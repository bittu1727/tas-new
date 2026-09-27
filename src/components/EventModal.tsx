import React, { useState } from 'react';
import { X, Trophy, Calendar, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { sounds } from '../utils/audio';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTournament: () => void;
  language: 'hi' | 'en';
}

const MISSIONS = [
  { id: 1, title: 'Play 3 Rounds of Badam', reward: '500 🪙', progress: '1 / 3', done: false },
  { id: 2, title: 'Lead with 6 of Hearts (6♥)', reward: '25 💎', progress: '1 / 1', done: true },
  { id: 3, title: 'Win a Match with 0 Penalty', reward: '1,000 🪙', progress: '0 / 1', done: false },
  { id: 4, title: 'Play in Online Multiplayer', reward: '50 💎', progress: '0 / 1', done: false },
];

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onStartTournament,
  language,
}) => {
  const [activeTab, setActiveTab] = useState<'tournaments' | 'missions'>('tournaments');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-[#0a3891] via-[#062469] to-[#04163d] border-4 border-amber-400 p-4 text-white shadow-[0_0_50px_rgba(245,158,11,0.5)] flex flex-col max-h-[85vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-rose-600 hover:bg-rose-500 border-2 border-white text-white flex items-center justify-center shadow-lg transition-transform active:scale-90 cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 pb-3 border-b border-white/10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-amber-400 to-yellow-600 text-neutral-950 flex items-center justify-center shadow font-black text-lg">
            🏆
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black tracking-wider uppercase">
              {language === 'hi' ? 'इवेंट्स व टूर्नामेंट्स' : 'EVENTS & TOURNAMENTS'}
            </h2>
            <p className="text-[10px] text-amber-300">
              {language === 'hi' ? 'दैनिक मिशन और महामुकाबला' : 'Daily Quests & Grand Championships'}
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl my-3 border border-white/10">
          <button
            onClick={() => setActiveTab('tournaments')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
              activeTab === 'tournaments'
                ? 'bg-amber-400 text-neutral-950 shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            🏆 {language === 'hi' ? 'टूर्नामेंट' : 'Tournaments'}
          </button>
          <button
            onClick={() => setActiveTab('missions')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
              activeTab === 'missions'
                ? 'bg-amber-400 text-neutral-950 shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            🎯 {language === 'hi' ? 'दैनिक मिशन' : 'Daily Quests'}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {activeTab === 'tournaments' ? (
            <>
              {/* Grand Tournament 1 */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 border-2 border-yellow-200 text-neutral-950 shadow-lg flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="bg-neutral-950 text-amber-300 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                    FEATURED • 4 ROUNDS
                  </span>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-neutral-950">
                    <Clock size={12} />
                    <span>Live Now</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-black text-sm sm:text-base">Maharaja Grand Cup</h3>
                    <p className="text-[11px] font-bold text-amber-950">Prize Pool: 50,000 🪙 + Gold Crown</p>
                  </div>
                  <button
                    onClick={() => {
                      sounds.playClick();
                      onClose();
                      onStartTournament();
                    }}
                    className="px-4 py-2 rounded-xl bg-neutral-950 hover:bg-neutral-900 text-amber-300 font-black text-xs border border-amber-400 shadow-md active:scale-95 cursor-pointer"
                  >
                    PLAY NOW
                  </button>
                </div>
              </div>

              {/* Tournament 2 */}
              <div className="p-3 rounded-2xl bg-[#082260] border border-white/10 flex items-center justify-between shadow">
                <div>
                  <span className="text-[9px] font-bold text-cyan-300 uppercase">WEEKEND SPECIAL</span>
                  <h3 className="font-bold text-xs sm:text-sm text-white">Sunday Blitz Masters</h3>
                  <p className="text-[10px] text-amber-300 font-bold">Prize Pool: 20,000 🪙</p>
                </div>
                <button
                  onClick={() => {
                    sounds.playClick();
                    onClose();
                    onStartTournament();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-b from-yellow-300 to-amber-500 text-neutral-950 font-black text-xs border border-white active:scale-95 cursor-pointer"
                >
                  ENTER
                </button>
              </div>
            </>
          ) : (
            <>
              {MISSIONS.map((m) => (
                <div
                  key={m.id}
                  className={`p-3 rounded-2xl border flex items-center justify-between shadow ${
                    m.done
                      ? 'bg-emerald-950/60 border-emerald-500/50'
                      : 'bg-[#082260] border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {m.done ? (
                      <CheckCircle2 size={18} className="text-emerald-400" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-amber-400" />
                    )}
                    <div>
                      <h4 className="font-bold text-xs text-white">{m.title}</h4>
                      <p className="text-[10px] text-amber-300 font-mono">Reward: {m.reward}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-neutral-300 font-bold">{m.progress}</span>
                    {m.done && (
                      <span className="text-[9px] font-black bg-emerald-500 text-neutral-950 px-1.5 py-0.5 rounded">
                        CLAIMED
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
