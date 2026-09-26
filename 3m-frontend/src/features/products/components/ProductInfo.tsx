import { useState, useEffect } from 'react';
import { Heart, ShoppingBag, Star, ShieldCheck, Ruler, X, Calendar, MessageSquare, MessageCircle, Share2, Link2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useCartStore } from '../../../store/cartStore';
import { useWishlistStore } from '../../../store/wishlistStore';
// import { useAuthStore } from '../../../store/authStore';
import { useLanguageStore } from '../../../store/languageStore';
import { translations } from '../../../lib/translations';
import { QuickCheckoutModal } from '../../../components/QuickCheckoutModal';

interface ProductInfoProps {
  product: any;
  reviews: any[];
  averageRate: number;
}

export function ProductInfo({ product, reviews, averageRate }: ProductInfoProps) {
  const { addItem } = useCartStore();
  const wishlistItems = useWishlistStore((state) => state.items);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  // const { isAuthenticated, openAuthModal } = useAuthStore();
  const { language } = useLanguageStore();
  const t = translations[language];

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [showSizeGuide, setShowSizeGuide] = useState<boolean>(false);
  const [isQuickCheckoutOpen, setIsQuickCheckoutOpen] = useState<boolean>(false);

  useEffect(() => {
    if (product) {
      if (product.variants && product.variants.length > 0) {
        const firstAvailableVariant = product.variants.find((v: any) => v.quantity > 0) || product.variants[0];
        if (firstAvailableVariant) {
          setSelectedSize(firstAvailableVariant.size);
          setSelectedColor(firstAvailableVariant.colorCode);
        }
      }
    }
  }, [product]);

  const categoryName = typeof product.categoryID === 'object' && product.categoryID
    ? (product.categoryID as any).name
    : (language === 'ar' ? 'مجموعة غير محددة' : 'General Collection');

  const isWishlisted = product ? wishlistItems.some((item) => item._id === product._id) : false;

  const handleAddToCart = () => {
    if (product) {
      addItem(product, 1);
    }
  };

  const handleBuyNow = () => {
    setIsQuickCheckoutOpen(true);
  };

  const handleWhatsAppOrder = () => {
    const phone = '201006488707';
    const message = language === 'ar'
      ? `السلام عليكم، أود الاستفسار وطلب اللابتوب التالي من متجر LapHub:
- الجهاز: ${product.name}
- الماركة: ${product.brand || ''}
- البروسيسور: ${product.processor || ''}
- الرامات: ${product.ram || ''}
- التخزين: ${product.storage || ''}
- كارت الشاشة: ${product.gpu || ''}
- السعر: ${product.price} ج.م
- رابط المنتج: ${window.location.href}`
      : `Hello, I would like to order the following laptop from LapHub:
- Laptop: ${product.name}
- Brand: ${product.brand || ''}
- CPU: ${product.processor || ''}
- RAM: ${product.ram || ''}
- Storage: ${product.storage || ''}
- GPU: ${product.gpu || ''}
- Price: ${product.price} EGP
- Link: ${window.location.href}`;

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleSocialShare = (platform: 'whatsapp' | 'facebook' | 'copy') => {
    const url = window.location.href;
    const text = language === 'ar' 
      ? `بص على المنتج الجميل ده في متجر 3M: ${product.name}`
      : `Check out this beautiful product at 3M Store: ${product.name}`;

    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      toast.success(
        language === 'ar' 
          ? 'تم نسخ رابط المنتج بنجاح!' 
          : 'Product link copied successfully!'
      );
    }
  };

  return (
    <div className="lg:col-span-6 space-y-8">
     
      <div className="space-y-4">
        <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider block">
          {categoryName}
        </span>
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 leading-tight">
          {product.name}
        </h1>
        
        <div className={`flex items-center gap-2 ${language === 'ar' ? 'justify-end' : 'justify-start'}`}>
          <span className="text-xs text-neutral-500">({reviews.length} {t.reviewsCount})</span>
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-xs font-bold text-neutral-900 mt-0.5">{averageRate || '0.0'}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="text-2xl font-serif-en font-black text-neutral-950 pt-2 flex items-center gap-2" dir="ltr">
            {product.offer && product.offer.discountedPrice !== undefined && (
              (() => {
                const now = new Date();
                const start = new Date(product.offer.startDate);
                const end = new Date(product.offer.endDate);
                if (now >= start && now <= end) {
                  return (
                    <>
                      <span className="text-sm line-through text-red-500 font-serif-en opacity-70">
                        {product.price} {t.currency}
                      </span>
                      <span>
                        {product.offer.discountedPrice} {t.currency}
                      </span>
                    </>
                  );
                }
                return null;
              })()
            ) || (
              <span>
                {product.price} {t.currency}
              </span>
            )}
          </div>
          
          {(() => {
            const totalQuantity = product.variants?.reduce((sum: number, v: any) => sum + v.quantity, 0) ?? 0;
            if (totalQuantity === 0) {
              return (
                <span className="inline-flex items-center gap-1 bg-red-50 text-red-650 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-red-100 uppercase tracking-wider animate-pulse mt-2">
                  {t.outOfStock}
                </span>
              );
            } else if (totalQuantity <= 5) {
              return (
                <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-650 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-amber-100 uppercase tracking-wider mt-2">
                  {t.onlyItemsLeft.replace('{count}', String(totalQuantity))}
                </span>
              );
            }
            return null;
          })()}
        </div>
      </div>

      <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6">
        <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-medium">
          {product.description}
        </p>
      </div>

      {/* Laptop Technical Specifications Grid */}
      <div className="space-y-4 bg-neutral-900/90 text-white p-5 rounded-2xl border border-amber-500/30 shadow-lg">
        <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2 border-b border-neutral-800 pb-3">
          <Cpu className="w-4 h-4 text-amber-400" />
          <span>المواصفات التقنية الفائقة (Technical Specs)</span>
        </h3>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-neutral-800/80 p-2.5 rounded-xl border border-neutral-700/50">
            <span className="text-neutral-400 text-[10px] block mb-0.5">الماركة (Brand)</span>
            <span className="font-bold text-amber-400">{product.brand || 'HP'}</span>
          </div>

          <div className="bg-neutral-800/80 p-2.5 rounded-xl border border-neutral-700/50">
            <span className="text-neutral-400 text-[10px] block mb-0.5">المعالج (Processor)</span>
            <span className="font-bold text-white">{product.processor || 'Intel Core i7'}</span>
          </div>

          <div className="bg-neutral-800/80 p-2.5 rounded-xl border border-neutral-700/50">
            <span className="text-neutral-400 text-[10px] block mb-0.5">الرامات (RAM)</span>
            <span className="font-bold text-white">{product.ram || '16GB'}</span>
          </div>

          <div className="bg-neutral-800/80 p-2.5 rounded-xl border border-neutral-700/50">
            <span className="text-neutral-400 text-[10px] block mb-0.5">التخزين (Storage)</span>
            <span className="font-bold text-white">{product.storage || '512GB SSD'}</span>
          </div>

          <div className="bg-neutral-800/80 p-2.5 rounded-xl border border-neutral-700/50">
            <span className="text-neutral-400 text-[10px] block mb-0.5">كارت الشاشة (Graphics)</span>
            <span className="font-bold text-amber-400">{product.gpu || 'Intel Iris Xe'}</span>
          </div>

          <div className="bg-neutral-800/80 p-2.5 rounded-xl border border-neutral-700/50">
            <span className="text-neutral-400 text-[10px] block mb-0.5">الشاشة (Screen)</span>
            <span className="font-bold text-white">{product.screen || '15.6" FHD'}</span>
          </div>

          <div className="bg-neutral-800/80 p-2.5 rounded-xl border border-neutral-700/50">
            <span className="text-neutral-400 text-[10px] block mb-0.5">حالة الفرز (Grade)</span>
            <span className="font-bold text-emerald-400">{product.grade || 'فرز أول (Grade A+)'}</span>
          </div>

          <div className="bg-neutral-800/80 p-2.5 rounded-xl border border-neutral-700/50">
            <span className="text-neutral-400 text-[10px] block mb-0.5">حالة البطارية</span>
            <span className="font-bold text-white">{product.battery || 'حالة ممتازة 85%+'}</span>
          </div>
        </div>

        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>{product.warranty || 'ضمان 14 يوم فحص واستبدال + شاحن أصلي مجاناً'}</span>
        </div>
      </div>

      
      <div className="space-y-4 border-t border-neutral-200 dark:border-neutral-800 pt-6">
        <button
          onClick={handleBuyNow}
          disabled={(product.stockQuantity ?? 1) === 0}
          className={`w-full text-xs font-black uppercase tracking-widest py-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
            (product.stockQuantity ?? 1) === 0
              ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700'
              : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-neutral-950 font-bold shadow-amber-500/20'
          }`}
        >
          <ShieldCheck className="w-4.5 h-4.5" />
          {(product.stockQuantity ?? 1) === 0 ? t.outOfStock : (language === 'ar' ? 'طلب سريع بدون تسجيل (الدفع عند الاستلام)' : 'Quick Buy (Guest Checkout)')}
        </button>

        <button
          onClick={handleWhatsAppOrder}
          disabled={(product.stockQuantity ?? 1) === 0}
          className={`w-full text-xs font-black uppercase tracking-widest py-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
            (product.stockQuantity ?? 1) === 0
              ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/10'
          }`}
        >
          <MessageCircle className="w-4.5 h-4.5" />
          {(product.stockQuantity ?? 1) === 0 ? t.outOfStock : (language === 'ar' ? 'طلب واستفسار مباشر عبر الواتساب' : 'Order via WhatsApp')}
        </button>

        <div className="flex gap-4">
          <button
            onClick={handleAddToCart}
            disabled={(product.stockQuantity ?? 1) === 0}
            className={`flex-1 text-xs font-bold uppercase tracking-wider py-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
              (product.stockQuantity ?? 1) === 0
                ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700'
                : 'bg-neutral-900 hover:bg-black text-white border border-neutral-700'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            {(product.stockQuantity ?? 1) === 0 ? t.outOfStock : t.addToShoppingBag}
          </button>
          
          <button
            onClick={() => toggleWishlist(product)}
            className={`w-14 h-14 border flex justify-center items-center transition-all cursor-pointer rounded-xl ${
              isWishlisted
                ? 'border-red-500 bg-red-500/10 text-red-500'
                : 'border-neutral-700 text-neutral-400 hover:border-amber-400 hover:text-amber-400'
            }`}
            title={isWishlisted ? t.removeFromWishlist : t.addToWishlist}
          >
            <Heart
              className="w-5 h-5"
              fill={isWishlisted ? 'currentColor' : 'none'}
            />
          </button>
        </div>

        {/* Social Sharing Section */}
        <div className="border-t border-neutral-100 pt-6 space-y-3">
          <span className="text-[10px] text-neutral-450 font-bold uppercase tracking-wider block">
            {language === 'ar' ? 'مشاركة المنتج:' : 'Share Product:'}
          </span>
          <div className="flex gap-2.5">
            <button 
              onClick={() => handleSocialShare('whatsapp')}
              className="flex-1 py-2 px-3 border border-neutral-200 hover:border-black transition-colors rounded-xl text-[10px] font-bold text-neutral-600 hover:text-black flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
              <span>{language === 'ar' ? 'واتساب' : 'WhatsApp'}</span>
            </button>
            <button 
              onClick={() => handleSocialShare('facebook')}
              className="flex-1 py-2 px-3 border border-neutral-200 hover:border-black transition-colors rounded-xl text-[10px] font-bold text-neutral-600 hover:text-black flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-[#1877F2]" />
              <span>{language === 'ar' ? 'فيسبوك' : 'Facebook'}</span>
            </button>
            <button 
              onClick={() => handleSocialShare('copy')}
              className="flex-1 py-2 px-3 border border-neutral-200 hover:border-black transition-colors rounded-xl text-[10px] font-bold text-neutral-600 hover:text-black flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Link2 className="w-3.5 h-3.5 text-neutral-500" />
              <span>{language === 'ar' ? 'نسخ الرابط' : 'Copy Link'}</span>
            </button>
          </div>
        </div>
      </div>

      
      <div className="bg-neutral-50/60 border border-neutral-100/80 rounded-2xl p-4 flex justify-between text-[11px] text-neutral-500 font-medium">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>{t.original100}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-neutral-400" />
          <span>{t.return14Days}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <MessageSquare className="w-4 h-4 text-neutral-400" />
          <span>{t.supportAlways}</span>
        </div>
      </div>

     
      {showSizeGuide && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0" onClick={() => setShowSizeGuide(false)} />
          <div 
            className="bg-white rounded-3xl w-full max-w-md p-6 relative shadow-2xl animate-in fade-in zoom-in-95 duration-200 z-10"
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          >
            <button 
              onClick={() => setShowSizeGuide(false)} 
              className={`absolute top-4 ${language === 'ar' ? 'left-4' : 'right-4'} p-1.5 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer text-neutral-400 hover:text-neutral-700`}
            >
              <X className="w-4.5 h-4.5" />
            </button>

            <div className="flex items-center gap-2 mb-6">
              <Ruler className="w-5 h-5 text-neutral-800" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">{t.sizeGuideTitle}</h3>
            </div>

            <div className="overflow-hidden border border-neutral-100 rounded-2xl mb-4">
              <table className="w-full text-center border-collapse">
                <thead>
                  <tr className="bg-neutral-50 text-[10px] uppercase font-bold text-neutral-500 border-b border-neutral-100">
                    <th className="py-2.5 px-3">{language === 'ar' ? 'المقاس' : 'Size'}</th>
                    <th className="py-2.5 px-3">{t.sizeGuideChest}</th>
                    <th className="py-2.5 px-3">{t.sizeGuideLength}</th>
                    <th className="py-2.5 px-3">{t.sizeGuideShoulders}</th>
                  </tr>
                </thead>
                <tbody className="text-[11px]">
                  {[
                    { name: 'XS', chest: '46', length: '66', shoulders: '40' },
                    { name: 'S', chest: '48', length: '68', shoulders: '42' },
                    { name: 'M', chest: '50', length: '70', shoulders: '44' },
                    { name: 'L', chest: '52', length: '72', shoulders: '46' },
                    { name: 'XL', chest: '54', length: '74', shoulders: '48' }
                  ].map((row) => {
                    const isSelected = selectedSize === row.name;
                    return (
                      <tr 
                        key={row.name}
                        className={`transition-colors duration-200 border-b border-neutral-100/70 last:border-b-0 ${
                          isSelected 
                            ? 'bg-neutral-950 text-white font-bold' 
                            : 'hover:bg-neutral-50 text-neutral-700'
                        }`}
                      >
                        <td className="py-3 px-3 font-bold">{row.name}</td>
                        <td className="py-3 px-3 font-mono">{row.chest}</td>
                        <td className="py-3 px-3 font-mono">{row.length}</td>
                        <td className="py-3 px-3 font-mono">{row.shoulders}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <p className="text-[10px] text-neutral-400 font-medium leading-relaxed">
              {t.sizeGuideNote}
            </p>
          </div>
        </div>
      )}

      
      <QuickCheckoutModal
        isOpen={isQuickCheckoutOpen}
        onClose={() => setIsQuickCheckoutOpen(false)}
        product={product}
        selectedSize={selectedSize}
        selectedColor={selectedColor}
      />
    </div>
  );
}
