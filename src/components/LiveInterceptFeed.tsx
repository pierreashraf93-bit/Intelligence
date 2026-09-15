import React, { useState, useEffect } from 'react';
import {
  Radio,
  Play,
  Pause,
  Filter,
  Trash2,
  Volume2,
  Lock,
  ArrowDownCircle,
  Clock,
  Send,
} from 'lucide-react';
import { InterceptedMessage } from '../types';
import { soundEngine } from '../utils/audio';

interface LiveInterceptFeedProps {
  initialMessages: InterceptedMessage[];
  soundEnabled: boolean;
}

export function LiveInterceptFeed({ initialMessages, soundEnabled }: LiveInterceptFeedProps) {
  const [messages, setMessages] = useState<InterceptedMessage[]>(initialMessages);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [activeChannelFilter, setActiveChannelFilter] = useState<string>('ALL');

  const incomingPool: Array<Omit<InterceptedMessage, 'id' | 'time'>> = [
    {
      source: 'UNIT-04',
      channel: 'CH-19',
      messageAr: 'رصد توقف المركبة المشبوهة أمام بوابة الشحن رقم 3، إنزال ركاب اثنين.',
      status: 'DECRYPTED',
      priority: 'URGENT',
      frequency: '142.850 MHz',
    },
    {
      source: 'CENTRAL',
      channel: 'CH-19',
      messageAr: 'تأكيد أمر الرصد دون تدخل. فريق الدعم في وضع التأهب خلف المنعطف.',
      status: 'DECRYPTED',
      priority: 'ROUTINE',
      frequency: '142.850 MHz',
    },
    {
      source: 'DRONE-08',
      channel: 'CH-04',
      messageAr: 'إشارة حرارية مرتفعة تنبعث من الطابق الأرضي للمبنى المهجور.',
      status: 'RECORDED',
      priority: 'FLASH',
      frequency: '433.850 MHz',
    },
    {
      source: 'SIGINT-02',
      channel: 'SEC-NET',
      messageAr: 'اعتراض مكالمة هاتف فضائي قصيرة مدتها 14 ثانية، جارٍ فك ترميز التردد.',
      status: 'INTERCEPTED',
      priority: 'ELEVATED',
      frequency: '868.100 MHz',
    },
    {
      source: 'SHADOW-LEAD',
      channel: 'CH-19',
      messageAr: 'المنفذ الخلفي مؤمن تماماً، لم تسجل أي محاولة هروب.',
      status: 'DECRYPTED',
      priority: 'ROUTINE',
      frequency: '142.850 MHz',
    },
  ];

  // Auto-feed new incoming messages when not paused
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const randomItem = incomingPool[Math.floor(Math.random() * incomingPool.length)];
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-GB', { hour12: false });

      const newMsg: InterceptedMessage = {
        id: `msg-${Date.now()}`,
        time: timeStr,
        ...randomItem,
      };

      setMessages((prev) => [newMsg, ...prev.slice(0, 24)]);
      if (soundEnabled) {
        soundEngine.playTelemetryBeep(true);
      }
    }, 7000);

    return () => clearInterval(interval);
  }, [isPaused, soundEnabled]);

  const filteredMessages = messages.filter((m) => {
    if (activeChannelFilter === 'ALL') return true;
    return m.channel === activeChannelFilter;
  });

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'FLASH':
        return 'bg-red-950 text-red-300 border-red-800 animate-pulse';
      case 'URGENT':
        return 'bg-amber-950 text-amber-300 border-amber-800';
      case 'ELEVATED':
        return 'bg-yellow-950/80 text-yellow-300 border-yellow-800';
      default:
        return 'bg-emerald-950/60 text-emerald-300 border-emerald-800';
    }
  };

  return (
    <section id="feed" className="w-full max-w-[1720px] mx-auto px-3 sm:px-6 my-6 select-none">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1f3825] pb-3 mb-4 gap-3">
        <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
          <div className="p-1.5 rounded bg-[#102214] border border-[#264c2e]">
            <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-arabic-display font-black text-zinc-100 tracking-wide">
              خط الاتصالات المعترضة — مصفوفة الرصد التكتيكي
            </h2>
            <p className="text-xs text-zinc-400 font-arabic-display">
              تفريغ فوري للإشارات اللاسلكية والبرقيات المشفرة لجميع قنوات العمليات
            </p>
          </div>
        </div>

        {/* Feed Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          {/* Channels Filter */}
          <div className="flex items-center space-x-1 rtl:space-x-reverse bg-[#0d1c11] border border-[#23452a] p-1 rounded">
            {['ALL', 'CH-19', 'CH-04', 'SEC-NET'].map((ch) => (
              <button
                key={ch}
                onClick={() => {
                  if (soundEnabled) soundEngine.playUiClick(true);
                  setActiveChannelFilter(ch);
                }}
                className={`px-2.5 py-0.5 rounded text-[11px] transition-colors ${
                  activeChannelFilter === ch
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'text-zinc-400 hover:text-emerald-300'
                }`}
              >
                {ch}
              </button>
            ))}
          </div>

          {/* Pause / Resume Button */}
          <button
            onClick={() => {
              if (soundEnabled) soundEngine.playUiClick(true);
              setIsPaused((prev) => !prev);
            }}
            className={`flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1.5 rounded border transition-colors ${
              isPaused
                ? 'bg-amber-950/70 border-amber-700 text-amber-300'
                : 'bg-[#122416] border-[#2b5231] text-emerald-300 hover:border-emerald-400'
            }`}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            <span className="font-arabic-display text-xs">
              {isPaused ? 'استئناف البث الحي' : 'إيقاف البث مؤقتاً'}
            </span>
          </button>

          {/* Clear Log */}
          <button
            onClick={() => {
              if (soundEnabled) soundEngine.playUiClick(true);
              setMessages([]);
            }}
            className="p-1.5 rounded border border-[#23452a] bg-[#0c180f] hover:border-red-700 text-zinc-400 hover:text-red-300 transition-colors"
            title="تفريغ السجل المؤقت"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Intercepts List Terminal Window */}
      <div className="tactical-box rounded-sm p-3 sm:p-4 bg-[#080f0a] border border-[#1b3420] shadow-xl">
        {/* Table Header Row (Hidden on mobile, stacked) */}
        <div className="hidden md:grid grid-cols-12 gap-3 pb-2 mb-2 border-b border-[#1b3420] text-xs font-mono text-zinc-500 font-bold tracking-wider">
          <div className="col-span-1">TIME [UTC]</div>
          <div className="col-span-2">SOURCE</div>
          <div className="col-span-2">CHANNEL / FREQ</div>
          <div className="col-span-5 font-arabic-display">نص البرقية المعترضة / MESSAGE</div>
          <div className="col-span-2 text-left rtl:text-right">STATUS / PRIORITY</div>
        </div>

        {/* Message Items */}
        <div className="divide-y divide-[#132718] max-h-[380px] overflow-y-auto space-y-1">
          {filteredMessages.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 font-mono text-xs">
              NO INTERCEPTED SIGNALS IN CURRENT BUFFER. WAITING FOR FREQUENCY BURST...
            </div>
          ) : (
            filteredMessages.map((msg, index) => (
              <div
                key={msg.id}
                className={`py-2.5 px-2 rounded-sm transition-colors grid grid-cols-1 md:grid-cols-12 gap-2 items-center text-xs font-mono ${
                  index === 0 && !isPaused ? 'bg-[#122818]/60 animate-fadeIn' : 'hover:bg-[#0c1a10]'
                }`}
              >
                {/* Time */}
                <div className="col-span-1 text-emerald-400 font-bold flex items-center space-x-1 rtl:space-x-reverse">
                  <Clock className="w-3 h-3 text-emerald-600 shrink-0 md:hidden" />
                  <span>{msg.time}</span>
                </div>

                {/* Source */}
                <div className="col-span-2 flex items-center space-x-1.5 rtl:space-x-reverse">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span className="text-zinc-200 font-bold">{msg.source}</span>
                </div>

                {/* Channel & Frequency */}
                <div className="col-span-2 text-zinc-400 text-[11px]">
                  <span className="px-1.5 py-0.5 rounded bg-[#102214] border border-[#224429] text-emerald-300 font-bold">
                    {msg.channel}
                  </span>
                  <span className="text-zinc-500 ml-1 rtl:mr-1">({msg.frequency})</span>
                </div>

                {/* Message Body (Arabic) */}
                <div className="col-span-5 font-arabic-display text-sm text-zinc-100 font-medium leading-relaxed">
                  "{msg.messageAr}"
                </div>

                {/* Status & Priority Badge */}
                <div className="col-span-2 flex items-center space-x-2 rtl:space-x-reverse md:justify-end rtl:md:justify-start">
                  <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${getPriorityBadge(msg.priority)}`}>
                    {msg.priority}
                  </span>
                  <span className="text-[10px] text-zinc-500">[{msg.status}]</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Live Feed Status Bar */}
        <div className="mt-3 pt-2 border-t border-[#1b3420] flex items-center justify-between text-[11px] font-mono text-zinc-500">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className={`w-2 h-2 rounded-full ${isPaused ? 'bg-amber-500' : 'bg-emerald-400 animate-ping'}`} />
            <span className="text-zinc-400">
              RECEIVER ARRAY: {isPaused ? 'PAUSED' : 'LISTENING TO SHORTWAVE FREQUENCIES'}
            </span>
          </div>
          <span>BUFFER: {filteredMessages.length} ENTRIES</span>
        </div>
      </div>
    </section>
  );
}
