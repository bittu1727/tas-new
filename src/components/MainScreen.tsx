import React, { useState, useEffect } from 'react';
import { sounds } from '../utils/audio';
import {
  Settings,
  Mail,
  ShoppingCart,
  HelpCircle,
  Sparkles,
  Trophy,
  Users,
  Home,
  Calendar,
  Mic,
  Briefcase,
  MessageCircle,
  Plus,
  Flame,
  Award,
  Tv,
  Edit3,
} from 'lucide-react';

interface MainScreenProps {
  onStartSolo: (mode?: 'bot' | 'pass') => void;
  onOpenOnlineLobby: (preset?: 'quick' | 'room' | 'team') => void;
  onOpenFriends: () => void;
  onOpenPassNPlaySetup: () => void;
  onOpenSevenUpDown: () => void;
  onOpenRewardVideo: () => void;
  onOpenProfileEdit: () => void;
  onOpenInventory: () => void;
  onOpenRules: () => void;
  onOpenSettings: () => void;
  onOpenCareer: () => void;
  coins: number;
  gems: number;
  onAddCurrency: (addCoins: number, addGems: number) => void;
  playerName: string;
  avatar: string;
  language: 'hi' | 'en';
  onToggleLanguage: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenSpin: () => void;
  onOpenShop: () => void;
  onOpenAdda: () => void;
  onOpenEvents: () => void;
}

export const MainScreen: React.FC<MainScreenProps> = ({
  onStartSolo,
  onOpenOnlineLobby,
  onOpenFriends,
  onOpenPassNPlaySetup,
  onOpenSevenUpDown,
  onOpenRewardVideo,
  onOpenProfileEdit,
  onOpenInventory,
  onOpenRules,
  onOpenSettings,
  onOpenCareer,
  coins,
  gems,
  onAddCurrency,
  playerName,
  avatar,
  language,
  onToggleLanguage,
  soundEnabled,
  onToggleSound,
  onOpenSpin,
  onOpenShop,
  onOpenAdda,
  onOpenEvents,
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'event' | 'adda' | 'inventory' | 'social'>('home');
  const [claimedDaily, setClaimedDaily] = useState(false);
  const [onlineCount, setOnlineCount] = useState(187060);
  const [teamCount, setTeamCount] = useState(6952);
  const [friendsCount, setFriendsCount] = useState(45662);

  // Realistic live player count fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount((c) => c + Math.floor(Math.random() * 9) - 4);
      setTeamCount((c) => c + Math.floor(Math.random() * 5) - 2);
      setFriendsCount((c) => c + Math.floor(Math.random() * 7) - 3);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const handleClaimSeason = () => {
    if (claimedDaily) return;
    sounds.playWin();
    sounds.playCoinCollect();
    onAddCurrency(500, 10);
    setClaimedDaily(true);
  };

  const handleModeClick = (action: () => void) => {
    sounds.playClick();
    action();
  };

  return (
    <div className="relative min-h-screen w-full bg-[#032363] overflow-x-hidden flex flex-col justify-between select-none font-sans">
      {/* Background with Ludo King Style Blue Textured Gradient & Watermark Pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a55d4] via-[#083ea8] to-[#021847] pointer-events-none" />

      {/* Ludo King / Card Table Felt Watermark Glyphs */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:20px_20px] pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10 select-none">
        <span className="absolute top-12 left-4 text-7xl font-serif">♥</span>
        <span className="absolute top-44 right-6 text-8xl font-serif">♠</span>
        <span className="absolute bottom-36 left-8 text-7xl font-serif">♦</span>
        <span className="absolute bottom-56 right-8 text-8xl font-serif">♣</span>
        <span className="absolute top-72 left-1/4 text-9xl font-serif">6</span>
        <span className="absolute top-64 right-1/3 text-9xl font-serif">7</span>
      </div>

      {/* ============================================================== */}
      {/* TOP BAR: Profile, Settings, Mail, Gems, Coins, Store Cart      */}
      {/* ============================================================== */}
      <header className="relative z-20 w-full px-2 sm:px-4 py-2 flex items-center justify-between gap-1 sm:gap-2 bg-gradient-to-b from-black/70 via-black/40 to-transparent">
        {/* Left: Avatar with Star Level & Profile edit */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Avatar Box */}
          <div
            onClick={onOpenProfileEdit}
            className="relative cursor-pointer group active:scale-95 transition-transform"
            title="Edit Profile"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 p-0.5 shadow-lg border-2 border-amber-300">
              <div className="w-full h-full rounded-[10px] bg-slate-900 flex items-center justify-center text-xl sm:text-2xl">
                {avatar || '👑'}
              </div>
            </div>
            {/* Level Star Badge */}
            <div className="absolute -bottom-1 -left-1 bg-amber-500 border border-white text-neutral-950 rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[9px] sm:text-[10px] font-black shadow">
              ⭐1
            </div>
            {/* Edit pencil badge */}
            <div className="absolute -top-1 -right-1 bg-blue-600 rounded-full w-4 h-4 border border-white flex items-center justify-center text-[8px] text-white">
              <Edit3 size={8} />
            </div>
          </div>

          {/* Settings Button */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenSettings();
            }}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-b from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600 border border-blue-300 text-white flex items-center justify-center shadow-md cursor-pointer transition-transform active:scale-95"
            title="Settings"
          >
            <Settings size={16} />
          </button>

          {/* Mail Envelope Button */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenEvents();
            }}
            className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-b from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 border border-amber-300 text-neutral-950 flex items-center justify-center shadow-md cursor-pointer transition-transform active:scale-95"
            title="Mail & Messages"
          >
            <Mail size={16} />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-600 rounded-full border border-white flex items-center justify-center text-[7px] text-white font-bold animate-pulse">
              1
            </span>
          </button>
        </div>

        {/* Right: Currency Bars (Diamonds & Coins) + Shop Cart */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Gems Pill */}
          <div
            onClick={onOpenShop}
            className="flex items-center gap-1 bg-[#061d49]/90 border-2 border-cyan-400/80 rounded-full px-2.5 py-0.5 shadow-md cursor-pointer active:scale-95 transition-transform"
          >
            <span className="text-cyan-300 text-xs sm:text-sm drop-shadow">💎</span>
            <span className="font-black text-xs sm:text-sm text-cyan-100 font-mono tracking-wide">
              {gems}
            </span>
            <div className="w-4 h-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 flex items-center justify-center font-black text-xs shadow-sm ml-0.5">
              <Plus size={10} strokeWidth={4} />
            </div>
          </div>

          {/* Coins Pill */}
          <div
            onClick={onOpenShop}
            className="flex items-center gap-1 bg-[#061d49]/90 border-2 border-amber-400/80 rounded-full px-2.5 py-0.5 shadow-md cursor-pointer active:scale-95 transition-transform"
          >
            <span className="text-amber-400 text-xs sm:text-sm drop-shadow">🪙</span>
            <span className="font-black text-xs sm:text-sm text-amber-200 font-mono tracking-wide">
              {coins.toLocaleString()}
            </span>
            <div className="w-4 h-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 flex items-center justify-center font-black text-xs shadow-sm ml-0.5">
              <Plus size={10} strokeWidth={4} />
            </div>
          </div>

          {/* Shopping Cart Button */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenShop();
            }}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-b from-amber-400 via-amber-500 to-yellow-600 border-2 border-amber-200 text-neutral-950 flex items-center justify-center shadow-lg cursor-pointer transition-transform active:scale-95"
            title="Coin & Diamond Store"
          >
            <ShoppingCart size={16} strokeWidth={2.5} />
          </button>
        </div>
      </header>

      {/* ============================================================== */}
      {/* FLOATING ACTION BADGES (LEFT & RIGHT COLUMNS)                   */}
      {/* ============================================================== */}
      {/* Left Column */}
      <div className="absolute top-18 left-2 z-20 flex flex-col gap-2.5 items-center">
        {/* "₹25 Only" Offer Banner */}
        <div
          onClick={onOpenShop}
          className="group cursor-pointer flex flex-col items-center active:scale-95 transition-transform"
        >
          <div className="bg-gradient-to-r from-red-600 to-amber-500 text-white font-black text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full border border-yellow-300 shadow-md animate-pulse">
            ₹25 Only
          </div>
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-200 border-2 border-white shadow-lg flex items-center justify-center text-neutral-950 font-black text-sm -mt-1">
            ₹
          </div>
        </div>

        {/* VIP / Royal Seal */}
        <div
          onClick={onOpenCareer}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-b from-amber-700 via-yellow-500 to-amber-400 border-2 border-amber-200 shadow-lg flex items-center justify-center text-neutral-950 font-black text-base cursor-pointer active:scale-95 transition-transform"
          title="VIP Club"
        >
          <Award size={18} />
        </div>

        {/* Live Stream / TV Badge */}
        <div
          onClick={onOpenAdda}
          className="flex flex-col items-center cursor-pointer active:scale-95 transition-transform"
          title="Watch Live Badam King"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-b from-red-600 to-rose-700 border-2 border-white shadow-lg flex items-center justify-center text-white font-black text-sm">
            ▶️
          </div>
          <span className="bg-red-600 text-white font-black text-[8px] px-1.5 py-0.2 rounded-full border border-white -mt-1 shadow flex items-center gap-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" /> LIVE
          </span>
        </div>

        {/* Free Coins Chest */}
        <div
          onClick={onOpenSpin}
          className="flex flex-col items-center cursor-pointer active:scale-95 transition-transform"
          title="Free Daily Reward"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-b from-amber-500 to-yellow-300 border-2 border-white shadow-lg flex items-center justify-center text-neutral-950 font-black text-lg">
            🎁
          </div>
          <span className="bg-emerald-600 text-white font-black text-[9px] px-1.5 py-0.2 rounded-full border border-white -mt-1 shadow">
            FREE
          </span>
        </div>
      </div>

      {/* Right Column */}
      <div className="absolute top-18 right-2 z-20 flex flex-col gap-2.5 items-center">
        {/* NO ADS Button */}
        <div
          onClick={onOpenShop}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-red-700 to-rose-500 border-2 border-white shadow-lg flex items-center justify-center text-white font-black text-[9px] cursor-pointer active:scale-95 transition-transform"
          title="Remove Ads"
        >
          <div className="text-center leading-none">
            <span className="block font-black">NO</span>
            <span className="block text-[7px]">ADS</span>
          </div>
        </div>

        {/* Daily Target / Missions Bullseye */}
        <div
          onClick={onOpenEvents}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-b from-amber-500 via-red-600 to-amber-400 border-2 border-white shadow-lg flex items-center justify-center text-white text-base cursor-pointer active:scale-95 transition-transform"
          title="Daily Quests"
        >
          🎯
        </div>

        {/* Language Switch */}
        <button
          onClick={() => {
            sounds.playClick();
            onToggleLanguage();
          }}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-b from-indigo-600 to-blue-700 border-2 border-indigo-300 shadow-lg flex items-center justify-center text-white font-black text-xs cursor-pointer active:scale-95 transition-transform"
          title="Change Language"
        >
          {language === 'hi' ? 'HI' : 'EN'}
        </button>

        {/* How to Play Yellow Bubble */}
        <button
          onClick={() => {
            sounds.playClick();
            onOpenRules();
          }}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-b from-amber-400 via-yellow-300 to-amber-500 border-2 border-white shadow-lg flex items-center justify-center text-neutral-950 font-black text-sm cursor-pointer active:scale-95 transition-transform"
          title="Rules & How to Play"
        >
          <HelpCircle size={18} strokeWidth={3} />
        </button>
      </div>

      {/* ============================================================== */}
      {/* CENTER STAGE: 3D Crown, BADAM KING Logo & Mode Action Cards   */}
      {/* ============================================================== */}
      <main className="relative z-10 flex-1 max-w-md w-full mx-auto px-4 py-1 flex flex-col items-center justify-around gap-1.5 sm:gap-2">
        {/* BRAND LOGO: 3D Crown + Colorful Glossy Letters + 3D Board Mascot */}
        <div className="flex flex-col items-center text-center mt-1">
          {/* 3D Golden Crown with Jewels */}
          <div className="relative -mb-1 filter drop-shadow-[0_8px_16px_rgba(245,158,11,0.7)] animate-bounce duration-1000">
            <span className="text-4xl sm:text-5xl">👑</span>
          </div>

          {/* 3D BADAM KING Letter Badges */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="flex items-center gap-1">
              <span className="w-8 h-10 sm:w-9 sm:h-11 rounded-lg bg-gradient-to-b from-cyan-400 to-blue-600 border-2 border-white text-white font-black text-xl sm:text-2xl flex items-center justify-center shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
                B
              </span>
              <span className="w-8 h-10 sm:w-9 sm:h-11 rounded-lg bg-gradient-to-b from-rose-500 to-red-600 border-2 border-white text-white font-black text-xl sm:text-2xl flex items-center justify-center shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
                A
              </span>
              <span className="w-8 h-10 sm:w-9 sm:h-11 rounded-lg bg-gradient-to-b from-emerald-400 to-green-600 border-2 border-white text-white font-black text-xl sm:text-2xl flex items-center justify-center shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
                D
              </span>
              <span className="w-8 h-10 sm:w-9 sm:h-11 rounded-lg bg-gradient-to-b from-amber-400 to-yellow-600 border-2 border-white text-white font-black text-xl sm:text-2xl flex items-center justify-center shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
                A
              </span>
              <span className="w-8 h-10 sm:w-9 sm:h-11 rounded-lg bg-gradient-to-b from-purple-500 to-indigo-600 border-2 border-white text-white font-black text-xl sm:text-2xl flex items-center justify-center shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
                M
              </span>
            </div>

            {/* Extruded Metallic KING */}
            <div className="bg-gradient-to-b from-yellow-200 via-amber-400 to-amber-600 px-3 py-1 rounded-lg border-2 border-yellow-100 shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
              <span className="font-black text-lg sm:text-xl text-neutral-950 tracking-wider">
                KING
              </span>
            </div>
          </div>

          {/* Perspective 3D Mat with Pawns and 6♥ Die Showcase */}
          <div className="flex items-center justify-center gap-2 mt-1 bg-black/40 px-3 py-0.5 rounded-full border border-amber-400/40 shadow-inner">
            <span className="text-xs">🔴</span>
            <span className="text-xs font-black text-red-500">6♥</span>
            <span className="text-xs">🎲</span>
            <span className="text-xs font-black text-red-500">7♥</span>
            <span className="text-xs">🟢</span>
            <span className="text-[10px] font-bold text-amber-300">
              {language === 'hi' ? 'असली बादाम छक्का' : 'Original 7-on-7 Sensation'}
            </span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* ROW 1: 3 HIGH-IMPACT MODE TILES (ONLINE, TEAM UP, FRIENDS)     */}
        {/* ============================================================== */}
        <div className="grid grid-cols-3 gap-2 w-full">
          {/* 1. PLAY ONLINE */}
          <button
            onClick={() => handleModeClick(() => onOpenOnlineLobby('quick'))}
            className="group relative flex flex-col items-center justify-between p-2 rounded-2xl bg-gradient-to-b from-[#ffdb4d] via-[#f59e0b] to-[#b45309] border-2 border-yellow-200 shadow-[0_6px_0_#78350f,0_10px_20px_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-[0_2px_0_#78350f] transition-all cursor-pointer overflow-hidden min-h-[96px] sm:min-h-[112px]"
          >
            <div className="absolute top-0 inset-x-0 h-1/2 bg-white/30 rounded-t-2xl pointer-events-none" />

            <div className="relative mt-0.5 flex items-center justify-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 border-2 border-white shadow-md flex items-center justify-center text-lg sm:text-xl">
                🌍
              </div>
            </div>

            <span className="font-black text-xs sm:text-sm text-neutral-950 tracking-wider uppercase mt-1">
              {language === 'hi' ? 'ऑनलाइन' : 'ONLINE'}
            </span>

            <span className="text-[9px] sm:text-[10px] font-bold text-amber-950 bg-yellow-300/90 px-1.5 py-0.2 rounded-full leading-none">
              🟢 {onlineCount.toLocaleString()}
            </span>
          </button>

          {/* 2. TEAM UP */}
          <button
            onClick={() => handleModeClick(() => onOpenOnlineLobby('team'))}
            className="group relative flex flex-col items-center justify-between p-2 rounded-2xl bg-gradient-to-b from-[#ffdb4d] via-[#f59e0b] to-[#b45309] border-2 border-yellow-200 shadow-[0_6px_0_#78350f,0_10px_20px_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-[0_2px_0_#78350f] transition-all cursor-pointer overflow-hidden min-h-[96px] sm:min-h-[112px]"
          >
            <div className="absolute top-0 inset-x-0 h-1/2 bg-white/30 rounded-t-2xl pointer-events-none" />

            <div className="relative mt-0.5 flex items-center justify-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 border-2 border-white shadow-md flex items-center justify-center text-lg sm:text-xl">
                ⚔️
              </div>
            </div>

            <span className="font-black text-xs sm:text-sm text-neutral-950 tracking-wider uppercase mt-1">
              {language === 'hi' ? 'टीम अप' : 'TEAM UP'}
            </span>

            <span className="text-[9px] sm:text-[10px] font-bold text-amber-950 bg-yellow-300/90 px-1.5 py-0.2 rounded-full leading-none">
              🟢 {teamCount.toLocaleString()}
            </span>
          </button>

          {/* 3. FRIENDS */}
          <button
            onClick={() => handleModeClick(onOpenFriends)}
            className="group relative flex flex-col items-center justify-between p-2 rounded-2xl bg-gradient-to-b from-[#ffdb4d] via-[#f59e0b] to-[#b45309] border-2 border-yellow-200 shadow-[0_6px_0_#78350f,0_10px_20px_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-[0_2px_0_#78350f] transition-all cursor-pointer overflow-hidden min-h-[96px] sm:min-h-[112px]"
          >
            <div className="absolute top-0 inset-x-0 h-1/2 bg-white/30 rounded-t-2xl pointer-events-none" />

            <div className="relative mt-0.5 flex items-center justify-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-rose-600 to-pink-400 border-2 border-white shadow-md flex items-center justify-center text-lg sm:text-xl">
                ❤️
              </div>
            </div>

            <span className="font-black text-xs sm:text-sm text-neutral-950 tracking-wider uppercase mt-1">
              {language === 'hi' ? 'दोस्त' : 'FRIENDS'}
            </span>

            <span className="text-[9px] sm:text-[10px] font-bold text-amber-950 bg-yellow-300/90 px-1.5 py-0.2 rounded-full leading-none">
              🟢 {friendsCount.toLocaleString()}
            </span>
          </button>
        </div>

        {/* ============================================================== */}
        {/* ROW 2: 2 WIDE MODE CARDS (VS COMPUTER & PASS N PLAY)          */}
        {/* ============================================================== */}
        <div className="grid grid-cols-2 gap-2 w-full">
          {/* VS COMPUTER */}
          <button
            onClick={() => handleModeClick(() => onStartSolo('bot'))}
            className="group relative flex items-center justify-center gap-2 p-2.5 rounded-2xl bg-gradient-to-b from-[#ffdb4d] via-[#f59e0b] to-[#b45309] border-2 border-yellow-200 shadow-[0_5px_0_#78350f,0_8px_16px_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-[0_1px_0_#78350f] transition-all cursor-pointer overflow-hidden"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-500 border border-white flex items-center justify-center text-white font-black text-xs shadow">
              VS 🤖
            </div>
            <div className="flex flex-col text-left">
              <span className="font-black text-xs sm:text-sm text-neutral-950 uppercase tracking-wide leading-tight">
                {language === 'hi' ? 'कंप्यूटर' : 'COMPUTER'}
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold text-amber-950">
                {language === 'hi' ? 'ऑफ़लाइन बॉट्स' : 'Smart AI Bots'}
              </span>
            </div>
          </button>

          {/* PASS N PLAY */}
          <button
            onClick={() => handleModeClick(onOpenPassNPlaySetup)}
            className="group relative flex items-center justify-center gap-2 p-2.5 rounded-2xl bg-gradient-to-b from-[#ffdb4d] via-[#f59e0b] to-[#b45309] border-2 border-yellow-200 shadow-[0_5px_0_#78350f,0_8px_16px_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-[0_1px_0_#78350f] transition-all cursor-pointer overflow-hidden"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-yellow-400 border border-white flex items-center justify-center text-neutral-950 font-black text-base shadow">
              👥
            </div>
            <div className="flex flex-col text-left">
              <span className="font-black text-xs sm:text-sm text-neutral-950 uppercase tracking-wide leading-tight">
                {language === 'hi' ? 'पास एंड प्ले' : 'PASS N PLAY'}
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold text-amber-950">
                {language === 'hi' ? '1 फ़ोन पर खेलें' : '1 Device Local'}
              </span>
            </div>
          </button>
        </div>

        {/* ============================================================== */}
        {/* ROW 3: TOURNAMENT & 7 UP DOWN MINIGAME                        */}
        {/* ============================================================== */}
        <div className="flex items-center justify-between gap-2 w-full px-1">
          {/* 7 UP DOWN Minigame Cup */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenSevenUpDown();
            }}
            className="flex flex-col items-center cursor-pointer active:scale-95 transition-transform"
            title="Play 7 Up 7 Down Minigame"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-b from-amber-400 via-red-600 to-amber-500 border-2 border-yellow-200 p-0.5 shadow-lg flex items-center justify-center text-lg">
              🎰
            </div>
            <span className="text-[9px] font-black text-yellow-300 mt-0.5">7 UP</span>
          </button>

          {/* Grand TOURNAMENT Banner */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenEvents();
            }}
            className="flex-1 relative flex items-center justify-center py-2 px-3 rounded-2xl bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 border-2 border-yellow-100 shadow-[0_5px_0_#78350f,0_8px_16px_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-[0_1px_0_#78350f] cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">🏆</span>
              <div className="flex flex-col text-center">
                <span className="font-black text-xs sm:text-sm text-neutral-950 tracking-wider uppercase">
                  {language === 'hi' ? 'टूर्नामेंट' : 'TOURNAMENT'}
                </span>
                <span className="text-[8px] sm:text-[9px] font-bold text-amber-950">
                  {language === 'hi' ? 'भव्य प्रतियोगिता 50,000🪙' : 'Win 50,000 Gold Coins'}
                </span>
              </div>
            </div>
          </button>

          {/* Blitz Rush Mode */}
          <button
            onClick={() => handleModeClick(() => onStartSolo('bot'))}
            className="flex flex-col items-center cursor-pointer active:scale-95 transition-transform"
            title="Fast Blitz Round"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-b from-emerald-500 via-teal-600 to-emerald-400 border-2 border-emerald-200 p-0.5 shadow-lg flex items-center justify-center text-lg">
              ⚡
            </div>
            <span className="text-[9px] font-black text-yellow-300 mt-0.5">BLITZ</span>
          </button>
        </div>

        {/* ============================================================== */}
        {/* SEASON PASS / DAILY BONUS CLAIM BUTTON                         */}
        {/* ============================================================== */}
        <div className="w-full flex items-center justify-center px-1">
          <button
            onClick={handleClaimSeason}
            disabled={claimedDaily}
            className={`w-full max-w-sm relative flex items-center justify-between px-4 py-2 sm:py-2.5 rounded-2xl border-2 transition-all cursor-pointer ${
              claimedDaily
                ? 'bg-neutral-800/80 border-neutral-600 opacity-70 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500 border-yellow-100 shadow-[0_5px_0_#92400e,0_8px_20px_rgba(245,158,11,0.5)] active:translate-y-1 active:shadow-[0_1px_0_#92400e]'
            }`}
          >
            <div className="bg-purple-800 text-yellow-300 border border-purple-400 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow">
              SEASON 27
            </div>

            <div className="flex items-center gap-1.5">
              <Sparkles size={16} className={claimedDaily ? 'text-neutral-400' : 'text-neutral-950 animate-spin'} />
              <span className="font-black text-xs sm:text-sm text-neutral-950 tracking-wider uppercase">
                {claimedDaily
                  ? language === 'hi'
                    ? 'प्राप्त हुआ ✓'
                    : 'CLAIMED ✓'
                  : language === 'hi'
                  ? 'मुफ़्त 500 कॉइन्स क्लेम करें'
                  : 'CLAIM 500 COINS'}
              </span>
            </div>

            <span className="text-xl">🪙</span>
          </button>
        </div>

        {/* Bottom Floating Ad & Lucky Spin Wheel */}
        <div className="w-full flex items-center justify-between px-2 pt-0.5">
          {/* Free Video Ad / 1000 Coins */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenRewardVideo();
            }}
            className="flex items-center gap-1.5 bg-black/60 border border-amber-400/60 rounded-xl px-2.5 py-1 text-white text-[10px] sm:text-xs font-bold cursor-pointer hover:bg-black/80 active:scale-95 transition-transform"
          >
            <Tv size={14} className="text-amber-400" />
            <span>{language === 'hi' ? 'फ्री वीडियो: +1000🪙' : 'Free Ad: +1000🪙'}</span>
          </button>

          {/* Rotating Lucky Spin Wheel Icon */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenSpin();
            }}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-yellow-400 border border-white text-neutral-950 rounded-xl px-3 py-1 font-black text-[11px] sm:text-xs shadow-lg cursor-pointer animate-pulse active:scale-95 transition-transform"
          >
            <div className="w-5 h-5 rounded-full border-2 border-neutral-950 flex items-center justify-center animate-spin text-[10px]">
              🎡
            </div>
            <span>{language === 'hi' ? 'स्पिन व्हील' : 'LUCKY SPIN'}</span>
          </button>
        </div>
      </main>

      {/* ============================================================== */}
      {/* BOTTOM NAVIGATION BAR (HOME, EVENT, ADDA, INVENTORY, SOCIAL)   */}
      {/* ============================================================== */}
      <nav className="relative z-20 w-full bg-[#021847] border-t-2 border-cyan-400/40 px-2 py-1 flex items-center justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.6)]">
        {/* 1. HOME */}
        <button
          onClick={() => {
            sounds.playClick();
            setActiveTab('home');
          }}
          className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === 'home'
              ? 'text-yellow-300 font-black scale-105'
              : 'text-neutral-400 hover:text-white font-medium'
          }`}
        >
          <div
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
              activeTab === 'home'
                ? 'bg-yellow-400 text-neutral-950 shadow-[0_0_12px_rgba(245,158,11,0.8)]'
                : 'text-neutral-300'
            }`}
          >
            <Home size={18} />
          </div>
          <span className="text-[10px] sm:text-[11px] mt-0.5">
            {language === 'hi' ? 'होम' : 'HOME'}
          </span>
        </button>

        {/* 2. EVENT */}
        <button
          onClick={() => {
            sounds.playClick();
            setActiveTab('event');
            onOpenEvents();
          }}
          className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === 'event'
              ? 'text-yellow-300 font-black scale-105'
              : 'text-neutral-400 hover:text-white font-medium'
          }`}
        >
          <div
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
              activeTab === 'event'
                ? 'bg-yellow-400 text-neutral-950 shadow-[0_0_12px_rgba(245,158,11,0.8)]'
                : 'text-neutral-300'
            }`}
          >
            <Calendar size={18} />
          </div>
          <span className="text-[10px] sm:text-[11px] mt-0.5">
            {language === 'hi' ? 'इवेंट' : 'EVENT'}
          </span>
        </button>

        {/* 3. ADDA (Voice / Club) */}
        <button
          onClick={() => {
            sounds.playClick();
            setActiveTab('adda');
            onOpenAdda();
          }}
          className={`relative flex flex-col items-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === 'adda'
              ? 'text-yellow-300 font-black scale-105'
              : 'text-neutral-400 hover:text-white font-medium'
          }`}
        >
          <span className="absolute -top-1 right-1 bg-red-600 text-white font-black text-[7px] px-1 rounded-full border border-white animate-bounce">
            NEW
          </span>
          <div
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
              activeTab === 'adda'
                ? 'bg-yellow-400 text-neutral-950 shadow-[0_0_12px_rgba(245,158,11,0.8)]'
                : 'text-neutral-300'
            }`}
          >
            <Mic size={18} />
          </div>
          <span className="text-[10px] sm:text-[11px] mt-0.5">
            {language === 'hi' ? 'अड्डा' : 'ADDA'}
          </span>
        </button>

        {/* 4. INVENTORY */}
        <button
          onClick={() => {
            sounds.playClick();
            setActiveTab('inventory');
            onOpenInventory();
          }}
          className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === 'inventory'
              ? 'text-yellow-300 font-black scale-105'
              : 'text-neutral-400 hover:text-white font-medium'
          }`}
        >
          <div
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
              activeTab === 'inventory'
                ? 'bg-yellow-400 text-neutral-950 shadow-[0_0_12px_rgba(245,158,11,0.8)]'
                : 'text-neutral-300'
            }`}
          >
            <Briefcase size={18} />
          </div>
          <span className="text-[10px] sm:text-[11px] mt-0.5">
            {language === 'hi' ? 'कलेक्शन' : 'INVENTORY'}
          </span>
        </button>

        {/* 5. SOCIAL / CAREER */}
        <button
          onClick={() => {
            sounds.playClick();
            setActiveTab('social');
            onOpenCareer();
          }}
          className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === 'social'
              ? 'text-yellow-300 font-black scale-105'
              : 'text-neutral-400 hover:text-white font-medium'
          }`}
        >
          <div
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
              activeTab === 'social'
                ? 'bg-yellow-400 text-neutral-950 shadow-[0_0_12px_rgba(245,158,11,0.8)]'
                : 'text-neutral-300'
            }`}
          >
            <MessageCircle size={18} />
          </div>
          <span className="text-[10px] sm:text-[11px] mt-0.5">
            {language === 'hi' ? 'सोशल' : 'SOCIAL'}
          </span>
        </button>
      </nav>
    </div>
  );
};
