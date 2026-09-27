import React from 'react';
import { Language } from '../types/rummy';
import { RUMMY_TRANSLATIONS } from '../utils/rummyTranslations';
import { X, BookOpen, CheckCircle, ShieldAlert, Sparkles, Layers } from 'lucide-react';

interface RummyRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const RummyRulesModal: React.FC<RummyRulesModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const t = RUMMY_TRANSLATIONS[language];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-white/20 rounded-3xl p-5 sm:p-6 max-w-2xl w-full text-left shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <BookOpen size={20} className="text-amber-400" />
            <h2 className="text-lg font-bold text-neutral-100">{t.rulesTitle}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 text-xs sm:text-sm text-neutral-300 leading-relaxed">
          {language === 'hi' ? (
            <>
              <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/30">
                <h3 className="font-bold text-amber-300 text-sm mb-1 flex items-center gap-1.5">
                  <Sparkles size={16} />
                  <span>खेल का मुख्य उद्देश्य</span>
                </h3>
                <p>
                  १३ पत्तों के इंडियन रमी में प्रत्येक खिलाड़ी को १३ पत्ते बांटे जाते हैं। खिलाड़ी को अपने सभी पत्तों को वैध <strong>सीक्वेंस (Sequences)</strong> और <strong>सेट्स (Sets)</strong> में व्यवस्थित करके सही घोषणा (Declare/Show) करनी होती है।
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                  <h4 className="font-bold text-emerald-400 mb-1">
                    १. पहला नियम: शुद्ध सीक्वेंस (Pure Sequence / ১ম जीवन)
                  </h4>
                  <p>
                    घोषणा मान्य होने के लिए <strong>कम से कम १ शुद्ध सीक्वेंस</strong> होना अनिवार्य है। शुद्ध सीक्वेंस एक ही सूट के ३ या अधिक क्रमबद्ध पत्तों का होता है (जैसे: ४♠-५♠-६♠, या A♥-२♥-३♥, या Q♦-K♦-A♦)। इसमें किसी भी जोकर की स्थानापन्न (substitute) चाल मान्य नहीं होती।
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                  <h4 className="font-bold text-blue-400 mb-1">
                    २. दूसरा नियम: दूसरा सीक्वेंस (Second Sequence / ২য় जीवन)
                  </h4>
                  <p>
                    हाथ में एक <strong>दूसरा सीक्वेंस</strong> भी होना चाहिए। यह शुद्ध सीक्वेंस भी हो सकता है या फिर वाइल्ड/प्रिंटेड जोकर से बना <strong>अशुद्ध सीक्वेंस (Impure Sequence)</strong> (जैसे: ७♥ - [जोकर] - ९♥)।
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                  <h4 className="font-bold text-purple-400 mb-1">
                    ३. तीसरा नियम: सेट्स (Sets)
                  </h4>
                  <p>
                    बाकी बचे पत्तों से ३ या ४ पत्तों का सेट बनाया जा सकता है। सेट में सभी पत्तों का <strong>मान (Rank) समान</strong> होना चाहिए और <strong>सूट अलग-अलग</strong> होने चाहिए (जैसे: ८♥ - ८♦ - ८♠)। एक ही सूट का पत्ता दोहराया नहीं जा सकता। जोकर का उपयोग सेट में भी किया जा सकता है।
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                  <h4 className="font-bold text-rose-400 mb-1">
                    ४. ड्रॉप के नियम (Drop Penalties)
                  </h4>
                  <p>
                    यदि आपके पास अच्छे पत्ते नहीं हैं:
                    <br />• <strong>फर्स्ट ड्रॉप (First Drop)</strong>: पहली चाल पर बिना पत्ता उठाए ड्रॉप करने पर केवल <strong>२० पेनल्टी अंक</strong> मिलते हैं।
                    <br />• <strong>मिडिल ड्रॉप (Middle Drop)</strong>: बीच खेल में ड्रॉप करने पर <strong>४० पेनल्टी अंक</strong> मिलते हैं।
                    <br />• <strong>गलत घोषणा (Wrong Declare)</strong>: बिना शुद्ध सीक्वेंस के घोषणा करने पर अधिकतम <strong>८० पेनल्टी अंक</strong> का नुकसान होता है!
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                  <h4 className="font-bold text-neutral-200 mb-1">
                    ५. पेनल्टी अंक गणना (Points Calculation)
                  </h4>
                  <p>
                    विजेता को <strong>० अंक</strong> मिलते हैं। अन्य खिलाड़ियों के अनमेल्ड (unmelded) पत्तों के अंक जुड़ते हैं:
                    <br />• A, K, Q, J = १० अंक प्रत्येक
                    <br />• २ से १० = संख्या मान (जैसे ५ = ५ अंक)
                    <br />• जोकर = ० अंक
                    <br />• अधिकतम पेनल्टी कैप = <strong>८० अंक</strong>।
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/30">
                <h3 className="font-bold text-amber-300 text-sm mb-1 flex items-center gap-1.5">
                  <Sparkles size={16} />
                  <span>Objective of 13-Card Indian Rummy</span>
                </h3>
                <p>
                  Each player is dealt 13 cards from 2 standard decks (including 2 Printed Jokers and 1 randomly selected Wild Cut Joker). The objective is to arrange all 13 cards into valid <strong>Sequences</strong> and <strong>Sets</strong> and make a valid Show/Declaration.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                  <h4 className="font-bold text-emerald-400 mb-1">
                    1. Pure Sequence (Mandatory First Life)
                  </h4>
                  <p>
                    You MUST have at least 1 Pure Sequence. A pure sequence is 3 or more consecutive cards of the SAME suit with NO Jokers used as substitutes (e.g. 4♠-5♠-6♠, A♥-2♥-3♥, or Q♦-K♦-A♦).
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                  <h4 className="font-bold text-blue-400 mb-1">
                    2. Second Sequence (Mandatory Second Life)
                  </h4>
                  <p>
                    You must have a second sequence of 3 or more cards of the same suit. It can be another Pure Sequence or an <strong>Impure Sequence</strong> utilizing Wild or Printed Jokers (e.g. 7♥ - [Joker] - 9♥).
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                  <h4 className="font-bold text-purple-400 mb-1">
                    3. Sets (Same Rank, Different Suits)
                  </h4>
                  <p>
                    Remaining cards can be arranged into Sets of 3 or 4 cards with the SAME rank and DIFFERENT suits (e.g. 8♥ - 8♦ - 8♠). Duplicate suits in the same set are strictly invalid. Jokers can substitute missing cards.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                  <h4 className="font-bold text-rose-400 mb-1">
                    4. Drop Rules & Penalties
                  </h4>
                  <p>
                    If dealt a difficult hand:
                    <br />• <strong>First Drop</strong>: Dropping on your very first turn without drawing grants a minimal <strong>20 penalty points</strong>.
                    <br />• <strong>Middle Drop</strong>: Dropping midway through the game gives <strong>40 penalty points</strong>.
                    <br />• <strong>Wrong Show</strong>: Declaring without valid pure sequences results in the maximum <strong>80 penalty points</strong>!
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                  <h4 className="font-bold text-neutral-200 mb-1">
                    5. Card Values & Scoring
                  </h4>
                  <p>
                    The winner receives <strong>0 points</strong>. Losing players accumulate penalty points for unarranged cards:
                    <br />• Face cards (A, K, Q, J) = 10 points each
                    <br />• Number cards (2 to 10) = their face value
                    <br />• Jokers = 0 points
                    <br />• Maximum loss is capped at <strong>80 points</strong>.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-4 mt-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/15 text-white transition-all cursor-pointer"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
