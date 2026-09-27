import React, { useState } from 'react';
import { X, Mic, MicOff, Users, Radio, Sparkles, Volume2 } from 'lucide-react';
import { sounds } from '../utils/audio';

interface AddaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoinRoom: () => void;
  language: 'hi' | 'en';
}

const CLUBS = [
  { id: '1', name: 'Delhi Badam Legends', members: 412, active: '18 Playing', city: 'Delhi', flag: '🇮🇳' },
  { id: '2', name: 'Mumbai Card Masters', members: 630, active: '32 Playing', city: 'Mumbai', flag: '🇮🇳' },
  { id: '3', name: 'Bengal Heart Chhakka Club', members: 520, active: '24 Playing', city: 'Kolkata', flag: '🇮🇳' },
  { id: '4', name: 'Punjab Royal 7s', members: 290, active: '14 Playing', city: 'Chandigarh', flag: '🇮🇳' },
  { id: '5', name: 'Global High Rollers 50k', members: 1200, active: '68 Playing', city: 'Worldwide', flag: '🌍' },
];

export const AddaModal: React.FC<AddaModalProps> = ({
  isOpen,
  onClose,
  onJoinRoom,
  language,
}) => {
  const [micOn, setMicOn] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-[#0b3c9b] via-[#07266b] to-[#04163d] border-4 border-yellow-400 p-4 text-white shadow-[0_0_50px_rgba(245,158,11,0.5)] flex flex-col max-h-[85vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-rose-600 hover:bg-rose-500 border-2 border-white text-white flex items-center justify-center shadow-lg transition-transform active:scale-90 cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Title */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-yellow-400 to-amber-600 text-neutral-950 flex items-center justify-center shadow font-black text-lg">
              🎙️
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base sm:text-lg font-black tracking-wider uppercase">
                  {language === 'hi' ? 'बादाम अड्डा व क्लब' : 'BADAM KING ADDA'}
                </h2>
                <span className="bg-red-600 text-white text-[8px] font-black px-1.5 py-0.2 rounded-full border border-white">
                  LIVE
                </span>
              </div>
              <p className="text-[10px] text-amber-300">
                {language === 'hi' ? 'लाइव आवाज़, कार्ड क्लब और चैट' : 'Voice Lounges, Live Clubs & Chats'}
              </p>
            </div>
          </div>

          {/* Mic Toggle */}
          <button
            onClick={() => {
              sounds.playClick();
              setMicOn((m) => !m);
            }}
            className={`p-2 rounded-xl border flex items-center gap-1 text-xs font-bold transition-all cursor-pointer ${
              micOn
                ? 'bg-emerald-600 border-emerald-300 text-white animate-pulse'
                : 'bg-black/60 border-white/20 text-neutral-400'
            }`}
          >
            {micOn ? <Mic size={15} /> : <MicOff size={15} />}
            <span>{micOn ? 'MIC ON' : 'MUTE'}</span>
          </button>
        </div>

        {/* Live Clubs List */}
        <div className="flex-1 overflow-y-auto space-y-2 py-3 pr-1">
          {CLUBS.map((club) => (
            <div
              key={club.id}
              className="p-3 rounded-2xl bg-[#082260] border border-white/10 hover:border-yellow-400/50 flex items-center justify-between transition-all shadow"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{club.flag}</span>
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-white flex items-center gap-1.5">
                    <span>{club.name}</span>
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] text-amber-300 mt-0.5">
                    <span>👥 {club.members} Members</span>
                    <span className="text-emerald-400 font-bold">🟢 {club.active}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  sounds.playClick();
                  onClose();
                  onJoinRoom();
                }}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-b from-yellow-300 to-amber-500 text-neutral-950 font-black text-xs border border-white shadow-md active:scale-95 cursor-pointer"
              >
                {language === 'hi' ? 'शामिल हों' : 'JOIN'}
              </button>
            </div>
          ))}
        </div>

        {/* Quick Voice Prompt */}
        <div className="bg-black/50 p-2.5 rounded-xl border border-white/10 text-center">
          <p className="text-[11px] text-amber-200">
            {language === 'hi'
              ? 'अड्डा में शामिल होकर दोस्तों से बात करें और नए साथी बनाएं!'
              : 'Chat live with real players, make friends, and dominate the tables!'}
          </p>
        </div>
      </div>
    </div>
  );
};
