import React, { useState } from 'react';
import { X, Award, Check, User, Sparkles } from 'lucide-react';
import { sounds } from '../utils/audio';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerName: string;
  avatar: string;
  onSaveProfile: (name: string, avatar: string) => void;
  coins: number;
  gems: number;
  language: 'hi' | 'en';
}

const AVAILABLE_AVATARS = [
  '👑', '🦁', '🐯', '🦅', '👸', '👳‍♂️', '🦊', '🐼', '🐺', '🐱', '🤖', '🦚'
];

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  playerName,
  avatar,
  onSaveProfile,
  coins,
  gems,
  language,
}) => {
  const [name, setName] = useState(playerName);
  const [selectedAvatar, setSelectedAvatar] = useState(avatar);

  if (!isOpen) return null;

  const handleSave = () => {
    sounds.playClick();
    onSaveProfile(name.trim() || 'Player 1', selectedAvatar);
    onClose();
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
            👑
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black tracking-wider uppercase">
              {language === 'hi' ? 'खिलाड़ी प्रोफ़ाइल' : 'PLAYER PROFILE'}
            </h2>
            <p className="text-[10px] text-amber-300">
              {language === 'hi' ? 'नाम और अवतार बदलें' : 'Customize your name & avatar'}
            </p>
          </div>
        </div>

        {/* Current Avatar & Name Input */}
        <div className="flex flex-col items-center mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 p-1 shadow-lg border-2 border-amber-300 mb-2">
            <div className="w-full h-full rounded-xl bg-slate-900 flex items-center justify-center text-3xl">
              {selectedAvatar}
            </div>
          </div>

          <div className="w-full">
            <label className="block text-[11px] font-bold text-amber-200 mb-1 text-center">
              {language === 'hi' ? 'आपका नाम:' : 'Player Name:'}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={16}
              className="w-full bg-slate-900/90 border border-amber-400/50 rounded-xl px-3 py-1.5 text-center text-sm font-bold text-white focus:outline-none focus:border-amber-300"
            />
          </div>
        </div>

        {/* Avatar Picker Grid */}
        <div className="mb-4">
          <label className="block text-[11px] font-bold text-amber-200 mb-1.5 uppercase">
            {language === 'hi' ? 'अवतार चुनें:' : 'Select Avatar:'}
          </label>
          <div className="grid grid-cols-6 gap-1.5">
            {AVAILABLE_AVATARS.map((av) => (
              <button
                key={av}
                onClick={() => {
                  sounds.playClick();
                  setSelectedAvatar(av);
                }}
                className={`w-9 h-9 rounded-xl border flex items-center justify-center text-lg transition-transform active:scale-90 cursor-pointer ${
                  selectedAvatar === av
                    ? 'bg-amber-400 border-white shadow-md scale-110'
                    : 'bg-black/50 border-white/20 hover:border-amber-300'
                }`}
              >
                {av}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-2 mb-4 bg-black/40 p-2.5 rounded-xl border border-white/10">
          <div className="text-center">
            <span className="block text-[10px] text-neutral-400 uppercase">Rank & Level</span>
            <span className="font-black text-amber-300 text-xs">⭐ Level 1 (Pro)</span>
          </div>
          <div className="text-center">
            <span className="block text-[10px] text-neutral-400 uppercase">Coins & Gems</span>
            <span className="font-black text-amber-300 text-xs">🪙 {coins.toLocaleString()} | 💎 {gems}</span>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full py-2.5 rounded-2xl bg-gradient-to-b from-amber-400 via-yellow-400 to-amber-500 text-neutral-950 font-black text-sm uppercase tracking-wider border-2 border-white shadow-[0_5px_0_#92400e,0_8px_16px_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-[0_1px_0_#92400e] transition-all cursor-pointer"
        >
          {language === 'hi' ? 'सुरक्षित करें' : 'SAVE PROFILE'}
        </button>
      </div>
    </div>
  );
};
