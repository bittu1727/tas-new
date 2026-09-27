import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Card, Language, Player } from '../types/game';
import { SHORT_RANK, TRANSLATIONS } from '../utils/translations';
import { sounds } from '../utils/audio';
import { Trophy, Award, ArrowRight, RotateCcw, Crown, Info, Sparkles } from 'lucide-react';

interface RoundSummaryModalProps {
  isOpen: boolean;
  winnerIndex: number;
  players: Player[];
  scores: number[];
  roundNumber: number;
  onNextRound: () => void;
  onResetTournament: () => void;
  language: Language;
}

export const RoundSummaryModal: React.FC<RoundSummaryModalProps> = ({
  isOpen,
  winnerIndex,
  players,
  scores,
  roundNumber,
  onNextRound,
  onResetTournament,
  language,
}) => {
  const t = TRANSLATIONS[language];

  useEffect(() => {
    if (isOpen) {
      sounds.playWin();
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch {
        // Confetti fallback
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const winner = players[winnerIndex];
  const lowestScore = Math.min(...scores);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-neutral-900 via-neutral-900 to-neutral-950 border-2 border-amber-400/90 rounded-3xl p-4 sm:p-6 max-w-2xl w-full text-center shadow-[0_0_60px_rgba(0,0,0,0.9),0_0_20px_rgba(245,158,11,0.2)] overflow-y-auto max-h-[94vh]">
        {/* Trophy & Winner Title */}
        <div className="flex flex-col items-center gap-2 mb-3">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-200 text-neutral-950 flex items-center justify-center shadow-xl ring-4 ring-amber-400/30">
            <Trophy size={36} />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-amber-300 font-serif tracking-wide">
            {t.winnerBanner.replace('{name}', winner?.name || '')}
          </h2>
          <div className="inline-flex items-center gap-2 text-xs text-emerald-300 font-bold bg-emerald-950/80 border border-emerald-500/50 px-3.5 py-1 rounded-full shadow-inner">
            <Sparkles size={14} className="text-emerald-400" />
            <span>
              {language === 'hi'
                ? 'सभी पत्ते पहले समाप्त करने पर विजेता को मिले ० पॉइंट!'
                : 'Finished all cards first ➔ Awarded 0 Points!'}
            </span>
          </div>
        </div>

        {/* Highlight Banner Explaining the Point Distribution Rule */}
        <div className="bg-amber-950/40 border border-amber-500/40 rounded-2xl p-2.5 sm:p-3 text-left text-xs mb-3 shadow-inner">
          <div className="flex items-start gap-2">
            <Info size={16} className="text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-300">
                {language === 'hi' ? 'पॉइंट गणना नियम: ' : 'Point Distribution Rule: '}
              </span>
              <span className="text-amber-100/90">
                {language === 'hi'
                  ? 'हाथ में बचे पत्तों के मान के बराबर पेनल्टी पॉइंट जुड़ते हैं (जैसे: अंत में K बचा तो १३ पॉइंट, Q=१२, J=११, १० से २ का संख्या मान, और A=१ पॉइंट)। विजेता को ० पॉइंट मिलते हैं।'
                  : 'Opponents receive penalty points equal to each leftover card’s rank (e.g. King K = 13 pts, Queen Q = 12 pts, Jack J = 11 pts, 10–2 = face value, Ace A = 1 pt). Winner gets 0 pts.'}
              </span>
            </div>
          </div>
        </div>

        {/* Breakdown Table */}
        <div className="my-3 bg-black/50 rounded-2xl border border-white/10 p-2.5 sm:p-3 overflow-x-auto text-left shadow-inner">
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
            <h4 className="text-xs font-bold text-neutral-200 uppercase tracking-wider flex items-center gap-1.5">
              <Award size={15} className="text-amber-400" />
              <span>{t.roundBreakdown}</span>
            </h4>
            <span className="text-[11px] font-mono text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
              K=13 · Q=12 · J=11 · A=1
            </span>
          </div>

          <table className="w-full text-xs text-neutral-300">
            <thead>
              <tr className="border-b border-white/10 text-neutral-400 font-medium">
                <th className="py-2 px-2.5 text-left">{t.playerCol}</th>
                <th className="py-2 px-2 text-center">{t.cardsLeftCol}</th>
                <th className="py-2 px-2.5 text-left">{t.cardListCol}</th>
                <th className="py-2 px-2.5 text-right">{t.pointsEarnedCol}</th>
              </tr>
            </thead>
            <tbody>
              {/* Winner Row (First, Highlighted in Emerald Gold) */}
              <tr className="bg-emerald-950/50 border-b border-emerald-500/40 text-emerald-200 font-semibold">
                <td className="py-2.5 px-2.5 flex items-center gap-1.5">
                  <Crown size={14} className="text-amber-400 shrink-0" />
                  <span className="font-bold text-white">{winner.name}</span>
                </td>
                <td className="py-2.5 px-2 text-center font-mono font-bold text-emerald-400">0</td>
                <td className="py-2.5 px-2.5 text-emerald-300/90 italic">
                  {language === 'hi' ? 'सभी पत्ते समाप्त (विजेता)' : 'Cleared all cards (Winner)'}
                </td>
                <td className="py-2.5 px-2.5 text-right font-mono font-black text-emerald-400 text-sm">
                  0 pts
                </td>
              </tr>

              {/* Opponent Rows with exact card rank point tags */}
              {players.map((p, idx) => {
                if (idx === winnerIndex) return null;
                const penaltyPoints = p.hand.reduce((sum, c) => sum + c.rank, 0);

                return (
                  <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="py-2.5 px-2.5 font-bold text-neutral-200">
                      {p.name}
                    </td>
                    <td className="py-2.5 px-2 text-center font-mono font-bold text-amber-300">
                      {p.hand.length}
                    </td>
                    <td className="py-2.5 px-2.5">
                      <div className="flex items-center gap-1.5 flex-wrap max-w-[280px]">
                        {p.hand.map((c) => {
                          const isRed = c.suit === '♥' || c.suit === '♦';
                          const rankLabel = SHORT_RANK[c.rank] || c.rank;
                          return (
                            <span
                              key={c.id}
                              className={`inline-flex items-center gap-1 font-mono font-semibold px-1.5 py-0.5 rounded text-[11px] ${
                                isRed
                                  ? 'bg-rose-950/70 text-rose-300 border border-rose-500/40'
                                  : 'bg-neutral-800 text-neutral-200 border border-white/20'
                              }`}
                              title={`${rankLabel}${c.suit} = ${c.rank} points`}
                            >
                              <span>{rankLabel}{c.suit}</span>
                              <span className="text-[9px] text-amber-300/90 font-normal">
                                ({c.rank}p)
                              </span>
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td className="py-2.5 px-2.5 text-right font-mono font-black text-rose-400 text-sm">
                      +{penaltyPoints} pts
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Tournament Overall Scores (Lowest is Leading) */}
        <div className="bg-white/[0.04] rounded-2xl p-3 border border-white/10 mb-4">
          <div className="flex items-center justify-between text-xs font-semibold text-neutral-400 mb-2 px-1">
            <span>🏆 {t.totalTournamentScore}</span>
            <span className="text-amber-300 text-[11px] flex items-center gap-1 font-medium">
              <Crown size={12} className="text-amber-400" />
              {language === 'hi' ? 'न्यूनतम पॉइंट वाला आगे' : 'Lowest Score Leads'}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            {players.map((p, idx) => {
              const isLeader = scores[idx] === lowestScore;
              return (
                <div
                  key={p.id}
                  className={`p-2.5 rounded-xl border transition-all ${
                    isLeader
                      ? 'bg-amber-500/20 border-amber-400/80 text-amber-300 ring-2 ring-amber-400/30 shadow-md'
                      : 'bg-black/40 border-white/10 text-neutral-300'
                  }`}
                >
                  <div className="text-xs font-bold truncate flex items-center justify-center gap-1">
                    {isLeader && <Crown size={12} className="text-amber-400" />}
                    <span>{p.name}</span>
                  </div>
                  <div className="text-base sm:text-lg font-mono font-black mt-0.5">
                    {scores[idx]} <span className="text-[10px] font-normal">pts</span>
                  </div>
                  {isLeader && (
                    <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                      👑 {language === 'hi' ? 'प्रथम स्थान' : '1st Place'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button
            onClick={onNextRound}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-neutral-950 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-300 hover:from-amber-300 hover:to-yellow-200 rounded-xl shadow-lg transition-transform active:scale-95 cursor-pointer"
          >
            <span>{t.nextRoundBtn}</span>
            <ArrowRight size={16} />
          </button>

          <button
            onClick={onResetTournament}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw size={14} />
            <span>{t.resetTournament}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
