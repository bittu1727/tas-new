import React from 'react';
import { RummyCard } from '../types/rummy';
import { SHORT_RANK } from '../utils/rummyTranslations';
import { Sparkles } from 'lucide-react';

interface RummyCardViewProps {
  card?: RummyCard;
  isFaceDown?: boolean;
  isSelected?: boolean;
  isJoker?: boolean;
  isCutJokerFace?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
}

export const RummyCardView: React.FC<RummyCardViewProps> = ({
  card,
  isFaceDown = false,
  isSelected = false,
  isJoker = false,
  isCutJokerFace = false,
  size = 'md',
  onClick,
  className = '',
}) => {
  if (isFaceDown || !card) {
    const sizeClasses =
      size === 'sm'
        ? 'w-9 h-14 rounded-md'
        : size === 'lg'
        ? 'w-16 h-24 sm:w-20 sm:h-28 rounded-xl'
        : 'w-12 h-18 sm:w-14 sm:h-20 rounded-lg';

    return (
      <div
        onClick={onClick}
        className={`${sizeClasses} bg-gradient-to-br from-indigo-950 via-slate-900 to-neutral-950 border border-amber-400/40 shadow-md flex items-center justify-center relative overflow-hidden select-none shrink-0 ${
          onClick ? 'cursor-pointer hover:border-amber-300 hover:shadow-lg' : ''
        } ${className}`}
      >
        <div className="absolute inset-1 border border-amber-300/30 rounded flex items-center justify-center">
          <div className="w-full h-full opacity-20 bg-[radial-gradient(#f59e0b_1.5px,transparent_1.5px)] [background-size:6px_6px]" />
        </div>
        <span className="text-amber-400/70 text-xs sm:text-sm font-serif">♠</span>
      </div>
    );
  }

  const isRed = card.suit === '♥' || card.suit === '♦';
  const textColor = card.isPrintedJoker ? 'text-amber-500' : isRed ? 'text-rose-600' : 'text-neutral-900';
  const rankLabel = card.isPrintedJoker ? 'PJ' : SHORT_RANK[card.rank] || card.rank;

  const sizeClasses =
    size === 'sm'
      ? 'w-8 h-12 sm:w-9 sm:h-13 text-[10px] rounded-md'
      : size === 'lg'
      ? 'w-14 h-20 sm:w-16 sm:h-24 md:w-18 md:h-26 text-sm sm:text-base rounded-xl'
      : 'w-11 h-16 sm:w-13 sm:h-20 text-xs sm:text-sm rounded-lg';

  const selectedClasses = isSelected
    ? '-translate-y-3.5 ring-2 ring-amber-400 shadow-[0_12px_24px_rgba(245,158,11,0.4)] z-20 brightness-105'
    : 'hover:-translate-y-1 hover:shadow-md';

  return (
    <div
      onClick={onClick}
      className={`relative select-none shrink-0 bg-gradient-to-b from-white via-neutral-50 to-neutral-100 font-bold flex flex-col justify-between p-1 sm:p-1.5 transition-all duration-150 border border-neutral-300 shadow-sm ${sizeClasses} ${textColor} ${selectedClasses} ${
        onClick ? 'cursor-pointer active:scale-95' : ''
      } ${className}`}
    >
      {/* Top Left Corner */}
      <div className="flex flex-col items-center leading-none self-start">
        <span className="font-mono font-black tracking-tight leading-none text-xs sm:text-sm">
          {rankLabel}
        </span>
        {!card.isPrintedJoker && (
          <span className="leading-none text-[10px] sm:text-xs mt-0.5">{card.suit}</span>
        )}
      </div>

      {/* Center Suit Glyph or Joker Icon */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {card.isPrintedJoker ? (
          <span className="text-xl sm:text-2xl text-amber-500">🃏</span>
        ) : (
          <span
            className={`opacity-85 leading-none select-none ${
              size === 'lg' ? 'text-2xl sm:text-3xl' : 'text-base sm:text-lg'
            }`}
          >
            {card.suit}
          </span>
        )}
      </div>

      {/* Bottom Right Corner */}
      <div className="flex flex-col items-center leading-none self-end rotate-180">
        <span className="font-mono font-black tracking-tight leading-none text-xs sm:text-sm">
          {rankLabel}
        </span>
        {!card.isPrintedJoker && (
          <span className="leading-none text-[10px] sm:text-xs mt-0.5">{card.suit}</span>
        )}
      </div>

      {/* Joker Emblem Tag */}
      {(isJoker || card.isPrintedJoker) && (
        <div className="absolute -top-1.5 -right-1 bg-amber-500 text-neutral-950 text-[8px] font-black uppercase px-1 rounded-sm shadow-md border border-amber-300 leading-none py-0.5 flex items-center gap-0.5">
          <span>★</span>
          <span>JOKER</span>
        </div>
      )}

      {/* Cut Joker Face Label */}
      {isCutJokerFace && (
        <div className="absolute bottom-0 inset-x-0 bg-neutral-950/80 text-amber-300 text-[8px] font-bold text-center py-0.5 tracking-wider">
          CUT JOKER
        </div>
      )}
    </div>
  );
};
