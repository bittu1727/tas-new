import { BoardState, BotDifficulty, Card, Player, Suit } from '../types/game';

export const SUITS: Suit[] = ['♥', '♦', '♣', '♠'];
export const ALL_RANKS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

export function createEmptyBoard(): BoardState {
  return {
    '♥': { low: null, high: null },
    '♦': { low: null, high: null },
    '♣': { low: null, high: null },
    '♠': { low: null, high: null },
  };
}

export function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of ALL_RANKS) {
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

export function isFirstMoveOfRound(board: BoardState): boolean {
  return SUITS.every((s) => board[s].low === null);
}

export function isHeartFivePlayed(board: BoardState): boolean {
  return board['♥'].low !== null && board['♥'].low <= 5;
}

/**
 * Validates whether a card can be legally played on the current board.
 * Rules:
 * 1. The very first move of the round must be the 6 of Hearts (6♥).
 * 2. To play in any suit, that suit's 6 must be on board or being played now.
 * 3. Descending sequence: 5 -> 4 -> 3 -> 2 -> 1 (Ace).
 *    CRITICAL: 5 of ♦, ♣, ♠ CANNOT be played until 5 of Hearts is already on board!
 * 4. Ascending sequence: 7 -> 8 -> 9 -> 10 -> 11 (J) -> 12 (Q) -> 13 (K).
 */
export function isValidMove(card: Card, board: BoardState): boolean {
  const isFirst = isFirstMoveOfRound(board);
  if (isFirst) {
    return card.suit === '♥' && card.rank === 6;
  }

  const suitState = board[card.suit];

  // If suit has not opened yet, only its 6 can open it
  if (suitState.low === null) {
    return card.rank === 6;
  }

  // Downward move (5 down to 1)
  if (card.rank === suitState.low - 1 && card.rank >= 1) {
    // Badam Chhakka Rule: 5♥ must be played before 5♦, 5♣, or 5♠ can be played!
    if (card.rank === 5 && card.suit !== '♥') {
      if (!isHeartFivePlayed(board)) {
        return false;
      }
    }
    return true;
  }

  // Upward move (7 up to 13)
  if (suitState.high !== null && card.rank === suitState.high + 1 && card.rank <= 13) {
    return true;
  }

  return false;
}

export function getValidMoves(hand: Card[], board: BoardState): Card[] {
  return hand.filter((card) => isValidMove(card, board));
}

export function sortHand(hand: Card[], mode: 'suit' | 'rank' | 'playable' = 'suit', board?: BoardState): Card[] {
  const copy = [...hand];
  if (mode === 'playable' && board) {
    copy.sort((a, b) => {
      const aVal = isValidMove(a, board) ? 1 : 0;
      const bVal = isValidMove(b, board) ? 1 : 0;
      if (aVal !== bVal) return bVal - aVal;
      const sDiff = SUITS.indexOf(a.suit) - SUITS.indexOf(b.suit);
      if (sDiff !== 0) return sDiff;
      return a.rank - b.rank;
    });
  } else if (mode === 'rank') {
    copy.sort((a, b) => {
      if (a.rank !== b.rank) return a.rank - b.rank;
      return SUITS.indexOf(a.suit) - SUITS.indexOf(b.suit);
    });
  } else {
    // Default by suit
    copy.sort((a, b) => {
      const sDiff = SUITS.indexOf(a.suit) - SUITS.indexOf(b.suit);
      if (sDiff !== 0) return sDiff;
      return a.rank - b.rank;
    });
  }
  return copy;
}

export function applyMoveToBoard(board: BoardState, card: Card): BoardState {
  const newBoard: BoardState = {
    '♥': { ...board['♥'] },
    '♦': { ...board['♦'] },
    '♣': { ...board['♣'] },
    '♠': { ...board['♠'] },
  };

  const current = newBoard[card.suit];
  if (current.low === null || current.high === null) {
    current.low = 6;
    current.high = 6;
  } else if (card.rank < current.low) {
    current.low = card.rank;
  } else if (card.rank > current.high) {
    current.high = card.rank;
  }

  return newBoard;
}

/**
 * Intelligent Bot Move Selector
 */
export function chooseBotMove(
  botHand: Card[],
  board: BoardState,
  allPlayers: Player[],
  difficulty: BotDifficulty = 'normal'
): Card | null {
  const validMoves = getValidMoves(botHand, board);
  if (validMoves.length === 0) return null;
  if (validMoves.length === 1) return validMoves[0];

  if (difficulty === 'easy') {
    // Random move
    return validMoves[Math.floor(Math.random() * validMoves.length)];
  }

  const minOpponentCardCount = Math.min(
    ...allPlayers.filter((p) => p.hand !== botHand).map((p) => p.hand.length)
  );

  // Score each valid move
  const scoredMoves = validMoves.map((card) => {
    let score = 0;

    // Is opening a suit?
    if (board[card.suit].low === null && card.rank === 6) {
      // Opening is good if we hold other cards in that suit
      const cardsInSuit = botHand.filter((c) => c.suit === card.suit && c.rank !== 6).length;
      score += 30 + cardsInSuit * 15;
    }

    // Is this 5♥?
    if (card.suit === '♥' && card.rank === 5) {
      // Check if we hold other 5s or low cards in other suits
      const lowCardsInOtherSuits = botHand.filter((c) => c.suit !== '♥' && c.rank <= 5).length;
      if (lowCardsInOtherSuits > 0) {
        // We want to unlock 5♥ so we can dump our own low cards!
        score += 50 + lowCardsInOtherSuits * 12;
      } else {
        // We hold NO low cards in other suits!
        // Withholding 5♥ starves opponents! Deprioritize playing it if we have alternatives
        score -= difficulty === 'master' ? 40 : 10;
      }
    }

    // Threat response: If someone has few cards left (<= 4), prioritize shedding heavy cards (K, Q, J)
    if (minOpponentCardCount <= 4) {
      score += card.rank * 6; // heavier ranks get higher priority
    } else {
      // Regular play: balance high card shedding with building our own runs
      score += card.rank * 2;
    }

    // Reward continuing our own chain
    if (card.rank > 6) {
      const hasNextHigher = botHand.some((c) => c.suit === card.suit && c.rank === card.rank + 1);
      if (hasNextHigher) score += 20;
    } else if (card.rank < 6) {
      const hasNextLower = botHand.some((c) => c.suit === card.suit && c.rank === card.rank - 1);
      if (hasNextLower) score += 20;
    }

    // Add small random noise for variety
    score += Math.random() * 5;

    return { card, score };
  });

  scoredMoves.sort((a, b) => b.score - a.score);
  return scoredMoves[0].card;
}
