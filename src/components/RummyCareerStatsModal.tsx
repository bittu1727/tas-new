import React, { useState } from 'react';
import { Language, RummyCareerStats } from '../types/rummy';
import { RUMMY_TRANSLATIONS } from '../utils/rummyTranslations';
import { Trophy, Award, Target, Flame, RotateCcw, X, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface RummyCareerStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: RummyCareerStats;
  onResetStats: () => void;
  language: Language;
}

export const RummyCareerStatsModal: React.FC<RummyCareerStatsModalProps> = ({
  isOpen,
  onClose,
  stats,
  onResetStats,
  language,
}) => {
  const t = RUMMY_TRANSLATIONS[language];
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  if (!isOpen) return null;

  const winRate =
    stats.totalGamesPlayed > 0
      ? Math.round((stats.totalWins / stats.totalGamesPlayed) * 100)
      : 0;

  const avgPenalty =
    stats.totalGamesPlayed > 0
      ? Math.round(stats.totalScorePenalty / stats.totalGamesPlayed)
      : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-amber-500/40 rounded-3xl p-5 sm:p-6 max-w-lg w-full text-left shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Trophy size={20} className="text-amber-400" />
            <h2 className="text-lg font-bold text-neutral-100">{t.careerStats}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Win Rate Highlight Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-neutral-950 border border-amber-500/30 flex items-center justify-between mb-4 shadow-md">
          <div>
            <div className="text-xs text-amber-300/80 font-medium">
              {language === 'hi' ? 'जीत प्रतिशत (Win Rate)' : 'Overall Win Rate'}
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono mt-0.5">
              {winRate}%
            </div>
          </div>
          <div className="text-right text-xs text-neutral-400">
            <div>
              {language === 'hi' ? 'कुल जीत:' : 'Total Wins:'}{' '}
              <strong className="text-emerald-400">{stats.totalWins}</strong> /{' '}
              {stats.totalGamesPlayed}
            </div>
          </div>
        </div>

        {/* 4-Metric Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
            <span className="text-neutral-400">
              {language === 'hi' ? 'खेले गए गेम' : 'Games Played'}
            </span>
            <span className="font-mono text-lg font-black text-white mt-1">
              {stats.totalGamesPlayed}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
            <span className="text-neutral-400">
              {language === 'hi' ? 'शुद्ध सीक्वेंस बनाए' : 'Pure Sequences'}
            </span>
            <span className="font-mono text-lg font-black text-emerald-400 mt-1">
              {stats.pureSequencesMade}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
            <span className="text-neutral-400">
              {language === 'hi' ? 'औसत पेनल्टी अंक' : 'Avg Penalty Pts'}
            </span>
            <span className="font-mono text-lg font-black text-amber-300 mt-1">
              {avgPenalty} pts
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
            <span className="text-neutral-400">
              {language === 'hi' ? 'ड्रॉप किए गेम' : 'Total Drops'}
            </span>
            <span className="font-mono text-lg font-black text-rose-400 mt-1">
              {stats.totalDrops}
            </span>
          </div>
        </div>

        {/* Recent Matches */}
        <div className="mb-4">
          <div className="text-xs font-bold text-neutral-300 mb-2">
            {language === 'hi' ? 'हाल के मैच' : 'Recent Matches'}
          </div>
          <div className="max-h-36 overflow-y-auto space-y-1.5 text-xs">
            {stats.recentGames.length === 0 ? (
              <div className="text-neutral-500 text-center py-4 text-[11px]">
                {language === 'hi' ? 'अभी कोई मैच रिकॉर्ड नहीं है।' : 'No matches recorded yet.'}
              </div>
            ) : (
              stats.recentGames.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-white/5"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        m.won
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                          : 'bg-rose-950 text-rose-300 border border-rose-500/40'
                      }`}
                    >
                      {m.won ? 'WON' : 'LOSS'}
                    </span>
                    <span className="text-neutral-400 capitalize">{m.mode}</span>
                  </div>
                  <span className="font-mono text-neutral-300">
                    {m.points} pts
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Reset Confirmation or Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          {showConfirmReset ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-rose-400">
                {language === 'hi' ? 'क्या आप रीसेट करना चाहते हैं?' : 'Reset stats?'}
              </span>
              <button
                onClick={() => {
                  onResetStats();
                  setShowConfirmReset(false);
                }}
                className="px-2.5 py-1 text-xs font-bold bg-rose-600 text-white rounded-lg cursor-pointer"
              >
                {language === 'hi' ? 'हाँ, रीसेट' : 'Yes, Reset'}
              </button>
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-2.5 py-1 text-xs font-medium text-neutral-400 hover:text-white cursor-pointer"
              >
                {language === 'hi' ? 'रद्द' : 'Cancel'}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirmReset(true)}
              className="text-xs text-neutral-500 hover:text-rose-400 transition-colors cursor-pointer"
            >
              {language === 'hi' ? 'आँकड़े रीसेट करें' : 'Reset Career Stats'}
            </button>
          )}

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/15 text-white transition-colors cursor-pointer"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
