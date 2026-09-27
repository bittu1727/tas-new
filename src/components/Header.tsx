import React from 'react';
import { Language, TableTheme } from '../types/game';
import { TRANSLATIONS } from '../utils/translations';
import { BookOpen, History, RotateCcw, Settings, Volume2, VolumeX, Globe, Trophy, Sparkles } from 'lucide-react';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onNewRound: () => void;
  onOpenRules: () => void;
  onOpenSettings: () => void;
  onOpenHistory: () => void;
  onOpenCareerStats: () => void;
  onOpenOnlineLobby: () => void;
  isOnlineMode: boolean;
  onlineRoomCode?: string;
  onlineCount?: number;
  roundNumber: number;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  soundEnabled,
  onToggleSound,
  onNewRound,
  onOpenRules,
  onOpenSettings,
  onOpenHistory,
  onOpenCareerStats,
  onOpenOnlineLobby,
  isOnlineMode,
  onlineRoomCode,
  onlineCount = 1,
  roundNumber,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <header className="flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3 border-b border-amber-500/30 bg-gradient-to-r from-neutral-950/95 via-stone-950/90 to-neutral-950/95 backdrop-blur-md sticky top-0 z-30 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
      {/* Brand & Wordmark */}
      <div className="flex items-center gap-2">
        <span className="text-lg sm:text-2xl font-black tracking-tight text-amber-400 font-serif flex items-center gap-1.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          <span className="text-xl sm:text-2xl">🃏</span>
          <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
            {t.appName}
          </span>
        </span>
        <span className="hidden lg:inline-block text-xs text-neutral-400 font-light border-l border-amber-500/20 pl-2">
          {t.tagline}
        </span>
      </div>

      {/* Navigation & Status Links */}
      <nav className="flex items-center gap-1.5 sm:gap-3 text-xs font-medium text-neutral-300">
        <span className="font-mono text-amber-300 bg-amber-950/70 border border-amber-500/40 px-2 py-0.5 rounded-lg shadow-inner">
          {language === 'hi' ? `राउंड ${roundNumber}` : `Round ${roundNumber}`}
        </span>

        {/* Global Online Lobby Trigger */}
        <button
          onClick={onOpenOnlineLobby}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm ${
            isOnlineMode
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 ring-1 ring-emerald-400/30'
              : 'bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 text-amber-300 hover:text-amber-200 border border-amber-500/40 hover:border-amber-400'
          }`}
          title={language === 'hi' ? 'ऑनलाइन खेलें' : 'Play online'}
        >
          <Globe size={13} className={isOnlineMode ? 'text-emerald-400' : 'text-amber-400'} />
          <span>
            {isOnlineMode && onlineRoomCode
              ? `${language === 'hi' ? 'कमरा:' : 'Room:'} ${onlineRoomCode}`
              : (language === 'hi' ? `ऑनलाइन (${onlineCount})` : `Online (${onlineCount})`)}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
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
          title={t.rules}
        >
          <BookOpen size={14} />
          <span className="hidden md:inline">{t.rules}</span>
        </button>

        {/* Score History */}
        <button
          onClick={onOpenHistory}
          className="flex items-center gap-1 text-neutral-300 hover:text-amber-400 transition-colors py-1 cursor-pointer"
          title={t.history}
        >
          <History size={14} />
          <span className="hidden md:inline">{t.history}</span>
        </button>
      </nav>

      {/* Actions (Language, Sound, Settings, New Round) */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Language switch */}
        <button
          onClick={() => onLanguageChange(language === 'hi' ? 'en' : 'hi')}
          className="px-2.5 py-1 text-xs font-bold bg-white/5 hover:bg-white/10 border border-white/15 rounded-lg text-neutral-200 transition-colors cursor-pointer"
        >
          {language === 'hi' ? 'EN' : 'हिन्दी'}
        </button>

        {/* Sound toggle */}
        <button
          onClick={onToggleSound}
          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
            soundEnabled
              ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
              : 'bg-white/5 border-white/15 text-neutral-400'
          }`}
          title={t.sound}
        >
          {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
        </button>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          className="p-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors cursor-pointer"
          title={t.settings}
        >
          <Settings size={15} />
        </button>

        {/* New Round */}
        <button
          onClick={onNewRound}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-black text-neutral-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 hover:from-amber-300 hover:to-yellow-200 rounded-lg shadow-md transition-all active:scale-95 cursor-pointer"
        >
          <RotateCcw size={13} />
          <span className="hidden sm:inline">{t.newRound}</span>
        </button>
      </div>
    </header>
  );
};
