import React from 'react';
import { BoardState, Card, Language, Suit } from '../types/game';
import { CardView } from './CardView';
import { isHeartFivePlayed, SUITS } from '../utils/gameLogic';
import { SHORT_RANK, SUIT_NAMES, TRANSLATIONS } from '../utils/translations';
import { ShieldAlert, CheckCircle2, Lock, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

interface BoardViewProps {
  board: BoardState;
  validMoves?: Card[];
  onPlayCard?: (card: Card) => void;
  language: Language;
}

export const BoardView: React.FC<BoardViewProps> = ({
  board,
  validMoves = [],
  onPlayCard,
  language,
}) => {
  const t = TRANSLATIONS[language];
  const heartFiveOut = isHeartFivePlayed(board);

  // Helper to check if a specific card rank/suit is in player's valid moves
  const getPlayableCard = (suit: Suit, rank: number): Card | undefined => {
    return validMoves.find((c) => c.suit === suit && c.rank === rank);
  };

  return (
    <div className="relative rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 bg-gradient-to-b from-emerald-950/80 via-neutral-950/90 to-neutral-950/95 border-2 border-amber-500/30 shadow-[0_12px_40px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.15)] flex flex-col gap-2.5 sm:gap-3 w-full backdrop-blur-md">
      {/* Decorative Gold Filigree Corner Accents */}
      <div className="absolute top-2 left-2 text-amber-400/40 text-xs select-none pointer-events-none font-serif">
        ❖
      </div>
      <div className="absolute top-2 right-2 text-amber-400/40 text-xs select-none pointer-events-none font-serif">
        ❖
      </div>

      {/* Board Header & 5♥ Status Alert */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-400/20 pb-2 px-1">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-amber-300 font-serif font-black text-sm sm:text-base tracking-wide">
            <span className="text-amber-400">♠</span>
            <span>{t.boardTitle}</span>
          </div>
          <span className="hidden sm:inline-block text-[11px] text-neutral-400 font-mono">
            A ◄ 5 ◄ <strong className="text-amber-400">[ 6 ]</strong> ► 7 ► K
          </span>
        </div>

        {/* 5♥ Rule status banner */}
        {!heartFiveOut ? (
          <div className="flex items-center gap-1.5 text-[11px] text-amber-300 bg-amber-950/70 border border-amber-500/40 px-2.5 py-0.5 rounded-full shadow-inner animate-pulse">
            <ShieldAlert size={13} className="text-amber-400 shrink-0" />
            <span className="truncate max-w-[240px] sm:max-w-none font-medium">
              {t.fiveBlockedHint}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-[11px] text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-medium shadow-inner">
            <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
            <span>5♥ {language === 'hi' ? 'खुल गया — सभी ५ सक्रिय' : 'played — all 5s unlocked'}</span>
          </div>
        )}
      </div>

      {/* 4 Suit Lanes */}
      <div className="flex flex-col gap-2 w-full">
        {SUITS.map((suit) => {
          const state = board[suit];
          const isRed = suit === '♥' || suit === '♦';
          const isOpened = state.low !== null && state.high !== null;
          const suitName = SUIT_NAMES[language][suit];

          // Played Low cards: ordered from lowest up to 5 so 5 touches the center 6
          const lowCards: Card[] = [];
          if (isOpened && state.low !== null && state.low < 6) {
            for (let r = state.low; r <= 5; r++) {
              lowCards.push({ id: `${suit}-${r}`, suit, rank: r });
            }
          }

          // Center 6 Card
          const centerCard: Card = { id: `${suit}-6`, suit, rank: 6 };

          // Played High cards: ordered from 7 up to highest so 7 touches the center 6
          const highCards: Card[] = [];
          if (isOpened && state.high !== null && state.high > 6) {
            for (let r = 7; r <= state.high; r++) {
              highCards.push({ id: `${suit}-${r}`, suit, rank: r });
            }
          }

          // Next target ranks
          const nextLowRank = !isOpened ? null : state.low! > 1 ? state.low! - 1 : null;
          const nextHighRank = !isOpened ? null : state.high! < 13 ? state.high! + 1 : null;

          // Check if human holds the next cards
          const playableSix = !isOpened ? getPlayableCard(suit, 6) : undefined;
          const playableNextLow = nextLowRank ? getPlayableCard(suit, nextLowRank) : undefined;
          const playableNextHigh = nextHighRank ? getPlayableCard(suit, nextHighRank) : undefined;

          // Is 5 blocked by 5♥ rule
          const isFiveBlocked = suit !== '♥' && !heartFiveOut && nextLowRank === 5;

          return (
            <div
              key={suit}
              className={`flex items-center gap-1.5 sm:gap-2.5 p-1.5 sm:p-2 rounded-xl transition-all border ${
                isOpened
                  ? 'bg-black/40 border-amber-400/15 shadow-sm'
                  : 'bg-black/25 border-white/5 opacity-85'
              }`}
            >
              {/* Left Suit Insignia Medallion */}
              <div
                className={`w-9 h-11 sm:w-11 sm:h-13 rounded-lg border flex flex-col items-center justify-center shrink-0 shadow-inner select-none ${
                  isRed
                    ? 'bg-rose-950/40 border-rose-500/30 text-rose-500'
                    : 'bg-slate-950/60 border-slate-700/40 text-neutral-100'
                }`}
              >
                <span className="text-xl sm:text-2xl leading-none font-black">{suit}</span>
                <span className="text-[8px] sm:text-[9px] font-bold text-neutral-400 truncate mt-0.5">
                  {suitName.split(' ')[0]}
                </span>
              </div>

              {/* Lane Runway: [Low Branch ◀] [Center 6] [▶ High Branch] */}
              <div className="flex-1 flex items-center justify-between gap-1 sm:gap-1.5 overflow-x-auto scrollbar-none py-0.5 min-w-0">
                {/* 1. Low Cards Branch (5 down to A) */}
                <div className="flex-1 flex items-center justify-end gap-1 overflow-x-auto scrollbar-none px-1">
                  {!isOpened ? (
                    <div className="text-[10px] sm:text-[11px] text-neutral-500 italic pr-2">
                      {language === 'hi' ? '६ से खुलेगा' : 'Awaiting 6'}
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 justify-end">
                      {/* Terminal Ace reached banner */}
                      {state.low === 1 && (
                        <span className="text-[8px] sm:text-[9px] font-black text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-1 py-0.5 rounded shadow">
                          ACE ✓
                        </span>
                      )}

                      {/* Next Low Placement Slot */}
                      {nextLowRank !== null && (
                        <div
                          onClick={() => {
                            if (playableNextLow && onPlayCard) {
                              onPlayCard(playableNextLow);
                            }
                          }}
                          className={`w-8 h-12 sm:w-9 sm:h-13 rounded-lg border-2 border-dashed flex flex-col items-center justify-center text-center transition-all shrink-0 select-none ${
                            playableNextLow
                              ? 'border-emerald-400 bg-emerald-950/70 text-emerald-300 ring-2 ring-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.6)] cursor-pointer animate-pulse hover:scale-105 active:scale-95'
                              : isFiveBlocked
                              ? 'border-amber-500/40 bg-amber-950/20 text-amber-400/60 cursor-not-allowed'
                              : 'border-white/15 bg-white/[0.02] text-neutral-500'
                          }`}
                          title={
                            isFiveBlocked
                              ? '5♥ must be played first'
                              : playableNextLow
                              ? `Click to place ${SHORT_RANK[nextLowRank] || nextLowRank}${suit}`
                              : `Slot for ${SHORT_RANK[nextLowRank] || nextLowRank}${suit}`
                          }
                        >
                          {isFiveBlocked ? (
                            <div className="flex flex-col items-center">
                              <Lock size={11} className="text-amber-400" />
                              <span className="text-[8px] font-bold mt-0.5">5♥</span>
                            </div>
                          ) : playableNextLow ? (
                            <div className="flex flex-col items-center">
                              <span className="text-[10px] font-black leading-none text-emerald-300 font-mono">
                                {SHORT_RANK[nextLowRank] || nextLowRank}
                              </span>
                              <span className="text-[7px] font-black uppercase tracking-tighter text-emerald-400 mt-0.5 bg-emerald-500/20 px-1 rounded">
                                PLACE
                              </span>
                            </div>
                          ) : (
                            <span className="font-mono text-xs font-bold text-neutral-400">
                              {SHORT_RANK[nextLowRank] || nextLowRank}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Played Low Cards Fan */}
                      {lowCards.length > 0 && (
                        <div className="flex items-center -space-x-3.5 sm:-space-x-4">
                          {lowCards.map((c) => (
                            <CardView
                              key={c.id}
                              card={c}
                              size="sm"
                              isTerminalWing={c.rank === 1}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 2. Center Anchor [ 6 ] Slot */}
                <div className="shrink-0 px-1 sm:px-1.5 flex items-center justify-center">
                  {!isOpened ? (
                    <div
                      onClick={() => {
                        if (playableSix && onPlayCard) {
                          onPlayCard(playableSix);
                        }
                      }}
                      className={`w-8 h-12 sm:w-10 sm:h-14 rounded-lg border-2 border-dashed flex flex-col items-center justify-center transition-all select-none ${
                        playableSix
                          ? 'border-amber-400 bg-amber-950/80 text-amber-300 ring-2 ring-amber-400 shadow-[0_0_18px_rgba(245,158,11,0.7)] cursor-pointer animate-bounce hover:scale-105 active:scale-95'
                          : 'border-amber-400/40 bg-amber-950/20 text-amber-400/70'
                      }`}
                      title={
                        playableSix
                          ? `Click to place 6${suit} and open suit!`
                          : `Place 6${suit} here to open`
                      }
                    >
                      <span className="font-mono font-black text-sm leading-none">6</span>
                      <span className="text-[10px] leading-none mt-0.5">{suit}</span>
                      {playableSix && (
                        <span className="text-[7px] font-black uppercase text-amber-300 tracking-tighter mt-0.5 bg-amber-500/30 px-1 rounded">
                          OPEN
                        </span>
                      )}
                    </div>
                  ) : (
                    <CardView card={centerCard} size="sm" isCenterSix={true} />
                  )}
                </div>

                {/* 3. High Cards Branch (7 up to K) */}
                <div className="flex-1 flex items-center justify-start gap-1 overflow-x-auto scrollbar-none px-1">
                  {!isOpened ? (
                    <div className="text-[10px] sm:text-[11px] text-neutral-500 italic pl-2">
                      {language === 'hi' ? '६ से खुलेगा' : 'Awaiting 6'}
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 justify-start">
                      {/* Played High Cards Fan */}
                      {highCards.length > 0 && (
                        <div className="flex items-center -space-x-3.5 sm:-space-x-4">
                          {highCards.map((c) => (
                            <CardView
                              key={c.id}
                              card={c}
                              size="sm"
                              isTerminalWing={c.rank === 13}
                            />
                          ))}
                        </div>
                      )}

                      {/* Next High Placement Slot */}
                      {nextHighRank !== null && (
                        <div
                          onClick={() => {
                            if (playableNextHigh && onPlayCard) {
                              onPlayCard(playableNextHigh);
                            }
                          }}
                          className={`w-8 h-12 sm:w-9 sm:h-13 rounded-lg border-2 border-dashed flex flex-col items-center justify-center text-center transition-all shrink-0 select-none ${
                            playableNextHigh
                              ? 'border-emerald-400 bg-emerald-950/70 text-emerald-300 ring-2 ring-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.6)] cursor-pointer animate-pulse hover:scale-105 active:scale-95'
                              : 'border-white/15 bg-white/[0.02] text-neutral-500'
                          }`}
                          title={
                            playableNextHigh
                              ? `Click to place ${SHORT_RANK[nextHighRank] || nextHighRank}${suit}`
                              : `Slot for ${SHORT_RANK[nextHighRank] || nextHighRank}${suit}`
                          }
                        >
                          {playableNextHigh ? (
                            <div className="flex flex-col items-center">
                              <span className="text-[10px] font-black leading-none text-emerald-300 font-mono">
                                {SHORT_RANK[nextHighRank] || nextHighRank}
                              </span>
                              <span className="text-[7px] font-black uppercase tracking-tighter text-emerald-400 mt-0.5 bg-emerald-500/20 px-1 rounded">
                                PLACE
                              </span>
                            </div>
                          ) : (
                            <span className="font-mono text-xs font-bold text-neutral-400">
                              {SHORT_RANK[nextHighRank] || nextHighRank}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Terminal King reached banner */}
                      {state.high === 13 && (
                        <span className="text-[8px] sm:text-[9px] font-black text-amber-400 bg-amber-950/80 border border-amber-500/40 px-1 py-0.5 rounded shadow">
                          KING ✓
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
