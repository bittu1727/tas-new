import React, { useState } from 'react';
import { CareerStats, Language } from '../types/game';
import { TRANSLATIONS } from '../utils/translations';
import {
  Trophy,
  Award,
  Zap,
  Flame,
  RotateCcw,
  X,
  Target,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Sparkles,
  Percent,
} from 'lucide-react';

interface CareerStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: CareerStats;
  onResetStats: () => void;
  language: Language;
}

export const CareerStatsModal: React.FC<CareerStatsModalProps> = ({
  isOpen,
  onClose,
  stats,
  onResetStats,
  language,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  if (!isOpen) return null;

  const totalPlayed = stats.totalRoundsPlayed;
  const totalWon = stats.totalRoundsWon;
  const winRate = totalPlayed > 0 ? ((totalWon / totalPlayed) * 100).toFixed(1) : '0.0';
  const avgPenalty =
    totalPlayed > 0 ? (stats.totalPenaltyPoints / totalPlayed).toFixed(1) : '0.0';

  const handleConfirmReset = () => {
    onResetStats();
    setShowConfirmReset(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-neutral-900 via-neutral-900 to-neutral-950 border-2 border-amber-400/80 rounded-3xl p-4 sm:p-6 max-w-xl w-full text-left shadow-[0_0_60px_rgba(0,0,0,0.9),0_0_20px_rgba(245,158,11,0.2)] overflow-y-auto max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-200 text-neutral-950 flex items-center justify-center shadow-lg ring-2 ring-amber-400/40">
              <Trophy size={22} className="text-neutral-950" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>{language === 'hi' ? 'करियर आँकड़े' : 'Career Statistics'}</span>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 border border-amber-500/40 px-2 py-0.5 rounded-full">
                  LIFETIME
                </span>
              </h2>
              <p className="text-[11px] text-neutral-400">
                {language === 'hi'
                  ? 'सभी टूर्नामेंट और सत्रों का समग्र प्रदर्शन रिकॉर्ड'
                  : 'Cumulative records across all tournament sessions'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Hero Performance Card: Win Rate Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-950/60 via-black/60 to-neutral-900 p-4 border border-amber-500/40 shadow-inner mb-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={13} />
                <span>{language === 'hi' ? 'समग्र जीत प्रतिशत' : 'Overall Win Percentage'}</span>
              </div>
              <div className="text-3xl sm:text-4xl font-mono font-black text-white mt-1 flex items-baseline gap-1.5">
                <span>{winRate}%</span>
                <span className="text-xs font-normal text-neutral-400">
                  ({totalWon} / {totalPlayed} {language === 'hi' ? 'राउंड जीते' : 'won'})
                </span>
              </div>
            </div>

            {/* Visual Win Circle Badge */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-yellow-400/20 border border-amber-400/40 flex flex-col items-center justify-center text-center p-1">
              <Award size={22} className="text-amber-300" />
              <span className="text-[10px] font-mono text-neutral-300 mt-0.5">
                {stats.cleanWins} {language === 'hi' ? 'क्लीन' : 'Clean'}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-black/60 h-2.5 rounded-full overflow-hidden mt-3 border border-white/10">
            <div
              className="bg-gradient-to-r from-amber-500 to-yellow-300 h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.min(parseFloat(winRate), 100)}%` }}
            />
          </div>
        </div>

        {/* 6-Grid Lifetime Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-4">
          {/* 1. Total Games Played */}
          <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex flex-col justify-between">
            <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
              <span>{language === 'hi' ? 'कुल खेल' : 'Games Played'}</span>
              <Target size={14} className="text-amber-400" />
            </div>
            <div className="text-xl sm:text-2xl font-mono font-bold text-white">
              {totalPlayed}
            </div>
            <div className="text-[10px] text-neutral-400 mt-1">
              {language === 'hi' ? 'राउंड समाप्त' : 'completed rounds'}
            </div>
          </div>

          {/* 2. Total Wins */}
          <div className="p-3 rounded-xl bg-black/40 border border-emerald-500/30 flex flex-col justify-between">
            <div className="flex items-center justify-between text-emerald-400 text-xs mb-1">
              <span>{language === 'hi' ? 'कुल जीत' : 'Total Wins'}</span>
              <Trophy size={14} className="text-emerald-400" />
            </div>
            <div className="text-xl sm:text-2xl font-mono font-bold text-emerald-300">
              {totalWon}
            </div>
            <div className="text-[10px] text-emerald-400/80 mt-1">
              {stats.cleanWins} {language === 'hi' ? 'क्लीन ०-पॉइंट जीत' : 'sweeps with 0 pts'}
            </div>
          </div>

          {/* 3. Total Penalty Points */}
          <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex flex-col justify-between">
            <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
              <span>{language === 'hi' ? 'कुल पेनल्टी' : 'Total Penalty'}</span>
              <TrendingUp size={14} className="text-rose-400" />
            </div>
            <div className="text-xl sm:text-2xl font-mono font-bold text-rose-300">
              {stats.totalPenaltyPoints}
            </div>
            <div className="text-[10px] text-neutral-400 mt-1" title="Lower points is better">
              {language === 'hi' ? 'पॉइंट (कम सबसे बेहतर)' : 'points (lower is best)'}
            </div>
          </div>

          {/* 4. Average Penalty / Game */}
          <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex flex-col justify-between">
            <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
              <span>{language === 'hi' ? 'औसत पेनल्टी' : 'Avg Penalty'}</span>
              <Percent size={14} className="text-sky-400" />
            </div>
            <div className="text-xl sm:text-2xl font-mono font-bold text-sky-300">
              {avgPenalty}
            </div>
            <div className="text-[10px] text-neutral-400 mt-1">
              {language === 'hi' ? 'पॉइंट प्रति राउंड' : 'points per game'}
            </div>
          </div>

          {/* 5. Clean 0-Pt Wins */}
          <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex flex-col justify-between">
            <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
              <span>{language === 'hi' ? 'क्लीन स्वीप' : 'Clean Sweeps'}</span>
              <ShieldCheck size={14} className="text-yellow-400" />
            </div>
            <div className="text-xl sm:text-2xl font-mono font-bold text-yellow-300">
              {stats.cleanWins}
            </div>
            <div className="text-[10px] text-neutral-400 mt-1">
              {language === 'hi' ? '० पेनल्टी जीत' : '0 penalty wins'}
            </div>
          </div>

          {/* 6. 6♥ Starter Hand Deals */}
          <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex flex-col justify-between">
            <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
              <span>{language === 'hi' ? '६♥ प्रस्थान' : '6♥ Openings'}</span>
              <span className="text-rose-500 font-bold">♥</span>
            </div>
            <div className="text-xl sm:text-2xl font-mono font-bold text-rose-300">
              {stats.sixHeartOpenings}
            </div>
            <div className="text-[10px] text-neutral-400 mt-1">
              {language === 'hi' ? 'बार खेल शुरू किया' : 'times started'}
            </div>
          </div>
        </div>

        {/* Recent Matches Feed */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs font-bold text-neutral-300 mb-2">
            <span>{language === 'hi' ? 'हालिया मैचों का इतिहास' : 'Recent Match History'}</span>
            <span className="text-[11px] text-neutral-400 font-normal">
              {stats.recentRounds.length} {language === 'hi' ? 'राउंड' : 'recent'}
            </span>
          </div>

          {stats.recentRounds.length === 0 ? (
            <div className="p-4 rounded-xl bg-black/30 border border-white/5 text-center text-xs text-neutral-500">
              {language === 'hi'
                ? 'अभी कोई मैच रिकॉर्ड नहीं है। खेल शुरू करने पर यहाँ दिखेगा।'
                : 'No match records yet. Play games to populate your career history.'}
            </div>
          ) : (
            <div className="max-h-44 overflow-y-auto space-y-1.5 scrollbar-thin">
              {stats.recentRounds.map((r, i) => (
                <div
                  key={r.id || i}
                  className="flex items-center justify-between p-2 rounded-xl bg-black/40 border border-white/5 text-xs hover:border-white/15 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        r.won
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      }`}
                    >
                      {r.won ? '✓' : '✗'}
                    </span>
                    <div>
                      <div className="font-semibold text-white flex items-center gap-1.5">
                        <span>
                          {r.won
                            ? language === 'hi'
                              ? 'राउंड विजय'
                              : 'Victory'
                            : language === 'hi'
                            ? 'पेनल्टी'
                            : 'Defeat / Penalty'}
                        </span>
                        <span className="text-[10px] font-mono text-neutral-400 px-1.5 py-0.2 rounded bg-white/5 border border-white/10 uppercase">
                          {r.mode === 'online' ? '🌐 World' : '🤖 Solo'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`font-mono font-bold ${
                        r.won ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {r.penalty === 0 ? '0 pts' : `+${r.penalty} pts`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions: Reset Career Stats safeguard */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
          {showConfirmReset ? (
            <div className="flex items-center gap-2 bg-rose-950/50 p-1.5 rounded-xl border border-rose-500/40 w-full justify-between animate-in fade-in">
              <span className="text-xs text-rose-300 flex items-center gap-1">
                <AlertTriangle size={14} className="text-rose-400 shrink-0" />
                <span>{language === 'hi' ? 'सभी आँकड़े रीसेट करें?' : 'Reset all stats?'}</span>
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setShowConfirmReset(false)}
                  className="px-2.5 py-1 text-[11px] rounded-lg bg-white/10 text-neutral-300 hover:text-white cursor-pointer"
                >
                  {language === 'hi' ? 'नहीं' : 'Cancel'}
                </button>
                <button
                  onClick={handleConfirmReset}
                  className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-rose-600 text-white hover:bg-rose-500 cursor-pointer shadow"
                >
                  {language === 'hi' ? 'हाँ, रीसेट करें' : 'Yes, Reset'}
                </button>
              </div>
            </div>
          ) : (
            <>
              <button
                onClick={() => setShowConfirmReset(true)}
                className="flex items-center gap-1 text-[11px] text-neutral-500 hover:text-rose-400 transition-colors cursor-pointer p-1"
              >
                <RotateCcw size={12} />
                <span>{language === 'hi' ? 'आँकड़े रीसेट' : 'Reset Career Stats'}</span>
              </button>

              <button
                onClick={onClose}
                className="px-5 py-1.5 rounded-xl bg-amber-400 text-neutral-950 font-bold text-xs hover:bg-amber-300 transition-all cursor-pointer shadow"
              >
                {language === 'hi' ? 'बंद करें' : 'Close'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
