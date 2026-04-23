import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Shield, Zap, Activity } from 'lucide-react';

export const GlobalIntelligence: React.FC<{ lang: string }> = ({ lang }) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { icon: Globe, label: lang === 'ar' ? 'الشبكة العالمية' : 'Global Network', value: '99.9%', color: 'text-blue-500' },
          { icon: Shield, label: lang === 'ar' ? 'الأمان' : 'Security', value: 'Military Grade', color: 'text-green-500' },
          { icon: Zap, label: lang === 'ar' ? 'الكمون' : 'Latency', value: '12ms', color: 'text-orange-500' },
          { icon: Activity, label: lang === 'ar' ? 'الحمل' : 'System Load', value: '24%', color: 'text-purple-500' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 bg-zinc-900 border border-zinc-800 rounded-3xl"
          >
            <stat.icon className={`w-6 h-6 ${stat.color} mb-4`} />
            <div className="text-2xl font-black">{stat.value}</div>
            <div className="text-xs text-zinc-500 uppercase tracking-widest">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-[32px]">
        <h2 className="text-2xl font-black mb-6">{lang === 'ar' ? 'تحليل التهديدات اللحظي' : 'Real-time Threat Analysis'}</h2>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center justify-between p-4 bg-black/50 rounded-2xl border border-zinc-800/50">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-sm font-mono text-zinc-400">NODE_0{i}_ACTIVE</span>
              </div>
              <span className="text-xs text-zinc-600">Verified by Nexus Core</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
