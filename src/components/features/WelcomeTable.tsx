import React from 'react';
import { User, Shield, Star, Activity } from 'lucide-react';

interface WelcomeTableProps {
  lang: 'ar' | 'en';
  userName?: string;
}

export const WelcomeTable: React.FC<WelcomeTableProps> = ({ lang, userName = 'User' }) => {
  const stats = [
    { label: lang === 'ar' ? 'المشاريع المنفذة' : 'Projects Deployed', value: '12', icon: <Activity className="w-4 h-4 text-blue-500" /> },
    { label: lang === 'ar' ? 'مستوى الأمان' : 'Security Level', value: '98%', icon: <Shield className="w-4 h-4 text-green-500" /> },
    { label: lang === 'ar' ? 'تقييم الأداء' : 'Performance Score', value: 'A+', icon: <Star className="w-4 h-4 text-yellow-500" /> },
  ];

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <User className="w-8 h-8 text-orange-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              {lang === 'ar' ? `مرحباً بك، ${userName}` : `Welcome back, ${userName}`}
            </h2>
            <p className="text-zinc-500 text-sm">
              {lang === 'ar' ? 'إليك نظرة سريعة على نشاطك الأخير في Brand Factory' : 'Here is a quick look at your recent activity in Brand Factory'}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center gap-3">
              <div className="p-2 bg-zinc-800 rounded-lg">
                {stat.icon}
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 uppercase font-mono">{stat.label}</p>
                <p className="text-lg font-bold text-white leading-none">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
