import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Radio,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Volume1,
  MessageCircle,
} from 'lucide-react';
import { VoicePhraseEvent } from '../hooks/useVoiceChat';
import { Language } from '../types/game';

interface VoiceChatHUDProps {
  isMicOn: boolean;
  isDeafened: boolean;
  myVolume: number;
  isSpeaking: boolean;
  micPermission: 'idle' | 'requesting' | 'granted' | 'denied' | 'unsupported';
  onToggleMic: () => void;
  onToggleDeafened: () => void;
  onSendVoicePhrase: (key: string, text: string) => void;
  recentPhrase: VoicePhraseEvent | null;
  speakingPeers: Record<string, boolean>;
  onlinePlayersCount?: number;
  language: Language;
}

export const VoiceChatHUD: React.FC<VoiceChatHUDProps> = ({
  isMicOn,
  isDeafened,
  myVolume,
  isSpeaking,
  micPermission,
  onToggleMic,
  onToggleDeafened,
  onSendVoicePhrase,
  recentPhrase,
  speakingPeers,
  onlinePlayersCount = 1,
  language,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const VOICE_PHRASES = [
    { key: 'hurry', label: language === 'hi' ? 'जल्दी चलो! ⚡' : 'Hurry up! ⚡', text: language === 'hi' ? 'चलो भाई, जल्दी चाल चलो!' : 'Hurry up, make your move!' },
    { key: 'great', label: language === 'hi' ? 'वाह! 🔥' : 'Great! 🔥', text: language === 'hi' ? 'वाह क्या बात है, शानदार चाल!' : 'Wow, great move!' },
    { key: 'trapped', label: language === 'hi' ? 'अरे यार! 😅' : 'Oh no! 😅', text: language === 'hi' ? 'अरे यार, फंस गए!' : 'Oh no, I am trapped!' },
    { key: 'five', label: language === 'hi' ? '५♥ खोलो! 🔒' : 'Open 5♥! 🔒', text: language === 'hi' ? 'पान का पंजा ५♥ निकालो!' : 'Play the Five of Hearts!' },
    { key: 'king', label: language === 'hi' ? 'बादाम किंग! 👑' : 'Badam King! 👑', text: language === 'hi' ? 'बादाम छक्का किंग!' : 'Badam Chhakka King!' },
    { key: 'pass', label: language === 'hi' ? 'पास! 🔄' : 'Pass! 🔄', text: language === 'hi' ? 'मेरे पास कोई कार्ड नहीं है, पास!' : 'No card to play, pass!' },
  ];

  const hasSpeakingPeers = Object.values(speakingPeers).some(Boolean);

  return (
    <div className="fixed bottom-3 left-3 z-40 flex flex-col items-start font-sans select-none">
      {/* Active Speaker Bubble */}
      {recentPhrase && (
        <div className="mb-2 max-w-xs bg-black/90 border border-amber-400 text-white rounded-2xl px-3 py-1.5 shadow-[0_0_20px_rgba(245,158,11,0.5)] flex items-center gap-2 animate-bounce">
          <span className="text-lg">{recentPhrase.senderAvatar || '👑'}</span>
          <div className="flex flex-col text-left">
            <span className="text-[10px] text-amber-300 font-bold">{recentPhrase.senderName}</span>
            <span className="text-xs font-black text-white">{recentPhrase.text}</span>
          </div>
        </div>
      )}

      {/* Expanded Voice Controls & Soundboard Drawer */}
      {isExpanded && (
        <div className="mb-2 w-72 sm:w-80 bg-neutral-950/95 border-2 border-amber-500/50 rounded-3xl p-3 shadow-[0_0_30px_rgba(0,0,0,0.8)] backdrop-blur-md flex flex-col gap-2.5 animate-in slide-in-from-bottom-3 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-yellow-400 text-neutral-950 flex items-center justify-center font-black">
                <Mic size={15} />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase text-amber-300 tracking-wider">
                  {language === 'hi' ? 'लाइव वॉइस चैट' : 'LIVE VOICE CHAT'}
                </h4>
                <p className="text-[9px] text-neutral-400">
                  {isMicOn
                    ? language === 'hi' ? 'माइक चालू है • आवाज़ प्रसारित हो रही है' : 'Mic is Live • Broadcasting audio'
                    : language === 'hi' ? 'माइक बंद है • बोलने के लिए अनम्यूट करें' : 'Mic Muted • Unmute to talk'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 rounded-full text-neutral-400 hover:text-white cursor-pointer"
            >
              <ChevronDown size={18} />
            </button>
          </div>

          {/* Mic Status & Live VU Meter */}
          <div className="flex items-center justify-between bg-black/60 p-2 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2">
              <button
                onClick={onToggleMic}
                className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center shadow-lg transition-transform active:scale-90 cursor-pointer ${
                  isMicOn
                    ? isSpeaking
                      ? 'bg-emerald-500 border-white text-neutral-950 animate-pulse shadow-[0_0_20px_rgba(16,185,129,0.8)]'
                      : 'bg-emerald-600 border-emerald-300 text-white'
                    : 'bg-rose-600 border-white text-white'
                }`}
                title={isMicOn ? 'Mute Mic' : 'Unmute Mic'}
              >
                {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
              </button>

              <div className="flex flex-col">
                <span className="text-xs font-black text-white">
                  {isMicOn
                    ? language === 'hi' ? 'माइक चालू (Live)' : 'Microphone ON'
                    : language === 'hi' ? 'माइक म्यूट (Muted)' : 'Microphone OFF'}
                </span>
                {/* Live Volume Meter Bar */}
                {isMicOn && (
                  <div className="w-24 bg-neutral-800 h-1.5 rounded-full overflow-hidden mt-1 border border-white/20">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-amber-300 transition-all duration-75"
                      style={{ width: `${Math.min(100, myVolume * 1.5)}%` }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Deafen Button */}
            <button
              onClick={onToggleDeafened}
              className={`p-2 rounded-xl border flex items-center gap-1 text-[11px] font-bold transition-all cursor-pointer ${
                isDeafened
                  ? 'bg-red-950 border-red-500 text-red-300'
                  : 'bg-black/40 border-white/15 text-neutral-300 hover:text-white'
              }`}
              title={isDeafened ? 'Unmute Incoming Voice' : 'Deafen All'}
            >
              {isDeafened ? <VolumeX size={15} /> : <Volume2 size={15} />}
              <span>{isDeafened ? 'DEAFEN' : 'AUDIO ON'}</span>
            </button>
          </div>

          {/* Mic Permission Warning */}
          {micPermission === 'denied' && (
            <div className="bg-red-900/80 border border-red-500 p-2 rounded-xl text-[10px] text-red-200">
              ⚠️ {language === 'hi' ? 'माइक अनुमति अस्वीकृत है। ब्राउज़र सेटिंग में अनुमति दें।' : 'Microphone permission blocked. Please allow mic in browser settings.'}
            </div>
          )}

          {/* Quick Voice Phrases / Emojis Soundboard */}
          <div>
            <div className="flex items-center justify-between text-[10px] font-bold text-amber-300 mb-1.5">
              <span>{language === 'hi' ? 'वॉइस इमोट्स व ताने (बोलें):' : 'Instant Voice Lines (Tap to Speak):'}</span>
              <span className="text-[9px] text-neutral-400">Audio Synth</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {VOICE_PHRASES.map((vp) => (
                <button
                  key={vp.key}
                  onClick={() => onSendVoicePhrase(vp.key, vp.text)}
                  className="px-2 py-1.5 rounded-xl bg-white/5 hover:bg-amber-400 hover:text-neutral-950 text-neutral-200 border border-white/10 text-xs font-bold text-left transition-all active:scale-95 cursor-pointer truncate shadow-sm flex items-center gap-1.5"
                >
                  <Radio size={11} className="text-amber-400 shrink-0" />
                  <span className="truncate">{vp.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Floating Compact Dock Button */}
      <div className="flex items-center gap-1.5 bg-[#0a1e47]/95 border-2 border-amber-400/80 rounded-full p-1 shadow-[0_4px_20px_rgba(0,0,0,0.6)] backdrop-blur-md">
        {/* Main Mic Toggle Button */}
        <button
          onClick={onToggleMic}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            isMicOn
              ? isSpeaking
                ? 'bg-emerald-500 text-neutral-950 shadow-[0_0_15px_rgba(16,185,129,0.9)] animate-pulse'
                : 'bg-emerald-600 text-white'
              : 'bg-rose-600 text-white'
          }`}
          title={isMicOn ? 'Mic ON (Tap to Mute)' : 'Mic OFF (Tap to Unmute)'}
        >
          {isMicOn ? <Mic size={17} /> : <MicOff size={17} />}
        </button>

        {/* Live Audio Activity Waves / Indicator */}
        <div
          onClick={() => setIsExpanded((e) => !e)}
          className="flex items-center gap-1.5 px-2 cursor-pointer"
        >
          <div className="flex items-center gap-0.5">
            <span
              className={`w-1 rounded-full transition-all duration-75 ${
                isSpeaking || hasSpeakingPeers
                  ? 'h-4 bg-emerald-400 animate-pulse'
                  : 'h-1.5 bg-neutral-500'
              }`}
            />
            <span
              className={`w-1 rounded-full transition-all duration-75 ${
                isSpeaking || hasSpeakingPeers
                  ? 'h-5 bg-emerald-300 animate-bounce'
                  : 'h-2 bg-neutral-500'
              }`}
            />
            <span
              className={`w-1 rounded-full transition-all duration-75 ${
                isSpeaking || hasSpeakingPeers
                  ? 'h-3 bg-emerald-400 animate-pulse'
                  : 'h-1 bg-neutral-500'
              }`}
            />
          </div>

          <span className="text-[11px] font-black uppercase text-amber-300">
            {language === 'hi' ? 'वॉइस' : 'VOICE'}
          </span>

          {isExpanded ? <ChevronDown size={14} className="text-amber-300" /> : <ChevronUp size={14} className="text-amber-300" />}
        </div>
      </div>
    </div>
  );
};
