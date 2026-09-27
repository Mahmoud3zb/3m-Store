import React from 'react'
import { Truck, ShieldCheck, Headphones, CheckCircle2, Award } from 'lucide-react'
import { useLanguageStore } from '../store/languageStore'
import { translations } from '../lib/translations'

export const BrandValues: React.FC = () => {
  const { language } = useLanguageStore();
  const t = translations[language];

  const values = [
    {
      Icon: Truck,
      title: t.value1Title,
      description: t.value1Desc,
    },
    {
      Icon: CheckCircle2,
      title: t.value2Title,
      description: t.value2Desc,
    },
    {
      Icon: ShieldCheck,
      title: t.value3Title,
      description: t.value3Desc,
    },
    {
      Icon: Headphones,
      title: t.value4Title,
      description: t.value4Desc,
    },
  ]

  return (
    <section className="bg-neutral-950 text-white py-20 px-6 md:px-12 border-y border-neutral-800/80 relative overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Background Subtle Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-500/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-14 max-w-2xl mx-auto space-y-3.5">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-[11px] font-bold border border-amber-500/30 backdrop-blur-sm">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'ar' ? 'مميزات وخدمات LapHub' : 'LapHub Core Guarantees'}</span>
          </span>

          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            {language === 'ar' ? (
              <>لماذا تختار <span className="text-amber-400 font-extrabold">LapHub</span> لشراء لابتوب استيراد؟</>
            ) : (
              <>Why Choose <span className="text-amber-400 font-extrabold">LapHub</span> for Your Laptop?</>
            )}
          </h2>

          <p className="text-xs md:text-sm text-neutral-400 leading-relaxed font-medium max-w-xl mx-auto">
            {t.brandValuesSubtitle}
          </p>
        </div>

        {/* Grid Cards */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
          {values.map(({ Icon, title, description }, index) => (
            <div 
              key={index} 
              className="group bg-neutral-900/90 border border-neutral-800 hover:border-amber-500/40 p-6 md:p-7 rounded-2xl hover:bg-neutral-900 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 shadow-lg hover:shadow-2xl hover:shadow-amber-500/10"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 group-hover:bg-amber-500 group-hover:text-neutral-950 text-amber-400 rounded-xl flex items-center justify-center transition-all duration-300 shadow-inner">
                  <Icon className="w-5.5 h-5.5" />
                </div>

                <h3 className="text-sm font-bold tracking-tight text-white group-hover:text-amber-400 transition-colors">
                  {title}
                </h3>

                <p className="text-xs text-neutral-400 leading-relaxed font-medium">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
