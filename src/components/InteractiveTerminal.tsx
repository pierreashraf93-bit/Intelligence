import React, { useState, useRef, useEffect } from 'react';
import {
  Terminal as TerminalIcon,
  Send,
  CornerDownLeft,
  Trash2,
  HelpCircle,
  ShieldAlert,
} from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface InteractiveTerminalProps {
  soundEnabled: boolean;
  onTriggerLockdown: () => void;
}

interface TerminalLog {
  id: string;
  type: 'input' | 'output' | 'error' | 'warning' | 'system';
  text: string;
  time: string;
}

export function InteractiveTerminal({ soundEnabled, onTriggerLockdown }: InteractiveTerminalProps) {
  const [inputVal, setInputVal] = useState<string>('');
  const [history, setHistory] = useState<TerminalLog[]>([
    {
      id: 'init-1',
      type: 'system',
      text: 'OPERATIONAL COMMAND SHELL // SEC-OS KERNEL v9.42 (x86_64-classified)',
      time: '20:42:00',
    },
    {
      id: 'init-2',
      type: 'system',
      text: 'Type "help" or "تعليمات" to view list of authorized theatrical commands.',
      time: '20:42:01',
    },
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const quickCommands = [
    { cmd: 'status', labelAr: 'الحالة' },
    { cmd: 'decrypt', labelAr: 'فك التشفير' },
    { cmd: 'scan', labelAr: 'مسح الترددات' },
    { cmd: 'files', labelAr: 'الملفات' },
    { cmd: 'agent', labelAr: 'العميل' },
    { cmd: 'lockdown', labelAr: 'إغلاق الطوارئ' },
    { cmd: 'clear', labelAr: 'مسح الشاشة' },
  ];

  const handleCommand = (rawCmd: string) => {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    if (soundEnabled) soundEngine.playUiClick(true);

    const now = new Date().toLocaleTimeString('en-GB', { hour12: false });

    // Append input line
    const userLog: TerminalLog = {
      id: `in-${Date.now()}`,
      type: 'input',
      text: `OPERATOR@SIGINT:~$ ${rawCmd}`,
      time: now,
    };

    let responses: TerminalLog[] = [];

    switch (cmd) {
      case 'help':
      case 'تعليمات':
      case '?':
        responses = [
          {
            id: `out-${Date.now()}-1`,
            type: 'output',
            text: 'AVAILABLE THEATRICAL COMMANDS // الأوامر المتاحة:\n  • status    - Display unified mission telemetry and alert status\n  • decrypt   - Execute cryptographic key rotation and buffer extraction\n  • scan      - Run RF microwave spectrum sweep across sectors\n  • files     - List all 6 active classified dossiers in vault\n  • agent     - Pull operational file for Operative 7734-XZ\n  • lockdown  - Trigger emergency sector lockdown protocol (CODE RED)\n  • clear     - Purge terminal display screen buffer',
            time: now,
          },
        ];
        break;

      case 'status':
      case 'حالة':
        responses = [
          {
            id: `out-${Date.now()}-1`,
            type: 'output',
            text: 'OPERATION: الظل الرابع (FOURTH SHADOW)\nMISSION STATUS: ACTIVE [DEFCON 2 - ELEVATED]\nDEPLOYED UNITS: 07 (5 FIELD OPERATIVES, 2 SURVEILLANCE DRONES)\nENCRYPTION: AES-256-GCM HARDENED\nCOMMUNICATION FREQUENCY: CH-19 (142.850 MHz) & SEC-NET (868.100 MHz)\nINTEGRITY: 99.7% // NO UNAUTHORIZED INTRUSION DETECTED',
            time: now,
          },
        ];
        break;

      case 'decrypt':
      case 'فك':
        responses = [
          {
            id: `out-${Date.now()}-1`,
            type: 'system',
            text: 'EXECUTING ASYMMETRIC KEY DECRYPTION...\n[▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓] 100%\nDECRYPT SUCCESS: TRANSMISSION FROM UNIT-04 VERIFIED.\n"الهدف تحرك باتجاه المنفذ الخلفي للمستودع رقم 12، المراقبة مستمرة."',
            time: now,
          },
        ];
        break;

      case 'scan':
      case 'مسح':
        responses = [
          {
            id: `out-${Date.now()}-1`,
            type: 'output',
            text: 'INITIATING HIGH-GAIN MICROWAVE SPECTRUM SCAN...\nSCAN COMPLETE: 04 TARGETS ACQUIRED IN GRID SECTORS.\n  • ECHO-44 (18.4km, BEARING 042°)\n  • SHADOW-DRONE (8.2km, BEARING 118°)\n  • SIERRA-09 (32.1km, BEARING 215° - FLAGGED HIGH RISK)\n  • TANGO-77 (41.5km, BEARING 310°)',
            time: now,
          },
        ];
        break;

      case 'files':
      case 'ملفات':
        responses = [
          {
            id: `out-${Date.now()}-1`,
            type: 'output',
            text: 'ACTIVE CLASSIFIED DOSSIERS ARCHIVE:\n  [1] FILE 0091-A: عملية العنكبوت الصامت (CLEARANCE: EYES ONLY)\n  [2] FILE 0102-C: برقيات التردد المعترضة (CLEARANCE: LEVEL 05)\n  [3] FILE 0117-B: تقصي هوية العميل المزدوج (CLEARANCE: LEVEL 07)\n  [4] FILE 0134-D: سجلات القطاع الأسود (CLEARANCE: EYES ONLY)\n  [5] FILE 0148-E: تفعيل بروتوكول الصقر (CLEARANCE: LEVEL 06)\n  [6] FILE 0162-F: شبكة الترحيل المشفرة (CLEARANCE: LEVEL 05)',
            time: now,
          },
        ];
        break;

      case 'agent':
      case 'عميل':
        responses = [
          {
            id: `out-${Date.now()}-1`,
            type: 'output',
            text: 'RETRIEVING OPERATIVE PROFILE:\nNAME: بيير أشرف (PIERRE ASHRAF)\nID: 7734-XZ // CODE: SHADOW-LEAD\nUNIT: FIELD SURVEILLANCE & SPECIAL RECON\nCLEARANCE: LEVEL 06\nBIOMETRICS: HEART RATE 74 BPM | SPO2 99% | STATUS: NOMINAL',
            time: now,
          },
        ];
        break;

      case 'lockdown':
      case 'حظر':
      case 'طوارئ':
        responses = [
          {
            id: `out-${Date.now()}-1`,
            type: 'warning',
            text: 'CRITICAL WARNING: PROTOCOL 44 INITIATED.\nSYSTEM LOCKED BY COMMAND AUTHORITY.\nDEPLOYING EMERGENCY LOCKDOWN MODAL...',
            time: now,
          },
        ];
        setTimeout(() => {
          onTriggerLockdown();
        }, 600);
        break;

      case 'clear':
      case 'مسح_الشاشة':
        setHistory([]);
        setInputVal('');
        return;

      default:
        responses = [
          {
            id: `err-${Date.now()}-1`,
            type: 'error',
            text: `ACCESS RESTRICTED OR UNRECOGNIZED COMMAND: "${rawCmd}".\nCLEARANCE LEVEL 07 REQUIRED. Type "help" for authorized command dictionary.`,
            time: now,
          },
        ];
        break;
    }

    setHistory((prev) => [...prev, userLog, ...responses]);
    setInputVal('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCommand(inputVal);
  };

  return (
    <section id="terminal" className="w-full max-w-[1720px] mx-auto px-3 sm:px-6 my-6 select-none">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1f3825] pb-3 mb-4 gap-2">
        <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
          <div className="p-1.5 rounded bg-[#102214] border border-[#264c2e]">
            <TerminalIcon className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-arabic-display font-black text-zinc-100 tracking-wide">
              الطرفية التفاعلية وأوامر المنظومة
            </h2>
            <p className="text-xs text-zinc-400 font-arabic-display">
              واجهة سطر الأوامر المركزية لإرسال واسترجاع البيانات الاستخباراتية المشفرة
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 rtl:space-x-reverse text-xs font-mono text-emerald-500">
          <span>TTY: /dev/sigint0</span>
          <span>//</span>
          <span>BAUD: 115200</span>
        </div>
      </div>

      {/* Terminal CRT Container */}
      <div className="relative rounded-sm bg-[#050a06] border-2 border-[#1c3621] p-4 sm:p-5 shadow-2xl overflow-hidden min-h-[360px] flex flex-col justify-between crt-overlay">
        {/* Terminal Header Bar */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#162e1c] text-xs font-mono">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            <span className="text-zinc-500 ml-2 rtl:mr-2">SECURE SHELL CONSOLE // ROOT PRIVILEGES RESTRICTED</span>
          </div>

          <button
            onClick={() => {
              if (soundEnabled) soundEngine.playUiClick(true);
              setHistory([]);
            }}
            className="text-zinc-500 hover:text-zinc-300 transition-colors"
            title="مسح الشاشة"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Terminal Output Log Area */}
        <div className="flex-1 overflow-y-auto max-h-[300px] space-y-2 font-mono text-xs pr-1 rtl:pr-0 rtl:pl-1">
          {history.map((log) => {
            let textColor = 'text-emerald-400';
            if (log.type === 'error') textColor = 'text-red-400';
            else if (log.type === 'warning') textColor = 'text-amber-400 font-bold';
            else if (log.type === 'system') textColor = 'text-teal-300';
            else if (log.type === 'input') textColor = 'text-zinc-100 font-bold';

            return (
              <div key={log.id} className="leading-relaxed">
                <span className="text-zinc-600 text-[10px] mr-2 rtl:mr-0 rtl:ml-2">[{log.time}]</span>
                <span className={`${textColor} whitespace-pre-wrap`}>{log.text}</span>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input Form Row */}
        <form onSubmit={handleSubmit} className="mt-4 pt-3 border-t border-[#162e1c]">
          <div className="flex items-center space-x-2 rtl:space-x-reverse bg-[#08120a] border border-[#1b3420] rounded px-3 py-2">
            <span className="font-mono text-xs text-emerald-400 font-bold shrink-0">
              OPERATOR@SIGINT:~$
            </span>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="اكتب أمراً هنا (مثال: help, status, decrypt, scan)..."
              className="flex-1 bg-transparent text-emerald-300 font-mono text-xs focus:outline-none placeholder:text-zinc-600"
              autoComplete="off"
              spellCheck="false"
            />
            <button
              type="submit"
              className="p-1 rounded bg-[#132817] hover:bg-[#1a3821] text-emerald-400 transition-colors"
              title="تنفيذ الأمر"
            >
              <CornerDownLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Command Pills for fast interaction */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2.5 text-[11px] font-mono">
            <span className="text-zinc-500 mr-1 rtl:mr-0 rtl:ml-1">QUICK COMMANDS:</span>
            {quickCommands.map((qc) => (
              <button
                key={qc.cmd}
                type="button"
                onClick={() => handleCommand(qc.cmd)}
                className="px-2.5 py-1 rounded bg-[#09150d] hover:bg-[#122818] border border-[#1d3823] text-emerald-300 hover:text-emerald-100 hover:border-emerald-500 transition-colors flex items-center space-x-1 rtl:space-x-reverse"
              >
                <span>{qc.cmd}</span>
                <span className="text-[10px] text-zinc-500 font-arabic-display">({qc.labelAr})</span>
              </button>
            ))}
          </div>
        </form>
      </div>
    </section>
  );
}
