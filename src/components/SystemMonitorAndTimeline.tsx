import React, { useState } from 'react';
import {
  Activity,
  Server,
  Clock,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Database,
  Radio,
  Lock,
  Eye,
  Archive,
} from 'lucide-react';
import { SystemHealthItem, TimelineLogEntry } from '../types';
import { soundEngine } from '../utils/audio';

interface SystemMonitorAndTimelineProps {
  systemModules: SystemHealthItem[];
  timelineEvents: TimelineLogEntry[];
  soundEnabled: boolean;
}

export function SystemMonitorAndTimeline({
  systemModules,
  timelineEvents,
  soundEnabled,
}: SystemMonitorAndTimelineProps) {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(timelineEvents[timelineEvents.length - 1].id);

  const getSystemIcon = (nameEn: string) => {
    switch (nameEn) {
      case 'ARCHIVE':
        return Archive;
      case 'SURVEILLANCE':
        return Eye;
      case 'COMMUNICATION':
        return Radio;
      case 'ENCRYPTION':
        return Lock;
      case 'DATABASE':
        return Database;
      default:
        return Server;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-950 text-red-300 border-red-800';
      case 'HIGH':
        return 'bg-amber-950 text-amber-300 border-amber-800';
      case 'ELEVATED':
        return 'bg-yellow-950/70 text-yellow-300 border-yellow-800';
      default:
        return 'bg-emerald-950/70 text-emerald-300 border-emerald-800';
    }
  };

  return (
    <section className="w-full max-w-[1720px] mx-auto px-3 sm:px-6 my-6 select-none">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Side (Col 1-5): System Monitor & Health Matrix */}
        <div className="lg:col-span-5 tactical-box rounded-sm p-4 sm:p-5 bg-[#09120c] border border-[#203e27] shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#1b3420] pb-3 mb-4">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Server className="w-4 h-4 text-emerald-400" />
                <h3 className="text-base sm:text-lg font-arabic-display font-black text-zinc-100">
                  مراقبة سلامة الأنظمة والشبكات
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#102414] text-emerald-400 border border-[#234b29]">
                CORE SYSTEMS: ALL GREEN
              </span>
            </div>

            {/* Systems Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs">
              {systemModules.map((sys) => {
                const Icon = getSystemIcon(sys.nameEn);
                return (
                  <div
                    key={sys.id}
                    className="p-3 rounded bg-[#060c08] border border-[#182f1d] flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="font-bold text-zinc-200">{sys.nameEn}</span>
                      </div>
                      <Icon className="w-3.5 h-3.5 text-emerald-500/80" />
                    </div>

                    <div className="font-arabic-display text-[11px] text-zinc-400 mb-2">
                      {sys.nameAr}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1.5 border-t border-[#132617]">
                      <span className="text-emerald-400 font-bold">{sys.status}</span>
                      <span>LATENCY: {sys.latencyMs}ms</span>
                    </div>

                    {/* Mini Load Bar */}
                    <div className="w-full bg-[#0d1c11] h-1 rounded overflow-hidden mt-1.5">
                      <div
                        className="bg-emerald-500 h-full rounded"
                        style={{ width: `${sys.load}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#182f1d] flex items-center justify-between text-[11px] font-mono text-zinc-500">
            <span>UPTIME: 99.98% / 142 DAYS</span>
            <span className="text-emerald-400 font-bold">ALL SERVICES NOMINAL</span>
          </div>
        </div>

        {/* Right Side (Col 6-12): Classified Timeline */}
        <div className="lg:col-span-7 tactical-box rounded-sm p-4 sm:p-5 bg-[#09120c] border border-[#203e27] shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#1b3420] pb-3 mb-4">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Clock className="w-4 h-4 text-emerald-400" />
                <h3 className="text-base sm:text-lg font-arabic-display font-black text-zinc-100">
                  الجدول الزمني للعملية — التوثيق الميداني
                </h3>
              </div>
              <span className="text-[10px] font-mono text-zinc-400">
                CHRONOLOGICAL MISSION LOG
              </span>
            </div>

            {/* Timeline Stream */}
            <div className="space-y-2.5 max-h-[330px] overflow-y-auto pr-1 rtl:pr-0 rtl:pl-1">
              {timelineEvents.map((evt) => {
                const isSelected = selectedEventId === evt.id;
                return (
                  <div
                    key={evt.id}
                    onClick={() => {
                      if (soundEnabled) soundEngine.playUiClick(true);
                      setSelectedEventId(evt.id);
                    }}
                    className={`p-3 rounded-sm border transition-all cursor-pointer flex items-start space-x-3 rtl:space-x-reverse ${
                      isSelected
                        ? 'bg-[#142618] border-emerald-500 shadow-md'
                        : 'bg-[#060c08] border-[#182f1d] hover:border-[#2a5433]'
                    }`}
                  >
                    {/* Timestamp Badge */}
                    <div className="px-2 py-1 rounded bg-[#0d1d11] border border-[#1f3f26] text-emerald-400 font-mono font-bold text-xs shrink-0">
                      {evt.time}
                    </div>

                    {/* Event Content */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-sm font-arabic-display font-bold text-zinc-100">
                          {evt.titleAr}
                        </h4>
                        <span className={`px-2 py-0.5 rounded border text-[10px] font-mono font-bold ${getSeverityBadge(evt.severity)}`}>
                          {evt.severity}
                        </span>
                      </div>
                      <p className="text-xs font-arabic-display text-zinc-300 mt-1 leading-relaxed">
                        {evt.descriptionAr}
                      </p>
                      <div className="flex items-center space-x-3 rtl:space-x-reverse text-[10px] font-mono text-zinc-500 mt-1">
                        <span>SECTOR: {evt.sector}</span>
                        <span>//</span>
                        <span className="text-emerald-500/80">{evt.titleEn}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#182f1d] flex items-center justify-between text-[11px] font-mono text-zinc-500">
            <span>TIMELINE ENTRIES: {timelineEvents.length} RECORDED</span>
            <span className="text-zinc-400 font-arabic-display">انقر على أي حدث للتفاصيل الكاملة</span>
          </div>
        </div>
      </div>
    </section>
  );
}
