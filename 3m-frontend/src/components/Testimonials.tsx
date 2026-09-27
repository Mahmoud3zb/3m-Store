import React from 'react'
import { Star, Quote, MessageSquareQuote, CheckCircle2 } from 'lucide-react'
import { useLanguageStore } from '../store/languageStore'
import { translations } from '../lib/translations'

export const Testimonials: React.FC = () => {
  const { language } = useLanguageStore();
  const t = translations[language];

  const reviews = [
    {
      name: t.review1Name,
      text: t.review1Text,
      rating: 5,
      date: t.review1Date,
      initial: 'أ',
    },
    {
      name: t.review2Name,
      text: t.review2Text,
      rating: 5,
      date: t.review2Date,
      initial: 'إ',
    },
    {
      name: t.review3Name,
      text: t.review3Text,
      rating: 5,
      date: t.review3Date,
      initial: 'س',
    },
  ]

  return (
    <section className={`py-20 px-6 md:px-12 max-w-7xl mx-auto ${language === 'ar' ? 'text-right' : 'text-left'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="text-center mb-14 space-y-3.5 max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-600 text-xs font-bold border border-amber-500/20">
          <MessageSquareQuote className="w-3.5 h-3.5 text-amber-500" />
          <span>{language === 'ar' ? 'ثقة وعملاء LapHub' : 'Customer Testimonials'}</span>
        </span>

        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900">
          {t.testimonialsTitle}
        </h2>

        <p className="text-xs md:text-sm text-neutral-500 leading-relaxed font-medium">
          {t.testimonialsSubtitle}
        </p>
      </div>

      {/* Grid of Reviews */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((rev, idx) => (
          <div 
            key={idx} 
            className="bg-white border border-neutral-200/80 hover:border-amber-500/40 p-7 rounded-2xl relative shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
          >
            {/* Quote Watermark */}
            <div className={`absolute top-6 text-amber-500/10 pointer-events-none ${language === 'ar' ? 'left-6' : 'right-6'}`}>
              <Quote className="w-14 h-14 rotate-180" />
            </div>
            
            <div>
              {/* Stars & Verified Badge */}
              <div className="flex justify-between items-center mb-5">
                <div className="flex gap-1 text-amber-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>

                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1 border border-emerald-200/60">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  {language === 'ar' ? 'مشتري موثّق' : 'Verified Buyer'}
                </span>
              </div>

              {/* Review Text */}
              <p className="text-xs text-neutral-700 leading-relaxed font-medium mb-8 relative z-10">
                "{rev.text}"
              </p>
            </div>

            {/* Author Footer */}
            <div className="flex items-center gap-3 pt-4 border-t border-neutral-100">
              <div className="w-9 h-9 rounded-full bg-amber-500/10 text-amber-700 font-black text-xs flex items-center justify-center border border-amber-500/20 flex-shrink-0">
                {rev.initial}
              </div>
              <div className="flex-grow min-w-0 flex justify-between items-baseline">
                <span className="font-bold text-neutral-900 text-xs truncate">{rev.name}</span>
                <span className="text-[10px] text-neutral-400 font-medium">{rev.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
