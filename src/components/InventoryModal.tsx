import React, { useState } from 'react';
import { X, Briefcase, Check, Sparkles, Palette } from 'lucide-react';
import { sounds } from '../utils/audio';
import { TableTheme } from '../types/game';

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: TableTheme;
  onSelectTheme: (theme: TableTheme) => void;
  language: 'hi' | 'en';
}

const THEMES: Array<{ id: TableTheme; name: string; desc: string; color: string }> = [
  { id: 'emerald', name: 'Emerald Velvet', desc: 'Classic Casino Green', color: 'bg-emerald-800' },
  { id: 'crimson', name: 'Crimson Palace', desc: 'Royal Maharaja Red', color: 'bg-rose-900' },
  { id: 'sapphire', name: 'Sapphire Midnight', desc: 'Deep Ocean Blue', color: 'bg-blue-900' },
  { id: 'obsidian', name: 'Obsidian Noir', desc: 'Sleek Cyber Black', color: 'bg-neutral-900' },
];

export const InventoryModal: React.FC<InventoryModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
  language,
}) => {
  if (!isOpen) return null;

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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-neutral-950 flex items-center justify-center font-black text-xl shadow">
            🎒
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black tracking-wider uppercase">
              {language === 'hi' ? 'शाही कलेक्शन व इन्वेंटरी' : 'ROYAL INVENTORY'}
            </h2>
            <p className="text-[10px] text-amber-300">
              {language === 'hi' ? 'टेबल और कार्ड की थीम बदलें' : 'Custom table felts & card designs'}
            </p>
          </div>
        </div>

        {/* Table Felt Themes */}
        <div className="space-y-2 mb-4">
          {THEMES.map((th) => {
            const isSelected = currentTheme === th.id;
            return (
              <div
                key={th.id}
                onClick={() => {
                  sounds.playClick();
                  onSelectTheme(th.id);
                }}
                className={`p-3 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-amber-400/20 border-yellow-300 shadow-md scale-102'
                    : 'bg-black/40 border-white/10 hover:border-amber-400/50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-xl ${th.color} border border-white shadow`} />
                  <div>
                    <h4 className="font-bold text-xs text-white">{th.name}</h4>
                    <p className="text-[10px] text-neutral-300">{th.desc}</p>
                  </div>
                </div>

                {isSelected ? (
                  <span className="flex items-center gap-1 text-[10px] font-black bg-emerald-500 text-neutral-950 px-2 py-0.5 rounded-full">
                    <Check size={12} strokeWidth={3} /> {language === 'hi' ? 'सक्रिय' : 'EQUIPPED'}
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-amber-300 hover:text-white">
                    {language === 'hi' ? 'चुनें' : 'EQUIP'}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-2xl bg-gradient-to-b from-amber-400 via-yellow-400 to-amber-500 text-neutral-950 font-black text-sm uppercase tracking-wider border-2 border-white shadow-[0_5px_0_#92400e,0_8px_16px_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-[0_1px_0_#92400e] transition-all cursor-pointer"
        >
          {language === 'hi' ? 'पूर्ण' : 'DONE'}
        </button>
      </div>
    </div>
  );
};
