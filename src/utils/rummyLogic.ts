import { MeldGroup, MeldType, DeclarationValidation, RummyCard, Suit } from '../types/rummy';

export const SUITS: Suit[] = ['♥', '♦', '♣', '♠'];

/**
 * Creates 2 standard decks of 52 cards + 2 Printed Jokers = 106 cards.
 */
export function createRummyDeck(): RummyCard[] {
  const cards: RummyCard[] = [];

  for (let d = 1; d <= 2; d++) {
    const deckId = d as 1 | 2;
    for (const suit of SUITS) {
      for (let rank = 1; rank <= 13; rank++) {
        cards.push({
          id: `d${deckId}_${suit}_${rank}`,
          suit,
          rank,
          deckId,
          isPrintedJoker: false,
        });
      }
    }
    // 1 Printed Joker per deck
    cards.push({
      id: `d${deckId}_PJ`,
      suit: '♠',
      rank: 0,
      deckId,
      isPrintedJoker: true,
    });
  }

  return shuffleDeck(cards);
}

/**
 * Fisher-Yates shuffle algorithm
 */
export function shuffleDeck(deck: RummyCard[]): RummyCard[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Checks if a card is a Joker:
 * - Either a Printed Joker (rank 0)
 * - Or matches the rank of the Cut Joker.
 * Note: If the Cut Joker itself is a Printed Joker, Aces (rank 1) become Wild Jokers.
 */
export function isCardJoker(card: RummyCard, cutJoker: RummyCard): boolean {
  if (card.isPrintedJoker || card.rank === 0) return true;
  const effectiveJokerRank = cutJoker.isPrintedJoker || cutJoker.rank === 0 ? 1 : cutJoker.rank;
  return card.rank === effectiveJokerRank;
}

/**
 * Calculates card point value in Indian Rummy:
 * - A, K, Q, J = 10 points
 * - 2 to 10 = face value (e.g. 5 = 5 pts)
 * - Jokers (Printed or Wild) = 0 points
 */
export function getCardPoints(card: RummyCard, cutJoker: RummyCard): number {
  if (isCardJoker(card, cutJoker)) return 0;
  if (card.rank === 1) return 10; // Ace is 10 points
  if (card.rank >= 10) return 10; // 10, J, Q, K are 10 points
  return card.rank;
}

/**
 * Validates a Pure Sequence (First Life):
 * - Minimum 3 cards
 * - All cards must be of the EXACT SAME suit
 * - No Printed Jokers allowed
 * - Wild Jokers can ONLY be used in their natural rank and suit (not as wild substitutes)
 * - Cards must form consecutive sequence without gaps or duplicates
 * - Supports Ace-low (A-2-3-...) and Ace-high (...-Q-K-A). A cannot wrap around (e.g., K-A-2 is invalid).
 */
export function isPureSequence(cards: RummyCard[], cutJoker: RummyCard): boolean {
  if (cards.length < 3) return false;

  // Cannot contain any Printed Joker
  if (cards.some((c) => c.isPrintedJoker || c.rank === 0)) return false;

  const suit = cards[0].suit;
  if (cards.some((c) => c.suit !== suit)) return false;

  // Extract ranks
  const ranks = cards.map((c) => c.rank);

  // Check for duplicate ranks
  if (new Set(ranks).size !== ranks.length) return false;

  // Test standard sorting (Ace as 1)
  const sortedStandard = [...ranks].sort((a, b) => a - b);
  let isSeqStandard = true;
  for (let i = 0; i < sortedStandard.length - 1; i++) {
    if (sortedStandard[i + 1] !== sortedStandard[i] + 1) {
      isSeqStandard = false;
      break;
    }
  }
  if (isSeqStandard) return true;

  // Test Ace-high (A = 14: e.g. Q(12)-K(13)-A(14) or J-Q-K-A)
  if (ranks.includes(1)) {
    const aceHighRanks = ranks.map((r) => (r === 1 ? 14 : r)).sort((a, b) => a - b);
    let isSeqAceHigh = true;
    for (let i = 0; i < aceHighRanks.length - 1; i++) {
      if (aceHighRanks[i + 1] !== aceHighRanks[i] + 1) {
        isSeqAceHigh = false;
        break;
      }
    }
    if (isSeqAceHigh) return true;
  }

  return false;
}

/**
 * Validates an Impure Sequence (Second Life):
 * - Minimum 3 cards
 * - Natural cards must all be of the SAME suit
 * - Jokers (Printed or Wild) can substitute missing consecutive ranks
 * - At least one natural card must exist (obviously, need 3 cards total)
 */
export function isImpureSequence(cards: RummyCard[], cutJoker: RummyCard): boolean {
  if (cards.length < 3) return false;

  // If it's already a pure sequence, it also fulfills the requirement of an impure sequence
  if (isPureSequence(cards, cutJoker)) return true;

  const naturals: RummyCard[] = [];
  let jokersCount = 0;

  for (const c of cards) {
    if (isCardJoker(c, cutJoker)) {
      jokersCount++;
    } else {
      naturals.push(c);
    }
  }

  // Must have at least 1 natural card (or 2 to define a suit)
  if (naturals.length === 0) return false;

  // All natural cards must share the same suit
  const suit = naturals[0].suit;
  if (naturals.some((c) => c.suit !== suit)) return false;

  const natRanks = naturals.map((c) => c.rank);
  // No duplicates among natural cards
  if (new Set(natRanks).size !== natRanks.length) return false;

  // Try standard (Ace = 1)
  const canFormStandard = checkSequenceWithJokers(natRanks, jokersCount, false);
  if (canFormStandard) return true;

  // Try Ace-high (Ace = 14)
  if (natRanks.includes(1)) {
    const aceHigh = natRanks.map((r) => (r === 1 ? 14 : r));
    const canFormAceHigh = checkSequenceWithJokers(aceHigh, jokersCount, true);
    if (canFormAceHigh) return true;
  }

  return false;
}

function checkSequenceWithJokers(ranks: number[], availableJokers: number, isAceHigh: boolean): boolean {
  const sorted = [...ranks].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];

  // Span between min and max
  const span = max - min + 1;
  const missingInSpan = span - sorted.length;

  if (missingInSpan <= availableJokers) {
    // We can fill all gaps inside the span.
    // Any remaining jokers can extend sequence at the ends.
    // But maximum sequence length cannot exceed 14 (A to K or 1 to 14)
    if (sorted.length + availableJokers <= 14) {
      return true;
    }
  }

  return false;
}

/**
 * Validates a Set:
 * - 3 or 4 cards of the SAME rank
 * - Natural cards must have DIFFERENT suits (no duplicate suits)
 * - Jokers can substitute any missing suit
 */
export function isValidSet(cards: RummyCard[], cutJoker: RummyCard): boolean {
  if (cards.length < 3 || cards.length > 4) return false;

  const naturals: RummyCard[] = [];
  let jokersCount = 0;

  for (const c of cards) {
    if (isCardJoker(c, cutJoker)) {
      jokersCount++;
    } else {
      naturals.push(c);
    }
  }

  // If all are jokers or only 1 natural card + 2 jokers
  if (naturals.length <= 1) return true;

  // All natural cards must have the SAME rank
  const targetRank = naturals[0].rank;
  if (naturals.some((c) => c.rank !== targetRank)) return false;

  // Natural cards must have DIFFERENT suits
  const suits = naturals.map((c) => c.suit);
  if (new Set(suits).size !== suits.length) return false;

  return true;
}

/**
 * Classifies a group of cards into its best meld type
 */
export function classifyMeld(cards: RummyCard[], cutJoker: RummyCard): MeldType {
  if (cards.length < 3) return 'invalid';

  if (isPureSequence(cards, cutJoker)) return 'pure_sequence';
  if (isImpureSequence(cards, cutJoker)) return 'impure_sequence';
  if (isValidSet(cards, cutJoker)) return 'set';

  return 'invalid';
}

/**
 * Evaluates a single meld group with detailed stats
 */
export function evaluateGroup(cards: RummyCard[], cutJoker: RummyCard, id: string): MeldGroup {
  const meldType = classifyMeld(cards, cutJoker);
  const isValid = meldType !== 'invalid';
  const score = isValid ? 0 : cards.reduce((sum, c) => sum + getCardPoints(c, cutJoker), 0);

  return {
    id,
    cards,
    meldType,
    isValid,
    score,
  };
}

/**
 * Validates a full player declaration (all groups of cards in hand).
 * Requires:
 * 1. At least 1 Pure Sequence (First Life)
 * 2. At least 1 Second Sequence (Pure or Impure)
 * 3. All remaining groups must be valid Sets or Sequences
 * 4. Total cards should be 13 (or 14 before final discard).
 */
export function validateDeclaration(groups: RummyCard[][], cutJoker: RummyCard): DeclarationValidation {
  const breakdown: string[] = [];
  let pureSequenceCount = 0;
  let secondSequenceCount = 0;
  let setCount = 0;
  let invalidGroupCount = 0;

  const totalCards = groups.reduce((acc, g) => acc + g.length, 0);

  const evaluatedGroups: { type: MeldType; cards: RummyCard[] }[] = [];

  for (const group of groups) {
    if (group.length === 0) continue;

    if (isPureSequence(group, cutJoker)) {
      pureSequenceCount++;
      evaluatedGroups.push({ type: 'pure_sequence', cards: group });
    } else if (isImpureSequence(group, cutJoker)) {
      secondSequenceCount++;
      evaluatedGroups.push({ type: 'impure_sequence', cards: group });
    } else if (isValidSet(group, cutJoker)) {
      setCount++;
      evaluatedGroups.push({ type: 'set', cards: group });
    } else {
      invalidGroupCount++;
      evaluatedGroups.push({ type: 'invalid', cards: group });
    }
  }

  // If there are multiple pure sequences, the extras count as valid second sequences!
  const effectivePure = pureSequenceCount;
  const effectiveSecond = (pureSequenceCount > 1 ? pureSequenceCount - 1 : 0) + secondSequenceCount;

  const hasPureSequence = effectivePure >= 1;
  const hasSecondSequence = hasPureSequence && effectiveSecond >= 1;

  let totalScore = 0;

  if (!hasPureSequence) {
    // If no pure sequence, player gets penalty for ALL cards in hand (max 80 points)
    breakdown.push('No Pure Sequence (First Life missing)');
    totalScore = groups.flat().reduce((sum, c) => sum + getCardPoints(c, cutJoker), 0);
  } else if (!hasSecondSequence) {
    // If has pure sequence but no second sequence, pure sequence cards are exempt, others count!
    breakdown.push('Missing Second Sequence (Second Life missing)');
    let nonPurePoints = 0;
    let foundFirstPure = false;

    for (const g of evaluatedGroups) {
      if (g.type === 'pure_sequence' && !foundFirstPure) {
        foundFirstPure = true; // exempt
      } else {
        nonPurePoints += g.cards.reduce((sum, c) => sum + getCardPoints(c, cutJoker), 0);
      }
    }
    totalScore = nonPurePoints;
  } else {
    // Both sequences satisfied: only invalid groups carry penalty!
    for (const g of evaluatedGroups) {
      if (g.type === 'invalid') {
        totalScore += g.cards.reduce((sum, c) => sum + getCardPoints(c, cutJoker), 0);
      }
    }
  }

  // Cap penalty at 80 points (standard Indian Rummy rule)
  totalScore = Math.min(80, totalScore);

  const isValid = hasPureSequence && hasSecondSequence && invalidGroupCount === 0 && (totalCards === 13 || totalCards === 14);

  return {
    isValid,
    hasPureSequence,
    hasSecondSequence,
    totalScore,
    pureSequenceCount,
    secondSequenceCount,
    setCount,
    invalidGroupCount,
    breakdown,
  };
}

/**
 * Intelligent Hand Auto-Grouping:
 * Automatically sorts player's hand into logical groups:
 * 1. Finds Pure Sequences first
 * 2. Finds Impure Sequences with Jokers
 * 3. Finds Sets
 * 4. Gathers remaining deadwood
 */
export function autoGroupHand(hand: RummyCard[], cutJoker: RummyCard): RummyCard[][] {
  const cards = [...hand];
  const groups: RummyCard[][] = [];

  // Group by suit first
  const bySuit: Record<Suit, RummyCard[]> = { '♥': [], '♦': [], '♣': [], '♠': [] };
  const jokers: RummyCard[] = [];

  for (const c of cards) {
    if (isCardJoker(c, cutJoker)) {
      jokers.push(c);
    } else {
      bySuit[c.suit].push(c);
    }
  }

  // Sort each suit
  for (const s of SUITS) {
    bySuit[s].sort((a, b) => a.rank - b.rank);
  }

  // 1. Extract pure sequences
  for (const s of SUITS) {
    const suitCards = bySuit[s];
    if (suitCards.length < 3) continue;

    // Sliding window for sequences
    let seq: RummyCard[] = [suitCards[0]];
    for (let i = 1; i < suitCards.length; i++) {
      if (suitCards[i].rank === seq[seq.length - 1].rank + 1) {
        seq.push(suitCards[i]);
      } else if (suitCards[i].rank === seq[seq.length - 1].rank) {
        // duplicate rank, skip
      } else {
        if (seq.length >= 3) {
          groups.push(seq);
          // Remove used from suitCards
          const usedIds = new Set(seq.map((c) => c.id));
          bySuit[s] = suitCards.filter((c) => !usedIds.has(c.id));
        }
        seq = [suitCards[i]];
      }
    }
    if (seq.length >= 3) {
      groups.push(seq);
      const usedIds = new Set(seq.map((c) => c.id));
      bySuit[s] = suitCards.filter((c) => !usedIds.has(c.id));
    }
  }

  // 2. Form groups from remaining cards by suit
  for (const s of SUITS) {
    const remainingInSuit = bySuit[s];
    if (remainingInSuit.length > 0) {
      // If we have jokers and 2 consecutive cards in this suit, attach joker
      if (jokers.length > 0 && remainingInSuit.length >= 2) {
        const withJoker = [...remainingInSuit, jokers.pop()!];
        groups.push(withJoker);
      } else {
        groups.push(remainingInSuit);
      }
    }
  }

  // Any leftover jokers attach to the smallest group or form their own
  if (jokers.length > 0) {
    if (groups.length > 0) {
      groups[0].push(...jokers);
    } else {
      groups.push(jokers);
    }
  }

  return groups.filter((g) => g.length > 0);
}

/**
 * AI Bot decision for Indian Rummy:
 * 1. Decide whether to draw from Open Pile or Closed Deck
 * 2. Decide which card to discard
 * 3. Decide whether to declare (if valid)
 */
export function botMakeTurn(
  botHand: RummyCard[],
  cutJoker: RummyCard,
  openTopCard: RummyCard | null
): {
  drawFrom: 'open' | 'closed';
  discardCard: RummyCard;
  canDeclare: boolean;
} {
  // Check if open top card is a Joker or highly useful (e.g. completes a run)
  let drawFrom: 'open' | 'closed' = 'closed';

  if (openTopCard) {
    if (isCardJoker(openTopCard, cutJoker)) {
      drawFrom = 'open';
    } else {
      // Check if open card connects with any 2 cards in bot hand
      const matchingSuitCards = botHand.filter((c) => c.suit === openTopCard.suit);
      const connects = matchingSuitCards.some((c) => Math.abs(c.rank - openTopCard.rank) === 1);
      const matchingRank = botHand.filter((c) => c.rank === openTopCard.rank);

      if (connects || matchingRank.length >= 2) {
        drawFrom = 'open';
      }
    }
  }

  // To simulate discard: pick candidate card that has the highest deadwood score and isn't a joker
  const nonJokers = botHand.filter((c) => !isCardJoker(c, cutJoker));
  let discardCard = nonJokers[0] || botHand[0];

  // Prefer discarding high point cards (K, Q, J, 10) that do not connect to other cards
  let maxDeadwoodValue = -1;

  for (const c of nonJokers) {
    const sameSuitNeighbors = botHand.filter(
      (other) => other.id !== c.id && other.suit === c.suit && Math.abs(other.rank - c.rank) <= 2
    );
    const sameRankNeighbors = botHand.filter((other) => other.id !== c.id && other.rank === c.rank);

    // If completely isolated
    const isolationPenalty = sameSuitNeighbors.length === 0 && sameRankNeighbors.length === 0 ? 20 : 0;
    const value = getCardPoints(c, cutJoker) + isolationPenalty;

    if (value > maxDeadwoodValue) {
      maxDeadwoodValue = value;
      discardCard = c;
    }
  }

  // Test if declaring is possible
  const remainingCards = botHand.filter((c) => c.id !== discardCard.id);
  const testGroups = autoGroupHand(remainingCards, cutJoker);
  const validation = validateDeclaration(testGroups, cutJoker);

  return {
    drawFrom,
    discardCard,
    canDeclare: validation.isValid,
  };
}
