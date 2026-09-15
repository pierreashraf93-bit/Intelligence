import React, { useState, useEffect, useRef } from 'react';
import { soundEngine } from '../utils/audio';
import { ShieldCheck, Terminal as TerminalIcon, Cpu, Lock, Radio, CheckCircle, Volume2, VolumeX } from 'lucide-react';

interface BootSequenceProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onComplete: () => void;
}

interface BootStep {
  textEn: string;
  textAr: string;
  status: 'pending' | 'processing' | 'done';
  diagnostic?: string;
}

export function BootSequence({ soundEnabled, onToggleSound, onComplete }: BootSequenceProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [typedChars, setTypedChars] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const [grantedFlash, setGrantedFlash] = useState<boolean>(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  const steps: BootStep[] = [
    { textEn: 'SYSTEM INITIALIZATION // HARDWARE DIAGNOSTICS', textAr: 'بدء تشغيل المنظومة — فحص العتاد التناظري والرقمي...', status: 'done', diagnostic: 'MEM: 64TB OK // CPU-CLUSTER: NOMINAL' },
    { textEn: 'NETWORK INTEGRITY VERIFICATION // SECURE MESH', textAr: 'التحقق من سلامة الشبكة المشفرة — تكامل المسارات 99.98%', status: 'done', diagnostic: 'LATENCY: 1.2ms // PACKET LOSS: 0.00%' },
    { textEn: 'CRYPTOGRAPHIC HANDSHAKE // AES-256-GCM', textAr: 'تثبيت بروتوكول التشفير العسكري — تبادل المفاتيح السيادية', status: 'done', diagnostic: 'KEY_HASH: 9E74A...43F1 // CIPHER: ECC-521' },
    { textEn: 'SECURE CHANNEL INITIALIZATION // TRUNK 19', textAr: 'تدشين القناة المعزولة — خط الاتصال التكتيكي 19 نشط', status: 'done', diagnostic: 'BAUD: 115200 // BUFFER: SYNCED' },
    { textEn: 'IDENTITY & BIOMETRIC CONFIRMATION // ID: 7734-XZ', textAr: 'التحقق من الهوية البيومترية — مطابقة النمط العصبي', status: 'done', diagnostic: 'BIOMETRIC MATCH: 99.8% // CODENAME: SHADOW-04' },
    { textEn: 'CLEARANCE LEVEL VERIFICATION // LEVEL 06', textAr: 'تدقيق مستوى التفويض الأمني — الفئة السادسة (سري للغاية)', status: 'done', diagnostic: 'CLEARANCE: GRANTED // RESTRICTIONS: NONE' },
    { textEn: 'ARCHIVE INTEGRITY CHECK // STATE SECURITY REPO', textAr: 'فحص مصفوفة الأرشيف الاستخباري — الملفات النشطة متصلة', status: 'done', diagnostic: 'DOCUMENTS: 6 LOADED // TAMPER_FLAG: 0' },
    { textEn: 'SURVEILLANCE GRID & TACTICAL RADAR ONLINE', textAr: 'ربط شبكة الرصد الجغرافي والرادار الميداني بالمركز الرئيسي', status: 'done', diagnostic: 'ZONES: 5 ACTIVE // ASSETS: 5 TRACKED' },
    { textEn: 'OPERATIONS ROOM CONNECTION ESTABLISHED', textAr: 'تم إنشاء الاتصال بغرفة العمليات المركزية — جاهزية كاملة', status: 'done', diagnostic: 'THEATER: OMEGA-01 // UPLINK: LOCKED' },
  ];

  // Auto-advance sequence
  useEffect(() => {
    if (currentStepIndex < steps.length) {
      const step = steps[currentStepIndex];
      let charPos = 0;
      const fullText = `> ${step.textEn} [${step.textAr}]`;

      const typeInterval = setInterval(() => {
        if (charPos < fullText.length) {
          setTypedChars(fullText.slice(0, charPos + 1));
          if (soundEnabled && charPos % 2 === 0) {
            soundEngine.playKeyClick(true);
          }
          charPos++;
        } else {
          clearInterval(typeInterval);
          // Wait briefly then advance to next step
          setTimeout(() => {
            if (soundEnabled) soundEngine.playBreachChirp(true);
            setProgress(Math.round(((currentStepIndex + 1) / steps.length) * 100));
            setCurrentStepIndex((prev) => prev + 1);
          }, 320);
        }
      }, 16);

      return () => clearInterval(typeInterval);
    } else {
      // Completed all steps -> Dramatic ACCESS GRANTED
      setGrantedFlash(true);
      if (soundEnabled) soundEngine.playAccessGranted(true);
      const timer = setTimeout(() => {
        onComplete();
      }, 1600);
      return () => clearTimeout(timer);
    }
  }, [currentStepIndex, soundEnabled]);

  // Keyboard shortcut: ESC to skip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (soundEnabled) soundEngine.playUiClick(true);
        onComplete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [soundEnabled, onComplete]);

  // Auto scroll terminal to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [currentStepIndex, typedChars]);

  return (
    <div className="fixed inset-0 z-50 bg-[#050806] text-emerald-400 font-terminal flex flex-col justify-between p-4 sm:p-8 select-none crt-vignette overflow-hidden">
      {/* Top Bar with Classification & Controls */}
      <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3 text-xs tracking-wider">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
          <span className="font-bold text-emerald-300">BOOT SEQUENCE // SECURE OS v4.9.1</span>
          <span className="hidden sm:inline text-emerald-600">|</span>
          <span className="hidden sm:inline text-emerald-500/80 font-arabic-display">الهيئة العليا لأمن الدولة</span>
        </div>

        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          {/* Sound Toggle */}
          <button
            onClick={() => {
              if (!soundEnabled) soundEngine.playUiClick(true);
              onToggleSound();
            }}
            className="flex items-center space-x-1.5 rtl:space-x-reverse px-2.5 py-1 rounded border border-emerald-800/80 hover:border-emerald-500 bg-emerald-950/40 text-emerald-300 hover:text-emerald-100 transition-colors"
            title={soundEnabled ? 'كتم الصوت' : 'تفعيل الصوت'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-zinc-500" />}
            <span className="text-[11px] font-mono">{soundEnabled ? 'AUDIO: ON' : 'AUDIO: OFF'}</span>
          </button>

          {/* Professional Skip Button */}
          <button
            onClick={() => {
              if (soundEnabled) soundEngine.playUiClick(true);
              onComplete();
            }}
            className="px-3 py-1 rounded border border-emerald-700/80 hover:border-emerald-400 bg-emerald-950/60 hover:bg-emerald-900/40 text-emerald-300 font-bold transition-all shadow-[0_0_10px_rgba(16,185,129,0.15)] flex items-center space-x-2 rtl:space-x-reverse"
          >
            <span className="font-arabic-display text-xs">تخطي التشغيل</span>
            <span className="text-[10px] text-emerald-500 border border-emerald-800 px-1 rounded bg-black/40">ESC</span>
          </button>
        </div>
      </div>

      {/* Main Terminal Window */}
      <div className="flex-1 my-6 max-w-4xl w-full mx-auto flex flex-col justify-center">
        {/* Terminal Header */}
        <div className="bg-[#0b130e] border border-emerald-800/80 p-3 rounded-t flex items-center justify-between text-xs text-emerald-400/90">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <TerminalIcon className="w-4 h-4 text-emerald-400" />
            <span className="font-mono font-bold tracking-wider">TERMINAL // SEC-NODE-04</span>
          </div>
          <div className="flex items-center space-x-3 rtl:space-x-reverse text-[11px] text-emerald-500">
            <span className="hidden sm:inline">CIPHER: AES-256</span>
            <span>PORT: 3000/SEC</span>
            <span className="text-emerald-300 font-bold">{progress}%</span>
          </div>
        </div>

        {/* Terminal Body */}
        <div
          ref={terminalRef}
          className="bg-[#070d09]/95 border-x border-b border-emerald-800/70 p-4 sm:p-6 rounded-b h-72 sm:h-96 overflow-y-auto space-y-2 text-xs sm:text-sm font-mono shadow-[inset_0_0_30px_rgba(0,0,0,0.8)]"
        >
          {/* Previous finished steps */}
          {steps.slice(0, currentStepIndex).map((s, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-emerald-300/90 border-b border-emerald-950/60 pb-1.5">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-emerald-500">[{s.textEn.split('//')[0].trim()}]</span>
                <span className="text-zinc-200 font-arabic-display">{s.textAr}</span>
              </div>
              {s.diagnostic && (
                <span className="text-[11px] text-emerald-600/90 font-mono tracking-tight self-end sm:self-auto">
                  {s.diagnostic}
                </span>
              )}
            </div>
          ))}

          {/* Current typing step */}
          {currentStepIndex < steps.length && (
            <div className="text-emerald-300 flex items-center space-x-1.5 pt-1">
              <span>{typedChars}</span>
              <span className="inline-block w-2.5 h-4 bg-emerald-400 animate-pulse" />
            </div>
          )}

          {/* Dramatic ACCESS GRANTED Box */}
          {grantedFlash && (
            <div className="mt-6 border-2 border-emerald-400 bg-emerald-950/80 p-5 text-center rounded animate-pulse shadow-[0_0_30px_rgba(16,185,129,0.4)]">
              <div className="flex justify-center mb-2">
                <ShieldCheck className="w-12 h-12 text-emerald-400" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-widest text-emerald-200 uppercase font-mono">
                ACCESS GRANTED // LEVEL 06 CLEARANCE
              </h2>
              <p className="text-base sm:text-lg text-emerald-400 font-arabic-display mt-1">
                تم التحقق من التفويض الأمني — مرحباً بك في بوابة العمليات السرية
              </p>
              <div className="mt-2 text-xs text-emerald-600 font-mono">
                INITIALIZING THEATER DASHBOARD...
              </div>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-emerald-500 mb-1 font-mono">
            <span>UPLINK PROGRESS: {progress}%</span>
            <span>VERIFICATION STATUS: {progress === 100 ? 'AUTHENTICATED' : 'PROCESSING...'}</span>
          </div>
          <div className="h-2 w-full bg-[#0d1711] border border-emerald-900 rounded overflow-hidden p-0.5">
            <div
              className="h-full bg-emerald-500 transition-all duration-300 shadow-[0_0_10px_rgba(52,211,153,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Technical Readout */}
      <div className="border-t border-emerald-900/60 pt-3 flex flex-col sm:flex-row items-center justify-between text-[11px] text-emerald-600 font-mono gap-2">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <span>HOST: OPS-SRV-09</span>
          <span>NODE: DAMASCUS-NEXUS</span>
          <span>PROTOCOL: MIL-STD-188</span>
        </div>
        <div className="text-center text-zinc-500 font-arabic-display">
          محاكاة درامية سرية لأغراض المشاهد المسرحية والسينمائية — جميع البيانات وهمية بالكامل
        </div>
        <div className="text-emerald-500">
          SYS TIME: {new Date().toLocaleTimeString('en-GB')}
        </div>
      </div>
    </div>
  );
}
