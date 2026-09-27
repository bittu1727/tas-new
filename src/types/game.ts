export type Suit = '♥' | '♦' | '♣' | '♠';

export interface Card {
  id: string;
  suit: Suit;
  rank: number; // 1 (A) to 13 (K)
}

export interface SuitBoardState {
  low: number | null;  // lowest card played so far (6 -> 5 -> ... -> 1)
  high: number | null; // highest card played so far (6 -> 7 -> ... -> 13)
}

export type BoardState = Record<Suit, SuitBoardState>;

export interface Player {
  id: number;
  name: string;
  isBot: boolean;
  avatar: string;
  hand: Card[];
  lastAction?: {
    type: 'play' | 'pass' | 'start';
    card?: Card;
    timestamp: number;
  };
}

export type GameMode = 'casual' | 'tournament';
export type BotDifficulty = 'easy' | 'normal' | 'master';
export type TableTheme = 'emerald' | 'crimson' | 'sapphire' | 'obsidian';
export type Language = 'hi' | 'en';
export type HandSortMode = 'suit' | 'rank' | 'playable';

export interface RoundResult {
  roundNumber: number;
  winnerIndex: number;
  roundPenaltyPoints: number[]; // points received this round (winner = 0, opponents = card count)
  playerScores: number[];
  playerCardCounts: number[];
  leftoverCards: Card[][];
}

export interface CareerStats {
  totalRoundsPlayed: number;
  totalRoundsWon: number;
  totalPenaltyPoints: number;
  bestRoundPenalty: number | null; // 0 on clean win
  cleanWins: number; // won with 0 points
  totalTournamentsCompleted: number;
  tournamentsWon: number;
  sixHeartOpenings: number;
  recentRounds: Array<{
    id: string;
    date: number;
    won: boolean;
    penalty: number;
    mode: 'solo' | 'online';
  }>;
}

export interface GameSettings {
  language: Language;
  soundEnabled: boolean;
  speed: 'fast' | 'normal' | 'slow';
  botDifficulty: BotDifficulty;
  theme: TableTheme;
  targetScore: number;
  autoPass: boolean;
}
