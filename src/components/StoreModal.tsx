import React, { useState } from 'react';
import { sounds } from '../utils/audio';
import { X, ShoppingCart, Sparkles, Check, Gem, Coins, ShieldCheck } from 'lucide-react';

interface StoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  coins: number;
  gems: number;
  onAddCurrency: (addCoins: number, addGems: number) => void;
  language: 'hi' | 'en';
}

export const StoreModal: React.FC<StoreModalProps> = ({
  isOpen,
  onClose,
  coins,
  gems,
  onAddCurrency,
  language,
}) => {
  const [tab, setTab] = useState<'coins' | 'gems' | 'themes'>('coins');
  const [purchasedItem, setPurchasedItem] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleBuy = (name: string, addCoins: number, addGems: number) => {
    sounds.playWin();
    sounds.playCoinCollect();
    onAddCurrency(addCoins, addGems);
    setPurchasedItem(name);
    setTimeout(() => setPurchasedItem(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-[#0c3a96] via-[#07266b] to-[#04163d] border-4 border-amber-400 p-4 text-white shadow-[0_0_50px_rgba(245,158,11,0.5)] flex flex-col max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-rose-600 hover:bg-rose-500 border-2 border-white text-white flex items-center justify-center shadow-lg transition-transform active:scale-90 cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Header Title */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-amber-400 to-yellow-600 text-neutral-950 flex items-center justify-center shadow font-black text-lg">
              🛒
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-wider uppercase">
                {language === 'hi' ? 'शाही बाज़ार व शॉप' : 'ROYAL STORE'}
              </h2>
              <p className="text-[10px] text-amber-300">
                {language === 'hi' ? 'कॉइन्स, जेम्स और स्पेशल डील्स' : 'Coins, Gems & Exclusive Decks'}
              </p>
            </div>
          </div>

          {/* Current balance */}
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold bg-black/60 px-2.5 py-1 rounded-full border border-white/10">
            <span>🪙 {coins.toLocaleString()}</span>
            <span className="text-cyan-400">💎 {gems}</span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl my-3 border border-white/10">
          <button
            onClick={() => setTab('coins')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
              tab === 'coins'
                ? 'bg-amber-400 text-neutral-950 shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            🪙 {language === 'hi' ? 'कॉइन्स' : 'Coins'}
          </button>
          <button
            onClick={() => setTab('gems')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
              tab === 'gems'
                ? 'bg-cyan-400 text-neutral-950 shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            💎 {language === 'hi' ? 'जेम्स' : 'Gems'}
          </button>
          <button
            onClick={() => setTab('themes')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
              tab === 'themes'
                ? 'bg-purple-400 text-neutral-950 shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            🎨 {language === 'hi' ? 'थीम्स' : 'Themes'}
          </button>
        </div>

        {/* Purchase Confirmation Toast */}
        {purchasedItem && (
          <div className="bg-emerald-600 text-white font-bold text-xs p-2 rounded-xl text-center mb-2 animate-bounce border border-emerald-300">
            ✓ {purchasedItem} {language === 'hi' ? 'सफलतापूर्वक प्राप्त हुआ!' : 'claimed successfully!'}
          </div>
        )}

        {/* Tab Content List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {tab === 'coins' && (
            <>
              {/* Starter Deal Special */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-red-600 via-amber-600 to-yellow-500 border-2 border-yellow-200 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🔥</span>
                  <div>
                    <span className="bg-yellow-300 text-neutral-950 text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase">
                      500% BONUS
                    </span>
                    <h3 className="font-black text-sm text-white">Starter Pack</h3>
                    <p className="text-[11px] text-yellow-100 font-bold">10,000 🪙 + 50 💎</p>
                  </div>
                </div>
                <button
                  onClick={() => handleBuy('Starter Pack', 10000, 50)}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-b from-yellow-300 to-amber-500 text-neutral-950 font-black text-xs border border-white shadow-md active:scale-95 cursor-pointer"
                >
                  ₹25
                </button>
              </div>

              {/* Pack 1 */}
              <div className="p-3 rounded-2xl bg-[#082361] border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🪙</span>
                  <div>
                    <h3 className="font-black text-xs text-white">Pocket Stash</h3>
                    <p className="text-[11px] text-amber-300 font-bold">5,000 Coins</p>
                  </div>
                </div>
                <button
                  onClick={() => handleBuy('Pocket Stash', 5000, 0)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs border border-emerald-400 shadow-md active:scale-95 cursor-pointer"
                >
                  FREE (Ad)
                </button>
              </div>

              {/* Pack 2 */}
              <div className="p-3 rounded-2xl bg-[#082361] border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">💰</span>
                  <div>
                    <h3 className="font-black text-xs text-white">Royal Chest</h3>
                    <p className="text-[11px] text-amber-300 font-bold">25,000 Coins</p>
                  </div>
                </div>
                <button
                  onClick={() => handleBuy('Royal Chest', 25000, 10)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs border border-amber-200 shadow-md active:scale-95 cursor-pointer"
                >
                  ₹50
                </button>
              </div>

              {/* Pack 3 */}
              <div className="p-3 rounded-2xl bg-[#082361] border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">👑</span>
                  <div>
                    <h3 className="font-black text-xs text-white">Maharaja Vault</h3>
                    <p className="text-[11px] text-amber-300 font-bold">100,000 Coins</p>
                  </div>
                </div>
                <button
                  onClick={() => handleBuy('Maharaja Vault', 100000, 50)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs border border-amber-200 shadow-md active:scale-95 cursor-pointer"
                >
                  ₹150
                </button>
              </div>
            </>
          )}

          {tab === 'gems' && (
            <>
              <div className="p-3 rounded-2xl bg-[#082361] border border-cyan-400/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">💎</span>
                  <div>
                    <h3 className="font-black text-xs text-white">Gem Pouch</h3>
                    <p className="text-[11px] text-cyan-300 font-bold">50 Diamonds</p>
                  </div>
                </div>
                <button
                  onClick={() => handleBuy('Gem Pouch', 0, 50)}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-black text-xs border border-cyan-200 shadow-md active:scale-95 cursor-pointer"
                >
                  ₹40
                </button>
              </div>

              <div className="p-3 rounded-2xl bg-[#082361] border border-cyan-400/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">✨</span>
                  <div>
                    <h3 className="font-black text-xs text-white">Diamond Crate</h3>
                    <p className="text-[11px] text-cyan-300 font-bold">250 Diamonds</p>
                  </div>
                </div>
                <button
                  onClick={() => handleBuy('Diamond Crate', 0, 250)}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-black text-xs border border-cyan-200 shadow-md active:scale-95 cursor-pointer"
                >
                  ₹150
                </button>
              </div>
            </>
          )}

          {tab === 'themes' && (
            <div className="space-y-2">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-950 to-neutral-900 border border-emerald-500/50 flex items-center justify-between">
                <div>
                  <h3 className="font-black text-xs text-emerald-400">Royal Emerald Felt</h3>
                  <p className="text-[10px] text-neutral-400">Classic green velvet casino felt</p>
                </div>
                <span className="text-xs font-black text-emerald-400 bg-emerald-950 px-2 py-1 rounded border border-emerald-500/50">
                  EQUIPPED ✓
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-gradient-to-r from-red-950 to-neutral-900 border border-rose-500/50 flex items-center justify-between">
                <div>
                  <h3 className="font-black text-xs text-rose-400">Crimson Velvet</h3>
                  <p className="text-[10px] text-neutral-400">Rich royal red palace table</p>
                </div>
                <button
                  onClick={() => handleBuy('Crimson Velvet Theme', 0, 0)}
                  className="px-2.5 py-1 rounded bg-amber-400 text-neutral-950 font-black text-xs active:scale-95 cursor-pointer"
                >
                  500 🪙
                </button>
              </div>

              <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-950 to-neutral-900 border border-cyan-500/50 flex items-center justify-between">
                <div>
                  <h3 className="font-black text-xs text-cyan-400">Sapphire King</h3>
                  <p className="text-[10px] text-neutral-400">Midnight sapphire club table</p>
                </div>
                <button
                  onClick={() => handleBuy('Sapphire King Theme', 0, 0)}
                  className="px-2.5 py-1 rounded bg-amber-400 text-neutral-950 font-black text-xs active:scale-95 cursor-pointer"
                >
                  1,000 🪙
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Guarantee */}
        <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-center gap-1.5 text-[10px] text-amber-200/80">
          <ShieldCheck size={14} className="text-emerald-400" />
          <span>100% Safe Virtual Currency • Instant Activation</span>
        </div>
      </div>
    </div>
  );
};
