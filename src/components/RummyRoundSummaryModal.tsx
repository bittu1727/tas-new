import React from 'react';
import { RummyPlayer, RummyCard, Language } from '../types/rummy';
import { RummyCardView } from './RummyCardView';
import { RUMMY_TRANSLATIONS } from '../utils/rummyTranslations';
import { isCardJoker, evaluateGroup } from '../utils/rummyLogic';
import { Trophy, CheckCircle, XCircle, RotateCcw, Award } from 'lucide-react';

interface RummyRoundSummaryModalProps {
  isOpen: boolean;
  winner: RummyPlayer;
  players: RummyPlayer[];
  roundNumber: number;
  cutJoker: RummyCard;
  onNextRound: () => void;
  language: Language;
}

export const RummyRoundSummaryModal: React.FC<RummyRoundSummaryModalProps> = ({
  isOpen,
  winner,
  players,
  roundNumber,
  cutJoker,
  onNextRound,
  language,
}) => {
  const t = RUMMY_TRANSLATIONS[language];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-amber-500/40 rounded-3xl p-5 sm:p-6 max-w-2xl w-full text-left shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Winner Banner */}
        <div className="flex flex-col items-center text-center pb-4 border-b border-white/10">
          <div className="w-14 h-14 rounded-full bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center text-amber-400 mb-2 shadow-[0_0_20px_rgba(251,191,36,0.5)]">
            <Trophy size={32} />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-amber-300">
            {winner.name} {language === 'hi' ? 'ने विजेता घोषणा की! 🏆' : 'Won the Round! 🏆'}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            {language === 'hi'
              ? 'विजेता को ० पेनल्टी अंक मिलते हैं। अन्य खिलाड़ियों के पेनल्टी अंक नीचे दिए गए हैं:'
              : 'The winner gets 0 points. Opponents receive penalty points according to Indian Rummy rules:'}
          </p>
        </div>

        {/* Players Score Breakdown Table */}
        <div className="space-y-3 my-4">
          {players.map((p) => {
            const isWinner = p.id === winner.id;
            const isDropped = p.status === 'dropped';

            return (
              <div
                key={p.id}
                className={`p-3 rounded-2xl border transition-all ${
                  isWinner
                    ? 'bg-amber-950/40 border-amber-400/60 ring-1 ring-amber-400/30'
                    : 'bg-white/[0.03] border-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{p.avatar}</span>
                    <span className="text-sm font-bold text-neutral-100">{p.name}</span>
                    {isWinner && (
                      <span className="text-[10px] font-bold bg-amber-400 text-neutral-950 px-2 py-0.5 rounded-full">
                        WINNER (0 pts)
                      </span>
                    )}
                    {isDropped && (
                      <span className="text-[10px] font-bold bg-rose-950 text-rose-400 border border-rose-500/40 px-2 py-0.5 rounded-full">
                        DROPPED
                      </span>
                    )}
                  </div>
                  <div className="font-mono text-base font-black text-amber-300">
                    {p.score} pts
                  </div>
                </div>

                {/* Show player's groups if not dropped */}
                {!isDropped && (
                  <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
                    {p.groups.map((group, gIdx) => {
                      const evaluated = evaluateGroup(group, cutJoker, `res_${p.id}_${gIdx}`);
                      return (
                        <div
                          key={gIdx}
                          className="flex flex-col items-center bg-black/40 rounded-xl p-1 border border-white/5 shrink-0"
                        >
                          <span
                            className={`text-[8px] font-bold mb-0.5 ${
                              evaluated.isValid ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            {evaluated.meldType === 'pure_sequence'
                              ? 'Pure'
                              : evaluated.meldType === 'impure_sequence'
                              ? 'Seq'
                              : evaluated.meldType === 'set'
                              ? 'Set'
                              : 'Invalid'}
                          </span>
                          <div className="flex items-center -space-x-3">
                            {group.map((c) => (
                              <RummyCardView
                                key={c.id}
                                card={c}
                                isJoker={isCardJoker(c, cutJoker)}
                                size="sm"
                              />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end pt-3 border-t border-white/10">
          <button
            onClick={onNextRound}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-sm bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-yellow-200 text-neutral-950 shadow-lg hover:shadow-xl transition-all active:scale-95 cursor-pointer"
          >
            <RotateCcw size={16} />
            <span>{t.nextRound}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
