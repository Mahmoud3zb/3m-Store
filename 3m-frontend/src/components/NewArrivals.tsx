import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { productService } from '../services/productService'
import { useCartStore } from '../store/cartStore'
import { useWishlistStore } from '../store/wishlistStore'
import { Heart, ShoppingBag, Cpu, HardDrive, ShieldCheck } from 'lucide-react'
import { Skeleton } from './ui/skeleton'
import { useLanguageStore } from '../store/languageStore'
import { translations } from '../lib/translations'
import { toast } from 'react-hot-toast'

export const NewArrivals: React.FC = () => {
  const { addItem } = useCartStore();
  const wishlistItems = useWishlistStore((state) => state.items)
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist)
  const { language } = useLanguageStore()
  const t = translations[language]

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['new-arrivals'],
    queryFn: () => productService.getProducts({ limit: 4, sort: '-createdAt' }),
  })

  const products = productsData?.data || []

  if (isLoading) {
    return (
      <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto">
        <Skeleton className="h-6 w-48 mb-8 mx-auto" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((id) => (
            <div key={id} className="space-y-4 p-3 border border-neutral-100/40 rounded-3xl">
              <Skeleton className="aspect-[4/3] rounded-2xl" />
              <Skeleton className="h-3.5 w-16" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-28" />
              <div className="pt-2 border-t border-neutral-50 flex justify-between items-center">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-9 w-24 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (products.length === 0) return null

  return (
    <section className={`py-16 px-6 md:px-12 max-w-7xl mx-auto ${language === 'ar' ? 'text-right' : 'text-left'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="flex flex-col md:flex-row justify-between items-baseline mb-12 border-b border-neutral-200/60 pb-5">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-900 mb-1.5 flex items-center gap-2">
            <span className="w-2 h-6 bg-amber-500 rounded-full inline-block" />
            {t.newArrivalsTitle}
          </h2>
          <p className="text-xs text-neutral-500 font-medium">
            {t.newArrivalsSubtitle}
          </p>
        </div>
        <Link 
          to="/shop" 
          className="text-xs font-bold tracking-wider text-amber-600 hover:text-amber-700 transition-colors mt-4 md:mt-0 flex items-center gap-1.5 cursor-pointer underline decoration-amber-500/30 underline-offset-4"
        >
          {t.viewAllCollections}
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          const isWishlisted = wishlistItems.some((item) => item._id === product._id)
          const categoryName = typeof product.categoryID === 'object' && product.categoryID 
            ? (product.categoryID as any).name 
            : (language === 'ar' ? 'لابات استيراد' : 'Imported Laptops');

          return (
            <div key={product._id} className="group relative flex flex-col justify-between bg-white p-3.5 rounded-2xl border border-neutral-200/70 hover:border-amber-500/40 hover:shadow-xl transition-all duration-300">
              <div>
                {/* Image & Badges */}
                <div className="aspect-[4/3] bg-neutral-100 overflow-hidden relative mb-3.5 rounded-xl border border-neutral-200/50">
                  <Link to={`/product/${product._id}`} className="block w-full h-full">
                    <img
                      src={product.imageCover || '/p1.jpeg'}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </Link>

                  {/* Grade Badge Overlay */}
                  {product.grade && (
                    <span className="absolute top-2.5 right-2.5 bg-neutral-950/90 text-amber-400 text-[9px] font-black px-2 py-0.5 rounded-md backdrop-blur-md border border-amber-500/30 shadow-sm">
                      {product.grade}
                    </span>
                  )}

                  {/* Wishlist Button */}
                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-md hover:bg-white w-8 h-8 rounded-full transition-all shadow-sm flex items-center justify-center cursor-pointer z-10 ${
                      isWishlisted ? 'text-red-500' : 'text-neutral-700 hover:text-red-500'
                    }`}
                    title={isWishlisted ? t.removeFromWishlist : t.addToWishlist}
                  >
                    <Heart className="w-4 h-4" fill={isWishlisted ? 'currentColor' : 'none'} />
                  </button>
                </div>

                {/* Category & Title */}
                <span className="text-[10px] text-amber-600 font-extrabold uppercase tracking-wider mb-1 block">
                  {categoryName}
                </span>
                <Link to={`/product/${product._id}`} className="block hover:text-amber-600 transition-colors mb-2">
                  <h3 className="text-xs font-bold text-neutral-900 truncate leading-snug">
                    {product.name}
                  </h3>
                </Link>

                {/* Hardware Specs Pills */}
                <div className="flex flex-wrap gap-1.5 mb-3 text-[10px]">
                  {product.processor && (
                    <span className="bg-neutral-100 text-neutral-800 font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 border border-neutral-200/60">
                      <Cpu className="w-3 h-3 text-amber-600" />
                      {product.processor}
                    </span>
                  )}
                  {product.ram && (
                    <span className="bg-neutral-100 text-neutral-700 font-medium px-2 py-0.5 rounded-md">
                      {product.ram}
                    </span>
                  )}
                  {product.storage && (
                    <span className="bg-neutral-100 text-neutral-700 font-medium px-2 py-0.5 rounded-md flex items-center gap-1">
                      <HardDrive className="w-3 h-3 text-neutral-500" />
                      {product.storage}
                    </span>
                  )}
                </div>

                {/* Description snippet */}
                {product.description && (
                  <p className="text-[11px] text-neutral-500 line-clamp-2 leading-relaxed mb-3">
                    {product.description}
                  </p>
                )}
              </div>

              {/* Price & Add to Cart Action */}
              <div className="mt-auto pt-3 border-t border-neutral-100">
                <div className="flex justify-between items-baseline mb-3">
                  <span className="text-[10px] text-neutral-400 font-bold uppercase">{t.priceLabel}</span>
                  <div className="flex items-center gap-1.5">
                    {product.offer && product.offer.discountedPrice !== undefined && (
                      (() => {
                        const now = new Date();
                        const start = new Date(product.offer.startDate);
                        const end = new Date(product.offer.endDate);
                        if (now >= start && now <= end) {
                          return (
                            <>
                              <span className="text-[10px] line-through text-red-500 font-serif-en opacity-70" dir="ltr">
                                {product.price} {t.currency}
                              </span>
                              <span className="text-sm font-black text-amber-600 font-serif-en" dir="ltr">
                                {product.offer.discountedPrice} {t.currency}
                              </span>
                            </>
                          );
                        }
                        return null;
                      })()
                    ) || (
                      <span className="text-sm font-black text-amber-600 font-serif-en" dir="ltr">
                        {product.price} {t.currency}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  <button
                    onClick={() => {
                      addItem(product, 1);
                      toast.success(
                        language === 'ar' ? 'تم إضافة اللابتوب للسلة بنجاح!' : 'Laptop added to cart!'
                      );
                    }}
                    className="col-span-3 bg-neutral-900 hover:bg-amber-500 hover:text-neutral-950 text-white font-bold text-[10px] py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-amber-400 group-hover:text-neutral-950" />
                    <span>{t.addToCart}</span>
                  </button>

                  <Link
                    to={`/product/${product._id}`}
                    className="col-span-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-[10px] font-bold py-2.5 rounded-xl transition-all flex items-center justify-center cursor-pointer text-center"
                  >
                    {language === 'ar' ? 'التفاصيل' : 'Details'}
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
