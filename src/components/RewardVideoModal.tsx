import React, { useState, useEffect } from 'react';
import { X, Tv, Sparkles, Award } from 'lucide-react';
import { sounds } from '../utils/audio';

interface RewardVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReward: (coins: number) => void;
  language: 'hi' | 'en';
}

export const RewardVideoModal: React.FC<RewardVideoModalProps> = ({
  isOpen,
  onClose,
  onReward,
  language,
}) => {
  const [timeLeft, setTimeLeft] = useState(5);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(5);
      setIsFinished(false);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsFinished(true);
          sounds.playWin();
          sounds.playCoinCollect();
          onReward(1000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, onReward]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/90 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#111827] via-[#0f172a] to-[#020617] border-4 border-amber-400 p-4 text-white shadow-[0_0_50px_rgba(245,158,11,0.6)] flex flex-col items-center">
        {/* Close Button (only active after countdown) */}
        {isFinished && (
          <button
            onClick={onClose}
            className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-rose-600 hover:bg-rose-500 border-2 border-white text-white flex items-center justify-center shadow-lg transition-transform active:scale-90 cursor-pointer animate-bounce"
          >
            <X size={18} />
          </button>
        )}

        {/* Video Simulation Box */}
        <div className="w-full h-48 rounded-2xl bg-gradient-to-br from-indigo-900 via-purple-900 to-amber-900 border-2 border-amber-400/60 p-4 flex flex-col items-center justify-between text-center relative overflow-hidden shadow-inner">
          {/* Top Banner */}
          <div className="w-full flex items-center justify-between text-[11px] font-bold">
            <span className="bg-red-600 px-2 py-0.5 rounded text-white flex items-center gap-1">
              <Tv size={12} /> AD
            </span>
            <span className="bg-black/60 px-2 py-0.5 rounded text-amber-300 font-mono">
              {isFinished ? (language === 'hi' ? 'रिवॉर्ड तैयार!' : 'Reward Ready!') : `${timeLeft}s`}
            </span>
          </div>

          {/* Center Mascot & Message */}
          <div className="my-auto flex flex-col items-center">
            <span className="text-4xl animate-bounce">👑</span>
            <h3 className="font-black text-base text-amber-300 mt-1 uppercase">
              BADAM KING PRO LEAGUE
            </h3>
            <p className="text-[10px] text-neutral-300">
              {language === 'hi' ? 'भारत का नंबर 1 बादाम छक्का गेम' : "India's #1 7-on-7 Card Game"}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-black/60 h-2 rounded-full overflow-hidden border border-white/20">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 transition-all duration-1000 ease-linear"
              style={{ width: `${((5 - timeLeft) / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Reward Status */}
        <div className="mt-4 text-center">
          {isFinished ? (
            <div className="flex flex-col items-center gap-1">
              <p className="text-emerald-400 font-black text-sm uppercase">
                {language === 'hi' ? 'बधाई! 1,000 कॉइन्स प्राप्त हुए!' : 'CONGRATULATIONS! +1,000 COINS!'}
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-6 py-1.5 rounded-xl bg-gradient-to-b from-amber-400 to-yellow-500 text-neutral-950 font-black text-xs border border-white shadow-md active:scale-95 cursor-pointer"
              >
                {language === 'hi' ? 'संग्रह करें' : 'COLLECT & CLOSE'}
              </button>
            </div>
          ) : (
            <p className="text-xs text-neutral-400">
              {language === 'hi'
                ? 'मुफ़्त कॉइन्स पाने के लिए विज्ञापन पूरा देखें...'
                : 'Watch to the end to claim your free reward...'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
