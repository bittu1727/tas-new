import React from 'react';
import { RummyCard, TurnPhase, Language } from '../types/rummy';
import { RummyCardView } from './RummyCardView';
import { RUMMY_TRANSLATIONS } from '../utils/rummyTranslations';
import { isCardJoker } from '../utils/rummyLogic';
import { Layers, ArrowDownCircle, CheckCircle2, AlertCircle } from 'lucide-react';

interface RummyTableCenterProps {
  closedDeckCount: number;
  openTopCard: RummyCard | null;
  cutJoker: RummyCard;
  turnPhase: TurnPhase;
  isHumanTurn: boolean;
  onDrawClosed: () => void;
  onDrawOpen: () => void;
  onDropToFinish?: () => void;
  canFinishDeclare?: boolean;
  language: Language;
}

export const RummyTableCenter: React.FC<RummyTableCenterProps> = ({
  closedDeckCount,
  openTopCard,
  cutJoker,
  turnPhase,
  isHumanTurn,
  onDrawClosed,
  onDrawOpen,
  onDropToFinish,
  canFinishDeclare = false,
  language,
}) => {
  const t = RUMMY_TRANSLATIONS[language];
  const canDraw = isHumanTurn && turnPhase === 'draw';
  const canDiscard = isHumanTurn && turnPhase === 'discard';

  return (
    <div className="flex flex-col items-center justify-center p-3 sm:p-5 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-md shadow-2xl max-w-2xl mx-auto w-full">
      {/* Upper Status Guide */}
      <div className="text-xs sm:text-sm font-semibold mb-3 flex items-center gap-2">
        {isHumanTurn ? (
          turnPhase === 'draw' ? (
            <span className="text-amber-300 flex items-center gap-1.5 animate-pulse bg-amber-950/60 px-3 py-1 rounded-full border border-amber-500/40">
              <ArrowDownCircle size={15} />
              <span>{t.drawCard} ({t.closedDeck} / {t.openDeck})</span>
            </span>
          ) : (
            <span className="text-emerald-300 flex items-center gap-1.5 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/40">
              <CheckCircle2 size={15} />
              <span>{t.discardPrompt}</span>
            </span>
          )
        ) : (
          <span className="text-neutral-400">
            {language === 'hi' ? 'विरोधी की चाल की प्रतीक्षा...' : 'Opponent is playing...'}
          </span>
        )}
      </div>

      {/* Center Deck Grid */}
      <div className="flex items-center justify-center gap-4 sm:gap-8 flex-wrap">
        {/* 1. Closed Stockpile Deck with Cut Joker Tucked Beneath */}
        <div className="flex flex-col items-center">
          <div className="relative group">
            {/* Cut Joker peeking horizontally beneath the closed pile */}
            <div className="absolute -left-6 sm:-left-8 top-1/2 -translate-y-1/2 rotate-[-90deg] scale-90 sm:scale-95 shadow-lg">
              <RummyCardView card={cutJoker} isCutJokerFace size="sm" />
            </div>

            {/* Closed Deck Stack */}
            <div
              onClick={canDraw ? onDrawClosed : undefined}
              className={`relative ${
                canDraw
                  ? 'cursor-pointer hover:scale-105 active:scale-95 ring-2 ring-amber-400 rounded-lg shadow-[0_0_20px_rgba(245,158,11,0.5)]'
                  : 'opacity-90'
              } transition-all duration-150`}
            >
              {/* Stack effect layers */}
              <div className="absolute -top-1 -right-1 w-12 h-18 sm:w-14 sm:h-20 bg-neutral-900 border border-amber-400/20 rounded-lg -z-10" />
              <div className="absolute -top-2 -right-2 w-12 h-18 sm:w-14 sm:h-20 bg-neutral-900 border border-amber-400/10 rounded-lg -z-20" />
              <RummyCardView isFaceDown size="md" />

              {/* Deck count badge */}
              <div className="absolute -bottom-2 -right-2 bg-neutral-950 border border-white/20 text-neutral-200 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full shadow">
                {closedDeckCount}
              </div>
            </div>
          </div>
          <span className="text-[11px] text-neutral-400 mt-2 font-medium">
            {t.closedDeck}
          </span>
        </div>

        {/* 2. Open Discard Pile */}
        <div className="flex flex-col items-center">
          <div
            onClick={canDraw && openTopCard ? onDrawOpen : undefined}
            className={`relative ${
              canDraw && openTopCard
                ? 'cursor-pointer hover:scale-105 active:scale-95 ring-2 ring-emerald-400 rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                : ''
            } transition-all duration-150 min-w-[3rem] min-h-[4.5rem] flex items-center justify-center`}
          >
            {openTopCard ? (
              <RummyCardView
                card={openTopCard}
                isJoker={isCardJoker(openTopCard, cutJoker)}
                size="md"
              />
            ) : (
              <div className="w-12 h-18 sm:w-14 sm:h-20 rounded-lg border-2 border-dashed border-white/20 flex items-center justify-center text-xs text-neutral-500">
                Empty
              </div>
            )}
          </div>
          <span className="text-[11px] text-neutral-400 mt-2 font-medium">
            {t.openDeck}
          </span>
        </div>

        {/* 3. Finish / Declare Slot */}
        <div className="flex flex-col items-center">
          <div
            onClick={canDiscard && onDropToFinish ? onDropToFinish : undefined}
            className={`w-12 h-18 sm:w-14 sm:h-20 rounded-lg border-2 border-dashed flex flex-col items-center justify-center p-1 text-center transition-all ${
              canDiscard
                ? 'border-amber-400/80 bg-amber-950/30 text-amber-300 cursor-pointer hover:bg-amber-950/60 ring-2 ring-amber-400/50 shadow-[0_0_15px_rgba(245,158,11,0.3)] animate-pulse'
                : 'border-white/15 bg-white/[0.02] text-neutral-500'
            }`}
          >
            <span className="text-[10px] font-black uppercase leading-tight">
              {language === 'hi' ? 'घोषणा / शो' : 'Finish Show'}
            </span>
            <span className="text-[9px] mt-1 opacity-70">
              {language === 'hi' ? 'स्लॉट' : 'Slot'}
            </span>
          </div>
          <span className="text-[11px] text-neutral-400 mt-2 font-medium">
            {t.finishSlot}
          </span>
        </div>
      </div>
    </div>
  );
};
