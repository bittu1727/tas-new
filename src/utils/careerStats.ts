import { CareerStats } from '../types/game';

const STORAGE_KEY = 'badam_chhakka_career_stats';

export const DEFAULT_CAREER_STATS: CareerStats = {
  totalRoundsPlayed: 0,
  totalRoundsWon: 0,
  totalPenaltyPoints: 0,
  bestRoundPenalty: null,
  cleanWins: 0,
  totalTournamentsCompleted: 0,
  tournamentsWon: 0,
  sixHeartOpenings: 0,
  recentRounds: [],
};

export function loadCareerStats(): CareerStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_CAREER_STATS,
        ...parsed,
        recentRounds: Array.isArray(parsed.recentRounds) ? parsed.recentRounds : [],
      };
    }
  } catch {
    // fallback
  }
  return DEFAULT_CAREER_STATS;
}

export function saveCareerStats(stats: CareerStats): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // ignore quota errors
  }
}

export function recordRoundOutcome(
  prev: CareerStats,
  params: {
    won: boolean;
    penalty: number;
    isSixStarter: boolean;
    mode: 'solo' | 'online';
  }
): CareerStats {
  const { won, penalty, isSixStarter, mode } = params;

  const totalRoundsPlayed = prev.totalRoundsPlayed + 1;
  const totalRoundsWon = prev.totalRoundsWon + (won ? 1 : 0);
  const totalPenaltyPoints = prev.totalPenaltyPoints + penalty;
  const cleanWins = prev.cleanWins + (won && penalty === 0 ? 1 : 0);
  const sixHeartOpenings = prev.sixHeartOpenings + (isSixStarter ? 1 : 0);

  const bestRoundPenalty =
    prev.bestRoundPenalty === null
      ? penalty
      : Math.min(prev.bestRoundPenalty, penalty);

  const newRecentEntry = {
    id: `round-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    date: Date.now(),
    won,
    penalty,
    mode,
  };

  const updated: CareerStats = {
    ...prev,
    totalRoundsPlayed,
    totalRoundsWon,
    totalPenaltyPoints,
    bestRoundPenalty,
    cleanWins,
    sixHeartOpenings,
    recentRounds: [newRecentEntry, ...(prev.recentRounds || [])].slice(0, 15),
  };

  saveCareerStats(updated);
  return updated;
}

export function recordTournamentOutcome(
  prev: CareerStats,
  wonTournament: boolean
): CareerStats {
  const updated: CareerStats = {
    ...prev,
    totalTournamentsCompleted: prev.totalTournamentsCompleted + 1,
    tournamentsWon: prev.tournamentsWon + (wonTournament ? 1 : 0),
  };
  saveCareerStats(updated);
  return updated;
}

export function resetCareerStats(): CareerStats {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
  return DEFAULT_CAREER_STATS;
}
