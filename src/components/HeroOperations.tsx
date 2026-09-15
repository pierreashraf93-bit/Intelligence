import React, { useState, useEffect } from 'react';
import { Radio, Lock, ShieldAlert, Cpu, Terminal as TerminalIcon, FileText, CheckCircle2, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { ClassifiedDocument } from '../types';

interface HeroOperationsProps {
  soundEnabled: boolean;
  onOpenDossier: (dossier: ClassifiedDocument) => void;
  featuredDossier: ClassifiedDocument;
}

export function HeroOperations({ soundEnabled, onOpenDossier, featuredDossier }: HeroOperationsProps) {
  // Scramble Decryption State
  const [decryptProgress, setDecryptProgress] = useState<number>(0);
  const [revealedChars, setRevealedChars] = useState<string>('');
  const [isDecrypted, setIsDecrypted] = useState<boolean>(false);
  const [currentCycle, setCurrentCycle] = useState<number>(0);
  const [revealedRedactions, setRevealedRedactions] = useState<boolean>(false);

  const rawMessages = [
    {
      source: 'UNKNOWN // ENCRYPTED BEACON',
      channel: 'CH-19 (142.850 MHz)',
      targetMessage: 'تم تأكيد تحرك الموكب المشبوه من مستودع القطاع الصناعي باتجاه نقطة التقاطع 44. المراقبة اللاسلكية تؤكد وجود جهاز إرسال رقمي مجهول الهوية على متن المركبة الثالثة.',
    },
    {
      source: 'STATION-OMEGA // COVERT',
      channel: 'CH-04 (433.850 MHz)',
      targetMessage: 'اعتراض حزمة إشارات ميكروية مشفرة بتبادل مفاتيح خوارزمية. الهدف الدبلوماسي وصل إلى مقر الاجتماع غير المعلن تحت حراسة مشددة.',
    },
    {
      source: 'DRONE-RECON-08',
      channel: 'SEC-NET (868.100 MHz)',
      targetMessage: 'المسح الحراري الليلي يؤكد تفريغ 4 صناديق معدنية معزولة في المبنى المهجور. نطلب تفويض رفع مستوى المراقبة إلى الدرجة القصوى.',
    },
  ];

  const currentTransmission = rawMessages[currentCycle % rawMessages.length];
  const cipherChars = '01#@$%&*!?§¶¥ΞλΨΩ░▒▓█789XYZ';

  // Decryption Scrambler Effect
  useEffect(() => {
    setIsDecrypted(false);
    setDecryptProgress(0);
    const targetText = currentTransmission.targetMessage;
    let progress = 0;

    const interval = setInterval(() => {
      progress += 2;
      setDecryptProgress(Math.min(progress, 100));

      const resolvedCount = Math.floor((progress / 100) * targetText.length);
      let scrambled = targetText.slice(0, resolvedCount);

      for (let i = resolvedCount; i < Math.min(resolvedCount + 14, targetText.length); i++) {
        if (targetText[i] === ' ') {
          scrambled += ' ';
        } else {
          scrambled += cipherChars[Math.floor(Math.random() * cipherChars.length)];
        }
      }

      setRevealedChars(scrambled);

      if (soundEnabled && progress % 6 === 0) {
        soundEngine.playBreachChirp(true);
      }

      if (progress >= 100) {
        clearInterval(interval);
        setRevealedChars(targetText);
        setIsDecrypted(true);
        if (soundEnabled) soundEngine.playAccessGranted(true);
      }
    }, 45);

    return () => clearInterval(interval);
  }, [currentCycle, soundEnabled]);

  const handleNextDecrypt = () => {
    if (soundEnabled) soundEngine.playUiClick(true);
    setCurrentCycle((prev) => prev + 1);
  };

  const handleToggleRedactions = () => {
    if (soundEnabled) soundEngine.playUiClick(true);
    setRevealedRedactions((prev) => !prev);
  };

  return (
    <section className="w-full max-w-[1720px] mx-auto p-3 sm:p-6 select-none">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Side (Col 1-7): Large Encrypted Live Decryption Terminal */}
        <div className="lg:col-span-7 flex flex-col tactical-box p-4 sm:p-5 rounded-sm shadow-xl min-h-[460px] justify-between">
          {/* Decryption Header */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1f3825] pb-3">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="font-mono text-xs font-bold tracking-wider text-emerald-300">
                  INCOMING TRANSMISSION INTERCEPT // CH-19
                </span>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse text-[11px] font-mono">
                <span className="px-2 py-0.5 rounded bg-red-950/80 border border-red-800 text-red-300 animate-pulse font-bold">
                  SIGNAL INTERCEPTED
                </span>
                <span className="text-zinc-500">|</span>
                <span className="text-emerald-500">AES-256-GCM</span>
              </div>
            </div>

            {/* Transmission Metadata Panel */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-3 p-2.5 rounded bg-[#09110b] border border-[#162719] text-[11px] font-mono">
              <div>
                <span className="text-zinc-500 block">SOURCE:</span>
                <span className="text-emerald-300 font-bold">{currentTransmission.source}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">FREQUENCY:</span>
                <span className="text-emerald-400">{currentTransmission.channel}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">CIPHER PROTOCOL:</span>
                <span className="text-zinc-300">ECC-521 // MIL-SPEC</span>
              </div>
              <div>
                <span className="text-zinc-500 block">DECRYPT STATUS:</span>
                <span className={isDecrypted ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold animate-pulse'}>
                  {isDecrypted ? 'COMPLETE (100%)' : `DECRYPTING (${decryptProgress}%)`}
                </span>
              </div>
            </div>
          </div>

          {/* Scrambler / Arabic Decrypted Stream Viewport */}
          <div className="relative my-2 p-4 sm:p-5 rounded bg-[#050906] border border-[#1a3020] min-h-[190px] flex flex-col justify-center overflow-hidden shadow-[inset_0_0_25px_rgba(0,0,0,0.85)]">
            <div className="absolute top-2 left-2 text-[10px] font-mono text-zinc-600 flex items-center space-x-1 rtl:space-x-reverse">
              <TerminalIcon className="w-3 h-3 text-emerald-500" />
              <span>CRYPTANALYSIS STREAM // RAW BUFFER</span>
            </div>

            {/* Decrypting Progress Bar on Top */}
            <div className="w-full bg-[#0e1911] h-1.5 mb-4 rounded overflow-hidden">
              <div
                className="bg-emerald-400 h-full transition-all duration-150 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                style={{ width: `${decryptProgress}%` }}
              />
            </div>

            {/* Message Content */}
            <div className="text-base sm:text-lg font-arabic-display leading-relaxed tracking-wide text-emerald-300 font-medium">
              {revealedChars}
              {!isDecrypted && (
                <span className="inline-block w-2.5 h-4 bg-emerald-400 ml-1 rtl:mr-1 animate-pulse align-middle" />
              )}
            </div>

            {isDecrypted && (
              <div className="mt-4 pt-2 border-t border-[#162719] flex items-center justify-between text-xs font-mono text-emerald-500/90">
                <span className="flex items-center space-x-1.5 rtl:space-x-reverse">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>CHECKSUM VERIFIED // SHA-256 MATCH</span>
                </span>
                <span className="text-zinc-500">AUTO-ARCHIVED IN SECURE VAULT</span>
              </div>
            )}
          </div>

          {/* Bottom Decryption Controls & Real-Time Waveform */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#1a3020] pt-3 text-xs font-mono">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <button
                onClick={handleNextDecrypt}
                className="flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1.5 rounded border border-[#2b4c32] bg-[#102014] hover:border-emerald-400 text-emerald-300 hover:text-emerald-100 transition-colors shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="font-arabic-display">اعتراض تردد جديد</span>
                <span className="text-[10px] text-zinc-400">[CYCLE]</span>
              </button>
              <span className="text-zinc-500 text-[11px]">SIGNAL SNR: +34.2 dB</span>
            </div>

            {/* Simulated Audio/RF Visualizer Bars */}
            <div className="flex items-end space-x-1 rtl:space-x-reverse h-5">
              {[40, 75, 55, 90, 65, 85, 30, 95, 70, 60, 80, 50, 90, 45].map((h, i) => (
                <div
                  key={i}
                  className="w-1 bg-emerald-500/80 rounded-t"
                  style={{
                    height: `${isDecrypted ? 20 : (h * ((i % 3) + 1)) % 100}%`,
                    opacity: isDecrypted ? 0.4 : 0.9,
                    transition: 'height 0.15s ease',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Side (Col 8-12): Physical-Looking Classified Intelligence Dossier */}
        <div className="lg:col-span-5 relative physical-dossier-paper rounded-sm p-5 sm:p-6 flex flex-col justify-between shadow-2xl border border-[#8c7f66]">
          {/* Top Paper Folder Tab & Red Classification Stamp */}
          <div>
            <div className="flex items-start justify-between border-b-2 border-[#8c7f66]/60 pb-3 mb-4">
              <div>
                <div className="text-[11px] font-mono uppercase tracking-widest text-[#5c523f] font-bold">
                  STATE SECURITY SERVICE // TOP SECRET ARCHIVE
                </div>
                <h3 className="text-xl sm:text-2xl font-arabic-display font-black text-[#1d1f1c] tracking-tight mt-0.5">
                  ملف العملية: {featuredDossier.operationNameAr}
                </h3>
                <div className="text-xs font-mono text-[#5c523f]">
                  CODENAME: {featuredDossier.codename} // REF: {featuredDossier.fileNumber}
                </div>
              </div>

              {/* Red Classified Stamp Graphic */}
              <div className="classified-stamp-red select-none text-center shadow-sm">
                <div className="text-sm sm:text-base font-bold">سري للغاية</div>
                <div className="text-[9px] tracking-tighter">TOP SECRET</div>
              </div>
            </div>

            {/* Document Metadata Table (Typewriter look) */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-[#d3c7ad]/80 p-2.5 rounded border border-[#a89b80] mb-4">
              <div>
                <span className="text-[#6e634e] block text-[10px]">تاريخ الإنشاء / DATE:</span>
                <span className="font-bold text-[#232420]">{featuredDossier.date}</span>
              </div>
              <div>
                <span className="text-[#6e634e] block text-[10px]">مستوى التفويض / CLEARANCE:</span>
                <span className="font-bold text-red-900">{featuredDossier.clearance}</span>
              </div>
              <div>
                <span className="text-[#6e634e] block text-[10px]">مستوى التهديد / THREAT:</span>
                <span className="font-bold text-red-800">{featuredDossier.threatLevel}</span>
              </div>
              <div>
                <span className="text-[#6e634e] block text-[10px]">الحالة العملياتية / STATUS:</span>
                <span className="font-bold text-[#1f3f27]">{featuredDossier.status}</span>
              </div>
            </div>

            {/* Short Fictional Briefing with Redacted Segments */}
            <div className="text-xs sm:text-sm font-arabic-display leading-relaxed text-[#262823] space-y-2">
              <p className="font-bold text-[#1a1b18] border-b border-[#a89b80] pb-1">
                ملخص التقرير الاستخباراتي الميداني:
              </p>
              <p>
                تم رصد نشاط غير مصرح به في{' '}
                <span
                  onClick={handleToggleRedactions}
                  className={revealedRedactions ? 'bg-amber-200/90 text-red-900 px-1 rounded font-bold cursor-pointer' : 'redacted-text'}
                  title="انقر لإلغاء/تطبيق حجب البيانات السرية"
                >
                  {revealedRedactions ? 'المستودع رقم 12 بالقطاع الشمالي' : '██████████████'}
                </span>
                ، حيث تشير تحريات الفريق الاستطلاعي إلى وصول حقيبة تحتوي على وحدات تشفير كهرومغناطيسية لصالح جهة{' '}
                <span
                  onClick={handleToggleRedactions}
                  className={revealedRedactions ? 'bg-amber-200/90 text-red-900 px-1 rounded font-bold cursor-pointer' : 'redacted-text'}
                  title="انقر لإلغاء/تطبيق حجب البيانات السرية"
                >
                  {revealedRedactions ? 'الشبكة المعادية 09' : '████████'}
                </span>
                .
              </p>
              <p>
                الإجراءات المتخذة: فرض طوق إلكتروني مشدد، ومراقبة كافة ترددات القفز الترددي دون اشتباك مباشر لحين اكتمال التحقق من هوية الوسيط.
              </p>
            </div>
          </div>

          {/* Handwritten-Style Field Annotation */}
          <div className="mt-4 pt-3 border-t-2 border-dashed border-[#9c8f74]">
            <div className="bg-[#e7dfcb] border border-[#a89b80] p-2.5 rounded text-[11px] font-mono text-[#383327] italic relative">
              <span className="font-bold font-arabic-display block not-italic text-red-900 text-xs mb-0.5">
                توجيه رئيس الشعبة (توقيع معتمد):
              </span>
              "يمنع منعاً باتاً تداول هذه الوثيقة خارج قاعة القيادة المشتركة. كافة الأفراد المعنيين خاضعون لبروتوكول الصمت اللاسلكي التام."
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between mt-3 pt-2 gap-2">
              <button
                onClick={handleToggleRedactions}
                className="flex items-center space-x-1.5 rtl:space-x-reverse text-xs font-mono text-[#4a4233] hover:text-[#1d1f1c] bg-[#d3c7ad] hover:bg-[#c5b89c] px-3 py-1.5 rounded transition-colors"
              >
                {revealedRedactions ? <EyeOff className="w-3.5 h-3.5 text-red-800" /> : <Eye className="w-3.5 h-3.5" />}
                <span className="font-arabic-display">
                  {revealedRedactions ? 'إعادة حجب الأسماء' : 'كشف الفقرات المحجوبة'}
                </span>
              </button>

              <button
                onClick={() => {
                  if (soundEnabled) soundEngine.playDossierOpen(true);
                  onOpenDossier(featuredDossier);
                }}
                className="flex items-center space-x-1.5 rtl:space-x-reverse text-xs font-arabic-display font-bold bg-[#1b2b1e] hover:bg-[#132016] text-[#e8ded0] px-4 py-1.5 rounded shadow transition-all border border-[#374e3b]"
              >
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                <span>فتح الملف الاستخباري الكامل</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
