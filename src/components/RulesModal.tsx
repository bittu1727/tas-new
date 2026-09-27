import React from 'react';
import { Language } from '../types/game';
import { TRANSLATIONS } from '../utils/translations';
import { X, Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const RulesModal: React.FC<RulesModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const t = TRANSLATIONS[language];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-white/20 rounded-3xl p-5 sm:p-7 max-w-2xl w-full text-left shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🃏</span>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-amber-400 font-serif">
                {t.rulesTitle}
              </h2>
              <p className="text-xs text-neutral-400">{t.rulesIntro}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Rules Content */}
        <div className="space-y-4 text-xs sm:text-sm text-neutral-300">
          {/* Rule 1 */}
          <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
            <div className="font-bold text-amber-300 text-sm flex items-center gap-2 mb-1">
              <span className="text-rose-400 font-serif text-base">6♥</span>
              <span>{t.rule1Title}</span>
            </div>
            <p className="text-neutral-300 leading-relaxed">{t.rule1Body}</p>
          </div>

          {/* Rule 2 */}
          <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
            <div className="font-bold text-amber-300 text-sm flex items-center gap-2 mb-1">
              <span>6♦ 6♣ 6♠</span>
              <span>{t.rule2Title}</span>
            </div>
            <p className="text-neutral-300 leading-relaxed">{t.rule2Body}</p>
          </div>

          {/* Rule 3 */}
          <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
            <div className="font-bold text-amber-300 text-sm flex items-center gap-2 mb-1">
              <span>↕️ {t.rule3Title}</span>
            </div>
            <p className="text-neutral-300 leading-relaxed mb-2">{t.rule3Body}</p>
            <div className="bg-black/40 p-2.5 rounded-lg font-mono text-xs text-neutral-200 border border-white/10 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">{language === 'hi' ? 'नीचे (Low):' : 'Low:'}</span>
                <span>5 ➔ 4 ➔ 3 ➔ 2 ➔ 1 (Ace / {language === 'hi' ? 'इक्का' : '1'})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-bold">{language === 'hi' ? 'ऊपर (High):' : 'High:'}</span>
                <span>7 ➔ 8 ➔ 9 ➔ 10 ➔ J (11) ➔ Q (12) ➔ K (13 / {language === 'hi' ? 'बादशाह' : 'King'})</span>
              </div>
            </div>
          </div>

          {/* Rule 4: Special Badam 5 Rule */}
          <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 shadow-inner">
            <div className="font-bold text-amber-300 text-sm flex items-center gap-2 mb-1">
              <AlertTriangle size={16} className="text-amber-400" />
              <span>{t.rule4Title}</span>
            </div>
            <p className="text-amber-100/90 leading-relaxed">{t.rule4Body}</p>
            <div className="mt-2 text-[11px] text-amber-300/80 bg-black/40 p-2 rounded border border-amber-500/20">
              💡 {language === 'hi'
                ? 'रणनीति: यदि आपके पास ५♥ है, तो उसे रोके रखकर आप अन्य सभी सूट के छोटे पत्तों को टेबल पर आने से रोक सकते हैं!'
                : 'Pro Tip: If you hold the 5♥, you can starve opponents who have low cards trapped in other suits!'}
            </div>
          </div>

          {/* Rule 5 */}
          <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
            <div className="font-bold text-amber-300 text-sm flex items-center gap-2 mb-1">
              <ShieldCheck size={16} className="text-emerald-400" />
              <span>{t.rule5Title}</span>
            </div>
            <p className="text-neutral-300 leading-relaxed">{t.rule5Body}</p>
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
