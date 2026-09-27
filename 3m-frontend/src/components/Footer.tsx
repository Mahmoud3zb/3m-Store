import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Mail, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { useLanguageStore } from '../store/languageStore';
import { translations } from '../lib/translations';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { language } = useLanguageStore();
  const t = translations[language];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-neutral-950 text-neutral-200 pt-20 pb-12 px-6 md:px-12 border-t border-neutral-900 mt-20" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Top Value Badges Bar */}
      <div className={`max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 pb-14 border-b border-neutral-900 mb-14 text-center ${language === 'ar' ? 'md:text-right' : 'md:text-left'}`}>
        
        {/* Shipping Feature */}
        <div className="flex flex-col md:flex-row items-center gap-4 group">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center transition-all duration-300 group-hover:bg-amber-500 group-hover:text-neutral-950 text-amber-400">
            <Truck className="w-5 h-5" />
          </div>
          <div className={`space-y-1 text-center ${language === 'ar' ? 'md:text-right' : 'md:text-left'}`}>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">{t.shippingTitle}</h4>
            <p className="text-[11px] text-neutral-400 leading-relaxed">{t.shippingDesc}</p>
          </div>
        </div>

        {/* Return / Warranty Feature */}
        <div className="flex flex-col md:flex-row items-center gap-4 group">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center transition-all duration-300 group-hover:bg-amber-500 group-hover:text-neutral-950 text-amber-400">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div className={`space-y-1 text-center ${language === 'ar' ? 'md:text-right' : 'md:text-left'}`}>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">{t.returnTitle}</h4>
            <p className="text-[11px] text-neutral-400 leading-relaxed">{t.returnDesc}</p>
          </div>
        </div>

        {/* Secure Payment Feature */}
        <div className="flex flex-col md:flex-row items-center gap-4 group">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center transition-all duration-300 group-hover:bg-amber-500 group-hover:text-neutral-950 text-amber-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className={`space-y-1 text-center ${language === 'ar' ? 'md:text-right' : 'md:text-left'}`}>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">{t.securePaymentTitle}</h4>
            <p className="text-[11px] text-neutral-400 leading-relaxed">{t.securePaymentDesc}</p>
          </div>
        </div>

      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
        
        {/* Brand Column */}
        <div className="lg:col-span-4 space-y-5">
          <Link to="/" className="inline-flex items-center gap-2.5 group" dir="ltr">
            <img 
              src="/newLogoLapHub.png" 
              alt="LapHub" 
              className="h-10 w-10 object-contain drop-shadow-md group-hover:scale-105 transition-transform" 
            />
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-wider text-amber-500">
                Lap<span className="text-white">Hub</span>
              </span>
              <span className="text-[9px] font-bold text-amber-600 tracking-widest uppercase -mt-1">
                Imported Laptops
              </span>
            </div>
          </Link>

          <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
            {t.footerBrandDesc}
          </p>
          
          {/* Social Links */}
          <div className="flex items-center gap-3 pt-1">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-amber-500 hover:text-amber-400 transition-all flex items-center justify-center text-neutral-400"
              title="Instagram"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-amber-500 hover:text-amber-400 transition-all flex items-center justify-center text-neutral-400"
              title="Twitter"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
            </a>
            
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-amber-500 hover:text-amber-400 transition-all flex items-center justify-center text-neutral-400"
              title="Facebook"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="lg:col-span-4 grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">{t.shopping}</h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <Link to="/" className="hover:text-amber-400 hover:underline decoration-amber-500/40 transition-colors">{t.home}</Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-amber-400 hover:underline decoration-amber-500/40 transition-colors">{t.shop}</Link>
              </li>
              <li>
                <Link to="/favorites" className="hover:text-amber-400 hover:underline decoration-amber-500/40 transition-colors">{t.favorites}</Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-amber-400 hover:underline decoration-amber-500/40 transition-colors">{t.shoppingBag}</Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">{t.supportHelp}</h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <Link to="/about" className="hover:text-amber-400 hover:underline decoration-amber-500/40 transition-colors">{t.aboutUs}</Link>
              </li>
              <li>
                <a href="#" className="hover:text-amber-400 hover:underline decoration-amber-500/40 transition-colors">{t.shippingDelivery}</a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-400 hover:underline decoration-amber-500/40 transition-colors">{t.returnPolicy}</a>
              </li>
              <li>
                <Link to="/about" className="hover:text-amber-400 hover:underline decoration-amber-500/40 transition-colors">{t.contactUs}</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Column */}
        <div className="lg:col-span-4 space-y-4">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">{t.joinUs}</h4>
          <p className="text-[11px] text-neutral-400 leading-relaxed">
            {t.newsletterDesc}
          </p>

          <form onSubmit={handleSubscribe} className="space-y-3.5 pt-1">
            <div className="relative flex items-center">
              <Mail className={`absolute w-4 h-4 text-neutral-500 ${language === 'ar' ? 'right-4' : 'left-4'}`} />
              <input
                type="email"
                required
                placeholder={t.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full bg-neutral-900 border border-neutral-800 focus:border-amber-500 focus:bg-black py-3 rounded-xl text-xs font-bold outline-none text-white transition-all placeholder-neutral-600 ${language === 'ar' ? 'pr-11 pl-12' : 'pl-11 pr-12'}`}
              />
              <button
                type="submit"
                className={`absolute w-8 h-8 rounded-lg bg-amber-500 text-neutral-950 hover:bg-amber-400 font-bold transition-all flex items-center justify-center cursor-pointer ${language === 'ar' ? 'left-2' : 'right-2'}`}
                title={t.subscribe}
              >
                {language === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
            
            {subscribed && (
              <p className="text-[10px] text-emerald-400 font-bold">{t.subscribeSuccess}</p>
            )}
          </form>
        </div>

      </div>

      {/* Bottom Rights & Payment Icons */}
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-neutral-900 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-neutral-500 uppercase tracking-widest">
        
        <div>
          <span>© 2026 LapHub Store. {language === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}</span>
        </div>

        {/* Supported Payment Badges */}
        <div className="flex items-center gap-3 text-neutral-400">
          <span className="text-[9px] tracking-wider uppercase font-bold text-neutral-500">{t.supportedPayments}:</span>
          <span className="font-serif-en border border-neutral-800 px-2.5 py-1 rounded text-[9px] tracking-widest font-black bg-neutral-900 text-amber-400">COD (كاش عند الاستلام)</span>
          <span className="font-serif-en border border-neutral-800 px-2 py-1 rounded text-[8px] tracking-widest font-black bg-neutral-900 text-neutral-300">VISA</span>
          <span className="font-serif-en border border-neutral-800 px-2 py-1 rounded text-[8px] tracking-widest font-black bg-neutral-900 text-neutral-300">MASTERCARD</span>
        </div>

        <div>
          <span>
            <a href="https://www.facebook.com/mahmoud.azaab.376/" target="_blank" rel="noopener noreferrer" className='text-neutral-400 hover:text-amber-400 transition-colors font-bold text-[12px] tracking-wider uppercase'>By 3ZB</a> 
          </span>
        </div>

      </div>

    </footer>
  );
};
