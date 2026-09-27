import React from 'react';
import { Card } from '../types/game';
import { SHORT_RANK } from '../utils/translations';
import { Lock } from 'lucide-react';

interface CardViewProps {
  card?: Card;
  isFaceDown?: boolean;
  isPlayable?: boolean;
  isCenterSix?: boolean;
  isBlockedFive?: boolean;
  isTerminalWing?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
}

export const CardView: React.FC<CardViewProps> = ({
  card,
  isFaceDown = false,
  isPlayable = false,
  isCenterSix = false,
  isBlockedFive = false,
  isTerminalWing = false,
  size = 'md',
  onClick,
  className = '',
}) => {
  // Face-down card back: Royal Navy & Gold geometric pattern
  if (isFaceDown || !card) {
    const sizeClasses =
      size === 'sm'
        ? 'w-7 h-10 sm:w-8 sm:h-12 rounded-md'
        : size === 'lg'
        ? 'w-16 h-24 sm:w-20 sm:h-28 rounded-xl'
        : 'w-11 h-16 sm:w-13 sm:h-20 rounded-lg';

    return (
      <div
        className={`${sizeClasses} bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 border border-amber-400/40 shadow-md flex items-center justify-center relative overflow-hidden select-none shrink-0 ${className}`}
      >
        <div className="absolute inset-0.5 border border-amber-300/30 rounded flex items-center justify-center">
          <div className="w-full h-full opacity-25 bg-[radial-gradient(#f59e0b_1.5px,transparent_1.5px)] [background-size:5px_5px]" />
          <div className="absolute w-4 h-4 rounded-full border border-amber-400/40 flex items-center justify-center text-[10px] text-amber-300/80 font-serif">
            ♠
          </div>
        </div>
      </div>
    );
  }

  const isRed = card.suit === '♥' || card.suit === '♦';
  const textColor = isRed ? 'text-rose-600' : 'text-slate-900';
  const rankLabel = SHORT_RANK[card.rank] || card.rank;

  const sizeClasses =
    size === 'sm'
      ? 'w-8 h-12 sm:w-9 sm:h-13 text-xs rounded-md'
      : size === 'lg'
      ? 'w-16 h-24 sm:w-20 sm:h-30 text-base sm:text-lg rounded-xl'
      : 'w-12 h-18 sm:w-14 sm:h-21 text-sm rounded-lg';

  // Playable interactive states: subtle lift and vivid glow
  const playableClasses = isPlayable
    ? '-translate-y-2.5 ring-2 ring-emerald-400 shadow-[0_8px_18px_rgba(16,185,129,0.5)] cursor-pointer hover:-translate-y-3.5 hover:ring-amber-300 active:scale-95 z-20 brightness-105'
    : isBlockedFive
    ? 'opacity-40 grayscale-[60%] cursor-not-allowed'
    : 'hover:-translate-y-0.5 hover:shadow-md';

  const centerSixClasses = isCenterSix
    ? 'ring-2 ring-amber-400 shadow-[0_0_16px_rgba(245,158,11,0.6)] border-amber-300'
    : 'border border-neutral-300/90';

  return (
    <div
      onClick={isPlayable ? onClick : undefined}
      className={`relative select-none shrink-0 bg-gradient-to-b from-white via-neutral-50 to-stone-100 font-bold flex flex-col justify-between p-1 sm:p-1.5 transition-all duration-150 ${sizeClasses} ${textColor} ${centerSixClasses} ${playableClasses} ${className}`}
      style={{
        boxShadow: isCenterSix
          ? '0 0 16px rgba(245, 158, 11, 0.5), 0 4px 10px rgba(0,0,0,0.3)'
          : isPlayable
          ? '0 6px 16px rgba(0,0,0,0.35)'
          : '0 2px 5px rgba(0,0,0,0.2)',
      }}
    >
      {/* Top Left Corner Index */}
      <div className="flex flex-col items-center leading-none self-start">
        <span className="font-mono font-black tracking-tighter text-xs sm:text-sm leading-none">
          {rankLabel}
        </span>
        <span className="leading-none text-[10px] sm:text-xs mt-0.5">{card.suit}</span>
      </div>

      {/* Center Watermark Glyphs */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span
          className={`opacity-80 select-none leading-none ${
            size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-base' : 'text-xl'
          }`}
        >
          {card.suit}
        </span>
      </div>

      {/* Bottom Right Inverted Index */}
      <div className="flex flex-col items-center leading-none self-end rotate-180">
        <span className="font-mono font-black tracking-tighter text-xs sm:text-sm leading-none">
          {rankLabel}
        </span>
        <span className="leading-none text-[10px] sm:text-xs mt-0.5">{card.suit}</span>
      </div>

      {/* Playable Indicator: Embedded at top right inside card boundaries */}
      {isPlayable && (
        <div className="absolute top-0.5 right-0.5 bg-emerald-500 text-neutral-950 text-[7px] font-black uppercase px-1 rounded-sm leading-tight shadow-sm border border-emerald-300">
          PLAY
        </div>
      )}

      {/* 5♥ Blocked Warning Lock */}
      {isBlockedFive && (
        <div className="absolute inset-0 bg-neutral-950/65 rounded-lg flex flex-col items-center justify-center text-amber-300 p-0.5">
          <Lock size={12} />
          <span className="text-[7px] font-bold mt-0.5 leading-none">5♥ First</span>
        </div>
      )}

      {/* Terminal Wing Badge (Ace / King) */}
      {isTerminalWing && (
        <div className="absolute bottom-0.5 left-0.5 bg-amber-400 text-neutral-950 text-[7px] font-black px-1 rounded-sm leading-none shadow">
          END
        </div>
      )}
    </div>
  );
};
