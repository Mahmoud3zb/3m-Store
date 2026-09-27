import React from 'react'
import { useLanguageStore } from '../store/languageStore'
import { translations } from '../lib/translations'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ShieldCheck, Zap } from 'lucide-react'

interface GalleryItem {
  id: string
  title: string
  subtitle: string
  price: string
  image: string
  aspectRatio: string
}

interface StaggeredGalleryProps {
  onItemClick?: (itemId: string) => void
}

export const StaggeredGallery: React.FC<StaggeredGalleryProps> = () => {
  const { language } = useLanguageStore();
  const t = translations[language];
  const navigate = useNavigate();

  const items: GalleryItem[] = [
    {
      id: 'business-coding',
      title: language === 'ar' ? 'أجهزة البرمجة والأعمال الشاقة' : 'Pro Business & Coding Laptops',
      subtitle: language === 'ar' ? 'سلسلة الاعتمادية والأداء الصامت' : 'High Reliability & Battery Life',
      price: language === 'ar' ? 'تبدأ من 15,400 ج.م' : 'From 15,400 EGP',
      image: '/laptop_gallery_1.jpg',
      aspectRatio: 'aspect-[4/3]',
    },
    {
      id: 'gaming-render',
      title: language === 'ar' ? 'وحوش الجيمنج والريندر والـ 3D' : 'Gaming & 3D Rendering Beasts',
      subtitle: language === 'ar' ? 'كروت شاشة RTX + شاشات 144Hz' : 'NVIDIA RTX & 144Hz Displays',
      price: language === 'ar' ? 'تبدأ من 27,900 ج.م' : 'From 27,900 EGP',
      image: '/laptop_gallery_2.jpg',
      aspectRatio: 'aspect-[3/4]',
    },
  ]

  const handleCategoryClick = (categoryKeyword: string) => {
    navigate(`/shop?keyword=${encodeURIComponent(categoryKeyword)}`);
  }

  return (
    <section className="py-20 md:py-28 px-6 md:px-10 max-w-7xl mx-auto" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className={`flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-4 md:gap-0 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-2 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            {language === 'ar' ? 'جودة فاخرة | فحص شامل' : 'Luxe Quality | Full Inspection'}
          </span>
          <h2 className="text-2xl md:text-4xl font-bold leading-tight text-neutral-900">
            {language === 'ar' ? (
              <>أداء استثنائي. <br className="hidden md:block" /> تصميم يرفع تطلعاتك.</>
            ) : (
              <>Exceptional Performance. <br className="hidden md:block" /> Design That Elevates You.</>
            )}
          </h2>
        </div>
        <p className={`text-neutral-500 text-xs md:text-sm max-w-md leading-relaxed font-medium ${language === 'ar' ? 'text-right' : 'text-left'}`}>
          {t.gallerySubtitle}
        </p>
      </div>

      {/* Staggered Gallery Items */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-10 items-center">
        {/* Gallery Item 1 */}
        <div
          onClick={() => handleCategoryClick('برمجة')}
          className="md:col-span-7 relative group cursor-pointer pb-8 md:pb-12"
        >
          <div className={`overflow-hidden rounded-3xl ${items[0].aspectRatio} bg-neutral-900 border border-neutral-200/80 shadow-lg group-hover:border-amber-500/50 group-hover:shadow-2xl transition-all duration-500`}>
            <img
              src={items[0].image}
              alt={items[0].title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
          </div>
          
          {/* Floating Info Card */}
          <div className={`absolute bottom-0 bg-white/95 backdrop-blur-md p-5 md:p-6 shadow-xl rounded-2xl group-hover:shadow-2xl transition-all duration-300 w-64 md:w-80 z-20 border border-neutral-200/80 group-hover:border-amber-500/30 ${language === 'ar' ? 'right-4 md:-bottom-6 md:-right-6 text-right' : 'left-4 md:-bottom-6 md:-left-6 text-left'}`}>
            <span className="text-[10px] text-amber-600 font-extrabold tracking-wider uppercase block mb-1">
              {items[0].subtitle}
            </span>
            <h3 className="font-bold text-sm md:text-base mb-3 leading-snug text-neutral-900">
              {items[0].title}
            </h3>
            <div className="flex justify-between items-center border-t border-neutral-100 pt-3">
              <span className="font-serif-en text-xs md:text-sm font-black text-amber-600" dir="ltr">
                {items[0].price}
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-900 group-hover:text-amber-600 transition-colors flex items-center gap-1">
                {t.shopNow}
                {language === 'ar' ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
              </span>
            </div>
          </div>
        </div>

        {/* Gallery Item 2 */}
        <div
          onClick={() => handleCategoryClick('جيمنج')}
          className="md:col-span-5 md:mt-16 relative group cursor-pointer pb-8 md:pb-12"
        >
          <div className={`overflow-hidden rounded-3xl ${items[1].aspectRatio} bg-neutral-900 border border-neutral-200/80 shadow-lg group-hover:border-amber-500/50 group-hover:shadow-2xl transition-all duration-500`}>
            <img
              src={items[1].image}
              alt={items[1].title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
          </div>
          
          {/* Floating Info Card */}
          <div className={`absolute bottom-0 bg-white/95 backdrop-blur-md p-5 md:p-6 shadow-xl rounded-2xl group-hover:shadow-2xl transition-all duration-300 w-64 md:w-80 z-20 border border-neutral-200/80 group-hover:border-amber-500/30 ${language === 'ar' ? 'left-4 md:-bottom-6 md:-left-6 text-right' : 'right-4 md:-bottom-6 md:-right-6 text-left'}`}>
            <span className="text-[10px] text-amber-600 font-extrabold tracking-wider uppercase block mb-1">
              {items[1].subtitle}
            </span>
            <h3 className="font-bold text-sm md:text-base mb-3 leading-snug text-neutral-900">
              {items[1].title}
            </h3>
            <div className="flex justify-between items-center border-t border-neutral-100 pt-3">
              <span className="font-serif-en text-xs md:text-sm font-black text-amber-600" dir="ltr">
                {items[1].price}
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-900 group-hover:text-amber-600 transition-colors flex items-center gap-1">
                {t.shopNow}
                {language === 'ar' ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
