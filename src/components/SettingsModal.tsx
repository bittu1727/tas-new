import React from 'react';
import { BotDifficulty, GameSettings, Language, TableTheme } from '../types/game';
import { TRANSLATIONS } from '../utils/translations';
import { X, Volume2, VolumeX, Sliders, Palette, Zap, Sparkles } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onResetTournament: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetTournament,
}) => {
  const t = TRANSLATIONS[settings.language];

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
                { id: 'emerald', label: t.themeEmerald, color: 'bg-emerald-900 border-emerald-500' },
                { id: 'crimson', label: t.themeCrimson, color: 'bg-rose-950 border-rose-500' },
                { id: 'sapphire', label: t.themeSapphire, color: 'bg-blue-950 border-blue-500' },
                { id: 'obsidian', label: t.themeObsidian, color: 'bg-neutral-900 border-neutral-600' },
              ].map((themeItem) => (
                <button
                  key={themeItem.id}
                  onClick={() => onUpdateSettings({ theme: themeItem.id as TableTheme })}
                  className={`flex items-center gap-2 p-2 rounded-lg border transition-all text-left ${
                    settings.theme === themeItem.id
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
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
            <div className="font-bold text-neutral-200 mb-2">{t.aiDifficulty}</div>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              {[
                { id: 'easy', label: t.easy },
                { id: 'normal', label: t.medium },
                { id: 'master', label: t.master },
              ].map((diff) => (
                <button
                  key={diff.id}
                  onClick={() => onUpdateSettings({ botDifficulty: diff.id as BotDifficulty })}
                  className={`py-1.5 px-2 rounded-lg border text-center transition-colors ${
                    settings.botDifficulty === diff.id
                      ? 'bg-amber-400 text-neutral-950 font-bold border-amber-400 shadow'
                      : 'bg-black/40 border-white/10 text-neutral-400 hover:text-white'
                  }`}
                >
                  {diff.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bot Turn Speed */}
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={15} className="text-amber-400" />
              <div className="font-bold text-neutral-200">{t.speed}</div>
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              {[
                { id: 'fast', label: t.fast },
                { id: 'normal', label: t.normal },
                { id: 'slow', label: t.slow },
              ].map((sp) => (
                <button
                  key={sp.id}
                  onClick={() => onUpdateSettings({ speed: sp.id as 'fast' | 'normal' | 'slow' })}
                  className={`py-1.5 px-2 rounded-lg border text-center transition-colors ${
                    settings.speed === sp.id
                      ? 'bg-amber-400 text-neutral-950 font-bold border-amber-400 shadow'
                      : 'bg-black/40 border-white/10 text-neutral-400 hover:text-white'
                  }`}
                >
                  {sp.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/10">
            <div className="flex items-center gap-2">
              {settings.soundEnabled ? (
                <Volume2 size={18} className="text-emerald-400" />
              ) : (
                <VolumeX size={18} className="text-neutral-500" />
              )}
              <span className="font-bold text-neutral-200">{t.sound}</span>
            </div>
            <button
              onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.soundEnabled ? 'bg-emerald-500' : 'bg-neutral-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.soundEnabled ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Reset Tournament Data */}
          <div className="pt-2">
            <button
              onClick={() => {
                onResetTournament();
                onClose();
              }}
              className="w-full py-2.5 px-4 text-xs font-bold text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 border border-rose-600/30 rounded-xl transition-colors cursor-pointer"
            >
              {t.resetTournament}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors cursor-pointer"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
