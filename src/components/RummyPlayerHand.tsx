import React from 'react';
import { RummyCard, TurnPhase, Language, MeldGroup } from '../types/rummy';
import { RummyCardView } from './RummyCardView';
import { RUMMY_TRANSLATIONS } from '../utils/rummyTranslations';
import { isCardJoker, classifyMeld, evaluateGroup } from '../utils/rummyLogic';
import {
  Sparkles,
  Layers,
  Trash2,
  Trophy,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  FolderPlus,
  RefreshCw,
} from 'lucide-react';

interface RummyPlayerHandProps {
  groups: RummyCard[][];
  cutJoker: RummyCard;
  selectedCardIds: Set<string>;
  onToggleSelectCard: (cardId: string) => void;
  onGroupSelected: () => void;
  onAutoGroup: () => void;
  onDiscardSelected: () => void;
  onDeclare: () => void;
  turnPhase: TurnPhase;
  isHumanTurn: boolean;
  canDeclare: boolean;
  handScore: number;
  hasPureSequence: boolean;
  hasSecondSequence: boolean;
  language: Language;
}

export const RummyPlayerHand: React.FC<RummyPlayerHandProps> = ({
  groups,
  cutJoker,
  selectedCardIds,
  onToggleSelectCard,
  onGroupSelected,
  onAutoGroup,
  onDiscardSelected,
  onDeclare,
  turnPhase,
  isHumanTurn,
  canDeclare,
  handScore,
  hasPureSequence,
  hasSecondSequence,
  language,
}) => {
  const t = RUMMY_TRANSLATIONS[language];
  const canDiscard = isHumanTurn && turnPhase === 'discard' && selectedCardIds.size === 1;
  const canGroup = selectedCardIds.size >= 2;

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-2">
      {/* Top Hand Bar: Live Score & Sequence Requirements */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 rounded-2xl bg-black/50 border border-white/10 text-xs shadow-md">
        {/* Sequence Life Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-medium">
            <span
              className={`w-2 h-2 rounded-full ${
                hasPureSequence ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-rose-500'
              }`}
            />
            <span className={hasPureSequence ? 'text-emerald-300 font-bold' : 'text-neutral-400'}>
              {language === 'hi' ? 'शुद्ध १ला जीवन' : 'Pure Seq (1st Life)'}
            </span>
          </div>

          <span className="text-white/20">|</span>

          <div className="flex items-center gap-1.5 font-medium">
            <span
              className={`w-2 h-2 rounded-full ${
                hasSecondSequence ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-neutral-600'
              }`}
            />
            <span className={hasSecondSequence ? 'text-emerald-300 font-bold' : 'text-neutral-400'}>
              {language === 'hi' ? '२रा जीवन' : '2nd Life (Seq)'}
            </span>
          </div>
        </div>

        {/* Live Score Counter */}
        <div className="flex items-center gap-2">
          <span className="text-neutral-400">{t.scoreLabel}</span>
          <span
            className={`font-mono text-sm font-black px-2.5 py-0.5 rounded-lg border ${
              handScore === 0 && canDeclare
                ? 'bg-amber-400 text-neutral-950 border-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.6)] animate-bounce'
                : handScore <= 20
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                : 'bg-rose-950/80 text-rose-300 border-rose-500/40'
            }`}
          >
            {handScore === 0 && canDeclare ? '0 PTS (READY!)' : `${handScore} pts`}
          </span>
        </div>
      </div>

      {/* Main Groups Area */}
      <div className="flex items-start justify-center gap-3 sm:gap-4 overflow-x-auto p-3 rounded-2xl bg-black/30 border border-white/10 min-h-[9.5rem] scrollbar-none">
        {groups.map((group, groupIdx) => {
          const evaluated = evaluateGroup(group, cutJoker, `g_${groupIdx}`);
          const badgeConfig = {
            pure_sequence: {
              label: t.pureSeqBadge,
              style: 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300',
            },
            impure_sequence: {
              label: t.impureSeqBadge,
              style: 'bg-blue-950/80 border-blue-500/50 text-blue-300',
            },
            set: {
              label: t.setBadge,
              style: 'bg-purple-950/80 border-purple-500/50 text-purple-300',
            },
            invalid: {
              label: t.invalidBadge,
              style: 'bg-white/5 border-white/10 text-neutral-400',
            },
          }[evaluated.meldType];

          return (
            <div
              key={groupIdx}
              className="flex flex-col items-center bg-white/[0.03] border border-white/10 rounded-2xl p-2 shrink-0 transition-all hover:bg-white/[0.05]"
            >
              {/* Group Meld Status Tag */}
              <div
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border mb-2 select-none shadow-sm ${badgeConfig.style}`}
              >
                {badgeConfig.label}
              </div>

              {/* Overlapping Card Row */}
              <div className="flex items-center -space-x-4 sm:-space-x-5 px-1 py-1">
                {group.map((card) => {
                  const isSelected = selectedCardIds.has(card.id);
                  const isJoker = isCardJoker(card, cutJoker);

                  return (
                    <RummyCardView
                      key={card.id}
                      card={card}
                      isSelected={isSelected}
                      isJoker={isJoker}
                      onClick={() => onToggleSelectCard(card.id)}
                      size="md"
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-2 py-1">
        {/* Left Action: Auto Group / Smart Sort */}
        <div className="flex items-center gap-2">
          <button
            onClick={onAutoGroup}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/15 border border-white/15 text-neutral-200 rounded-xl transition-all cursor-pointer active:scale-95 shadow-sm"
          >
            <RefreshCw size={13} />
            <span>{t.autoGroupBtn}</span>
          </button>

          <button
            onClick={canGroup ? onGroupSelected : undefined}
            disabled={!canGroup}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              canGroup
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 hover:bg-amber-500/30 cursor-pointer shadow-md'
                : 'bg-white/5 text-neutral-500 border border-white/5 opacity-50 cursor-not-allowed'
            }`}
          >
            <FolderPlus size={14} />
            <span>{t.groupBtn}</span>
          </button>
        </div>

        {/* Right Primary Actions: Discard / Declare */}
        <div className="flex items-center gap-2">
          {canDeclare && isHumanTurn && turnPhase === 'discard' && (
            <button
              onClick={onDeclare}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-black bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 text-neutral-950 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.6)] hover:shadow-2xl transition-all cursor-pointer animate-pulse active:scale-95"
            >
              <Trophy size={15} />
              <span>{t.declareBtn}</span>
            </button>
          )}

          <button
            onClick={canDiscard ? onDiscardSelected : undefined}
            disabled={!canDiscard}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              canDiscard
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg cursor-pointer active:scale-95'
                : 'bg-white/5 text-neutral-500 border border-white/5 opacity-40 cursor-not-allowed'
            }`}
          >
            <Trash2 size={14} />
            <span>{t.discardBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
