import React from 'react'
import { useLanguageStore } from '../store/languageStore'
import { translations } from '../lib/translations'
import { ShieldCheck, Cpu, Award, ArrowLeft, ArrowRight } from 'lucide-react'

interface HeroAsymmetricalProps {
  onShopClick?: () => void
  onExploreFeatured?: () => void
}

export const HeroAsymmetrical: React.FC<HeroAsymmetricalProps> = ({
  onShopClick,
  onExploreFeatured,
}) => {
  const { language } = useLanguageStore();
  const t = translations[language];

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center pt-24 pb-16 md:py-20 overflow-hidden bg-neutral-950 text-white">
      {/* Background Banner Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/bg.jpg"
          alt="LapHub Banner"
          className="w-full h-full object-cover object-center opacity-9000 filter contrast-225"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/60" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-10 md:gap-12">
        {/* Main Text Content */}
        <div className={`w-full md:w-3/5 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mb-6 backdrop-blur-sm">
            <Award className="w-4 h-4 text-amber-400" />
            <span>LapHub — أداء | جودة | ثقة</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight tracking-tight text-white">
            <span className="text-amber-500">{t.heroTitleLine1}</span> {t.heroTitleLine2}
            <br />
            <span className="bg-gradient-to-r from-amber-300 via-amber-500 to-amber-600 bg-clip-text text-transparent">
              {t.heroTitleLine3}
            </span>
          </h1>

          <p className="text-neutral-300 mb-8 leading-relaxed text-base md:text-lg max-w-2xl">
            {t.heroSubtitle}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={onShopClick}
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-black px-8 py-4 rounded-xl text-sm uppercase tracking-wider hover:brightness-110 shadow-lg shadow-amber-500/20 transition-all flex items-center gap-3 cursor-pointer"
            >
              <span>{t.shopCollection}</span>
              {language === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>

            {onExploreFeatured && (
              <button
                onClick={onExploreFeatured}
                className="bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700 text-white font-bold px-7 py-4 rounded-xl text-sm transition-all cursor-pointer backdrop-blur-sm"
              >
                {t.explore}
              </button>
            )}
          </div>

          {/* Quick Badges */}
          <div className="grid grid-cols-3 gap-4 mt-10 pt-8 border-t border-neutral-800/80">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-amber-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">ضمان حقيقي</h4>
                <p className="text-[11px] text-neutral-400">فحص واستبدال 14 يوم</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-amber-400">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">فرز أول 100%</h4>
                <p className="text-[11px] text-neutral-400">بحالة الزيرو والشاحن الأصلي</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-amber-400">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">أفضل الأجهزة</h4>
                <p className="text-[11px] text-neutral-400">Dell • HP • Lenovo • Apple</p>
              </div>
            </div>
          </div>
        </div>

        
      </div>
    </section>
  )
}

