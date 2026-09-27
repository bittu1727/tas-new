import React, { useState } from 'react';
import { Language } from '../types/game';
import { ChatMessage } from '../hooks/useOnlineGame';
import { MessageSquare, Send, X } from 'lucide-react';

interface OnlineChatWidgetProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  language: Language;
}

export const OnlineChatWidget: React.FC<OnlineChatWidgetProps> = ({
  messages,
  onSendMessage,
  language,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');

  const QUICK_REACTIONS = [
    language === 'hi' ? 'बादाम छक्का! ♠️' : 'Badam Chhakka! ♠️',
    language === 'hi' ? 'पास! 🔄' : 'Pass! 🔄',
    language === 'hi' ? 'शानदार चाल! 🔥' : 'Great move! 🔥',
    language === 'hi' ? 'फंस गए! 😂' : 'Trapped! 😂',
    language === 'hi' ? '५♥ निकालो! 🔒' : 'Show 5♥! 🔒',
    '👑',
    '👍',
    '🎉',
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleQuickReaction = (text: string) => {
    onSendMessage(text);
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end">
      {/* Expanded Chat Drawer */}
      {isOpen && (
        <div className="mb-2 w-72 sm:w-80 bg-neutral-950/95 border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md flex flex-col animate-in slide-in-from-bottom-3 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 bg-white/5">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <MessageSquare size={13} />
              <span>{language === 'hi' ? 'टेबल चैट' : 'Table Chat'}</span>
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-neutral-400 hover:text-white p-1 rounded-full cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>

          {/* Messages Log */}
          <div className="p-2.5 max-h-48 overflow-y-auto space-y-1.5 text-xs">
            {messages.length === 0 ? (
              <div className="text-center text-neutral-500 py-4 text-[11px]">
                {language === 'hi' ? 'अभी कोई संदेश नहीं है।' : 'No messages yet.'}
              </div>
            ) : (
              messages.map((m) => (
                <div key={m.id} className="bg-white/[0.04] p-1.5 rounded-lg border border-white/5">
                  <span className="font-bold text-amber-400 mr-1.5">{m.senderName}:</span>
                  <span className="text-neutral-200">{m.text}</span>
                </div>
              ))
            )}
          </div>

          {/* Quick Reactions Bar */}
          <div className="flex items-center gap-1 p-1.5 border-t border-white/10 overflow-x-auto scrollbar-none bg-black/40">
            {QUICK_REACTIONS.map((reaction, i) => (
              <button
                key={i}
                onClick={() => handleQuickReaction(reaction)}
                className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/10 hover:bg-amber-400 hover:text-neutral-950 text-neutral-300 transition-colors whitespace-nowrap cursor-pointer shrink-0"
              >
                {reaction}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-2 border-t border-white/10 flex items-center gap-1.5">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={language === 'hi' ? 'संदेश लिखें...' : 'Type a message...'}
              maxLength={80}
              className="flex-1 bg-black/50 border border-white/15 rounded-xl px-2.5 py-1 text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-1.5 rounded-xl bg-amber-400 text-neutral-950 hover:bg-amber-300 disabled:opacity-40 transition-colors cursor-pointer shrink-0"
            >
              <Send size={13} />
            </button>
          </form>
        </div>
      )}

      {/* Floating Chat Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-neutral-950 font-bold text-xs shadow-xl hover:from-amber-400 hover:to-yellow-300 transition-transform active:scale-95 cursor-pointer ring-2 ring-white/20"
      >
        <MessageSquare size={15} />
        <span>{language === 'hi' ? 'चैट' : 'Chat'}</span>
        {messages.length > 0 && !isOpen && (
          <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
        )}
      </button>
    </div>
  );
};
