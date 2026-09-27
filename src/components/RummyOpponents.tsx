import React from 'react';
import { RummyPlayer, Language } from '../types/rummy';
import { RummyCardView } from './RummyCardView';
import { Bot, User, ShieldAlert } from 'lucide-react';

interface RummyOpponentsProps {
  opponents: RummyPlayer[];
  currentTurn: number;
  language: Language;
}

export const RummyOpponents: React.FC<RummyOpponentsProps> = ({
  opponents,
  currentTurn,
  language,
}) => {
  return (
    <div className="flex items-center justify-around w-full max-w-4xl mx-auto gap-2 px-2">
      {opponents.map((player) => {
        const isTurn = currentTurn === player.id;
        const isDropped = player.status === 'dropped';

        return (
          <div
            key={player.id}
            className={`flex flex-col items-center p-2 rounded-2xl border transition-all ${
              isTurn
                ? 'bg-amber-950/40 border-amber-400 ring-2 ring-amber-400/50 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                : 'bg-black/30 border-white/10 opacity-90'
            } ${isDropped ? 'opacity-40 grayscale' : ''}`}
          >
            {/* Avatar & Player Tag */}
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-base sm:text-lg">{player.avatar}</span>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-neutral-200 truncate max-w-[80px] sm:max-w-[100px]">
                  {player.name}
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">
                  {player.score} pts
                </span>
              </div>
            </div>

            {/* Overlapping Mini Card Backs representing player's hand */}
            <div className="flex items-center -space-x-4 my-1">
              {isDropped ? (
                <div className="text-[10px] font-bold text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-500/40">
                  DROPPED
                </div>
              ) : (
                <>
                  <RummyCardView isFaceDown size="sm" />
                  <RummyCardView isFaceDown size="sm" />
                  <RummyCardView isFaceDown size="sm" />
                  <div className="w-8 h-12 bg-neutral-900 border border-white/20 rounded flex items-center justify-center font-mono text-xs font-bold text-neutral-300 shadow">
                    {player.hand.length}
                  </div>
                </>
              )}
            </div>

            {/* Turn status note */}
            <div className="min-h-[18px] text-[10px]">
              {isTurn ? (
                <span className="text-amber-300 font-bold animate-pulse flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                  <span>{language === 'hi' ? 'चाल सोच रहा है...' : 'Thinking...'}</span>
                </span>
              ) : player.lastAction ? (
                <span className="text-neutral-400 truncate max-w-[120px]">
                  {player.lastAction.type === 'draw'
                    ? (language === 'hi' ? 'पत्ता उठाया' : 'Drew card')
                    : player.lastAction.type === 'discard'
                    ? (language === 'hi' ? `फेंका: ${player.lastAction.card?.rank}${player.lastAction.card?.suit}` : `Discarded`)
                    : ''}
                </span>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
};
