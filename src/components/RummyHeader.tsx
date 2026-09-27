import React from 'react';
import { Language, TableTheme } from '../types/rummy';
import { RUMMY_TRANSLATIONS } from '../utils/rummyTranslations';
import {
  BookOpen,
  History,
  RotateCcw,
  Settings,
  Volume2,
  VolumeX,
  Trophy,
  ShieldAlert,
  Flame,
} from 'lucide-react';

interface RummyHeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onNewGame: () => void;
  onOpenRules: () => void;
  onOpenSettings: () => void;
  onOpenCareerStats: () => void;
  onDrop: () => void;
  canDrop: boolean;
  isFirstDrop: boolean;
  roundNumber: number;
}

export const RummyHeader: React.FC<RummyHeaderProps> = ({
  language,
  onLanguageChange,
  soundEnabled,
  onToggleSound,
  onNewGame,
  onOpenRules,
  onOpenSettings,
  onOpenCareerStats,
  onDrop,
  canDrop,
  isFirstDrop,
  roundNumber,
}) => {
  const t = RUMMY_TRANSLATIONS[language];

  return (
    <header className="flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3 border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-30">
      {/* Brand & Wordmark */}
      <div className="flex items-center gap-2">
        <span className="text-xl sm:text-2xl font-black tracking-tight text-amber-400 font-serif flex items-center gap-1.5">
          <span>🃏</span>
          <span>{t.appName}</span>
        </span>
        <span className="hidden md:inline-block text-xs text-neutral-400 font-light border-l border-white/20 pl-2">
          {t.tagline}
        </span>
      </div>

      {/* Navigation & Mid Actions */}
      <nav className="flex items-center gap-2 sm:gap-3 text-xs font-medium text-neutral-300">
        <span className="font-mono text-amber-300 bg-amber-950/50 border border-amber-500/30 px-2.5 py-0.5 rounded-lg">
          {language === 'hi' ? `राउंड ${roundNumber}` : `Deal ${roundNumber}`}
        </span>

        {/* Drop Button */}
        <button
          onClick={canDrop ? onDrop : undefined}
          disabled={!canDrop}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
            canDrop
              ? 'bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-500/50 cursor-pointer shadow-sm active:scale-95'
              : 'bg-white/5 text-neutral-600 border border-white/5 opacity-50 cursor-not-allowed'
          }`}
          title={isFirstDrop ? t.firstDropLabel : t.middleDropLabel}
        >
          <ShieldAlert size={14} className={canDrop ? 'text-rose-400' : 'text-neutral-600'} />
          <span>{t.dropBtn}</span>
          <span className="text-[10px] opacity-75">
            ({isFirstDrop ? '20p' : '40p'})
          </span>
        </button>

        {/* Career Stats */}
        <button
          onClick={onOpenCareerStats}
          className="flex items-center gap-1 text-neutral-300 hover:text-amber-400 transition-colors py-1 cursor-pointer"
          title={t.careerStats}
        >
          <Trophy size={14} className="text-amber-400" />
          <span className="hidden md:inline">{t.careerStats}</span>
        </button>

        {/* Rules */}
        <button
          onClick={onOpenRules}
          className="flex items-center gap-1 text-neutral-300 hover:text-amber-400 transition-colors py-1 cursor-pointer"
          title={t.rulesTitle}
        >
          <BookOpen size={14} />
          <span className="hidden md:inline">{language === 'hi' ? 'नियम' : 'Rules'}</span>
        </button>
      </nav>

      {/* Right Controls: Language, Sound, Settings, New Game */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Language switcher */}
        <button
          onClick={() => onLanguageChange(language === 'hi' ? 'en' : 'hi')}
          className="px-2.5 py-1 text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/15 rounded-lg text-neutral-200 transition-colors cursor-pointer"
        >
          {language === 'hi' ? 'EN' : 'हिन्दी'}
        </button>

        {/* Audio Toggle */}
        <button
          onClick={onToggleSound}
          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
            soundEnabled
              ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
              : 'bg-white/5 border-white/15 text-neutral-400'
          }`}
        >
          {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          className="p-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors cursor-pointer"
        >
          <Settings size={16} />
        </button>

        {/* New Game */}
        <button
          onClick={onNewGame}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-neutral-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-yellow-200 rounded-lg shadow-md transition-all active:scale-95 cursor-pointer"
        >
          <RotateCcw size={13} />
          <span className="hidden sm:inline">{t.newGame}</span>
        </button>
      </div>
    </header>
  );
};
