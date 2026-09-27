import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export type Suit = '♥' | '♦' | '♣' | '♠';

export interface Card {
  id: string;
  suit: Suit;
  rank: number; // 1 to 13 (1 = Ace, 11 = Jack, 12 = Queen, 13 = King)
}

export interface BoardSuitState {
  low: number | null;
  high: number | null;
}

export type BoardState = Record<Suit, BoardSuitState>;

export interface OnlinePlayer {
  id: string;
  name: string;
  avatar: string;
  country: string;
  isBot: boolean;
  isHost: boolean;
  seatIndex: number;
  hand: Card[];
  score: number;
  connected: boolean;
}

export interface RoomState {
  code: string;
  hostId: string;
  isPublic: boolean;
  status: 'lobby' | 'playing' | 'round_summary';
  roundNumber: number;
  players: OnlinePlayer[];
  board: BoardState;
  currentTurn: number;
  starterIndex: number;
  firstMoveMade: boolean;
  createdAt: number;
  lastAction: {
    playerId: string;
    playerName: string;
    type: 'play' | 'pass';
    card?: Card;
  } | null;
  history: Array<{
    roundNumber: number;
    winnerIndex: number;
    roundPenaltyPoints: number[];
    playerScores: number[];
  }>;
  botTimer?: NodeJS.Timeout;
}

const SUITS: Suit[] = ['♥', '♦', '♣', '♠'];

function createInitialBoard(): BoardState {
  return {
    '♥': { low: null, high: null },
    '♦': { low: null, high: null },
    '♣': { low: null, high: null },
    '♠': { low: null, high: null },
  };
}

function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (let rank = 1; rank <= 13; rank++) {
      deck.push({
        id: `${suit}-${rank}`,
        suit,
        rank,
      });
    }
  }
  // Fisher-Yates shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function isValidMove(card: Card, board: BoardState): boolean {
  const suitState = board[card.suit];

  // 1. If 6 is not played yet in this suit, ONLY 6 is valid
  if (suitState.low === null) {
    return card.rank === 6;
  }

  // 2. High wing: next card in sequence (suitState.high + 1 up to 13)
  if (suitState.high !== null && card.rank === suitState.high + 1 && card.rank <= 13) {
    return true;
  }

  // 3. Low wing: next card in sequence (suitState.low - 1 down to 1)
  if (suitState.low !== null && card.rank === suitState.low - 1 && card.rank >= 1) {
    // Badam 5 Rule: 5 of any other suit can only be played if 5♥ is already played
    if (card.rank === 5 && card.suit !== '♥') {
      const heartState = board['♥'];
      const heartFivePlayed = heartState.low !== null && heartState.low <= 5;
      if (!heartFivePlayed) {
        return false;
      }
    }
    return true;
  }

  return false;
}

function getValidMoves(hand: Card[], board: BoardState, isFirstMoveOfRound: boolean): Card[] {
  if (isFirstMoveOfRound) {
    const heartSix = hand.find((c) => c.suit === '♥' && c.rank === 6);
    return heartSix ? [heartSix] : [];
  }
  return hand.filter((card) => isValidMove(card, board));
}

// In-memory rooms repository
const rooms = new Map<string, RoomState>();
const socketRoomMap = new Map<WebSocket, { roomCode: string; playerId: string }>();

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return rooms.has(code) ? generateRoomCode() : code;
}

function sanitizeStateForPlayer(room: RoomState, playerId: string) {
  return {
    code: room.code,
    hostId: room.hostId,
    isPublic: room.isPublic,
    status: room.status,
    roundNumber: room.roundNumber,
    currentTurn: room.currentTurn,
    starterIndex: room.starterIndex,
    firstMoveMade: room.firstMoveMade,
    lastAction: room.lastAction,
    board: room.board,
    history: room.history,
    myPlayerId: playerId,
    players: room.players.map((p) => ({
      id: p.id,
      name: p.name,
      avatar: p.avatar,
      country: p.country,
      isBot: p.isBot,
      isHost: p.isHost,
      seatIndex: p.seatIndex,
      handCount: p.hand.length,
      score: p.score,
      connected: p.connected,
      // Only include actual cards for the requesting player
      hand: p.id === playerId ? p.hand : [],
    })),
  };
}

function getPublicRoomsList() {
  const list = [];
  for (const room of rooms.values()) {
    if (room.isPublic && room.status === 'lobby') {
      list.push({
        code: room.code,
        hostName: room.players[0]?.name || 'Player',
        playerCount: room.players.length,
        createdAt: room.createdAt,
      });
    }
  }
  return list;
}

function broadcastRoomState(room: RoomState, wss: WebSocketServer) {
  wss.clients.forEach((client) => {
    const clientMeta = socketRoomMap.get(client);
    if (clientMeta && clientMeta.roomCode === room.code && client.readyState === WebSocket.OPEN) {
      const sanitized = sanitizeStateForPlayer(room, clientMeta.playerId);
      client.send(JSON.stringify({ type: 'ROOM_UPDATE', data: sanitized }));
    }
  });
}

function broadcastGlobalStats(wss: WebSocketServer) {
  let totalActivePlayers = 0;
  for (const r of rooms.values()) {
    totalActivePlayers += r.players.filter((p) => !p.isBot && p.connected).length;
  }
  // Baseline active world count (minimum connected + organic pool)
  const connectedCount = Math.max(wss.clients.size, totalActivePlayers, 1);
  const activeRoomsCount = rooms.size;

  const payload = JSON.stringify({
    type: 'GLOBAL_STATS',
    data: {
      onlinePlayers: connectedCount,
      activeRooms: activeRoomsCount,
      publicRooms: getPublicRoomsList(),
    },
  });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

function broadcastChat(roomCode: string, chatMessage: any, wss: WebSocketServer) {
  wss.clients.forEach((client) => {
    const clientMeta = socketRoomMap.get(client);
    if (clientMeta && clientMeta.roomCode === roomCode && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'CHAT_MESSAGE', data: chatMessage }));
    }
  });
}

function scheduleBotTurnIfNeeded(room: RoomState, wss: WebSocketServer) {
  if (room.status !== 'playing') return;
  const currentPlayer = room.players[room.currentTurn];
  if (!currentPlayer || !currentPlayer.isBot) return;

  if (room.botTimer) clearTimeout(room.botTimer);

  room.botTimer = setTimeout(() => {
    executeBotTurn(room, wss);
  }, 900);
}

function executeBotTurn(room: RoomState, wss: WebSocketServer) {
  if (room.status !== 'playing') return;
  const bot = room.players[room.currentTurn];
  if (!bot || !bot.isBot) return;

  const isFirst = !room.firstMoveMade;
  const moves = getValidMoves(bot.hand, room.board, isFirst);

  if (moves.length === 0) {
    // Bot passes
    room.lastAction = {
      playerId: bot.id,
      playerName: bot.name,
      type: 'pass',
    };
    advanceTurn(room, wss);
  } else {
    // Select best card (prioritize high rank cards to avoid penalties if others are close to winning)
    const cardToPlay = moves.sort((a, b) => b.rank - a.rank)[0];

    // Remove from bot hand
    bot.hand = bot.hand.filter((c) => !(c.suit === cardToPlay.suit && c.rank === cardToPlay.rank));

    // Update board
    const suitState = room.board[cardToPlay.suit];
    if (suitState.low === null) {
      suitState.low = cardToPlay.rank;
      suitState.high = cardToPlay.rank;
    } else {
      if (cardToPlay.rank < suitState.low) suitState.low = cardToPlay.rank;
      if (cardToPlay.rank > (suitState.high ?? 0)) suitState.high = cardToPlay.rank;
    }

    room.firstMoveMade = true;
    room.lastAction = {
      playerId: bot.id,
      playerName: bot.name,
      type: 'play',
      card: cardToPlay,
    };

    // Check if bot won
    if (bot.hand.length === 0) {
      handleRoundFinish(room, bot.seatIndex, wss);
      return;
    }

    advanceTurn(room, wss);
  }
}

function advanceTurn(room: RoomState, wss: WebSocketServer) {
  room.currentTurn = (room.currentTurn + 1) % 4;
  broadcastRoomState(room, wss);
  scheduleBotTurnIfNeeded(room, wss);
}

function handleRoundFinish(room: RoomState, winnerSeatIndex: number, wss: WebSocketServer) {
  room.status = 'round_summary';

  // Scoring Rule:
  // - Winner receives 0 points
  // - Opponents receive points equal to the sum of remaining card ranks in their hand (K=13, Q=12, J=11, 2-10, A=1)
  const roundPenalty = room.players.map((p, idx) =>
    idx === winnerSeatIndex ? 0 : p.hand.reduce((sum, c) => sum + c.rank, 0)
  );

  room.players.forEach((p, idx) => {
    p.score += roundPenalty[idx];
  });

  room.history.unshift({
    roundNumber: room.roundNumber,
    winnerIndex: winnerSeatIndex,
    roundPenaltyPoints: roundPenalty,
    playerScores: room.players.map((p) => p.score),
  });

  broadcastRoomState(room, wss);
}

function startRoundInRoom(room: RoomState, wss: WebSocketServer) {
  const deck = createDeck();

  // Ensure 4 players (fill with bots if fewer than 4 humans)
  const botNames = [
    { name: 'Bot Rohan (Smart)', country: '🇮🇳', avatar: '🤖' },
    { name: 'Bot Priya (Pro)', country: '🇮🇳', avatar: '🤖' },
    { name: 'Bot Vikram (Master)', country: '🇮🇳', avatar: '🤖' },
  ];
  let botCount = 1;
  while (room.players.length < 4) {
    const seat = room.players.length;
    const botProfile = botNames[seat - 1] || { name: `Bot ${botCount++}`, country: '🌐', avatar: '🤖' };
    room.players.push({
      id: `bot-${seat}`,
      name: botProfile.name,
      avatar: botProfile.avatar,
      country: botProfile.country,
      isBot: true,
      isHost: false,
      seatIndex: seat,
      hand: [],
      score: 0,
      connected: true,
    });
  }

  // Deal 13 cards to each player
  room.players.forEach((p, idx) => {
    p.hand = deck.slice(idx * 13, (idx + 1) * 13);
  });

  // Find who has 6♥ to determine starting turn
  let startIdx = 0;
  room.players.forEach((p, idx) => {
    if (p.hand.some((c) => c.suit === '♥' && c.rank === 6)) {
      startIdx = idx;
    }
  });

  room.board = createInitialBoard();
  room.starterIndex = startIdx;
  room.currentTurn = startIdx;
  room.firstMoveMade = false;
  room.lastAction = null;
  room.status = 'playing';

  broadcastRoomState(room, wss);
  scheduleBotTurnIfNeeded(room, wss);
}

function setupWebSocketHandlers(wss: WebSocketServer) {
  wss.on('connection', (ws) => {
    // Send immediate global stats to newly connected client
    ws.send(JSON.stringify({
      type: 'GLOBAL_STATS',
      data: {
        onlinePlayers: Math.max(wss.clients.size, 1),
        activeRooms: rooms.size,
        publicRooms: getPublicRoomsList(),
      },
    }));

    ws.on('message', (messageRaw) => {
      try {
        const payload = JSON.parse(messageRaw.toString());
        const { type, data } = payload;

        switch (type) {
          case 'GET_GLOBAL_STATS': {
            ws.send(JSON.stringify({
              type: 'GLOBAL_STATS',
              data: {
                onlinePlayers: Math.max(wss.clients.size, 1),
                activeRooms: rooms.size,
                publicRooms: getPublicRoomsList(),
              },
            }));
            break;
          }

          case 'QUICK_MATCH': {
            // Find any open public room with space
            const { playerName, avatar, country } = data;
            let targetRoom: RoomState | undefined;

            for (const room of rooms.values()) {
              if (room.isPublic && room.status === 'lobby' && room.players.length < 4) {
                targetRoom = room;
                break;
              }
            }

            if (targetRoom) {
              // Join this existing public room
              const playerId = `user-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
              const seatIndex = targetRoom.players.length;

              const newPlayer: OnlinePlayer = {
                id: playerId,
                name: playerName || `Player ${seatIndex + 1}`,
                avatar: avatar || '👑',
                country: country || '🌐',
                isBot: false,
                isHost: false,
                seatIndex,
                hand: [],
                score: 0,
                connected: true,
              };

              targetRoom.players.push(newPlayer);
              socketRoomMap.set(ws, { roomCode: targetRoom.code, playerId });

              ws.send(JSON.stringify({
                type: 'ROOM_JOINED',
                data: {
                  roomCode: targetRoom.code,
                  playerId,
                  room: sanitizeStateForPlayer(targetRoom, playerId),
                },
              }));

              broadcastRoomState(targetRoom, wss);
              broadcastGlobalStats(wss);
            } else {
              // Create a new public world room
              const code = generateRoomCode();
              const playerId = `user-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

              const hostPlayer: OnlinePlayer = {
                id: playerId,
                name: playerName || 'Host',
                avatar: avatar || '👑',
                country: country || '🌐',
                isBot: false,
                isHost: true,
                seatIndex: 0,
                hand: [],
                score: 0,
                connected: true,
              };

              const newRoom: RoomState = {
                code,
                hostId: playerId,
                isPublic: true,
                status: 'lobby',
                roundNumber: 1,
                players: [hostPlayer],
                board: createInitialBoard(),
                currentTurn: 0,
                starterIndex: 0,
                firstMoveMade: false,
                createdAt: Date.now(),
                lastAction: null,
                history: [],
              };

              rooms.set(code, newRoom);
              socketRoomMap.set(ws, { roomCode: code, playerId });

              ws.send(JSON.stringify({
                type: 'ROOM_CREATED',
                data: {
                  roomCode: code,
                  playerId,
                  room: sanitizeStateForPlayer(newRoom, playerId),
                },
              }));
              broadcastGlobalStats(wss);
            }
            break;
          }

          case 'CREATE_ROOM': {
            const { playerName, isPublic = true, avatar = '👑', country = '🌐' } = data;
            const code = generateRoomCode();
            const playerId = `user-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

            const hostPlayer: OnlinePlayer = {
              id: playerId,
              name: playerName || 'Host',
              avatar,
              country,
              isBot: false,
              isHost: true,
              seatIndex: 0,
              hand: [],
              score: 0,
              connected: true,
            };

            const newRoom: RoomState = {
              code,
              hostId: playerId,
              isPublic: Boolean(isPublic),
              status: 'lobby',
              roundNumber: 1,
              players: [hostPlayer],
              board: createInitialBoard(),
              currentTurn: 0,
              starterIndex: 0,
              firstMoveMade: false,
              createdAt: Date.now(),
              lastAction: null,
              history: [],
            };

            rooms.set(code, newRoom);
            socketRoomMap.set(ws, { roomCode: code, playerId });

            ws.send(JSON.stringify({
              type: 'ROOM_CREATED',
              data: {
                roomCode: code,
                playerId,
                room: sanitizeStateForPlayer(newRoom, playerId),
              },
            }));
            broadcastGlobalStats(wss);
            break;
          }

          case 'JOIN_ROOM': {
            const { roomCode, playerName, avatar = '👤', country = '🌐' } = data;
            const normalizedCode = (roomCode || '').toUpperCase().trim();
            const room = rooms.get(normalizedCode);

            if (!room) {
              ws.send(JSON.stringify({ type: 'ERROR', message: 'Room not found! Check the room code.' }));
              return;
            }

            if (room.status !== 'lobby') {
              ws.send(JSON.stringify({ type: 'ERROR', message: 'Game already in progress in this room!' }));
              return;
            }

            if (room.players.length >= 4) {
              ws.send(JSON.stringify({ type: 'ERROR', message: 'Room is full (Maximum 4 players).' }));
              return;
            }

            const playerId = `user-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
            const seatIndex = room.players.length;

            const newPlayer: OnlinePlayer = {
              id: playerId,
              name: playerName || `Player ${seatIndex + 1}`,
              avatar,
              country,
              isBot: false,
              isHost: false,
              seatIndex,
              hand: [],
              score: 0,
              connected: true,
            };

            room.players.push(newPlayer);
            socketRoomMap.set(ws, { roomCode: normalizedCode, playerId });

            ws.send(JSON.stringify({
              type: 'ROOM_JOINED',
              data: {
                roomCode: normalizedCode,
                playerId,
                room: sanitizeStateForPlayer(room, playerId),
              },
            }));

            broadcastRoomState(room, wss);
            broadcastGlobalStats(wss);
            break;
          }

          case 'START_GAME': {
            const meta = socketRoomMap.get(ws);
            if (!meta) return;
            const room = rooms.get(meta.roomCode);
            if (!room || room.hostId !== meta.playerId) return;

            startRoundInRoom(room, wss);
            broadcastGlobalStats(wss);
            break;
          }

          case 'PLAY_CARD': {
            const meta = socketRoomMap.get(ws);
            if (!meta) return;
            const room = rooms.get(meta.roomCode);
            if (!room || room.status !== 'playing') return;

            const player = room.players[room.currentTurn];
            if (!player || player.id !== meta.playerId) return;

            const card = data.card as Card;
            if (!card) return;

            const isFirst = !room.firstMoveMade;
            const legalMoves = getValidMoves(player.hand, room.board, isFirst);
            const isLegal = legalMoves.some((m) => m.suit === card.suit && m.rank === card.rank);

            if (!isLegal) {
              ws.send(JSON.stringify({ type: 'ERROR', message: 'Invalid move!' }));
              return;
            }

            // Remove card from player hand
            player.hand = player.hand.filter((c) => !(c.suit === card.suit && c.rank === card.rank));

            // Place card on board
            const suitState = room.board[card.suit];
            if (suitState.low === null) {
              suitState.low = card.rank;
              suitState.high = card.rank;
            } else {
              if (card.rank < suitState.low) suitState.low = card.rank;
              if (card.rank > (suitState.high ?? 0)) suitState.high = card.rank;
            }

            room.firstMoveMade = true;
            room.lastAction = {
              playerId: player.id,
              playerName: player.name,
              type: 'play',
              card,
            };

            // Check if player emptied hand
            if (player.hand.length === 0) {
              handleRoundFinish(room, player.seatIndex, wss);
              return;
            }

            advanceTurn(room, wss);
            break;
          }

          case 'PASS_TURN': {
            const meta = socketRoomMap.get(ws);
            if (!meta) return;
            const room = rooms.get(meta.roomCode);
            if (!room || room.status !== 'playing') return;

            const player = room.players[room.currentTurn];
            if (!player || player.id !== meta.playerId) return;

            const isFirst = !room.firstMoveMade;
            const legalMoves = getValidMoves(player.hand, room.board, isFirst);

            if (legalMoves.length > 0) {
              ws.send(JSON.stringify({ type: 'ERROR', message: 'You have valid cards you can play!' }));
              return;
            }

            room.lastAction = {
              playerId: player.id,
              playerName: player.name,
              type: 'pass',
            };

            advanceTurn(room, wss);
            break;
          }

          case 'NEXT_ROUND': {
            const meta = socketRoomMap.get(ws);
            if (!meta) return;
            const room = rooms.get(meta.roomCode);
            if (!room || room.hostId !== meta.playerId) return;

            room.roundNumber += 1;
            startRoundInRoom(room, wss);
            break;
          }

          case 'SEND_CHAT': {
            const meta = socketRoomMap.get(ws);
            if (!meta) return;
            const room = rooms.get(meta.roomCode);
            if (!room) return;

            const sender = room.players.find((p) => p.id === meta.playerId);
            const message = {
              id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
              senderName: sender?.name || 'Player',
              senderAvatar: sender?.avatar || '👤',
              senderCountry: sender?.country || '🌐',
              text: (data.text || '').slice(0, 100),
              timestamp: Date.now(),
            };

            broadcastChat(room.code, message, wss);
            break;
          }

          case 'LEAVE_ROOM': {
            handleClientDisconnect(ws, wss);
            break;
          }
        }
      } catch (err) {
        console.error('WebSocket message parsing error:', err);
      }
    });

    ws.on('close', () => {
      handleClientDisconnect(ws, wss);
      broadcastGlobalStats(wss);
    });
  });
}

function handleClientDisconnect(ws: WebSocket, wss: WebSocketServer) {
  const meta = socketRoomMap.get(ws);
  if (!meta) return;

  socketRoomMap.delete(ws);
  const room = rooms.get(meta.roomCode);
  if (!room) return;

  const player = room.players.find((p) => p.id === meta.playerId);
  if (player) {
    player.connected = false;
    // If during lobby and host leaves or room empty
    const connectedHumans = room.players.filter((p) => !p.isBot && p.connected);
    if (connectedHumans.length === 0) {
      if (room.botTimer) clearTimeout(room.botTimer);
      rooms.delete(room.code);
      broadcastGlobalStats(wss);
      return;
    }

    // If host leaves, assign host to next connected human
    if (player.isHost) {
      const nextHost = connectedHumans[0];
      if (nextHost) {
        room.hostId = nextHost.id;
        nextHost.isHost = true;
      }
    }

    broadcastRoomState(room, wss);
    broadcastGlobalStats(wss);
  }
}

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const wss = new WebSocketServer({ server });

  app.use(express.json());

  // Health and global stats endpoints
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'Badam Chhakka World Multiplayer Server',
      activeRooms: rooms.size,
      connectedClients: wss.clients.size,
      time: Date.now(),
    });
  });

  app.get('/api/rooms', (req, res) => {
    res.json({
      rooms: getPublicRoomsList(),
      totalRooms: rooms.size,
    });
  });

  // Setup WebSocket room logic
  setupWebSocketHandlers(wss);

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  const PORT = 3000;
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Badam Chhakka World Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
