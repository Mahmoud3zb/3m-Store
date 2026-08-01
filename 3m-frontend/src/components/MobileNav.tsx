import React from 'react'
import { Home, Shirt, Search, Heart, User } from 'lucide-react'
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
    { id: 'shop' as TabType, label: t.shop, Icon: Shirt },
    { id: 'search' as TabType, label: t.search, Icon: Search, isFloating: true },
    { id: 'favorites' as TabType, label: t.favorites, Icon: Heart, badge: favoritesCount },
    { id: 'profile' as TabType, label: t.profile, Icon: User },
  ]

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[88%] max-w-sm md:hidden pointer-events-none">
      <div className="flex justify-around items-center bg-white/80 backdrop-blur-xl border border-white/40 py-2 px-4 rounded-full shadow-[0_6px_24px_0_rgba(0,0,0,0.08)] pointer-events-auto">
        {tabs.map(({ id, Icon, badge, isFloating }) => {
          const isActive = activeTab === id
          if (isFloating) {
            return (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                className="relative -top-4 bg-black hover:bg-neutral-900 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-md border-3 border-[#F8F8F8] transition-transform active:scale-95 cursor-pointer flex-shrink-0"
                title={t.search}
              >
                <Icon className="w-4 h-4" />
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
                className={`w-5 h-5 transition-colors duration-300 ${
                  isActive ? 'text-black scale-105' : 'text-gray-400 hover:text-gray-600'
                }`}
              />
              {badge !== undefined && badge > 0 && (
                <span className="absolute top-0 right-0 bg-black text-white text-[8px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center font-serif-en">
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
