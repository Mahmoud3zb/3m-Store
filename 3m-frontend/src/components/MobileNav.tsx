import React from 'react'
import { Home, Laptop, Search, Heart, User } from 'lucide-react'
import { useLanguageStore } from '../store/languageStore'
import { translations } from '../lib/translations'

export type TabType = 'home' | 'shop' | 'search' | 'favorites' | 'profile'

interface MobileNavProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
  favoritesCount?: number
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  onTabChange,
  favoritesCount = 0,
}) => {
  const { language } = useLanguageStore()
  const t = translations[language]

  const tabs = [
    { id: 'home' as TabType, label: t.home, Icon: Home },
    { id: 'shop' as TabType, label: t.shop, Icon: Laptop },
    { id: 'search' as TabType, label: t.search, Icon: Search, isFloating: true },
    { id: 'favorites' as TabType, label: t.favorites, Icon: Heart, badge: favoritesCount },
    { id: 'profile' as TabType, label: t.profile, Icon: User },
  ]

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm md:hidden pointer-events-none">
      <div className="flex justify-around items-center bg-neutral-950/90 backdrop-blur-xl border border-amber-500/20 py-2.5 px-4 rounded-full shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] pointer-events-auto">
        {tabs.map(({ id, Icon, badge, isFloating }) => {
          const isActive = activeTab === id
          if (isFloating) {
            return (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                className="relative -top-5 bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-neutral-950 w-11 h-11 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30 border-3 border-neutral-950 transition-transform active:scale-95 cursor-pointer flex-shrink-0"
                title={t.search}
              >
                <Icon className="w-5 h-5 font-bold" />
              </button>
            )
          }
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className="relative p-1.5 flex flex-col items-center justify-center transition-all cursor-pointer"
            >
              <Icon
                className={`w-5 h-5 transition-all duration-300 ${
                  isActive ? 'text-amber-400 scale-110' : 'text-neutral-400 hover:text-white'
                }`}
              />
              {badge !== undefined && badge > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-neutral-950 text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center font-serif-en border border-neutral-950">
                  {badge}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
