import React, { useState, useEffect } from 'react';
import {
  Shield,
  Radio,
  Lock,
  Eye,
  Volume2,
  VolumeX,
  Tv,
  RotateCcw,
  AlertTriangle,
  Activity,
  Terminal,
  FileText,
  Radar as RadarIcon,
  Layers,
} from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface HeaderHUDProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  crtEnabled: boolean;
  onToggleCrt: () => void;
  onReplayBoot: () => void;
  onTriggerLockdown: () => void;
  activeSection?: string;
  onNavigateSection?: (sectionId: string) => void;
  defcon?: 1 | 2 | 3 | 4 | 5;
  onSetDefcon?: (lvl: 1 | 2 | 3 | 4 | 5) => void;
}

export function HeaderHUD({
  soundEnabled,
  onToggleSound,
  crtEnabled,
  onToggleCrt,
  onReplayBoot,
  onTriggerLockdown,
  activeSection = 'overview',
  onNavigateSection = () => {},
  defcon = 2,
  onSetDefcon = () => {},
}: HeaderHUDProps) {
  const [timeStr, setTimeStr] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-GB', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
      setDateStr(
        now.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }).toUpperCase()
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'overview', labelAr: 'غرفة القيادة', labelEn: 'OVERVIEW', icon: Layers },
    { id: 'dossiers', labelAr: 'الملفات النشطة', labelEn: 'DOSSIERS', icon: FileText },
    { id: 'grid', labelAr: 'شبكة المراقبة', labelEn: 'GRID MAP', icon: Eye },
    { id: 'radar', labelAr: 'الرادار التكتيكي', labelEn: 'RADAR', icon: RadarIcon },
    { id: 'feed', labelAr: 'الاتصالات المعترضة', labelEn: 'SIGINT FEED', icon: Radio },
    { id: 'terminal', labelAr: 'موجه الأوامر', labelEn: 'TERMINAL', icon: Terminal },
  ];

  return (
    <header className="w-full bg-[#080e0a]/95 border-b border-[#1f3323] text-gray-200 select-none sticky top-0 z-20 backdrop-blur-sm">
      {/* Top Header Row */}
      <div className="max-w-[1720px] mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left Side: Organization Seal and Branding */}
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          {/* Emblem */}
          <div className="relative w-10 h-10 rounded-sm bg-[#111e14] border border-[#2e5436] flex items-center justify-center shadow-[0_0_12px_rgba(34,197,94,0.2)]">
            <Shield className="w-6 h-6 text-emerald-400" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse border border-[#080e0a]" />
          </div>

          <div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <h1 className="text-base sm:text-lg font-arabic-display font-black tracking-wide text-zinc-100">
                الهيئة العليا لأمن الدولة
              </h1>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#162719] text-emerald-400 font-mono border border-[#2b4c31]">
                HSS-SEC
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-zinc-400 font-arabic-display tracking-tight">
              شبكة العمليات الداخلية — مركز الرصد والتحليل الاستخباراتي
            </p>
          </div>
        </div>

        {/* Center: Mission Identifier */}
        <div className="flex flex-col items-center justify-center px-4 py-1 rounded bg-[#0e1911] border border-[#233f28] shadow-inner">
          <div className="flex items-center space-x-2 rtl:space-x-reverse text-[11px] text-emerald-400 font-mono font-bold tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>OPERATION: SHADOW-04</span>
          </div>
          <div className="text-xs sm:text-sm font-arabic-display font-bold text-amber-300/90 tracking-wide">
            عملية: الظل الرابع // النطاق التكتيكي الموحد
          </div>
        </div>

        {/* Right Side: Status Indicators & Clock */}
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          {/* Technical Status Dots */}
          <div className="hidden lg:flex flex-col space-y-1 text-[10px] font-mono border-r rtl:border-r-0 rtl:border-l border-[#1f3323] pr-4 rtl:pr-0 rtl:pl-4">
            <div className="flex items-center space-x-1.5 rtl:space-x-reverse text-emerald-400">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              <span>SECURE CONNECTION</span>
            </div>
            <div className="flex items-center space-x-1.5 rtl:space-x-reverse text-emerald-400">
              <Lock className="w-2.5 h-2.5" />
              <span>ENCRYPTION: AES-256</span>
            </div>
            <div className="flex items-center space-x-1.5 rtl:space-x-reverse text-emerald-400">
              <Radio className="w-2.5 h-2.5 animate-pulse" />
              <span>SURVEILLANCE ONLINE</span>
            </div>
          </div>

          {/* Clock & Date */}
          <div className="text-left rtl:text-right font-mono">
            <div className="text-sm sm:text-base font-bold text-emerald-400 tracking-wider">
              {timeStr || '00:00:00'} <span className="text-[10px] text-emerald-600 font-normal">UTC</span>
            </div>
            <div className="text-[10px] text-zinc-400">
              {dateStr || '15-SEP-2026'}
            </div>
          </div>

          {/* Quick HUD Controls */}
          <div className="flex items-center space-x-1.5 rtl:space-x-reverse border-l rtl:border-l-0 rtl:border-r border-[#1f3323] pl-3 rtl:pl-0 rtl:pr-3">
            {/* Sound Toggle */}
            <button
              onClick={() => {
                if (!soundEnabled) soundEngine.playUiClick(true);
                onToggleSound();
              }}
              className={`p-1.5 rounded border transition-colors ${
                soundEnabled
                  ? 'bg-emerald-950/60 border-emerald-600 text-emerald-300'
                  : 'bg-zinc-900 border-zinc-700 text-zinc-500'
              }`}
              title={soundEnabled ? 'كتم الصوت' : 'تشغيل الصوت'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* CRT Toggle */}
            <button
              onClick={() => {
                if (soundEnabled) soundEngine.playUiClick(true);
                onToggleCrt();
              }}
              className={`p-1.5 rounded border transition-colors ${
                crtEnabled
                  ? 'bg-emerald-950/60 border-emerald-600 text-emerald-300'
                  : 'bg-zinc-900 border-zinc-700 text-zinc-500'
              }`}
              title="تفعيل/إلغاء خطوط شاشة CRT التناظرية"
            >
              <Tv className="w-3.5 h-3.5" />
            </button>

            {/* Replay Boot */}
            <button
              onClick={() => {
                if (soundEnabled) soundEngine.playUiClick(true);
                onReplayBoot();
              }}
              className="p-1.5 rounded border border-[#25422a] bg-[#0f1b13] hover:border-emerald-500 text-zinc-400 hover:text-emerald-300 transition-colors"
              title="إعادة تشغيل بروتوكول الإقلاع التكتيكي"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* DEFCON Level Selector */}
            <div className="hidden md:flex items-center space-x-1 rtl:space-x-reverse bg-[#09120b] border border-[#1e3b24] p-0.5 rounded font-mono text-[10px]">
              <span className="text-zinc-500 px-1 font-bold">DEFCON:</span>
              {([1, 2, 3, 4, 5] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => {
                    if (soundEnabled) soundEngine.playUiClick(true);
                    onSetDefcon(lvl);
                  }}
                  className={`w-5 h-5 rounded font-bold transition-all ${
                    defcon === lvl
                      ? lvl === 1
                        ? 'bg-red-600 text-white shadow-[0_0_8px_rgba(239,68,68,0.8)]'
                        : lvl === 2
                        ? 'bg-amber-600 text-white'
                        : 'bg-emerald-600 text-white'
                      : 'text-zinc-500 hover:text-zinc-200'
                  }`}
                  title={`DEFCON ${lvl}`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            {/* Emergency Lockdown */}
            <button
              onClick={() => {
                if (soundEnabled) soundEngine.playAccessDenied(true);
                onTriggerLockdown();
              }}
              className="px-2.5 py-1 rounded border border-red-700/80 bg-red-950/70 hover:bg-red-900 text-red-300 font-mono text-[11px] font-bold flex items-center space-x-1.5 rtl:space-x-reverse transition-all shadow-[0_0_10px_rgba(220,38,38,0.2)]"
              title="تفعيل الإغلاق الأمني التكتيكي الطارئ"
            >
              <AlertTriangle className="w-3 h-3 text-red-400 animate-pulse" />
              <span className="font-arabic-display">إغلاق طارئ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Bar */}
      <div className="bg-[#060b08] border-t border-[#16251a] px-3 sm:px-6 py-1.5 overflow-x-auto scrollbar-none">
        <div className="max-w-[1720px] mx-auto flex items-center justify-between min-w-max gap-4">
          <div className="flex items-center space-x-1 sm:space-x-2 rtl:space-x-reverse">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (soundEnabled) soundEngine.playUiClick(true);
                    onNavigateSection(item.id);
                  }}
                  className={`flex items-center space-x-2 rtl:space-x-reverse px-3 py-1 text-xs transition-all ${
                    isActive
                      ? 'bg-[#152a1c] border-b-2 border-emerald-400 text-emerald-300 font-bold'
                      : 'text-zinc-400 hover:text-emerald-200 hover:bg-[#0c160f]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-zinc-500'}`} />
                  <span className="font-arabic-display">{item.labelAr}</span>
                  <span className="text-[10px] font-mono text-zinc-500">[{item.labelEn}]</span>
                </button>
              );
            })}
          </div>

          {/* Small Diagnostic Readout in Nav Bar */}
          <div className="hidden md:flex items-center space-x-3 rtl:space-x-reverse text-[11px] font-mono text-zinc-400">
            <span className="flex items-center space-x-1 rtl:space-x-reverse">
              <Activity className="w-3 h-3 text-emerald-400" />
              <span>NET_LOAD: 34%</span>
            </span>
            <span className="text-zinc-600">|</span>
            <span>NODES: 6/6 SYNCED</span>
            <span className="text-zinc-600">|</span>
            <span className="text-amber-400 font-bold">THREAT: ELEVATED</span>
          </div>
        </div>
      </div>
    </header>
  );
}
