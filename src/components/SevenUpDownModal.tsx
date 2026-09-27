import React, { useState } from 'react';
import { X, Sparkles, Trophy, Coins, RotateCcw } from 'lucide-react';
import { sounds } from '../utils/audio';
import { Card, Suit } from '../types/game';

interface SevenUpDownModalProps {
  isOpen: boolean;
  onClose: () => void;
  coins: number;
  onUpdateCoins: (delta: number) => void;
  language: 'hi' | 'en';
}

type BetChoice = 'down' | 'seven' | 'up';

export const SevenUpDownModal: React.FC<SevenUpDownModalProps> = ({
  isOpen,
  onClose,
  coins,
  onUpdateCoins,
  language,
}) => {
  const [betAmount, setBetAmount] = useState<number>(100);
  const [betChoice, setBetChoice] = useState<BetChoice | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [drawnCard, setDrawnCard] = useState<Card | null>(null);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [won, setWon] = useState<boolean | null>(null);

  if (!isOpen) return null;

  const handleRoll = () => {
    if (!betChoice || isRolling) return;
    if (coins < betAmount) {
      sounds.playInvalid();
      setResultMessage(language === 'hi' ? 'पर्याप्त कॉइन्स नहीं हैं!' : 'Not enough coins!');
      return;
    }

    setIsRolling(true);
    setResultMessage(null);
    setWon(null);
    sounds.playShuffle();

    // Deduct bet amount immediately
    onUpdateCoins(-betAmount);

    let rolls = 0;
    const rollInterval = setInterval(() => {
      rolls++;
      sounds.playSpinTick();
      const randomRank = Math.floor(Math.random() * 13) + 1; // 1 (Ace) to 13 (King)
      const suits: Suit[] = ['♥', '♦', '♣', '♠'];
      const randomSuit = suits[Math.floor(Math.random() * 4)];
      setDrawnCard({ id: `draw-${rolls}`, suit: randomSuit, rank: randomRank });

      if (rolls > 15) {
        clearInterval(rollInterval);
        
        // Final Card Draw
        const finalRank = Math.floor(Math.random() * 13) + 1; // 1 to 13 (where 7 is center)
        const finalSuit = suits[Math.floor(Math.random() * 4)];
        const card: Card = { id: `final-${finalSuit}-${finalRank}`, suit: finalSuit, rank: finalRank };
        setDrawnCard(card);
        setIsRolling(false);

        let isWin = false;
        let winMultiplier = 0;

        if (betChoice === 'down' && card.rank < 7) {
          isWin = true;
          winMultiplier = 2;
        } else if (betChoice === 'up' && card.rank > 7) {
          isWin = true;
          winMultiplier = 2;
        } else if (betChoice === 'seven' && card.rank === 7) {
          isWin = true;
          winMultiplier = 5; // 5x Jackpot for exact 7!
        }

        if (isWin) {
          const winAmount = betAmount * winMultiplier;
          onUpdateCoins(winAmount);
          sounds.playWin();
          sounds.playCoinCollect();
          setWon(true);
          setResultMessage(
            language === 'hi'
              ? `शानदार! आप जीते ${winAmount.toLocaleString()} कॉइन्स! (${winMultiplier}x)`
              : `WINNER! You won ${winAmount.toLocaleString()} Coins! (${winMultiplier}x)`
          );
        } else {
          sounds.playInvalid();
          setWon(false);
          setResultMessage(
            language === 'hi'
              ? `कोई बात नहीं! कार्ड था ${getRankName(card.rank)}${card.suit}`
              : `Better luck next time! Card was ${getRankName(card.rank)}${card.suit}`
          );
        }
      }
    }, 100);
  };

  const getRankName = (rank: number) => {
    if (rank === 1) return 'A';
    if (rank === 11) return 'J';
    if (rank === 12) return 'Q';
    if (rank === 13) return 'K';
    return rank.toString();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#941b0c] via-[#621708] to-[#220901] border-4 border-amber-400 p-4 text-white shadow-[0_0_50px_rgba(245,158,11,0.6)] flex flex-col items-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isRolling}
          className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-rose-600 hover:bg-rose-500 border-2 border-white text-white flex items-center justify-center shadow-lg transition-transform active:scale-90 cursor-pointer disabled:opacity-50"
        >
          <X size={18} />
        </button>

        {/* Title */}
        <div className="bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500 text-neutral-950 font-black px-6 py-1 rounded-full text-xs sm:text-sm tracking-wider uppercase shadow-[0_4px_12px_rgba(0,0,0,0.5)] border-2 border-amber-200 mb-2 flex items-center gap-1.5">
          <span>🎰</span>
          <span>{language === 'hi' ? '7 अप 7 डाउन मिनीगेम' : '7 UP 7 DOWN MINIGAME'}</span>
          <span>🎰</span>
        </div>

        {/* Balance Display */}
        <div className="flex items-center gap-1.5 bg-black/60 px-3 py-1 rounded-full border border-amber-400/40 text-xs font-bold text-amber-300 mb-3">
          <span>🪙 {coins.toLocaleString()}</span>
        </div>

        {/* Center Card Stage */}
        <div className="relative w-28 h-40 rounded-2xl bg-gradient-to-b from-white to-neutral-200 border-4 border-amber-400 shadow-[0_10px_25px_rgba(0,0,0,0.8)] flex flex-col items-center justify-between p-2 mb-3">
          {drawnCard ? (
            <>
              <div className={`w-full flex justify-between text-xs font-black ${
                drawnCard.suit === '♥' || drawnCard.suit === '♦' ? 'text-red-600' : 'text-neutral-950'
              }`}>
                <span>{getRankName(drawnCard.rank)}</span>
                <span>{drawnCard.suit}</span>
              </div>
              <div className={`text-4xl font-black ${
                drawnCard.suit === '♥' || drawnCard.suit === '♦' ? 'text-red-600' : 'text-neutral-950'
              }`}>
                {drawnCard.suit}
              </div>
              <div className={`w-full flex justify-between text-xs font-black rotate-180 ${
                drawnCard.suit === '♥' || drawnCard.suit === '♦' ? 'text-red-600' : 'text-neutral-950'
              }`}>
                <span>{getRankName(drawnCard.rank)}</span>
                <span>{drawnCard.suit}</span>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-neutral-400 text-center">
              <span className="text-3xl mb-1">🃏</span>
              <span className="text-[10px] font-bold uppercase">{language === 'hi' ? 'कार्ड चुनें' : 'Draw Card'}</span>
            </div>
          )}
        </div>

        {/* Outcome Message */}
        {resultMessage && (
          <div
            className={`w-full py-1.5 px-3 rounded-xl text-center text-xs font-black mb-3 border shadow ${
              won
                ? 'bg-emerald-600 border-emerald-300 text-white animate-bounce'
                : 'bg-red-800/80 border-red-500 text-red-200'
            }`}
          >
            {resultMessage}
          </div>
        )}

        {/* 3 Bet Choices (7 Down, Exact 7, 7 Up) */}
        <div className="grid grid-cols-3 gap-1.5 w-full mb-3">
          {/* 7 DOWN */}
          <button
            onClick={() => {
              sounds.playClick();
              setBetChoice('down');
            }}
            disabled={isRolling}
            className={`py-2 px-1 rounded-xl border-2 font-black flex flex-col items-center transition-all cursor-pointer ${
              betChoice === 'down'
                ? 'bg-gradient-to-b from-blue-500 to-indigo-700 border-yellow-300 text-white scale-105 shadow-[0_0_15px_rgba(59,130,246,0.8)]'
                : 'bg-black/50 border-white/20 text-neutral-300 hover:border-blue-400'
            }`}
          >
            <span className="text-xs uppercase">{language === 'hi' ? '7 डाउन' : '7 DOWN'}</span>
            <span className="text-[10px] opacity-80">(2 - 6)</span>
            <span className="text-[9px] text-amber-300 font-bold bg-black/40 px-1.5 rounded mt-0.5">2X PAY</span>
          </button>

          {/* EXACT 7 */}
          <button
            onClick={() => {
              sounds.playClick();
              setBetChoice('seven');
            }}
            disabled={isRolling}
            className={`py-2 px-1 rounded-xl border-2 font-black flex flex-col items-center transition-all cursor-pointer ${
              betChoice === 'seven'
                ? 'bg-gradient-to-b from-amber-500 to-yellow-600 border-white text-neutral-950 scale-105 shadow-[0_0_20px_rgba(245,158,11,1)]'
                : 'bg-black/50 border-white/20 text-neutral-300 hover:border-yellow-400'
            }`}
          >
            <span className="text-xs uppercase text-amber-300 font-black">EXACT 7</span>
            <span className="text-[10px] opacity-80">(Lucky 7)</span>
            <span className="text-[9px] text-yellow-300 font-bold bg-amber-950 px-1.5 rounded mt-0.5">5X PAY</span>
          </button>

          {/* 7 UP */}
          <button
            onClick={() => {
              sounds.playClick();
              setBetChoice('up');
            }}
            disabled={isRolling}
            className={`py-2 px-1 rounded-xl border-2 font-black flex flex-col items-center transition-all cursor-pointer ${
              betChoice === 'up'
                ? 'bg-gradient-to-b from-rose-500 to-red-700 border-yellow-300 text-white scale-105 shadow-[0_0_15px_rgba(239,68,68,0.8)]'
                : 'bg-black/50 border-white/20 text-neutral-300 hover:border-red-400'
            }`}
          >
            <span className="text-xs uppercase">{language === 'hi' ? '7 अप' : '7 UP'}</span>
            <span className="text-[10px] opacity-80">(8 - K)</span>
            <span className="text-[9px] text-amber-300 font-bold bg-black/40 px-1.5 rounded mt-0.5">2X PAY</span>
          </button>
        </div>

        {/* Bet Chips Selector */}
        <div className="flex items-center justify-center gap-1.5 w-full mb-3">
          {[50, 100, 250, 500].map((amt) => (
            <button
              key={amt}
              onClick={() => {
                sounds.playClick();
                setBetAmount(amt);
              }}
              disabled={isRolling}
              className={`px-2.5 py-1 rounded-full text-xs font-black border transition-all cursor-pointer ${
                betAmount === amt
                  ? 'bg-amber-400 text-neutral-950 border-white shadow-md scale-105'
                  : 'bg-black/60 text-amber-200 border-amber-400/30 hover:border-amber-400'
              }`}
            >
              🪙 {amt}
            </button>
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={handleRoll}
          disabled={!betChoice || isRolling}
          className="w-full py-2.5 rounded-2xl bg-gradient-to-b from-amber-400 via-yellow-400 to-amber-500 text-neutral-950 font-black text-sm uppercase tracking-wider border-2 border-white shadow-[0_5px_0_#92400e,0_8px_16px_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-[0_1px_0_#92400e] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRolling ? (language === 'hi' ? 'घूम रहा है...' : 'DRAWING...') : (language === 'hi' ? 'कार्ड निकालें!' : 'PLAY NOW!')}
        </button>
      </div>
    </div>
  );
};
