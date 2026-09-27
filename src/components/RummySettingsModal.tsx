import React from 'react';
import { BotDifficulty, Language, RummyGameSettings, TableTheme } from '../types/rummy';
import { RUMMY_TRANSLATIONS } from '../utils/rummyTranslations';
import { X, Volume2, VolumeX, Sliders, Palette, Zap, Sparkles } from 'lucide-react';

interface RummySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: RummyGameSettings;
  onUpdateSettings: (newSettings: Partial<RummyGameSettings>) => void;
  onResetGame: () => void;
}

export const RummySettingsModal: React.FC<RummySettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetGame,
}) => {
  const t = RUMMY_TRANSLATIONS[settings.language];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-white/20 rounded-3xl p-5 sm:p-6 max-w-lg w-full text-left shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Sliders size={20} className="text-amber-400" />
            <h2 className="text-lg font-bold text-neutral-100">{t.settings}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4 text-xs sm:text-sm">
          {/* Language Selection */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/10">
            <div>
              <div className="font-bold text-neutral-200">{t.language}</div>
              <div className="text-[11px] text-neutral-400">Select interface language</div>
            </div>
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/10">
              <button
                onClick={() => onUpdateSettings({ language: 'hi' })}
                className={`px-3 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                  settings.language === 'hi'
                    ? 'bg-amber-400 text-neutral-950 shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => onUpdateSettings({ language: 'en' })}
                className={`px-3 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                  settings.language === 'en'
                    ? 'bg-amber-400 text-neutral-950 shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                English
              </button>
            </div>
          </div>

          {/* Table Felt Theme */}
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Palette size={16} className="text-amber-400" />
              <div className="font-bold text-neutral-200">{t.tableTheme}</div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: 'emerald', label: 'Classic Emerald', color: 'bg-emerald-900 border-emerald-500' },
                { id: 'crimson', label: 'Royal Crimson', color: 'bg-rose-950 border-rose-500' },
                { id: 'sapphire', label: 'Sapphire Blue', color: 'bg-blue-950 border-blue-500' },
                { id: 'obsidian', label: 'Dark Obsidian', color: 'bg-neutral-900 border-neutral-600' },
              ].map((themeItem) => (
                <button
                  key={themeItem.id}
                  onClick={() => onUpdateSettings({ tableTheme: themeItem.id as TableTheme })}
                  className={`flex items-center gap-2 p-2 rounded-lg border transition-all text-left ${
                    settings.tableTheme === themeItem.id
                      ? `${themeItem.color} ring-2 ring-amber-400 text-white font-bold`
                      : 'bg-black/30 border-white/10 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full ${themeItem.color}`} />
                  <span className="truncate">{themeItem.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Bot Level */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/10">
            <div>
              <div className="font-bold text-neutral-200">{t.botLevel}</div>
              <div className="text-[11px] text-neutral-400">AI strategic intelligence</div>
            </div>
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/10">
              {(['easy', 'normal', 'master'] as BotDifficulty[]).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => onUpdateSettings({ botDifficulty: lvl })}
                  className={`px-2.5 py-1 rounded text-xs font-bold capitalize transition-colors cursor-pointer ${
                    settings.botDifficulty === lvl
                      ? 'bg-amber-400 text-neutral-950 shadow'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Game Speed */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/10">
            <div>
              <div className="font-bold text-neutral-200">
                {settings.language === 'hi' ? 'बॉट चाल गति' : 'Bot Turn Speed'}
              </div>
              <div className="text-[11px] text-neutral-400">Delay for opponent decisions</div>
            </div>
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/10">
              {(['fast', 'normal', 'slow'] as const).map((spd) => (
                <button
                  key={spd}
                  onClick={() => onUpdateSettings({ gameSpeed: spd })}
                  className={`px-2.5 py-1 rounded text-xs font-bold capitalize transition-colors cursor-pointer ${
                    settings.gameSpeed === spd
                      ? 'bg-amber-400 text-neutral-950 shadow'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {spd}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-4 mt-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/15 text-white transition-colors cursor-pointer"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
