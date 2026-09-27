import React, { useState } from 'react';
import { X, Users, Play, Sparkles } from 'lucide-react';
import { sounds } from '../utils/audio';

interface PassNPlaySetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartMatch: (playerNames: string[], avatars: string[]) => void;
  language: 'hi' | 'en';
}

const AVATAR_OPTIONS = ['👑', '🦁', '🐯', '🦅', '👸', '👳‍♂️', '🦊', '🐼'];

export const PassNPlaySetupModal: React.FC<PassNPlaySetupModalProps> = ({
  isOpen,
  onClose,
  onStartMatch,
  language,
}) => {
  const [playerCount, setPlayerCount] = useState<number>(4);
  const [names, setNames] = useState<string[]>([
    'Player 1',
    'Player 2',
    'Player 3',
    'Player 4',
  ]);
  const [avatars, setAvatars] = useState<string[]>(['👑', '🦁', '🐯', '🦅']);

  if (!isOpen) return null;

  const handleNameChange = (index: number, val: string) => {
    setNames((prev) => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  const handleAvatarCycle = (index: number) => {
    sounds.playClick();
    setAvatars((prev) => {
      const copy = [...prev];
      const currentIdx = AVATAR_OPTIONS.indexOf(copy[index]);
      const nextIdx = (currentIdx + 1) % AVATAR_OPTIONS.length;
      copy[index] = AVATAR_OPTIONS[nextIdx];
      return copy;
    });
  };

  const handleStart = () => {
    sounds.playClick();
    sounds.playShuffle();
    onStartMatch(names.slice(0, playerCount), avatars.slice(0, playerCount));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#0a3891] via-[#062469] to-[#04163d] border-4 border-amber-400 p-4 text-white shadow-[0_0_50px_rgba(245,158,11,0.6)] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-rose-600 hover:bg-rose-500 border-2 border-white text-white flex items-center justify-center shadow-lg transition-transform active:scale-90 cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2 pb-3 border-b border-white/10 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-neutral-950 flex items-center justify-center font-black text-xl shadow">
            👥
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black tracking-wider uppercase">
              {language === 'hi' ? 'पास एंड प्ले (1 फ़ोन)' : 'PASS N PLAY (1 PHONE)'}
            </h2>
            <p className="text-[10px] text-amber-300">
              {language === 'hi' ? 'एक ही फ़ोन पर दोस्तों के साथ खेलें' : 'Pass the phone between friends'}
            </p>
          </div>
        </div>

        {/* Player Count Selector */}
        <div className="mb-3">
          <label className="block text-xs font-bold text-amber-200 uppercase mb-1.5">
            {language === 'hi' ? 'खिलाड़ियों की संख्या:' : 'Number of Players:'}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[2, 4].map((cnt) => (
              <button
                key={cnt}
                onClick={() => {
                  sounds.playClick();
                  setPlayerCount(cnt);
                }}
                className={`py-1.5 rounded-xl border-2 text-xs font-black transition-all cursor-pointer ${
                  playerCount === cnt
                    ? 'bg-amber-400 border-white text-neutral-950 shadow-md scale-102'
                    : 'bg-black/40 border-white/20 text-neutral-300 hover:border-amber-300'
                }`}
              >
                {cnt} {language === 'hi' ? 'खिलाड़ी' : 'Players'}
              </button>
            ))}
          </div>
        </div>

        {/* Players List Config */}
        <div className="space-y-2 mb-4">
          {Array.from({ length: playerCount }).map((_, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 p-2 rounded-xl bg-black/40 border border-white/10"
            >
              <button
                onClick={() => handleAvatarCycle(idx)}
                className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-yellow-400 border border-white flex items-center justify-center text-xl shadow cursor-pointer active:scale-90 transition-transform"
                title="Tap to change avatar"
              >
                {avatars[idx]}
              </button>
              <div className="flex-1">
                <input
                  type="text"
                  value={names[idx]}
                  onChange={(e) => handleNameChange(idx, e.target.value)}
                  maxLength={14}
                  className="w-full bg-slate-900/80 border border-amber-400/40 rounded-lg px-2.5 py-1 text-xs font-bold text-white focus:outline-none focus:border-amber-300"
                  placeholder={`Player ${idx + 1}`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Start Game Action */}
        <button
          onClick={handleStart}
          className="w-full py-2.5 rounded-2xl bg-gradient-to-b from-amber-400 via-yellow-400 to-amber-500 text-neutral-950 font-black text-sm uppercase tracking-wider border-2 border-white shadow-[0_5px_0_#92400e,0_8px_16px_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-[0_1px_0_#92400e] transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Play size={16} fill="currentColor" />
          <span>{language === 'hi' ? 'गेम शुरू करें' : 'START MATCH'}</span>
        </button>
      </div>
    </div>
  );
};
