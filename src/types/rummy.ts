export type Suit = '♥' | '♦' | '♣' | '♠';

export interface RummyCard {
  id: string;
  suit: Suit;
  rank: number; // 1 (A) to 13 (K), 0 for Printed Joker
  isPrintedJoker?: boolean;
  deckId: 1 | 2;
}

export type MeldType = 'pure_sequence' | 'impure_sequence' | 'set' | 'invalid';

export interface MeldGroup {
  id: string;
  cards: RummyCard[];
  meldType: MeldType;
  isValid: boolean;
  score: number;
}

export interface DeclarationValidation {
  isValid: boolean;
  hasPureSequence: boolean;
  hasSecondSequence: boolean;
  totalScore: number;
  pureSequenceCount: number;
  secondSequenceCount: number;
  setCount: number;
  invalidGroupCount: number;
  breakdown: string[];
}

export type PlayerStatus = 'active' | 'dropped' | 'declared' | 'lost';

export interface RummyPlayer {
  id: number;
  name: string;
  avatar: string;
  isBot: boolean;
  hand: RummyCard[];
  groups: RummyCard[][];
  score: number; // current round points or tournament cumulative
  status: PlayerStatus;
  firstTurnDone?: boolean;
  lastAction?: {
    type: 'draw' | 'discard' | 'declare' | 'drop';
    source?: 'closed' | 'open';
    card?: RummyCard;
    timestamp: number;
  };
}

export type TurnPhase = 'draw' | 'discard' | 'declaring' | 'round_over';

export type GameMode = 'points' | 'pool101' | 'pool201';
export type TableTheme = 'emerald' | 'crimson' | 'sapphire' | 'obsidian';
export type Language = 'hi' | 'en';
export type BotDifficulty = 'easy' | 'normal' | 'master';

export interface RummyRoundResult {
  roundNumber: number;
  winnerId: number;
  scores: {
    playerId: number;
    playerName: string;
    points: number;
    status: PlayerStatus;
    groups: MeldGroup[];
  }[];
}

export interface RummyCareerStats {
  totalGamesPlayed: number;
  totalWins: number;
  totalDrops: number;
  totalScorePenalty: number;
  pureSequencesMade: number;
  recentGames: Array<{
    id: string;
    date: number;
    won: boolean;
    points: number;
    mode: 'solo' | 'online';
  }>;
}

export interface RummyGameSettings {
  language: Language;
  soundEnabled: boolean;
  tableTheme: TableTheme;
  botDifficulty: BotDifficulty;
  gameMode: GameMode;
  autoGroupOnDeal: boolean;
  gameSpeed: 'fast' | 'normal' | 'slow';
}
