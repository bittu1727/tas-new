import React, { useState } from 'react';
import { X, Heart, Users, Copy, Check, Share2, ArrowRight } from 'lucide-react';
import { sounds } from '../utils/audio';

interface FriendsRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateRoom: (playerName: string) => void;
  onJoinRoom: (roomCode: string, playerName: string) => void;
  playerName: string;
  language: 'hi' | 'en';
}

export const FriendsRoomModal: React.FC<FriendsRoomModalProps> = ({
  isOpen,
  onClose,
  onCreateRoom,
  onJoinRoom,
  playerName,
  language,
}) => {
  const [tab, setTab] = useState<'create' | 'join'>('create');
  const [joinCode, setJoinCode] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCreate = () => {
    sounds.playClick();
    onCreateRoom(playerName || 'Player');
    onClose();
  };

  const handleJoin = () => {
    if (!joinCode.trim()) return;
    sounds.playClick();
    onJoinRoom(joinCode.trim().toUpperCase(), playerName || 'Player');
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-pink-400 text-white flex items-center justify-center font-black text-xl shadow">
            ❤️
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black tracking-wider uppercase">
              {language === 'hi' ? 'दोस्तों के साथ खेलें' : 'PLAY WITH FRIENDS'}
            </h2>
            <p className="text-[10px] text-amber-300">
              {language === 'hi' ? 'प्राइवेट रूम बनाएं या कोड से जुड़ें' : 'Create private room or join with code'}
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl mb-4 border border-white/10">
          <button
            onClick={() => setTab('create')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
              tab === 'create'
                ? 'bg-amber-400 text-neutral-950 shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {language === 'hi' ? 'रूम बनाएं' : 'CREATE ROOM'}
          </button>
          <button
            onClick={() => setTab('join')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
              tab === 'join'
                ? 'bg-amber-400 text-neutral-950 shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {language === 'hi' ? 'कोड से जुड़ें' : 'JOIN ROOM'}
          </button>
        </div>

        {/* Content */}
        {tab === 'create' ? (
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="p-3 bg-black/40 rounded-2xl border border-white/10 w-full">
              <span className="text-3xl mb-1 block">🏰</span>
              <h3 className="font-bold text-sm text-white">
                {language === 'hi' ? 'नया प्राइवेट रूम' : 'Private Custom Room'}
              </h3>
              <p className="text-[11px] text-amber-200/80 mt-1">
                {language === 'hi'
                  ? 'रूम बनाकर 4-अक्षरों का कोड दोस्तों को शेयर करें।'
                  : 'Host a private table and share your 4-letter room code.'}
              </p>
            </div>

            <button
              onClick={handleCreate}
              className="w-full py-2.5 rounded-2xl bg-gradient-to-b from-amber-400 via-yellow-400 to-amber-500 text-neutral-950 font-black text-sm uppercase tracking-wider border-2 border-white shadow-[0_5px_0_#92400e,0_8px_16px_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-[0_1px_0_#92400e] transition-all cursor-pointer"
            >
              {language === 'hi' ? 'कमरा बनाएं' : 'CREATE & HOST'}
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-3">
            <div className="w-full">
              <label className="block text-[11px] font-bold text-amber-200 mb-1">
                {language === 'hi' ? 'रूम कोड दर्ज करें:' : 'Enter 4-Character Room Code:'}
              </label>
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                maxLength={6}
                placeholder="e.g. 7824"
                className="w-full bg-slate-900 border-2 border-amber-400/60 rounded-xl px-3 py-2 text-center text-lg font-mono font-black text-amber-300 uppercase tracking-widest focus:outline-none focus:border-amber-300"
              />
            </div>

            <button
              onClick={handleJoin}
              disabled={!joinCode.trim()}
              className="w-full py-2.5 rounded-2xl bg-gradient-to-b from-amber-400 via-yellow-400 to-amber-500 text-neutral-950 font-black text-sm uppercase tracking-wider border-2 border-white shadow-[0_5px_0_#92400e,0_8px_16px_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-[0_1px_0_#92400e] transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              <span>{language === 'hi' ? 'रूम में शामिल हों' : 'JOIN ROOM'}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
