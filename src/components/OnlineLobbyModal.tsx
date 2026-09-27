import React, { useState } from 'react';
import { Language } from '../types/game';
import { GlobalStats, OnlineRoomData, PublicRoomItem, GAME_SERVER_API_URL } from '../hooks/useOnlineGame';
import { TRANSLATIONS } from '../utils/translations';
import {
  Globe,
  Users,
  Copy,
  Check,
  Play,
  LogOut,
  X,
  Crown,
  Bot,
  User,
  Share2,
  Sparkles,
  AlertCircle,
  Zap,
  MessageCircle,
  Send,
  RefreshCw,
  Lock,
} from 'lucide-react';

interface OnlineLobbyModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: OnlineRoomData | null;
  myPlayerId: string | null;
  globalStats: GlobalStats;
  onQuickMatch: (playerName: string, avatar: string, country: string) => void;
  onCreateRoom: (playerName: string, isPublic: boolean, avatar: string, country: string) => void;
  onJoinRoom: (roomCode: string, playerName: string, avatar: string, country: string) => void;
  onRefreshStats: () => void;
  onStartGame: () => void;
  onLeaveRoom: () => void;
  language: Language;
  error: string | null;
  connecting: boolean;
}

const AVATARS = ['👑', '🐯', '🦁', '🦅', '🚀', '💎', '⚡', '🎯'];
const COUNTRIES = [
  { flag: '🇮🇳', name: 'India' },
  { flag: '🌐', name: 'Global' },
  { flag: '🇦🇪', name: 'UAE' },
  { flag: '🇸🇦', name: 'Saudi Arabia' },
  { flag: '🇺🇸', name: 'USA' },
  { flag: '🇬🇧', name: 'UK' },
  { flag: '🇨🇦', name: 'Canada' },
  { flag: '🇸🇬', name: 'Singapore' },
];

export const OnlineLobbyModal: React.FC<OnlineLobbyModalProps> = ({
  isOpen,
  onClose,
  room,
  myPlayerId,
  globalStats,
  onQuickMatch,
  onCreateRoom,
  onJoinRoom,
  onRefreshStats,
  onStartGame,
  onLeaveRoom,
  language,
  error,
  connecting,
}) => {
  const t = TRANSLATIONS[language];
  const [activeTab, setActiveTab] = useState<'quick' | 'create' | 'join' | 'browse'>('quick');
  const [playerName, setPlayerName] = useState(
    localStorage.getItem('badam_player_name') || (language === 'hi' ? 'खिलाड़ी १' : 'Player 1')
  );
  const [selectedAvatar, setSelectedAvatar] = useState(
    localStorage.getItem('badam_player_avatar') || '👑'
  );
  const [selectedCountry, setSelectedCountry] = useState(
    localStorage.getItem('badam_player_country') || '🇮🇳'
  );
  const [joinCode, setJoinCode] = useState('');
  const [isPublicRoom, setIsPublicRoom] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const isHost = room?.hostId === myPlayerId;
  const inviteUrl = room ? `${window.location.origin}${window.location.pathname}?room=${room.code}` : '';

  const saveProfile = () => {
    localStorage.setItem('badam_player_name', playerName.trim());
    localStorage.setItem('badam_player_avatar', selectedAvatar);
    localStorage.setItem('badam_player_country', selectedCountry);
  };

  const handleQuickMatch = () => {
    if (!playerName.trim()) return;
    saveProfile();
    onQuickMatch(playerName.trim(), selectedAvatar, selectedCountry);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;
    saveProfile();
    onCreateRoom(playerName.trim(), isPublicRoom, selectedAvatar, selectedCountry);
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || !joinCode.trim()) return;
    saveProfile();
    onJoinRoom(joinCode.trim().toUpperCase(), playerName.trim(), selectedAvatar, selectedCountry);
  };

  const handleJoinDirect = (code: string) => {
    if (!playerName.trim()) return;
    saveProfile();
    onJoinRoom(code, playerName.trim(), selectedAvatar, selectedCountry);
  };

  const handleCopyCode = () => {
    if (!room) return;
    navigator.clipboard.writeText(room.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    if (!inviteUrl) return;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // WhatsApp share
  const handleShareWhatsApp = () => {
    if (!room) return;
    const text = encodeURIComponent(
      `🃏 Badam Chhakka / Badam Saat (Indian Sevens)!\nRoom Code: ${room.code}\nJoin and play now: ${inviteUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  // Native Web Share Sheet
  const handleNativeShare = async () => {
    if (!room) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Badam Chhakka - Play With Friends',
          text: `Join my Badam Chhakka card table! Room Code: ${room.code}`,
          url: inviteUrl,
        });
      } catch {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-neutral-900 via-neutral-900 to-neutral-950 border-2 border-amber-400/80 rounded-3xl p-4 sm:p-6 max-w-lg w-full text-left shadow-[0_0_60px_rgba(0,0,0,0.9),0_0_20px_rgba(245,158,11,0.2)] overflow-y-auto max-h-[92vh]">
        {/* Modal Header & Global Status Counter */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-200 text-neutral-950 flex items-center justify-center shadow-lg ring-2 ring-amber-400/40">
              <Globe size={22} className="animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>{language === 'hi' ? 'विश्वव्यापी ऑनलाइन मल्टीप्लेयर' : 'World Online Multiplayer'}</span>
              </h2>
              <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>
                  {globalStats.onlinePlayers} {language === 'hi' ? 'खिलाड़ी विश्व स्तर पर ऑनलाइन' : 'Players Online Worldwide'}
                </span>
                <span>·</span>
                <span className="text-neutral-400">
                  {globalStats.activeRooms} {language === 'hi' ? 'सक्रिय टेबल' : 'Active Tables'}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-3 p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2 animate-shake">
            <AlertCircle size={16} className="text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* VIEW A: In Lobby Room */}
        {room && room.status === 'lobby' ? (
          <div className="space-y-4">
            {/* Room Code Showcase */}
            <div className="bg-black/60 border border-amber-500/40 rounded-2xl p-4 text-center shadow-inner relative overflow-hidden">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-1 bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                <Globe size={12} />
                <span>{room.isPublic ? (language === 'hi' ? 'पब्लिक वर्ल्ड रूम' : 'Public World Room') : (language === 'hi' ? 'प्राइवेट फ्रेंड्स रूम' : 'Private Friends Room')}</span>
              </div>

              <div className="text-4xl sm:text-5xl font-mono font-black text-amber-300 tracking-widest my-2 select-all drop-shadow-[0_0_12px_rgba(245,158,11,0.4)]">
                {room.code}
              </div>

              {/* Instant Social Share Buttons for Friends Worldwide */}
              <div className="flex items-center justify-center gap-2 flex-wrap mt-3">
                <button
                  onClick={handleShareWhatsApp}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#25D366] text-white hover:bg-[#20ba59] transition-all cursor-pointer shadow-md"
                  title="Share to WhatsApp"
                >
                  <MessageCircle size={15} />
                  <span>WhatsApp</span>
                </button>

                <button
                  onClick={handleNativeShare}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-400 text-neutral-950 hover:bg-amber-300 transition-all cursor-pointer shadow-md"
                >
                  <Share2 size={14} />
                  <span>{language === 'hi' ? 'शेयर आमंत्रण' : 'Share Invite'}</span>
                </button>

                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-white/10 hover:bg-white/20 text-neutral-200 transition-all cursor-pointer border border-white/15"
                >
                  {copiedCode ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{copiedCode ? (language === 'hi' ? 'कॉपी!' : 'Copied!') : (language === 'hi' ? 'कोड' : 'Code')}</span>
                </button>
              </div>

              {/* Worldwide Friends Note */}
              <p className="mt-3 pt-2.5 border-t border-white/10 text-[11px] text-neutral-400 leading-relaxed text-center">
                🌍 {language === 'hi'
                  ? 'आपके दोस्त किसी भी देश या Wi-Fi से इस कोड या लिंक का उपयोग करके टेबल में तुरंत शामिल हो सकते हैं।'
                  : 'Friends from anywhere in the world or on your Wi-Fi can join instantly using this code.'}
              </p>
            </div>

            {/* Players in Lobby (4 Seats) */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-neutral-300 mb-2">
                <span>{language === 'hi' ? 'टेबल के स्थान (४ खिलाड़ी)' : 'Table Seats (4 Players)'}</span>
                <span className="text-amber-400 font-mono">{room.players.length} / 4</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[0, 1, 2, 3].map((seatIdx) => {
                  const player = room.players[seatIdx];
                  if (player) {
                    const isMe = player.id === myPlayerId;
                    return (
                      <div
                        key={player.id}
                        className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${
                          isMe
                            ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-1 ring-amber-400/40'
                            : 'bg-black/50 border-white/10 text-neutral-200'
                        }`}
                      >
                        <div className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center text-lg relative shrink-0 border border-white/10">
                          <span>{player.avatar || '👤'}</span>
                          <span className="absolute -bottom-1 -right-1 text-xs">
                            {player.country || '🇮🇳'}
                          </span>
                        </div>
                        <div className="overflow-hidden">
                          <div className="text-xs font-bold truncate flex items-center gap-1">
                            <span>{player.name}</span>
                            {player.isHost && <Crown size={12} className="text-amber-400 shrink-0" />}
                          </div>
                          <div className="text-[10px] text-emerald-400 font-medium">
                            {isMe ? (language === 'hi' ? 'आप (Ready)' : 'You (Ready)') : (language === 'hi' ? 'तैयार हैं' : 'Ready')}
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // Empty Slot (auto-filled by Smart Bot if started)
                  return (
                    <div
                      key={`empty-${seatIdx}`}
                      className="p-2.5 rounded-xl border border-dashed border-white/15 bg-white/[0.02] flex items-center gap-2.5 opacity-75"
                    >
                      <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center shrink-0 text-neutral-500">
                        <Bot size={17} />
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-xs font-medium text-neutral-400 truncate">
                          {language === 'hi' ? `स्थान ${seatIdx + 1}: खाली` : `Seat ${seatIdx + 1}: Empty`}
                        </div>
                        <div className="text-[10px] text-neutral-500">
                          {language === 'hi' ? 'स्मार्ट बॉट से भरा जाएगा' : 'Filled by Smart Bot'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                onClick={onLeaveRoom}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors cursor-pointer border border-white/10"
              >
                <LogOut size={14} />
                <span>{language === 'hi' ? 'टेबल छोड़ें' : 'Leave Table'}</span>
              </button>

              {isHost ? (
                <button
                  onClick={onStartGame}
                  className="flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-bold text-neutral-950 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-300 hover:from-amber-300 hover:to-yellow-200 rounded-xl shadow-lg transition-transform active:scale-95 cursor-pointer"
                >
                  <Play size={16} fill="currentColor" />
                  <span>{language === 'hi' ? 'खेल शुरू करें' : 'Start Game'}</span>
                </button>
              ) : (
                <div className="text-xs text-amber-300 flex items-center gap-1.5 font-medium animate-pulse">
                  <Sparkles size={14} />
                  <span>{language === 'hi' ? 'होस्ट द्वारा खेल शुरू करने की प्रतीक्षा...' : 'Waiting for host to start...'}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* VIEW B: World Modes (Quick Match, Create Room, Join Room, Browse Tables) */
          <div>
            {/* Player Identity Setup (Name, Avatar, Country Flag) */}
            <div className="bg-black/40 border border-white/10 rounded-2xl p-3 mb-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-300">
                  {language === 'hi' ? 'आपका प्रोफाइल' : 'Your Global Profile'}
                </span>
                <span className="text-[11px] text-amber-400 font-mono">
                  {selectedAvatar} {selectedCountry}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  maxLength={18}
                  placeholder={language === 'hi' ? 'आपका नाम' : 'Your Name'}
                  className="flex-1 px-3 py-1.5 rounded-xl bg-black/50 border border-white/15 text-xs sm:text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-amber-400 font-semibold"
                />

                {/* Country Flag Selector */}
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="px-2 py-1.5 rounded-xl bg-black/60 border border-white/15 text-xs text-neutral-200 focus:outline-none focus:border-amber-400 cursor-pointer"
                  title="Select Country"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.flag} value={c.flag}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Avatar Selector Icons */}
              <div className="flex items-center justify-between gap-1 pt-1 overflow-x-auto scrollbar-none">
                {AVATARS.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => setSelectedAvatar(av)}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-sm sm:text-base transition-transform cursor-pointer ${
                      selectedAvatar === av
                        ? 'bg-amber-400 text-neutral-950 scale-110 shadow ring-2 ring-white'
                        : 'bg-white/5 hover:bg-white/15 text-neutral-300'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-black/50 rounded-xl border border-white/10 mb-3.5 text-[11px] font-bold">
              <button
                onClick={() => setActiveTab('quick')}
                className={`py-1.5 rounded-lg transition-colors cursor-pointer text-center flex items-center justify-center gap-1 ${
                  activeTab === 'quick'
                    ? 'bg-amber-400 text-neutral-950 shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Zap size={12} />
                <span>{language === 'hi' ? 'क्विक मैच' : 'Quick'}</span>
              </button>
              <button
                onClick={() => setActiveTab('create')}
                className={`py-1.5 rounded-lg transition-colors cursor-pointer text-center ${
                  activeTab === 'create'
                    ? 'bg-amber-400 text-neutral-950 shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {language === 'hi' ? 'नया कमरा' : 'Create'}
              </button>
              <button
                onClick={() => setActiveTab('join')}
                className={`py-1.5 rounded-lg transition-colors cursor-pointer text-center ${
                  activeTab === 'join'
                    ? 'bg-amber-400 text-neutral-950 shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {language === 'hi' ? 'कोड से' : 'Code'}
              </button>
              <button
                onClick={() => {
                  setActiveTab('browse');
                  onRefreshStats();
                }}
                className={`py-1.5 rounded-lg transition-colors cursor-pointer text-center flex items-center justify-center gap-1 ${
                  activeTab === 'browse'
                    ? 'bg-amber-400 text-neutral-950 shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Globe size={12} />
                <span>{language === 'hi' ? 'टेबल्स' : 'Tables'}</span>
              </button>
            </div>

            {/* TAB 1: World Quick Match */}
            {activeTab === 'quick' && (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/40 via-black/50 to-neutral-950 border border-amber-500/40 text-center">
                  <div className="w-12 h-12 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center mx-auto mb-2 ring-2 ring-amber-400/30">
                    <Zap size={24} />
                  </div>
                  <h3 className="font-bold text-sm text-white mb-1">
                    {language === 'hi' ? 'विश्व स्तर पर किसी के साथ खेलें' : 'Play Anyone Worldwide'}
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed mb-3">
                    {language === 'hi'
                      ? 'एक क्लिक में इंटरनेट पर ऑनलाइन उपलब्ध किसी भी खिलाड़ी के साथ मैचिंग शुरू करें।'
                      : 'Instantly connect with other players online across the globe for a 4-player game.'}
                  </p>

                  <button
                    onClick={handleQuickMatch}
                    disabled={connecting || !playerName.trim()}
                    className="w-full py-3 rounded-xl font-black text-neutral-950 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-300 hover:from-amber-300 hover:to-yellow-200 transition-all text-xs sm:text-sm shadow-xl active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Globe size={16} />
                    <span>
                      {connecting
                        ? (language === 'hi' ? 'मैच खोज रहे हैं...' : 'Finding Match...')
                        : (language === 'hi' ? 'क्विक मैच शुरू करें' : 'Start World Quick Match')}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: Create Custom Room */}
            {activeTab === 'create' && (
              <form onSubmit={handleCreate} className="space-y-3">
                <div className="flex items-center justify-between p-2.5 bg-black/40 rounded-xl border border-white/10 text-xs">
                  <div>
                    <div className="font-bold text-neutral-200">
                      {language === 'hi' ? 'पब्लिक टेबल (सभी के लिए दृश्य)' : 'Public Table (Visible to World)'}
                    </div>
                    <div className="text-[11px] text-neutral-400">
                      {isPublicRoom
                        ? (language === 'hi' ? 'दुनिया का कोई भी खिलाड़ी शामिल हो सकता है' : 'Anyone online can join')
                        : (language === 'hi' ? 'केवल वे जिनके पास कोड है शामिल हो सकते हैं' : 'Only people with code can join')}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPublicRoom(!isPublicRoom)}
                    className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer ${
                      isPublicRoom ? 'bg-amber-400' : 'bg-neutral-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-neutral-950 transition-transform ${
                        isPublicRoom ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={connecting || !playerName.trim()}
                  className="w-full py-2.5 rounded-xl font-bold text-neutral-950 bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 transition-all text-xs sm:text-sm shadow-lg disabled:opacity-50 cursor-pointer"
                >
                  {connecting
                    ? (language === 'hi' ? 'कमरा बन रहा है...' : 'Creating...')
                    : (language === 'hi' ? 'कमरा बनाएँ' : 'Create Room')}
                </button>
              </form>
            )}

            {/* TAB 3: Join via Room Code */}
            {activeTab === 'join' && (
              <form onSubmit={handleJoin} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    {language === 'hi' ? 'कमरा कोड (४ अक्षर)' : 'Room Code (4 Letters)'}
                  </label>
                  <input
                    type="text"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    maxLength={6}
                    required
                    placeholder="e.g. BC79"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-lg font-mono font-bold tracking-widest text-amber-300 placeholder:text-neutral-600 focus:outline-none focus:border-amber-400 uppercase text-center"
                  />
                </div>

                <button
                  type="submit"
                  disabled={connecting || !joinCode.trim() || !playerName.trim()}
                  className="w-full py-2.5 rounded-xl font-bold text-neutral-950 bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 transition-all text-xs sm:text-sm shadow-lg disabled:opacity-50 cursor-pointer"
                >
                  {connecting
                    ? (language === 'hi' ? 'जुड़ रहे हैं...' : 'Joining...')
                    : (language === 'hi' ? 'कमरे में शामिल हों' : 'Join Room')}
                </button>
              </form>
            )}

            {/* TAB 4: Browse Public Tables */}
            {activeTab === 'browse' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                  <span>{language === 'hi' ? 'सक्रिय वर्ल्ड टेबल्स' : 'Active World Tables'}</span>
                  <button
                    onClick={onRefreshStats}
                    className="flex items-center gap-1 text-amber-400 hover:text-amber-300 cursor-pointer"
                  >
                    <RefreshCw size={12} />
                    <span>{language === 'hi' ? 'ताज़ा करें' : 'Refresh'}</span>
                  </button>
                </div>

                {globalStats.publicRooms.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-black/40 border border-white/10 text-center text-xs text-neutral-400 space-y-2">
                    <p>{language === 'hi' ? 'वर्तमान में कोई सार्वजनिक टेबल प्रतीक्षारत नहीं है।' : 'No public tables currently waiting.'}</p>
                    <button
                      onClick={() => setActiveTab('create')}
                      className="px-4 py-1.5 rounded-xl bg-amber-400 text-neutral-950 font-bold text-xs hover:bg-amber-300 cursor-pointer"
                    >
                      {language === 'hi' ? 'पहली टेबल बनाएँ' : 'Create the First Table'}
                    </button>
                  </div>
                ) : (
                  <div className="max-h-48 overflow-y-auto space-y-1.5">
                    {globalStats.publicRooms.map((table) => (
                      <div
                        key={table.code}
                        className="p-2.5 rounded-xl bg-black/50 border border-white/10 flex items-center justify-between hover:border-amber-400/50 transition-colors"
                      >
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            <span className="font-mono text-amber-300">{table.code}</span>
                            <span className="text-neutral-400 font-normal">by {table.hostName}</span>
                          </div>
                          <div className="text-[10px] text-neutral-400">
                            {table.playerCount} / 4 {language === 'hi' ? 'खिलाड़ी' : 'Players'}
                          </div>
                        </div>

                        <button
                          onClick={() => handleJoinDirect(table.code)}
                          className="px-3 py-1 text-xs font-bold bg-amber-400 text-neutral-950 hover:bg-amber-300 rounded-lg shadow cursor-pointer transition-transform active:scale-95"
                        >
                          {language === 'hi' ? 'जुड़ें' : 'Join'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Server Endpoint Indicator */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-neutral-400 font-mono">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Server:</span>
          </span>
          <span className="text-amber-300 truncate max-w-[240px]" title={GAME_SERVER_API_URL}>
            {GAME_SERVER_API_URL}
          </span>
        </div>
      </div>
    </div>
  );
};
