import React, { useState } from 'react';
import { sounds } from '../utils/audio';
import { X, Sparkles, Trophy } from 'lucide-react';

interface SpinWheelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReward: (coins: number, gems: number) => void;
  language: 'hi' | 'en';
}

interface Prize {
  label: string;
  coins: number;
  gems: number;
  color: string;
}

const PRIZES: Prize[] = [
  { label: '250 🪙', coins: 250, gems: 0, color: '#f59e0b' },
  { label: '500 🪙', coins: 500, gems: 0, color: '#10b981' },
  { label: '10 💎', coins: 0, gems: 10, color: '#06b6d4' },
  { label: '1,000 🪙', coins: 1000, gems: 0, color: '#8b5cf6' },
  { label: '350 🪙', coins: 350, gems: 0, color: '#ec4899' },
  { label: '25 💎', coins: 0, gems: 25, color: '#3b82f6' },
  { label: 'JACKPOT 2,500', coins: 2500, gems: 50, color: '#ef4444' },
  { label: '150 🪙', coins: 150, gems: 0, color: '#14b8a6' },
];

export const SpinWheelModal: React.FC<SpinWheelModalProps> = ({
  isOpen,
  onClose,
  onReward,
  language,
}) => {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);

  if (!isOpen) return null;

  const handleSpin = () => {
    if (spinning) return;
    setSpinning(true);
    setWonPrize(null);
    sounds.playClick();

    // Pick random prize
    const prizeIndex = Math.floor(Math.random() * PRIZES.length);
    const segmentAngle = 360 / PRIZES.length;
    // Calculate final rotation (multiple full spins + target angle)
    const extraSpins = 5 + Math.floor(Math.random() * 3); // 5-7 rotations
    const targetAngle = 360 * extraSpins + (PRIZES.length - 1 - prizeIndex) * segmentAngle + segmentAngle / 2;
    
    // Play tick intervals
    let tickCount = 0;
    const tickInterval = setInterval(() => {
      tickCount++;
      sounds.playSpinTick();
      if (tickCount > 25) clearInterval(tickInterval);
    }, 110);

    setRotation((prev) => prev + targetAngle);

    setTimeout(() => {
      clearInterval(tickInterval);
      const prize = PRIZES[prizeIndex];
      setWonPrize(prize);
      setSpinning(false);
      sounds.playWin();
      sounds.playCoinCollect();
      onReward(prize.coins, prize.gems);
    }, 3800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#0e3b94] via-[#082a70] to-[#04163d] border-4 border-amber-400 p-5 text-white shadow-[0_0_50px_rgba(245,158,11,0.5)] flex flex-col items-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={spinning}
          className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-rose-600 hover:bg-rose-500 border-2 border-white text-white flex items-center justify-center shadow-lg transition-transform active:scale-90 cursor-pointer disabled:opacity-50"
        >
          <X size={18} />
        </button>

        {/* Title Banner */}
        <div className="bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500 text-neutral-950 font-black px-6 py-1.5 rounded-full text-sm sm:text-base tracking-wider uppercase shadow-[0_4px_12px_rgba(0,0,0,0.4)] border-2 border-amber-200 mb-4 flex items-center gap-1.5">
          <Sparkles size={16} />
          <span>{language === 'hi' ? 'लकी स्पिन व्हील' : 'LUCKY SPIN WHEEL'}</span>
          <Sparkles size={16} />
        </div>

        {/* Pointer Arrow */}
        <div className="relative flex flex-col items-center">
          <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[22px] border-t-amber-300 z-20 drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)] -mb-3" />

          {/* Wheel Disc */}
          <div
            className="w-64 h-64 sm:w-72 sm:h-72 rounded-full border-8 border-amber-400 relative overflow-hidden shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-transform duration-[3800ms] cubic-bezier(0.15, 0.9, 0.2, 1)"
            style={{
              transform: `rotate(${rotation}deg)`,
              background: `conic-gradient(
                #f59e0b 0deg 45deg,
                #10b981 45deg 90deg,
                #06b6d4 90deg 135deg,
                #8b5cf6 135deg 180deg,
                #ec4899 180deg 225deg,
                #3b82f6 225deg 270deg,
                #ef4444 270deg 315deg,
                #14b8a6 315deg 360deg
              )`,
            }}
          >
            {/* Center spokes and labels */}
            {PRIZES.map((p, idx) => {
              const angle = idx * 45 + 22.5;
              return (
                <div
                  key={idx}
                  className="absolute inset-0 flex items-start justify-center pt-3 text-[11px] font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                  style={{
                    transform: `rotate(${angle}deg)`,
                    transformOrigin: '50% 50%',
                  }}
                >
                  <span className="bg-black/40 px-1.5 py-0.5 rounded-full border border-white/20 whitespace-nowrap">
                    {p.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Center Spin Hub */}
          <button
            onClick={handleSpin}
            disabled={spinning}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-300 border-4 border-white text-neutral-950 font-black text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(245,158,11,0.8)] flex flex-col items-center justify-center cursor-pointer transition-transform active:scale-95 disabled:opacity-80"
          >
            <Trophy size={14} />
            <span>{spinning ? '...' : 'SPIN'}</span>
          </button>
        </div>

        {/* Won Prize Celebration */}
        {wonPrize && (
          <div className="mt-4 p-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-2xl border-2 border-emerald-300 text-center animate-bounce shadow-lg w-full">
            <p className="text-xs uppercase font-bold text-emerald-100">
              {language === 'hi' ? 'बधाई हो! आपने जीता:' : 'CONGRATULATIONS! YOU WON:'}
            </p>
            <p className="text-lg font-black text-white">{wonPrize.label}</p>
          </div>
        )}

        <p className="text-[11px] text-amber-200/80 mt-3 font-medium text-center">
          {language === 'hi'
            ? 'रोज़ाना मुफ़्त स्पिन करें और कॉइन्स जीतें!'
            : 'Spin daily to win free coins & gems!'}
        </p>
      </div>
    </div>
  );
};
