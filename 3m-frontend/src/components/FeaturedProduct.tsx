import React from 'react'
import { Heart, ShoppingBag, Cpu, HardDrive, ShieldCheck, Sparkles, Monitor, Battery } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useLanguageStore } from '../store/languageStore'
import { translations } from '../lib/translations'
import { Link } from 'react-router-dom'
import { productService } from '../services/productService'
import { useCartStore } from '../store/cartStore'
import { useWishlistStore } from '../store/wishlistStore'
import { Skeleton } from './ui/skeleton'
import { toast } from 'react-hot-toast'

export const FeaturedProduct: React.FC = () => {
  const { addItem } = useCartStore();
  const wishlistItems = useWishlistStore((state) => state.items)
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist)
  const { language } = useLanguageStore()
  const t = translations[language]

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['home-featured-product'],
    queryFn: () => productService.getProducts({ isFeatured: true, limit: 1 }),
  });

  const products = productsData?.data || [];
  const activeProduct = products.length > 0 ? products[0] : null;

  if (isLoading) {
    return (
      <div className="my-16 bg-white py-16 border-y border-neutral-200/80">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-1/2">
            <Skeleton className="aspect-[4/3] rounded-3xl" />
          </div>
          <div className="w-full md:w-1/2 space-y-6 text-right" dir="rtl">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-20 w-full rounded-2xl" />
            <div className="pt-6 border-t border-neutral-100 flex gap-4">
              <Skeleton className="flex-1 h-12 rounded-xl" />
              <Skeleton className="w-12 h-12 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!activeProduct) return null;

  const isWishlisted = wishlistItems.some((item) => item._id === activeProduct._id);
  const categoryName = typeof activeProduct.categoryID === 'object' && activeProduct.categoryID
    ? (activeProduct.categoryID as any).name
    : (language === 'ar' ? 'ترشيح اليوم المميز' : 'Daily Featured Choice');

  return (
    <section id="featured-product" className="my-16 bg-gradient-to-b from-neutral-50 to-white py-16 md:py-24 border-y border-neutral-200/80" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Top Badge */}
        <div className="flex items-center gap-2 mb-8">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-600 text-xs font-bold border border-amber-500/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{language === 'ar' ? 'الجهاز الأكثر طلباً وترشيحاً' : 'Most Recommended Laptop'}</span>
          </span>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
          {/* Laptop Image Showcase */}
          <div className="w-full md:w-1/2 relative group">
            <Link 
              to={`/product/${activeProduct._id}`} 
              className="block overflow-hidden aspect-[4/3] rounded-3xl border border-neutral-200/80 bg-white shadow-xl hover:shadow-2xl transition-all duration-500 relative"
            >
              <img
                src={activeProduct.imageCover || '/p1.jpeg'}
                alt={activeProduct.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />

              {/* Grade Badge */}
              {activeProduct.grade && (
                <span className="absolute top-4 right-4 bg-neutral-950/90 text-amber-400 text-xs font-extrabold px-3 py-1 rounded-lg backdrop-blur-md border border-amber-500/30 shadow-md">
                  {activeProduct.grade}
                </span>
              )}
            </Link>
          </div>

          {/* Details & Specs */}
          <div className={`w-full md:w-1/2 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
            <span className="text-xs text-amber-600 font-extrabold tracking-wider uppercase mb-2 block">
              {categoryName}
            </span>

            <Link to={`/product/${activeProduct._id}`} className="block hover:text-amber-600 transition-colors">
              <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 leading-tight mb-4">
                {activeProduct.name}
              </h2>
            </Link>

            {/* Price Row */}
            <div className="mb-6 flex items-baseline gap-3">
              {activeProduct.offer && activeProduct.offer.discountedPrice !== undefined && (
                (() => {
                  const now = new Date();
                  const start = new Date(activeProduct.offer.startDate);
                  const end = new Date(activeProduct.offer.endDate);
                  if (now >= start && now <= end) {
                    return (
                      <>
                        <span className="text-sm line-through text-red-500 font-serif-en opacity-70" dir="ltr">
                          {activeProduct.price} {t.currency}
                        </span>
                        <span className="font-serif-en text-3xl text-amber-600 font-black" dir="ltr">
                          {activeProduct.offer.discountedPrice} {t.currency}
                        </span>
                      </>
                    );
                  }
                  return null;
                })()
              ) || (
                <span className="font-serif-en text-3xl text-amber-600 font-black" dir="ltr">
                  {activeProduct.price} {t.currency}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-neutral-600 leading-relaxed mb-6 text-xs md:text-sm font-medium">
              {activeProduct.description}
            </p>

            {/* Hardware Specs Grid */}
            <div className="mb-8 p-4 bg-neutral-100/70 border border-neutral-200/80 rounded-2xl space-y-3">
              <span className="text-xs font-bold text-neutral-800 block">
                {language === 'ar' ? 'المواصفات الأساسية للجهاز:' : 'Key Hardware Specs:'}
              </span>

              <div className="grid grid-cols-2 gap-2 text-xs font-medium text-neutral-800">
                {activeProduct.processor && (
                  <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-neutral-200/60">
                    <Cpu className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span className="truncate font-bold text-amber-700">{activeProduct.processor}</span>
                  </div>
                )}
                {activeProduct.ram && (
                  <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-neutral-200/60">
                    <span className="w-2 h-2 rounded-full bg-neutral-400" />
                    <span>{activeProduct.ram}</span>
                  </div>
                )}
                {activeProduct.storage && (
                  <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-neutral-200/60">
                    <HardDrive className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                    <span>{activeProduct.storage}</span>
                  </div>
                )}
                {activeProduct.screen && (
                  <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-neutral-200/60">
                    <Monitor className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                    <span>{activeProduct.screen}</span>
                  </div>
                )}
              </div>

              {activeProduct.warranty && (
                <div className="pt-2 border-t border-neutral-200/60 text-[11px] text-amber-700 font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>{activeProduct.warranty}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  addItem(activeProduct, 1);
                  toast.success(
                    language === 'ar' ? 'تم إضافة اللابتوب للسلة بنجاح!' : 'Laptop added to cart!'
                  );
                }}
                className="flex-1 bg-neutral-900 hover:bg-amber-500 hover:text-neutral-950 text-white font-bold text-xs py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-neutral-900/10"
              >
                <ShoppingBag className="w-4 h-4 text-amber-400 group-hover:text-neutral-950" />
                <span>{t.addToCart}</span>
              </button>

              <Link
                to={`/product/${activeProduct._id}`}
                className="bg-amber-500 hover:bg-amber-600 text-neutral-950 text-xs font-bold py-3.5 px-6 rounded-xl transition-all cursor-pointer text-center block shadow-md shadow-amber-500/20"
              >
                {language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
              </Link>

              <button
                onClick={() => toggleWishlist(activeProduct)}
                className={`w-12 h-12 border flex justify-center items-center transition-colors cursor-pointer rounded-xl ${
                  isWishlisted
                    ? 'border-red-500 bg-red-50 text-red-500'
                    : 'border-neutral-300 text-neutral-600 hover:border-black'
                }`}
                title={isWishlisted ? t.removeFromWishlist : t.addToWishlist}
              >
                <Heart
                  className="w-5 h-5"
                  fill={isWishlisted ? 'currentColor' : 'none'}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
