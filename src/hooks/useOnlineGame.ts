import { useState, useEffect, useRef, useCallback } from 'react';
import { BoardState, Card, Language } from '../types/game';
import { sounds } from '../utils/audio';

export interface OnlinePlayerInfo {
  id: string;
  name: string;
  avatar?: string;
  country?: string;
  isBot: boolean;
  isHost: boolean;
  seatIndex: number;
  handCount: number;
  score: number;
  connected: boolean;
  hand: Card[];
}

export interface OnlineRoomData {
  code: string;
  hostId: string;
  isPublic?: boolean;
  status: 'lobby' | 'playing' | 'round_summary';
  roundNumber: number;
  currentTurn: number;
  starterIndex: number;
  firstMoveMade: boolean;
  lastAction: {
    playerId: string;
    playerName: string;
    type: 'play' | 'pass';
    card?: Card;
  } | null;
  board: BoardState;
  players: OnlinePlayerInfo[];
  myPlayerId: string;
  history: Array<{
    roundNumber: number;
    winnerIndex: number;
    roundPenaltyPoints: number[];
    playerScores: number[];
  }>;
}

export interface PublicRoomItem {
  code: string;
  hostName: string;
  playerCount: number;
  createdAt: number;
}

export interface GlobalStats {
  onlinePlayers: number;
  activeRooms: number;
  publicRooms: PublicRoomItem[];
}

export interface ChatMessage {
  id: string;
  senderName: string;
  senderAvatar?: string;
  senderCountry?: string;
  text: string;
  timestamp: number;
}

export function useOnlineGame() {
  const [isConnected, setIsConnected] = useState(false);
  const [room, setRoom] = useState<OnlineRoomData | null>(null);
  const [myPlayerId, setMyPlayerId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [globalStats, setGlobalStats] = useState<GlobalStats>({
    onlinePlayers: 1,
    activeRooms: 0,
    publicRooms: [],
  });

  const socketRef = useRef<WebSocket | null>(null);

  // Initialize WebSocket connection
  const connectSocket = useCallback((): Promise<WebSocket> => {
    return new Promise((resolve, reject) => {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        resolve(socketRef.current);
        return;
      }

      setConnecting(true);
      setError(null);

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}`;

      try {
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          setIsConnected(true);
          setConnecting(false);
          // Request global stats immediately
          ws.send(JSON.stringify({ type: 'GET_GLOBAL_STATS' }));
          resolve(ws);
        };

        ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            handleIncomingMessage(message);
          } catch (err) {
            console.error('Failed to parse WS message:', err);
          }
        };

        ws.onerror = (e) => {
          console.warn('WebSocket connection error:', e);
          setIsConnected(false);
          setConnecting(false);
          setError('Could not connect to online multiplayer server.');
          reject(e);
        };

        ws.onclose = () => {
          setIsConnected(false);
          setConnecting(false);
          socketRef.current = null;
        };

        socketRef.current = ws;
      } catch (err) {
        setConnecting(false);
        setError('WebSocket not supported or failed to connect.');
        reject(err);
      }
    });
  }, []);

  const handleIncomingMessage = (message: { type: string; data?: any; message?: string }) => {
    switch (message.type) {
      case 'GLOBAL_STATS': {
        if (message.data) {
          setGlobalStats(message.data);
        }
        break;
      }

      case 'ROOM_CREATED':
      case 'ROOM_JOINED': {
        setRoom(message.data.room);
        setMyPlayerId(message.data.playerId);
        setError(null);
        sounds.playClick();
        break;
      }

      case 'ROOM_UPDATE': {
        const newRoom = message.data as OnlineRoomData;
        setRoom(newRoom);

        // Sound trigger for card play or pass
        if (newRoom.lastAction) {
          if (newRoom.lastAction.type === 'play') {
            sounds.playCardClack();
          } else if (newRoom.lastAction.type === 'pass') {
            sounds.playPassSound();
          }
        }

        // Sound trigger for new round start
        if (newRoom.status === 'playing' && room?.status !== 'playing') {
          sounds.playShuffle();
        }

        // Sound trigger for round win
        if (newRoom.status === 'round_summary' && room?.status === 'playing') {
          sounds.playWin();
        }
        break;
      }

      case 'CHAT_MESSAGE': {
        setChatMessages((prev) => [...prev.slice(-25), message.data]);
        break;
      }

      case 'ERROR': {
        setError(message.message || 'Action failed.');
        sounds.playInvalid();
        break;
      }
    }
  };

  // Quick Match with anyone online in the world
  const quickMatch = async (playerName: string, avatar = '👑', country = '🌐') => {
    try {
      const ws = await connectSocket();
      ws.send(JSON.stringify({
        type: 'QUICK_MATCH',
        data: { playerName, avatar, country },
      }));
    } catch {
      setError('Failed to establish multiplayer connection.');
    }
  };

  const createRoom = async (
    playerName: string,
    isPublic: boolean = true,
    avatar = '👑',
    country = '🌐'
  ) => {
    try {
      const ws = await connectSocket();
      ws.send(JSON.stringify({
        type: 'CREATE_ROOM',
        data: { playerName, isPublic, avatar, country },
      }));
    } catch {
      setError('Failed to establish multiplayer connection.');
    }
  };

  const joinRoom = async (
    roomCode: string,
    playerName: string,
    avatar = '👤',
    country = '🌐'
  ) => {
    try {
      const ws = await connectSocket();
      ws.send(JSON.stringify({
        type: 'JOIN_ROOM',
        data: { roomCode, playerName, avatar, country },
      }));
    } catch {
      setError('Failed to establish multiplayer connection.');
    }
  };

  const refreshGlobalStats = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: 'GET_GLOBAL_STATS' }));
    } else {
      connectSocket().catch(() => {});
    }
  };

  const startGame = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: 'START_GAME' }));
    }
  };

  const playCard = (card: Card) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'PLAY_CARD',
        data: { card },
      }));
    }
  };

  const passTurn = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: 'PASS_TURN' }));
    }
  };

  const nextRound = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: 'NEXT_ROUND' }));
    }
  };

  const sendChat = (text: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN && text.trim()) {
      socketRef.current.send(JSON.stringify({
        type: 'SEND_CHAT',
        data: { text: text.trim() },
      }));
    }
  };

  const leaveRoom = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: 'LEAVE_ROOM' }));
    }
    setRoom(null);
    setMyPlayerId(null);
    setChatMessages([]);
    refreshGlobalStats();
  };

  // Connect on mount to listen for global online counts
  useEffect(() => {
    connectSocket().catch(() => {});
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [connectSocket]);

  return {
    isConnected,
    connecting,
    room,
    myPlayerId,
    chatMessages,
    globalStats,
    error,
    quickMatch,
    createRoom,
    joinRoom,
    refreshGlobalStats,
    startGame,
    playCard,
    passTurn,
    nextRound,
    sendChat,
    leaveRoom,
    clearError: () => setError(null),
  };
}
