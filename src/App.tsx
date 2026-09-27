import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  BoardState,
  BotDifficulty,
  Card,
  GameSettings,
  HandSortMode,
  Language,
  Player,
  RoundResult,
  TableTheme,
} from './types/game';
import {
  applyMoveToBoard,
  chooseBotMove,
  createDeck,
  createEmptyBoard,
  getValidMoves,
  isFirstMoveOfRound,
  isHeartFivePlayed,
  isValidMove,
} from './utils/gameLogic';
import { TRANSLATIONS } from './utils/translations';
import { sounds } from './utils/audio';
import {
  DEFAULT_CAREER_STATS,
  loadCareerStats,
  recordRoundOutcome,
  saveCareerStats,
} from './utils/careerStats';
import { useOnlineGame } from './hooks/useOnlineGame';
import { Header } from './components/Header';
import { BoardView } from './components/BoardView';
import { PlayerHand } from './components/PlayerHand';
import { BotPlayer } from './components/BotPlayer';
import { RoundSummaryModal } from './components/RoundSummaryModal';
import { RulesModal } from './components/RulesModal';
import { SettingsModal } from './components/SettingsModal';
import { HistoryModal } from './components/HistoryModal';
import { CareerStatsModal } from './components/CareerStatsModal';
import { OnlineLobbyModal } from './components/OnlineLobbyModal';
import { OnlineChatWidget } from './components/OnlineChatWidget';
import { MainScreen } from './components/MainScreen';
import { SpinWheelModal } from './components/SpinWheelModal';
import { StoreModal } from './components/StoreModal';
import { AddaModal } from './components/AddaModal';
import { EventModal } from './components/EventModal';
import { SevenUpDownModal } from './components/SevenUpDownModal';
import { PassNPlaySetupModal } from './components/PassNPlaySetupModal';
import { RewardVideoModal } from './components/RewardVideoModal';
import { ProfileEditModal } from './components/ProfileEditModal';
import { FriendsRoomModal } from './components/FriendsRoomModal';
import { InventoryModal } from './components/InventoryModal';
import { Info, Sparkles } from 'lucide-react';

const INITIAL_SETTINGS: GameSettings = {
  language: 'hi',
  soundEnabled: true,
  speed: 'normal',
  botDifficulty: 'normal',
  theme: 'emerald',
  targetScore: 100,
  autoPass: false,
};

const BOT_NAMES = {
  hi: ['आप (You)', 'कबीर (Kabir)', 'प्रिया (Priya)', 'राजेश (Rajesh)'],
  en: ['You', 'Kabir (Bot)', 'Priya (Bot)', 'Rajesh (Bot)'],
};

export default function App() {
  // Settings & Career Stats from localStorage
  const [settings, setSettings] = useState<GameSettings>(() => {
    try {
      const saved = localStorage.getItem('badam_chhakka_settings');
      if (saved) return { ...INITIAL_SETTINGS, ...JSON.parse(saved) };
    } catch {
      // ignore
    }
    return INITIAL_SETTINGS;
  });

  const [careerStats, setCareerStats] = useState(() => loadCareerStats());

  // Online Multiplayer Hook
  const {
    isConnected,
    connecting: onlineConnecting,
    room: onlineRoom,
    myPlayerId,
    chatMessages,
    globalStats,
    error: onlineError,
    quickMatch,
    createRoom,
    joinRoom,
    refreshGlobalStats,
    startGame: startOnlineGame,
    playCard: playOnlineCard,
    passTurn: passOnlineTurn,
    sendChat: sendChatMessage,
    leaveRoom: leaveOnlineRoom,
  } = useOnlineGame();

  const isOnlineMode = !!onlineRoom && onlineRoom.status !== 'lobby';

  // Solo Offline State
  const [board, setBoard] = useState<BoardState>(createEmptyBoard);
  const [players, setPlayers] = useState<Player[]>([
    { id: 0, name: BOT_NAMES.hi[0], isBot: false, avatar: '👤', hand: [] },
    { id: 1, name: BOT_NAMES.hi[1], isBot: true, avatar: '🦁', hand: [] },
    { id: 2, name: BOT_NAMES.hi[2], isBot: true, avatar: '🐯', hand: [] },
    { id: 3, name: BOT_NAMES.hi[3], isBot: true, avatar: '🦅', hand: [] },
  ]);
  const [currentTurn, setCurrentTurn] = useState<number>(0);
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const [starterIndex, setStarterIndex] = useState<number>(0);
  const [firstMoveMade, setFirstMoveMade] = useState<boolean>(false);
  const [scores, setScores] = useState<number[]>([0, 0, 0, 0]);
  const [history, setHistory] = useState<RoundResult[]>([]);
  const [sortMode, setSortMode] = useState<HandSortMode>('suit');
  const [statusMessage, setStatusMessage] = useState<string>('');

  // Screen mode: 'lobby' (Ludo King style Main Screen) or 'game' (Playing Table)
  const [currentScreen, setCurrentScreen] = useState<'lobby' | 'game'>('lobby');
  const [gameSubMode, setGameSubMode] = useState<'bot' | 'pass'>('bot');

  // Currency system (matches user screenshot: 3,920 coins, 150 gems)
  const [coins, setCoins] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('badam_coins');
      if (saved) return Number(saved);
    } catch {}
    return 3920;
  });
  const [gems, setGems] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('badam_gems');
      if (saved) return Number(saved);
    } catch {}
    return 150;
  });

  useEffect(() => {
    localStorage.setItem('badam_coins', coins.toString());
  }, [coins]);

  useEffect(() => {
    localStorage.setItem('badam_gems', gems.toString());
  }, [gems]);

  const handleAddCurrency = (addCoins: number, addGems: number) => {
    setCoins((c) => c + addCoins);
    setGems((g) => g + addGems);
  };

  const [profile, setProfile] = useState<{ name: string; avatar: string }>(() => {
    try {
      const saved = localStorage.getItem('badam_profile');
      if (saved) return JSON.parse(saved);
    } catch {}
    return { name: 'Player 1', avatar: '👑' };
  });

  useEffect(() => {
    localStorage.setItem('badam_profile', JSON.stringify(profile));
  }, [profile]);

  // Modals
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isCareerOpen, setIsCareerOpen] = useState(false);
  const [isOnlineLobbyOpen, setIsOnlineLobbyOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isSpinOpen, setIsSpinOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isAddaOpen, setIsAddaOpen] = useState(false);
  const [isEventsOpen, setIsEventsOpen] = useState(false);
  const [isSevenUpOpen, setIsSevenUpOpen] = useState(false);
  const [isPassNPlayOpen, setIsPassNPlayOpen] = useState(false);
  const [isRewardVideoOpen, setIsRewardVideoOpen] = useState(false);
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);
  const [isFriendsOpen, setIsFriendsOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [winnerIndex, setWinnerIndex] = useState<number>(0);

  const botTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync audio enabled state
  useEffect(() => {
    sounds.enabled = settings.soundEnabled;
  }, [settings.soundEnabled]);

  // Save settings
  useEffect(() => {
    localStorage.setItem('badam_chhakka_settings', JSON.stringify(settings));
  }, [settings]);

  // Save career stats
  useEffect(() => {
    saveCareerStats(careerStats);
  }, [careerStats]);

  // Check URL params for room code
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    if (roomParam) {
      setIsOnlineLobbyOpen(true);
    }
  }, []);

  /**
   * Start a fresh round in solo offline mode
   */
  const startNewSoloRound = useCallback((mode: 'bot' | 'pass' = gameSubMode) => {
    if (botTimerRef.current) clearTimeout(botTimerRef.current);
    sounds.playShuffle();

    const deck = createDeck();
    const pHands: Card[][] = [[], [], [], []];
    deck.forEach((card, idx) => {
      pHands[idx % 4].push(card);
    });

    // Find holder of 6 of Hearts (6♥)
    let holder = 0;
    for (let p = 0; p < 4; p++) {
      if (pHands[p].some((c) => c.suit === '♥' && c.rank === 6)) {
        holder = p;
        break;
      }
    }

    const isPass = mode === 'pass';
    const newPlayers: Player[] = [
      { id: 0, name: isPass ? (settings.language === 'hi' ? 'खिलाड़ी 1' : 'Player 1') : profile.name, isBot: false, avatar: profile.avatar, hand: pHands[0] },
      { id: 1, name: isPass ? (settings.language === 'hi' ? 'खिलाड़ी 2' : 'Player 2') : BOT_NAMES[settings.language][1], isBot: !isPass, avatar: '🦁', hand: pHands[1] },
      { id: 2, name: isPass ? (settings.language === 'hi' ? 'खिलाड़ी 3' : 'Player 3') : BOT_NAMES[settings.language][2], isBot: !isPass, avatar: '🐯', hand: pHands[2] },
      { id: 3, name: isPass ? (settings.language === 'hi' ? 'खिलाड़ी 4' : 'Player 4') : BOT_NAMES[settings.language][3], isBot: !isPass, avatar: '🦅', hand: pHands[3] },
    ];

    setBoard(createEmptyBoard());
    setPlayers(newPlayers);
    setStarterIndex(holder);
    setCurrentTurn(holder);
    setFirstMoveMade(false);
    setIsSummaryOpen(false);

    const t = TRANSLATIONS[settings.language];
    setStatusMessage(t.starterPrompt.replace('{name}', newPlayers[holder].name));
  }, [gameSubMode, profile.avatar, profile.name, settings.language]);

  const handleStartPassNPlayMatch = (names: string[], avatars: string[]) => {
    setIsPassNPlayOpen(false);
    setGameSubMode('pass');
    setCurrentScreen('game');

    if (botTimerRef.current) clearTimeout(botTimerRef.current);
    sounds.playShuffle();

    const deck = createDeck();
    const pHands: Card[][] = [[], [], [], []];
    deck.forEach((card, idx) => {
      pHands[idx % 4].push(card);
    });

    let holder = 0;
    for (let p = 0; p < 4; p++) {
      if (pHands[p].some((c) => c.suit === '♥' && c.rank === 6)) {
        holder = p;
        break;
      }
    }

    const newPlayers: Player[] = [
      { id: 0, name: names[0] || profile.name, isBot: false, avatar: avatars[0] || profile.avatar, hand: pHands[0] },
      { id: 1, name: names[1] || 'Player 2', isBot: false, avatar: avatars[1] || '🦁', hand: pHands[1] },
      { id: 2, name: names[2] || (names.length > 2 ? names[2] : 'Bot Kabir'), isBot: names.length <= 2, avatar: avatars[2] || '🐯', hand: pHands[2] },
      { id: 3, name: names[3] || (names.length > 3 ? names[3] : 'Bot Priya'), isBot: names.length <= 3, avatar: avatars[3] || '🦅', hand: pHands[3] },
    ];

    setBoard(createEmptyBoard());
    setPlayers(newPlayers);
    setStarterIndex(holder);
    setCurrentTurn(holder);
    setFirstMoveMade(false);
    setIsSummaryOpen(false);

    const t = TRANSLATIONS[settings.language];
    setStatusMessage(t.starterPrompt.replace('{name}', newPlayers[holder].name));
  };

  // Start initial round on mount
  useEffect(() => {
    startNewSoloRound();
  }, [startNewSoloRound]);

  /**
   * Conclude solo round
   */
  const handleRoundEnd = (roundWinner: number) => {
    setWinnerIndex(roundWinner);
    setIsSummaryOpen(true);

    const roundPenalties = players.map((p, idx) => (idx === roundWinner ? 0 : p.hand.length));
    const newScores = scores.map((s, idx) => s + roundPenalties[idx]);
    setScores(newScores);

    const result: RoundResult = {
      roundNumber,
      winnerIndex: roundWinner,
      roundPenaltyPoints: roundPenalties,
      playerScores: newScores,
      playerCardCounts: players.map((p) => p.hand.length),
      leftoverCards: players.map((p) => [...p.hand]),
    };
    setHistory((prev) => [result, ...prev]);

    // Record career stats & reward coins for winning
    const userWon = roundWinner === 0;
    const userPenalty = roundPenalties[0];
    const isSixStarter = starterIndex === 0;

    if (userWon) {
      setCoins((c) => c + 350);
      sounds.playCoinCollect();
    }

    setCareerStats((prev) =>
      recordRoundOutcome(prev, {
        won: userWon,
        penalty: userPenalty,
        isSixStarter,
        mode: 'solo',
      })
    );
  };

  /**
   * Human Move in Solo / Pass N Play Mode
   */
  const handleHumanPlayCard = (card: Card) => {
    const activePlayer = players[currentTurn];
    if (!activePlayer || activePlayer.isBot) return;

    if (!isValidMove(card, board)) {
      sounds.playInvalid();
      setStatusMessage(TRANSLATIONS[settings.language].startWithHeartSix);
      return;
    }

    sounds.playCardClack();
    const newBoard = applyMoveToBoard(board, card);
    const newHand = activePlayer.hand.filter((c) => c.id !== card.id);

    setBoard(newBoard);
    setFirstMoveMade(true);

    setPlayers((prev) =>
      prev.map((p) =>
        p.id === activePlayer.id
          ? {
              ...p,
              hand: newHand,
              lastAction: { type: 'play', card, timestamp: Date.now() },
            }
          : p
      )
    );

    // Check Win
    if (newHand.length === 0) {
      handleRoundEnd(activePlayer.id);
      return;
    }

    // Advance turn
    setCurrentTurn((prev) => (prev + 1) % 4);
  };

  /**
   * Human Pass in Solo / Pass N Play Mode
   */
  const handleHumanPass = () => {
    const activePlayer = players[currentTurn];
    if (!activePlayer || activePlayer.isBot) return;

    const valid = getValidMoves(activePlayer.hand, board);
    if (valid.length > 0) {
      sounds.playInvalid();
      setStatusMessage(TRANSLATIONS[settings.language].cantPassWithValidMoves);
      return;
    }

    sounds.playPassSound();
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === activePlayer.id
          ? {
              ...p,
              lastAction: { type: 'pass', timestamp: Date.now() },
            }
          : p
      )
    );

    setCurrentTurn((prev) => (prev + 1) % 4);
  };

  /**
   * Bot Turn Execution in Solo Mode
   */
  useEffect(() => {
    if (isOnlineMode) return;
    if (players[currentTurn] && !players[currentTurn].isBot) return;
    if (isSummaryOpen) return;

    const bot = players[currentTurn];
    if (!bot || !bot.isBot) return;

    const speeds = {
      fast: 350,
      normal: 750,
      slow: 1200,
    };
    const delay = speeds[settings.speed] || 750;

    botTimerRef.current = setTimeout(() => {
      // Must play 6 of Hearts if it's the very first move
      let chosenCard: Card | null = null;
      if (!firstMoveMade && isFirstMoveOfRound(board)) {
        chosenCard = bot.hand.find((c) => c.suit === '♥' && c.rank === 6) || null;
      } else {
        chosenCard = chooseBotMove(bot.hand, board, players, settings.botDifficulty);
      }

      if (chosenCard) {
        sounds.playCardClack();
        const newBoard = applyMoveToBoard(board, chosenCard);
        const newHand = bot.hand.filter((c) => c.id !== chosenCard!.id);

        setBoard(newBoard);
        setFirstMoveMade(true);

        setPlayers((prev) =>
          prev.map((p) =>
            p.id === bot.id
              ? {
                  ...p,
                  hand: newHand,
                  lastAction: { type: 'play', card: chosenCard!, timestamp: Date.now() },
                }
              : p
          )
        );

        if (newHand.length === 0) {
          handleRoundEnd(bot.id);
          return;
        }
      } else {
        // Pass
        sounds.playPassSound();
        setPlayers((prev) =>
          prev.map((p) =>
            p.id === bot.id
              ? {
                  ...p,
                  lastAction: { type: 'pass', timestamp: Date.now() },
                }
              : p
          )
        );
      }

      setCurrentTurn((prev) => (prev + 1) % 4);
    }, delay);

    return () => {
      if (botTimerRef.current) clearTimeout(botTimerRef.current);
    };
  }, [currentTurn, board, firstMoveMade, isSummaryOpen, isOnlineMode, settings.speed, settings.botDifficulty, players]);

  // Determine active display data (Online vs Solo)
  const activeBoard = isOnlineMode && onlineRoom ? onlineRoom.board : board;
  const activePlayers: Player[] = isOnlineMode && onlineRoom
    ? onlineRoom.players.map((op, idx) => ({
        id: idx,
        name: op.name,
        isBot: op.isBot,
        avatar: op.avatar || '👤',
        hand: op.hand || [],
        lastAction: onlineRoom.lastAction?.playerId === op.id ? (onlineRoom.lastAction as any) : undefined,
      }))
    : players;

  const myOnlineIndex = isOnlineMode && onlineRoom && myPlayerId
    ? onlineRoom.players.findIndex((p) => p.id === myPlayerId)
    : 0;

  const activeHumanIndex = isOnlineMode
    ? myOnlineIndex
    : gameSubMode === 'pass'
    ? currentTurn
    : 0;

  const activeTurn = isOnlineMode && onlineRoom ? onlineRoom.currentTurn : currentTurn;
  const isMyTurn = isOnlineMode
    ? activeTurn === myOnlineIndex
    : gameSubMode === 'pass'
    ? !players[currentTurn]?.isBot
    : currentTurn === 0;

  const myHand = isOnlineMode && onlineRoom && myPlayerId
    ? onlineRoom.players.find((p) => p.id === myPlayerId)?.hand || []
    : players[activeHumanIndex]?.hand || [];

  const myValidMoves = getValidMoves(myHand, activeBoard);

  const t = TRANSLATIONS[settings.language];

  // Table felt themes
  const themeGradients: Record<TableTheme, string> = {
    emerald: 'bg-[radial-gradient(ellipse_at_center,_#0b3823_0%,_#041a10_55%,_#020b07_100%)]',
    crimson: 'bg-[radial-gradient(ellipse_at_center,_#4a0e17_0%,_#28070d_55%,_#110205_100%)]',
    sapphire: 'bg-[radial-gradient(ellipse_at_center,_#0a2540_0%,_#061524_55%,_#02080f_100%)]',
    obsidian: 'bg-[radial-gradient(ellipse_at_center,_#1c1c1c_0%,_#0d0d0d_55%,_#000000_100%)]',
  };

  // Re-order opponents around the table relative to the user
  const leftPlayer = isOnlineMode
    ? activePlayers[(myOnlineIndex + 3) % 4]
    : activePlayers[1];
  const topPlayer = isOnlineMode
    ? activePlayers[(myOnlineIndex + 2) % 4]
    : activePlayers[2];
  const rightPlayer = isOnlineMode
    ? activePlayers[(myOnlineIndex + 1) % 4]
    : activePlayers[3];

  const handlePlayCardUnified = (card: Card) => {
    if (isOnlineMode) {
      playOnlineCard(card);
    } else {
      handleHumanPlayCard(card);
    }
  };

  // Render Ludo King Style Main Screen Lobby
  if (currentScreen === 'lobby' && !isOnlineMode) {
    return (
      <>
        <MainScreen
          onStartSolo={(mode = 'bot') => {
            setGameSubMode(mode);
            setCurrentScreen('game');
            startNewSoloRound(mode);
          }}
          onOpenOnlineLobby={() => {
            setIsOnlineLobbyOpen(true);
          }}
          onOpenFriends={() => setIsFriendsOpen(true)}
          onOpenPassNPlaySetup={() => setIsPassNPlayOpen(true)}
          onOpenSevenUpDown={() => setIsSevenUpOpen(true)}
          onOpenRewardVideo={() => setIsRewardVideoOpen(true)}
          onOpenProfileEdit={() => setIsProfileEditOpen(true)}
          onOpenInventory={() => setIsInventoryOpen(true)}
          onOpenRules={() => setIsRulesOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenCareer={() => setIsCareerOpen(true)}
          coins={coins}
          gems={gems}
          onAddCurrency={handleAddCurrency}
          playerName={profile.name}
          avatar={profile.avatar}
          language={settings.language}
          onToggleLanguage={() =>
            setSettings((s) => ({ ...s, language: s.language === 'hi' ? 'en' : 'hi' }))
          }
          soundEnabled={settings.soundEnabled}
          onToggleSound={() =>
            setSettings((s) => ({ ...s, soundEnabled: !s.soundEnabled }))
          }
          onOpenSpin={() => setIsSpinOpen(true)}
          onOpenShop={() => setIsShopOpen(true)}
          onOpenAdda={() => setIsAddaOpen(true)}
          onOpenEvents={() => setIsEventsOpen(true)}
        />

        {/* Modals available from Main Screen */}
        <RulesModal
          isOpen={isRulesOpen}
          onClose={() => setIsRulesOpen(false)}
          language={settings.language}
        />
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          settings={settings}
          onUpdateSettings={(newSet) => setSettings((prev) => ({ ...prev, ...newSet }))}
          onResetTournament={() => {
            setScores([0, 0, 0, 0]);
            setRoundNumber(1);
            setHistory([]);
            startNewSoloRound();
          }}
        />
        <CareerStatsModal
          isOpen={isCareerOpen}
          onClose={() => setIsCareerOpen(false)}
          stats={careerStats}
          onResetStats={() => {
            const fresh = DEFAULT_CAREER_STATS;
            setCareerStats(fresh);
            saveCareerStats(fresh);
          }}
          language={settings.language}
        />
        <OnlineLobbyModal
          isOpen={isOnlineLobbyOpen}
          onClose={() => setIsOnlineLobbyOpen(false)}
          room={onlineRoom}
          myPlayerId={myPlayerId}
          globalStats={globalStats}
          onQuickMatch={quickMatch}
          onCreateRoom={createRoom}
          onJoinRoom={joinRoom}
          onRefreshStats={refreshGlobalStats}
          onStartGame={() => {
            startOnlineGame();
            setCurrentScreen('game');
          }}
          onLeaveRoom={leaveOnlineRoom}
          language={settings.language}
          error={onlineError}
          connecting={onlineConnecting}
        />
        <SpinWheelModal
          isOpen={isSpinOpen}
          onClose={() => setIsSpinOpen(false)}
          onReward={(addCoins, addGems) => handleAddCurrency(addCoins, addGems)}
          language={settings.language}
        />
        <StoreModal
          isOpen={isShopOpen}
          onClose={() => setIsShopOpen(false)}
          coins={coins}
          gems={gems}
          onAddCurrency={handleAddCurrency}
          language={settings.language}
        />
        <AddaModal
          isOpen={isAddaOpen}
          onClose={() => setIsAddaOpen(false)}
          onJoinRoom={() => {
            setIsAddaOpen(false);
            setIsOnlineLobbyOpen(true);
          }}
          language={settings.language}
        />
        <EventModal
          isOpen={isEventsOpen}
          onClose={() => setIsEventsOpen(false)}
          onStartTournament={() => {
            setIsEventsOpen(false);
            setGameSubMode('bot');
            setCurrentScreen('game');
            startNewSoloRound('bot');
          }}
          language={settings.language}
        />
        <SevenUpDownModal
          isOpen={isSevenUpOpen}
          onClose={() => setIsSevenUpOpen(false)}
          coins={coins}
          onUpdateCoins={(delta) => setCoins((c) => Math.max(0, c + delta))}
          language={settings.language}
        />
        <PassNPlaySetupModal
          isOpen={isPassNPlayOpen}
          onClose={() => setIsPassNPlayOpen(false)}
          onStartMatch={handleStartPassNPlayMatch}
          language={settings.language}
        />
        <RewardVideoModal
          isOpen={isRewardVideoOpen}
          onClose={() => setIsRewardVideoOpen(false)}
          onReward={(rew) => handleAddCurrency(rew, 0)}
          language={settings.language}
        />
        <ProfileEditModal
          isOpen={isProfileEditOpen}
          onClose={() => setIsProfileEditOpen(false)}
          playerName={profile.name}
          avatar={profile.avatar}
          onSaveProfile={(newName, newAvatar) => setProfile({ name: newName, avatar: newAvatar })}
          coins={coins}
          gems={gems}
          language={settings.language}
        />
        <FriendsRoomModal
          isOpen={isFriendsOpen}
          onClose={() => setIsFriendsOpen(false)}
          onCreateRoom={(pName) => createRoom(pName, false, profile.avatar)}
          onJoinRoom={(code, pName) => joinRoom(code, pName, profile.avatar)}
          playerName={profile.name}
          language={settings.language}
        />
        <InventoryModal
          isOpen={isInventoryOpen}
          onClose={() => setIsInventoryOpen(false)}
          currentTheme={settings.theme}
          onSelectTheme={(th) => setSettings((prev) => ({ ...prev, theme: th }))}
          language={settings.language}
        />
      </>
    );
  }

  return (
    <div
      className={`min-h-screen ${themeGradients[settings.theme]} text-neutral-100 flex flex-col font-sans transition-colors duration-500`}
    >
      {/* Header */}
      <Header
        language={settings.language}
        onLanguageChange={(lang) => setSettings((prev) => ({ ...prev, language: lang }))}
        soundEnabled={settings.soundEnabled}
        onToggleSound={() => setSettings((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
        onNewRound={() => {
          setRoundNumber((r) => r + 1);
          startNewSoloRound();
        }}
        onOpenRules={() => setIsRulesOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenCareerStats={() => setIsCareerOpen(true)}
        onOpenOnlineLobby={() => setIsOnlineLobbyOpen(true)}
        onBackToLobby={() => setCurrentScreen('lobby')}
        isOnlineMode={isOnlineMode}
        onlineRoomCode={onlineRoom?.code}
        onlineCount={globalStats.onlinePlayers}
        roundNumber={isOnlineMode && onlineRoom ? onlineRoom.roundNumber : roundNumber}
      />

      {/* Main Playing Table Felt Arena */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-2 sm:p-4 flex flex-col justify-between gap-2.5">
        {/* MOBILE TOP ROW: All 3 Opponents seated neatly at top */}
        <section className="flex md:hidden items-center justify-between gap-1.5 w-full">
          {leftPlayer && (
            <BotPlayer
              player={leftPlayer}
              isCurrentTurn={activeTurn === leftPlayer.id}
              score={isOnlineMode && onlineRoom ? onlineRoom.players[leftPlayer.id]?.score || 0 : scores[leftPlayer.id]}
              language={settings.language}
              position="left"
              compact={true}
            />
          )}
          {topPlayer && (
            <BotPlayer
              player={topPlayer}
              isCurrentTurn={activeTurn === topPlayer.id}
              score={isOnlineMode && onlineRoom ? onlineRoom.players[topPlayer.id]?.score || 0 : scores[topPlayer.id]}
              language={settings.language}
              position="top"
              compact={true}
            />
          )}
          {rightPlayer && (
            <BotPlayer
              player={rightPlayer}
              isCurrentTurn={activeTurn === rightPlayer.id}
              score={isOnlineMode && onlineRoom ? onlineRoom.players[rightPlayer.id]?.score || 0 : scores[rightPlayer.id]}
              language={settings.language}
              position="right"
              compact={true}
            />
          )}
        </section>

        {/* DESKTOP TOP OPPONENT (Only on md+ screens) */}
        {topPlayer && (
          <section className="hidden md:flex justify-center">
            <BotPlayer
              player={topPlayer}
              isCurrentTurn={activeTurn === topPlayer.id}
              score={isOnlineMode && onlineRoom ? onlineRoom.players[topPlayer.id]?.score || 0 : scores[topPlayer.id]}
              language={settings.language}
              position="top"
            />
          </section>
        )}

        {/* CENTER FELT BOARD SECTION */}
        <section className="w-full my-auto flex items-center justify-center">
          {/* Desktop Left Bot */}
          {leftPlayer && (
            <div className="hidden md:flex flex-col justify-center pr-3 shrink-0">
              <BotPlayer
                player={leftPlayer}
                isCurrentTurn={activeTurn === leftPlayer.id}
                score={isOnlineMode && onlineRoom ? onlineRoom.players[leftPlayer.id]?.score || 0 : scores[leftPlayer.id]}
                language={settings.language}
                position="left"
              />
            </div>
          )}

          {/* Table Board: 100% Width on Mobile, Beautiful Velvet Mat */}
          <div className="w-full flex-1 min-w-0">
            <BoardView
              board={activeBoard}
              validMoves={isMyTurn ? myValidMoves : []}
              onPlayCard={handlePlayCardUnified}
              language={settings.language}
            />
          </div>

          {/* Desktop Right Bot */}
          {rightPlayer && (
            <div className="hidden md:flex flex-col justify-center pl-3 shrink-0">
              <BotPlayer
                player={rightPlayer}
                isCurrentTurn={activeTurn === rightPlayer.id}
                score={isOnlineMode && onlineRoom ? onlineRoom.players[rightPlayer.id]?.score || 0 : scores[rightPlayer.id]}
                language={settings.language}
                position="right"
              />
            </div>
          )}
        </section>

        {/* Live Commentary & Turn Prompt Pill */}
        <div className="min-h-[28px] flex items-center justify-center text-center px-2">
          <div className="text-xs sm:text-sm font-semibold text-amber-300 bg-neutral-950/80 px-4 py-1.5 rounded-full border border-amber-500/40 shadow-[0_4px_16px_rgba(0,0,0,0.5)] flex items-center gap-2 backdrop-blur-md">
            <Info size={14} className="text-amber-400 shrink-0" />
            <span>
              {isMyTurn
                ? myValidMoves.length > 0
                  ? t.mustPlay
                  : t.passNotice
                : isOnlineMode && onlineRoom
                ? `${onlineRoom.players[activeTurn]?.name || 'Opponent'} is playing...`
                : statusMessage || `${players[currentTurn]?.name || 'Bot'} is thinking...`}
            </span>
          </div>
        </div>

        {/* Pass N Play Turn Indicator */}
        {gameSubMode === 'pass' && (
          <div className="flex items-center justify-center -mb-1">
            <span className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-neutral-950 font-black text-xs px-3 py-1 rounded-full shadow border border-white flex items-center gap-1.5 animate-pulse">
              <span>📱</span>
              <span>{settings.language === 'hi' ? `बारी: ${players[activeHumanIndex]?.name}` : `Current Turn: ${players[activeHumanIndex]?.name}`}</span>
            </span>
          </div>
        )}

        {/* Bottom Section: Human Player Hand */}
        <section className="w-full pb-2">
          <PlayerHand
            player={{
              id: activeHumanIndex,
              name: isOnlineMode && onlineRoom && myPlayerId
                ? onlineRoom.players.find((p) => p.id === myPlayerId)?.name || 'You'
                : players[activeHumanIndex]?.name || profile.name,
              isBot: false,
              avatar: isOnlineMode && onlineRoom && myPlayerId
                ? onlineRoom.players.find((p) => p.id === myPlayerId)?.avatar || '👤'
                : players[activeHumanIndex]?.avatar || profile.avatar,
              hand: myHand,
            }}
            isCurrentTurn={isMyTurn}
            board={activeBoard}
            validMoves={myValidMoves}
            sortMode={sortMode}
            onSortChange={setSortMode}
            onPlayCard={handlePlayCardUnified}
            onPass={() => {
              if (isOnlineMode) {
                passOnlineTurn();
              } else {
                handleHumanPass();
              }
            }}
            onHint={() => {
              if (myValidMoves.length > 0) {
                sounds.playClick();
                setStatusMessage(`Playable: ${myValidMoves.map((c) => `${c.rank}${c.suit}`).join(', ')}`);
              }
            }}
            language={settings.language}
          />
        </section>
      </main>

      {/* Online Chat Widget */}
      {isOnlineMode && (
        <OnlineChatWidget
          messages={chatMessages}
          onSendMessage={sendChatMessage}
          language={settings.language}
        />
      )}

      {/* Online Lobby Modal */}
      <OnlineLobbyModal
        isOpen={isOnlineLobbyOpen}
        onClose={() => setIsOnlineLobbyOpen(false)}
        room={onlineRoom}
        myPlayerId={myPlayerId}
        globalStats={globalStats}
        onQuickMatch={quickMatch}
        onCreateRoom={createRoom}
        onJoinRoom={joinRoom}
        onRefreshStats={refreshGlobalStats}
        onStartGame={startOnlineGame}
        onLeaveRoom={leaveOnlineRoom}
        language={settings.language}
        error={onlineError}
        connecting={onlineConnecting}
      />

      {/* Solo Round Summary Modal */}
      {!isOnlineMode && (
        <RoundSummaryModal
          isOpen={isSummaryOpen}
          winnerIndex={winnerIndex}
          players={players}
          scores={scores}
          roundNumber={roundNumber}
          onNextRound={() => {
            setRoundNumber((r) => r + 1);
            startNewSoloRound();
          }}
          onResetTournament={() => {
            setScores([0, 0, 0, 0]);
            setRoundNumber(1);
            setHistory([]);
            startNewSoloRound();
          }}
          language={settings.language}
        />
      )}

      {/* Rules Modal */}
      <RulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
        language={settings.language}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={(newSet) => setSettings((prev) => ({ ...prev, ...newSet }))}
        onResetTournament={() => {
          setScores([0, 0, 0, 0]);
          setRoundNumber(1);
          setHistory([]);
          startNewSoloRound();
        }}
      />

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        players={players}
        language={settings.language}
      />

      {/* Career Stats Modal */}
      <CareerStatsModal
        isOpen={isCareerOpen}
        onClose={() => setIsCareerOpen(false)}
        stats={careerStats}
        onResetStats={() => {
          const fresh = DEFAULT_CAREER_STATS;
          setCareerStats(fresh);
          saveCareerStats(fresh);
        }}
        language={settings.language}
      />

      <SpinWheelModal
        isOpen={isSpinOpen}
        onClose={() => setIsSpinOpen(false)}
        onReward={(addCoins, addGems) => handleAddCurrency(addCoins, addGems)}
        language={settings.language}
      />
      <StoreModal
        isOpen={isShopOpen}
        onClose={() => setIsShopOpen(false)}
        coins={coins}
        gems={gems}
        onAddCurrency={handleAddCurrency}
        language={settings.language}
      />
      <AddaModal
        isOpen={isAddaOpen}
        onClose={() => setIsAddaOpen(false)}
        onJoinRoom={() => {
          setIsAddaOpen(false);
          setIsOnlineLobbyOpen(true);
        }}
        language={settings.language}
      />
      <EventModal
        isOpen={isEventsOpen}
        onClose={() => setIsEventsOpen(false)}
        onStartTournament={() => {
          setIsEventsOpen(false);
          setGameSubMode('bot');
          setCurrentScreen('game');
          startNewSoloRound('bot');
        }}
        language={settings.language}
      />
      <SevenUpDownModal
        isOpen={isSevenUpOpen}
        onClose={() => setIsSevenUpOpen(false)}
        coins={coins}
        onUpdateCoins={(delta) => setCoins((c) => Math.max(0, c + delta))}
        language={settings.language}
      />
      <PassNPlaySetupModal
        isOpen={isPassNPlayOpen}
        onClose={() => setIsPassNPlayOpen(false)}
        onStartMatch={handleStartPassNPlayMatch}
        language={settings.language}
      />
      <RewardVideoModal
        isOpen={isRewardVideoOpen}
        onClose={() => setIsRewardVideoOpen(false)}
        onReward={(rew) => handleAddCurrency(rew, 0)}
        language={settings.language}
      />
      <ProfileEditModal
        isOpen={isProfileEditOpen}
        onClose={() => setIsProfileEditOpen(false)}
        playerName={profile.name}
        avatar={profile.avatar}
        onSaveProfile={(newName, newAvatar) => setProfile({ name: newName, avatar: newAvatar })}
        coins={coins}
        gems={gems}
        language={settings.language}
      />
      <FriendsRoomModal
        isOpen={isFriendsOpen}
        onClose={() => setIsFriendsOpen(false)}
        onCreateRoom={(pName) => createRoom(pName, false, profile.avatar)}
        onJoinRoom={(code, pName) => joinRoom(code, pName, profile.avatar)}
        playerName={profile.name}
        language={settings.language}
      />
      <InventoryModal
        isOpen={isInventoryOpen}
        onClose={() => setIsInventoryOpen(false)}
        currentTheme={settings.theme}
        onSelectTheme={(th) => setSettings((prev) => ({ ...prev, theme: th }))}
        language={settings.language}
      />
    </div>
  );
}
