import React from 'react';
import { Language, Player, RoundResult } from '../types/game';
import { TRANSLATIONS } from '../utils/translations';
import { X, History, Trophy, Award, Crown } from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: RoundResult[];
  players: Player[];
  language: Language;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  players,
  language,
}) => {
  const t = TRANSLATIONS[language];

  if (!isOpen) return null;

  const totalRounds = history.length;
  const userWins = history.filter((h) => h.winnerIndex === 0).length;
  const winRate = totalRounds > 0 ? Math.round((userWins / totalRounds) * 100) : 0;
  const latestScores = history.length > 0 ? history[0].playerScores : [0, 0, 0, 0];
  const userScore = latestScores[0] || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-white/20 rounded-3xl p-5 sm:p-6 max-w-xl w-full text-left shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <History size={20} className="text-amber-400" />
            <h2 className="text-lg font-bold text-neutral-100">{t.history}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Stats Summary Bento */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 text-center">
          <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
            <div className="text-[11px] text-neutral-400 font-medium">
              {language === 'hi' ? 'कुल राउंड' : 'Total Rounds'}
            </div>
            <div className="text-lg font-bold font-mono text-neutral-100 mt-0.5">{totalRounds}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
            <div className="text-[11px] text-neutral-400 font-medium">
              {language === 'hi' ? 'आपकी जीत' : 'Your Wins'}
            </div>
            <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5">{userWins}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
            <div className="text-[11px] text-neutral-400 font-medium">
              {language === 'hi' ? 'जीत प्रतिशत' : 'Win Rate'}
            </div>
            <div className="text-lg font-bold font-mono text-amber-300 mt-0.5">{winRate}%</div>
          </div>
          <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
            <div className="text-[11px] text-neutral-400 font-medium">
              {language === 'hi' ? 'आपका स्कोर' : 'Your Score'}
            </div>
            <div className="text-lg font-bold font-mono text-cyan-400 mt-0.5">{userScore} pts</div>
          </div>
        </div>

        {/* Round List */}
        {history.length === 0 ? (
          <div className="py-8 text-center text-neutral-500 text-xs sm:text-sm">
            {language === 'hi'
              ? 'अभी तक कोई राउंड दर्ज नहीं हुआ है। खेलना शुरू करें!'
              : 'No rounds recorded yet. Play a round to see history!'}
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
              <span className="font-semibold uppercase tracking-wider">
                {language === 'hi' ? 'राउंड विवरण (विजेता = ० पॉइंट)' : 'Round Log (Winner = 0 pts)'}
              </span>
              <span className="text-[11px] text-amber-400">
                {language === 'hi' ? 'बचे पत्ते = पेनल्टी पॉइंट' : 'Cards Left = Added Points'}
              </span>
            </div>
            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
              {history.map((record) => {
                const winner = players[record.winnerIndex];
                const isUserWinner = record.winnerIndex === 0;

                return (
                  <div
                    key={record.roundNumber}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-neutral-400">#{record.roundNumber}</span>
                      <div className="flex items-center gap-1.5 font-bold">
                        <Trophy size={13} className={isUserWinner ? 'text-amber-400' : 'text-neutral-400'} />
                        <span className={isUserWinner ? 'text-amber-300' : 'text-neutral-200'}>
                          {winner?.name}
                        </span>
                        <span className="text-[10px] font-mono font-normal text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-1.5 py-0.2 rounded">
                          0 pts
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-neutral-400 font-mono">
                        {language === 'hi' ? 'स्कोर: ' : 'Scores: '}
                        {record.playerScores.map((sc, i) => `${players[i].name.split(' ')[0]}:${sc}`).join(' | ')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors cursor-pointer"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
