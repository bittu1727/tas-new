import React, { useState } from 'react';
import { BoardState, Card, HandSortMode, Language, Player, Suit } from '../types/game';
import { CardView } from './CardView';
import { isHeartFivePlayed, isValidMove, sortHand, SUITS } from '../utils/gameLogic';
import { SUIT_NAMES, TRANSLATIONS } from '../utils/translations';
import { Lightbulb, RotateCcw, LayoutGrid, Layers } from 'lucide-react';

interface PlayerHandProps {
  player: Player;
  isCurrentTurn: boolean;
  board: BoardState;
  validMoves: Card[];
  sortMode: HandSortMode;
  onSortChange: (mode: HandSortMode) => void;
  onPlayCard: (card: Card) => void;
  onPass: () => void;
  onHint: () => void;
  language: Language;
}

export const PlayerHand: React.FC<PlayerHandProps> = ({
  player,
  isCurrentTurn,
  board,
  validMoves,
  sortMode,
  onSortChange,
  onPlayCard,
  onPass,
  onHint,
  language,
}) => {
  const t = TRANSLATIONS[language];
  const [viewStyle, setViewStyle] = useState<'grouped' | 'fan'>('grouped');
  const sortedCards = sortHand(player.hand, sortMode, board);
  const heartFiveOut = isHeartFivePlayed(board);

  // Total hand penalty points risk
  const currentHandPoints = player.hand.reduce((sum, c) => sum + c.rank, 0);

  // Group cards by suit for the Grouped view
  const suitGroups: Record<Suit, Card[]> = {
    '♥': [],
    '♦': [],
    '♣': [],
    '♠': [],
  };

  sortedCards.forEach((c) => {
    if (suitGroups[c.suit]) {
      suitGroups[c.suit].push(c);
    }
  });

  return (
    <div
      className={`rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 transition-all duration-300 border shadow-2xl w-full backdrop-blur-md ${
        isCurrentTurn
          ? 'bg-gradient-to-t from-emerald-950/95 via-neutral-900/95 to-neutral-900/90 border-emerald-500/70 shadow-[0_0_35px_rgba(16,185,129,0.35)] ring-1 ring-emerald-500/40'
          : 'bg-black/75 border-white/10'
      }`}
    >
      {/* Top Header: Hand Count, Risk, View Switcher & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5 border-b border-white/10 pb-2 px-1">
        {/* Left: Turn Indicator & Stats */}
        <div className="flex items-center gap-2 flex-wrap">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              isCurrentTurn ? 'bg-emerald-400 animate-ping' : 'bg-neutral-600'
            }`}
          />
          <h3 className="font-bold text-xs sm:text-sm text-neutral-100 flex items-center gap-2">
            <span>{t.yourHand}</span>
            <span className="font-mono text-amber-300 font-bold bg-amber-950/80 border border-amber-500/40 px-2 py-0.5 rounded text-[11px] shadow-inner">
              {player.hand.length} {t.cardsLeft}
            </span>
          </h3>

          <div
            className="flex items-center gap-1 text-[10px] sm:text-[11px] font-mono text-rose-300 bg-rose-950/60 border border-rose-500/40 px-2 py-0.5 rounded shadow-inner"
            title={language === 'hi' ? 'राउंड समाप्त होने पर पेनल्टी जोखिम' : 'Current penalty risk'}
          >
            <span className="text-neutral-400">{language === 'hi' ? 'जोखिम:' : 'Risk:'}</span>
            <strong className="text-rose-400 font-black">{currentHandPoints}p</strong>
          </div>
        </div>

        {/* Right: Sorters & Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {/* Grouped vs Continuous Fan Toggle */}
          <div className="flex items-center bg-black/60 p-0.5 rounded-lg border border-white/10 text-[11px]">
            <button
              onClick={() => setViewStyle('grouped')}
              className={`flex items-center gap-1 px-2 py-0.5 rounded transition-all cursor-pointer ${
                viewStyle === 'grouped'
                  ? 'bg-amber-400 text-neutral-950 font-bold shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title={language === 'hi' ? 'सूट अनुसार समूह' : 'Grouped by Suit'}
            >
              <LayoutGrid size={11} />
              <span>{language === 'hi' ? 'सूट समूह' : 'Groups'}</span>
            </button>
            <button
              onClick={() => setViewStyle('fan')}
              className={`flex items-center gap-1 px-2 py-0.5 rounded transition-all cursor-pointer ${
                viewStyle === 'fan'
                  ? 'bg-amber-400 text-neutral-950 font-bold shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title={language === 'hi' ? 'लगातार कतार' : 'Continuous fan'}
            >
              <Layers size={11} />
              <span>{language === 'hi' ? 'कतार' : 'Fan'}</span>
            </button>
          </div>

          {/* Sorter Buttons (when in Fan view) */}
          {viewStyle === 'fan' && (
            <div className="flex items-center bg-black/60 p-0.5 rounded-lg border border-white/10 text-[11px]">
              <button
                onClick={() => onSortChange('suit')}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                  sortMode === 'suit'
                    ? 'bg-amber-400 text-neutral-950 font-bold shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {language === 'hi' ? 'सूट' : 'Suit'}
              </button>
              <button
                onClick={() => onSortChange('rank')}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                  sortMode === 'rank'
                    ? 'bg-amber-400 text-neutral-950 font-bold shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {language === 'hi' ? 'मान' : 'Rank'}
              </button>
              <button
                onClick={() => onSortChange('playable')}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                  sortMode === 'playable'
                    ? 'bg-amber-400 text-neutral-950 font-bold shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {language === 'hi' ? 'चाल' : 'Playable'}
              </button>
            </div>
          )}

          {/* Hint Button */}
          {isCurrentTurn && validMoves.length > 0 && (
            <button
              onClick={onHint}
              className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <Lightbulb size={12} className="text-amber-400" />
              <span>{t.hint}</span>
            </button>
          )}

          {/* Explicit Pass Button when no move */}
          {isCurrentTurn && validMoves.length === 0 && (
            <button
              onClick={onPass}
              className="flex items-center gap-1 px-3 py-1 text-xs font-black bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white rounded-lg shadow-[0_0_15px_rgba(225,29,72,0.6)] transition-all animate-bounce cursor-pointer active:scale-95"
            >
              <RotateCcw size={12} />
              <span>{t.pass}</span>
            </button>
          )}
        </div>
      </div>

      {/* Cards View Area with Generous Top Padding (pt-5) to Eliminate Any Top Clipping */}
      {viewStyle === 'grouped' ? (
        /* 1. SUIT-GROUPED VIEW: Clean, Organised, Highly Readable */
        <div className="pt-4 pb-2 px-1 flex items-start justify-start sm:justify-center gap-2 sm:gap-3 overflow-x-auto scrollbar-none w-full">
          {SUITS.map((suit) => {
            const cardsInSuit = suitGroups[suit];
            if (cardsInSuit.length === 0) return null;
            const isRed = suit === '♥' || suit === '♦';

            return (
              <div
                key={suit}
                className="flex flex-col items-center bg-black/40 border border-white/10 rounded-xl p-1.5 sm:p-2 shrink-0 shadow-inner"
              >
                {/* Suit Cluster Header */}
                <div className="flex items-center gap-1 mb-1 px-1.5 py-0.5 rounded bg-black/60 border border-white/5 w-full justify-between">
                  <span
                    className={`text-sm font-black leading-none ${
                      isRed ? 'text-rose-500' : 'text-neutral-200'
                    }`}
                  >
                    {suit}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400 font-bold">
                    {cardsInSuit.length}
                  </span>
                </div>

                {/* Cards in this suit */}
                <div className="flex items-center -space-x-3.5 sm:-space-x-4 pt-2 pb-1 px-1">
                  {cardsInSuit.map((card) => {
                    const isPlayable = isCurrentTurn && isValidMove(card, board);
                    const isBlockedFive = card.rank === 5 && card.suit !== '♥' && !heartFiveOut;

                    return (
                      <div key={card.id} className="shrink-0 transition-transform duration-150">
                        <CardView
                          card={card}
                          isPlayable={isPlayable}
                          isBlockedFive={isBlockedFive}
                          onClick={isPlayable ? () => onPlayCard(card) : undefined}
                          size="md"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* 2. CONTINUOUS FAN VIEW: Roomy, Non-Clipping Horizontal Strip */
        <div className="pt-5 pb-2 px-2 flex items-center justify-start sm:justify-center overflow-x-auto scrollbar-none -space-x-3 sm:-space-x-4 md:-space-x-3.5 transition-all">
          {sortedCards.map((card) => {
            const isPlayable = isCurrentTurn && isValidMove(card, board);
            const isBlockedFive = card.rank === 5 && card.suit !== '♥' && !heartFiveOut;

            return (
              <div key={card.id} className="shrink-0 transition-transform duration-150">
                <CardView
                  card={card}
                  isPlayable={isPlayable}
                  isBlockedFive={isBlockedFive}
                  onClick={isPlayable ? () => onPlayCard(card) : undefined}
                  size="md"
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
