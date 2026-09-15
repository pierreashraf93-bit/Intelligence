import React, { useState, useEffect } from 'react';
import {
  Activity,
  AlertTriangle,
  Users,
  MapPin,
  Radio,
  FolderLock,
  Cpu,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

interface OperationStatusProps {
  soundEnabled: boolean;
}

export function OperationStatus({ soundEnabled }: OperationStatusProps) {
  // Animated counters
  const [agentsCount, setAgentsCount] = useState<number>(0);
  const [locationsCount, setLocationsCount] = useState<number>(0);
  const [signalsCount, setSignalsCount] = useState<number>(120);
  const [integrityVal, setIntegrityVal] = useState<number>(92.0);

  useEffect(() => {
    // Initial entrance counter animation
    const duration = 1200;
    const steps = 30;
    const intervalTime = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const ratio = currentStep / steps;

      setAgentsCount(Math.round(ratio * 7));
      setLocationsCount(Math.round(ratio * 12));
      setSignalsCount(Math.round(120 + ratio * 28));
      setIntegrityVal(parseFloat((92.0 + ratio * 7.7).toFixed(1)));

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  // Subtle real-time signal ticker increase
  useEffect(() => {
    const signalInterval = setInterval(() => {
      setSignalsCount((prev) => prev + (Math.random() > 0.4 ? 1 : 0));
    }, 4500);
    return () => clearInterval(signalInterval);
  }, []);

  const stats = [
    {
      id: 'mission-status',
      labelEn: 'MISSION STATUS',
      labelAr: 'حالة العملية الرئيسية',
      value: 'ACTIVE',
      subValueAr: 'الظل الرابع — جارية',
      icon: Activity,
      color: 'text-emerald-400',
      borderColor: 'border-emerald-700/60',
      bgColor: 'bg-emerald-950/30',
      badge: 'STABLE',
      indicator: 'bg-emerald-400 animate-ping',
    },
    {
      id: 'threat-level',
      labelEn: 'THREAT LEVEL',
      labelAr: 'مستوى التهديد الأمني',
      value: 'ELEVATED',
      subValueAr: 'درجة التأهب: DEFCON-2',
      icon: AlertTriangle,
      color: 'text-amber-400',
      borderColor: 'border-amber-700/60',
      bgColor: 'bg-amber-950/20',
      badge: 'DEFCON 2',
      indicator: 'bg-amber-400 animate-pulse',
    },
    {
      id: 'active-units',
      labelEn: 'AGENTS ACTIVE',
      labelAr: 'الوحدات الميدانية النشطة',
      value: `0${agentsCount}`,
      subValueAr: '5 فرق + طائرتان مسيرتان',
      icon: Users,
      color: 'text-emerald-300',
      borderColor: 'border-[#27442d]',
      bgColor: 'bg-[#0b160f]',
      badge: 'DEPLOYED',
      indicator: 'bg-emerald-500',
    },
    {
      id: 'monitored-locations',
      labelEn: 'LOCATIONS MONITORED',
      labelAr: 'المواقع تحت الرصد',
      value: `${locationsCount < 10 ? '0' : ''}${locationsCount}`,
      subValueAr: '5 قطاعات تكتيكية محصنة',
      icon: MapPin,
      color: 'text-emerald-300',
      borderColor: 'border-[#27442d]',
      bgColor: 'bg-[#0b160f]',
      badge: 'SECURED',
      indicator: 'bg-emerald-400',
    },
    {
      id: 'signals-intercepted',
      labelEn: 'SIGNALS INTERCEPTED',
      labelAr: 'الإشارات المعترضة',
      value: `${signalsCount}`,
      subValueAr: 'مصفوفة الرصد التكتيكي',
      icon: Radio,
      color: 'text-emerald-300',
      borderColor: 'border-[#27442d]',
      bgColor: 'bg-[#0b160f]',
      badge: 'REAL-TIME',
      indicator: 'bg-emerald-400 animate-pulse',
    },
    {
      id: 'files-open',
      labelEn: 'FILES OPEN',
      labelAr: 'الملفات قيد المتابعة',
      value: '06',
      subValueAr: 'أرشيف الاستخبارات النشط',
      icon: FolderLock,
      color: 'text-emerald-300',
      borderColor: 'border-[#27442d]',
      bgColor: 'bg-[#0b160f]',
      badge: 'CLASSIFIED',
      indicator: 'bg-emerald-500',
    },
    {
      id: 'system-integrity',
      labelEn: 'SYSTEM INTEGRITY',
      labelAr: 'سلامة المنظومة الموحدة',
      value: `${integrityVal.toFixed(1)}%`,
      subValueAr: 'تكامل التشفير والتخزين',
      icon: ShieldCheck,
      color: 'text-emerald-400',
      borderColor: 'border-emerald-700/60',
      bgColor: 'bg-emerald-950/20',
      badge: 'OPTIMAL',
      indicator: 'bg-emerald-400',
    },
  ];

  return (
    <section className="w-full max-w-[1720px] mx-auto px-3 sm:px-6 my-4 select-none">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-[#1b3020] pb-2 mb-4">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-sm" />
          <h2 className="text-lg sm:text-xl font-arabic-display font-black text-zinc-100 tracking-wide">
            حالة العملية — المؤشرات التكتيكية الحية
          </h2>
          <span className="text-xs font-mono text-zinc-500">
            [TACTICAL OPERATION STATUS // THEATER TELEMETRY]
          </span>
        </div>

        <div className="hidden sm:flex items-center space-x-3 rtl:space-x-reverse text-xs font-mono text-emerald-500/80">
          <span>STREAM: HIGH-PRIORITY</span>
          <span>//</span>
          <span>ENCRYPTION: VERIFIED</span>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`tactical-box ${item.bgColor} border ${item.borderColor} p-3 sm:p-4 rounded-sm flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-emerald-500 transition-colors`}
            >
              {/* Module Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
                  <span className={`w-1.5 h-1.5 rounded-full ${item.indicator}`} />
                  <span className="text-[10px] font-mono text-zinc-400 tracking-wider">
                    {item.labelEn}
                  </span>
                </div>
                <Icon className={`w-4 h-4 ${item.color} opacity-70 group-hover:opacity-100 transition-opacity`} />
              </div>

              {/* Large Value Counter */}
              <div className="my-1">
                <div className={`text-2xl sm:text-3xl font-mono font-black tracking-wider ${item.color}`}>
                  {item.value}
                </div>
                <div className="text-xs font-arabic-display font-bold text-zinc-200 mt-0.5">
                  {item.labelAr}
                </div>
              </div>

              {/* Module Footer Readout */}
              <div className="mt-2 pt-2 border-t border-[#1a3020]/70 flex items-center justify-between text-[10px] font-mono text-zinc-400">
                <span className="truncate">{item.subValueAr}</span>
                <span className="text-[9px] px-1 rounded bg-[#070e09] border border-[#1b3221] text-emerald-400 font-bold shrink-0">
                  {item.badge}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
