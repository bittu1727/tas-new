import React from 'react';
import { Card, Language, Player } from '../types/game';
import { CardView } from './CardView';
import { SHORT_RANK, TRANSLATIONS } from '../utils/translations';
import { Bot, User } from 'lucide-react';

interface BotPlayerProps {
  player: Player;
  isCurrentTurn: boolean;
  score: number;
  language: Language;
  position: 'left' | 'top' | 'right';
  compact?: boolean;
}

export const BotPlayer: React.FC<BotPlayerProps> = ({
  player,
  isCurrentTurn,
  score,
  language,
  compact = false,
}) => {
  const t = TRANSLATIONS[language];

  const lastPlayedCard: Card | undefined =
    player.lastAction?.type === 'play' ? player.lastAction.card : undefined;

  const cardRankName = lastPlayedCard ? SHORT_RANK[lastPlayedCard.rank] || lastPlayedCard.rank : '';

  // Compact Mobile Mode (used in the top row on mobile devices)
  if (compact) {
    return (
      <div
        className={`flex flex-col items-center p-2 rounded-xl transition-all border shadow-lg min-w-[95px] max-w-[130px] flex-1 ${
          isCurrentTurn
            ? 'bg-gradient-to-b from-amber-500/25 to-black/60 border-amber-400 ring-2 ring-amber-400/80 shadow-[0_0_20px_rgba(245,158,11,0.5)] scale-105'
            : 'bg-black/60 border-white/10'
        }`}
      >
        <div className="flex items-center gap-1.5 w-full justify-between">
          <div className="flex items-center gap-1 truncate">
            <span className="text-base select-none">{player.avatar || '🤖'}</span>
            <span className="font-bold text-xs text-neutral-200 truncate">
              {player.name.split(' ')[0]}
            </span>
          </div>
          <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-500/40 shrink-0">
            {player.hand.length}🂠
          </span>
        </div>

        {/* Turn Status or Last Action */}
        <div className="min-h-[18px] text-[10px] mt-1 truncate w-full text-center">
          {isCurrentTurn ? (
            <span className="text-amber-300 font-bold animate-pulse flex items-center justify-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              <span>{language === 'hi' ? 'चाल...' : 'Thinking...'}</span>
            </span>
          ) : player.lastAction?.type === 'play' && lastPlayedCard ? (
            <span className="text-emerald-300 font-mono font-bold">
              {cardRankName}{lastPlayedCard.suit}
            </span>
          ) : player.lastAction?.type === 'pass' ? (
            <span className="text-neutral-500 italic">
              {language === 'hi' ? 'पास' : 'Pass'}
            </span>
          ) : (
            <span className="text-neutral-400 text-[10px]">{score} pts</span>
          )}
        </div>
      </div>
    );
  }

  // Desktop Standard Card View
  return (
    <div
      className={`flex flex-col items-center gap-2 p-3 sm:p-3.5 rounded-2xl transition-all duration-200 border shadow-xl ${
        isCurrentTurn
          ? 'bg-gradient-to-b from-amber-500/25 to-black/70 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.4)] ring-2 ring-amber-400/80 scale-[1.03]'
          : 'bg-black/55 border-amber-500/20 hover:border-amber-400/40 backdrop-blur-md'
      }`}
    >
      {/* Bot Header: Avatar & Name */}
      <div className="flex items-center gap-2.5">
        <div
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center relative font-bold text-sm shadow-md transition-all ${
            isCurrentTurn
              ? 'bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-200 text-neutral-950 ring-2 ring-white scale-105 shadow-[0_0_15px_rgba(251,191,36,0.6)]'
              : 'bg-neutral-800 text-neutral-300 border border-white/20'
          }`}
        >
          {player.avatar && player.avatar !== '👤' && player.avatar !== '🤖' ? (
            <span className="text-lg select-none leading-none">{player.avatar}</span>
          ) : player.isBot ? (
            <Bot size={18} />
          ) : (
            <User size={18} />
          )}
          {isCurrentTurn && (
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-neutral-900 animate-ping" />
          )}
        </div>

        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-sm text-neutral-100 truncate max-w-[100px] sm:max-w-[130px]">
              {player.name}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-neutral-400">
            <span className="text-amber-300 font-mono font-bold bg-amber-950/70 border border-amber-500/40 px-1.5 rounded">
              {score} pts
            </span>
            <span>·</span>
            <span>{player.hand.length} {t.cardsLeft}</span>
          </div>
        </div>
      </div>

      {/* Visual Card Fan / Face-down stack representation */}
      <div className="flex items-center justify-center -space-x-4 py-1 overflow-visible">
        {player.hand.slice(0, Math.min(6, player.hand.length)).map((_, idx) => (
          <CardView key={idx} isFaceDown size="sm" className="shadow-md" />
        ))}
        {player.hand.length > 6 && (
          <span className="text-xs font-mono text-amber-200 pl-5 font-bold drop-shadow">
            +{player.hand.length - 6}
          </span>
        )}
      </div>

      {/* Turn Activity / Last Action Note */}
      <div className="min-h-[22px] flex items-center justify-center text-center">
        {isCurrentTurn ? (
          <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 animate-pulse bg-amber-950/70 px-2.5 py-0.5 rounded-full border border-amber-500/50 shadow">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            {language === 'hi' ? 'चाल सोच रहा है...' : 'Thinking...'}
          </span>
        ) : player.lastAction ? (
          <span className="text-xs text-neutral-300 truncate max-w-[150px]">
            {player.lastAction.type === 'play' && lastPlayedCard ? (
              <span className="text-emerald-300 font-mono font-bold bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded shadow">
                {language === 'hi' ? 'चला: ' : 'Played: '}
                <strong>{cardRankName}{lastPlayedCard.suit}</strong>
              </span>
            ) : (
              <span className="text-neutral-400 italic bg-white/5 px-2 py-0.5 rounded">
                {language === 'hi' ? 'पास किया' : 'Passed'}
              </span>
            )}
          </span>
        ) : null}
      </div>
    </div>
  );
};
