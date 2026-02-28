import { useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, Home, Moon, Clock, Compass, MoreHorizontal } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { cn } from '@/lib/utils';

const BottomNav = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const items = [
    { path: '/', icon: Home, label: t.nav.home },
    { path: '/quran', icon: BookOpen, label: t.nav.quran },
    { path: '/azkar', icon: Moon, label: t.nav.azkar },
    { path: '/prayer', icon: Clock, label: t.nav.prayer },
    { path: '/qibla', icon: Compass, label: t.nav.qibla },
    { path: '/more', icon: MoreHorizontal, label: t.nav.more },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card/80 backdrop-blur-lg safe-area-bottom">
      <div className="flex items-center justify-around py-2 px-2 max-w-lg mx-auto">
        {items.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-[56px]',
                isActive
                  ? 'text-primary scale-105'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className={cn('h-5 w-5', isActive && 'stroke-[2.5]')} />
              <span className="text-[10px] font-medium">{label}</span>
              {isActive && (
                <div className="h-1 w-1 rounded-full bg-accent mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
