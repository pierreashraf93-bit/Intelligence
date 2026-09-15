import React from 'react';
import {
  ShieldCheck,
  UserCheck,
  QrCode,
  Fingerprint,
  Activity,
  Heart,
  Radio,
  Clock,
  BadgeCheck,
} from 'lucide-react';
import { PersonnelOperative } from '../types';

interface PersonnelIdentificationProps {
  operative: PersonnelOperative;
  soundEnabled: boolean;
}

export function PersonnelIdentification({ operative }: PersonnelIdentificationProps) {
  return (
    <section className="w-full max-w-[1720px] mx-auto px-3 sm:px-6 my-6 select-none">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1f3825] pb-3 mb-4 gap-2">
        <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
          <div className="p-1.5 rounded bg-[#102214] border border-[#264c2e]">
            <UserCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-arabic-display font-black text-zinc-100 tracking-wide">
              بطاقة هوية العنصر الميداني — التفويض الأمني
            </h2>
            <p className="text-xs text-zinc-400 font-arabic-display">
              الملف التعريفي للضابط المكلف بإدارة شبكة المراقبة المركزية لعملية "الظل الرابع"
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 rtl:space-x-reverse text-xs font-mono text-emerald-500">
          <span>BIOMETRIC MESH: SYNCED</span>
          <span>//</span>
          <span>STATUS: ARMED & DEPLOYED</span>
        </div>
      </div>

      {/* Physical Intelligence Badge Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Physical Classified Badge (Col 1-8) */}
        <div className="lg:col-span-8 tactical-box p-5 sm:p-7 rounded-sm bg-[#09120c] border border-[#22422a] shadow-2xl flex flex-col justify-between relative overflow-hidden">
          {/* Top Badge Classification Line */}
          <div className="flex items-center justify-between border-b-2 border-[#1f3825] pb-3 mb-4">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span className="font-mono text-xs font-bold tracking-widest text-emerald-400">
                STATE SECURITY SERVICE // OPERATIVE IDENTITY ACCREDITATION
              </span>
            </div>
            <div className="classified-stamp-red text-[11px] py-0.5 px-2">
              سري للغاية — مستوى 06
            </div>
          </div>

          {/* Badge Body: Silhouette + Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center my-2">
            {/* Holographic Silhouette Photo Placeholder (Cols 1-4) */}
            <div className="sm:col-span-4 flex flex-col items-center">
              <div className="relative w-36 h-44 rounded bg-[#040805] border-2 border-emerald-700/80 p-1 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.15)] overflow-hidden">
                {/* Silhouette SVG Graphic */}
                <div className="w-full h-full flex flex-col items-center justify-center relative opacity-85">
                  <div className="w-14 h-14 rounded-full bg-[#183120] border-2 border-emerald-500/70 mb-1" />
                  <div className="w-24 h-16 rounded-t-full bg-[#183120] border-t-2 border-x-2 border-emerald-500/70" />

                  {/* Hologram scan line */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-400/20 to-transparent animate-scanline pointer-events-none" />

                  {/* Reticle Overlay */}
                  <div className="absolute top-2 left-2 text-[8px] font-mono text-emerald-400">
                    + SEC-ID: 7734
                  </div>
                  <div className="absolute bottom-2 right-2 text-[8px] font-mono text-emerald-400">
                    CLEARANCE: LVL-06
                  </div>
                </div>
              </div>

              <div className="mt-2 text-[10px] font-mono text-zinc-500 text-center">
                DIGITAL BIOMETRIC COMPOSITE
              </div>
            </div>

            {/* Operative Details Table (Cols 5-12) */}
            <div className="sm:col-span-8 space-y-3 text-xs font-mono">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded bg-[#060c08] border border-[#16291a]">
                  <span className="text-zinc-500 text-[10px] block font-arabic-display">اسم العنصر:</span>
                  <span className="text-base font-arabic-display font-black text-zinc-100">
                    {operative.nameAr}
                  </span>
                  <span className="text-[11px] text-zinc-400 block font-mono">{operative.nameEn}</span>
                </div>

                <div className="p-2.5 rounded bg-[#060c08] border border-[#16291a]">
                  <span className="text-zinc-500 text-[10px] block">OPERATIVE ID:</span>
                  <span className="text-base font-bold text-emerald-300 tracking-wider">
                    {operative.idNumber}
                  </span>
                  <span className="text-[11px] text-zinc-400 block">CODE: {operative.codename}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded bg-[#060c08] border border-[#16291a]">
                  <span className="text-zinc-500 text-[10px] block font-arabic-display">الوحدة الميدانية:</span>
                  <span className="font-arabic-display font-bold text-zinc-200">
                    {operative.unitAr}
                  </span>
                </div>

                <div className="p-2.5 rounded bg-[#060c08] border border-[#16291a]">
                  <span className="text-zinc-500 text-[10px] block">SECURITY CLEARANCE:</span>
                  <span className="text-sm font-bold text-red-400">
                    {operative.clearance} [EYES ONLY]
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded bg-[#060c08] border border-[#16291a] font-arabic-display">
                <span className="text-zinc-500 text-[10px] block">المهمة الحالية المعتمدة:</span>
                <span className="text-zinc-100 font-bold">{operative.currentAssignmentAr}</span>
              </div>
            </div>
          </div>

          {/* Bottom Row: Barcode + Signature + Fingerprint */}
          <div className="mt-4 pt-3 border-t border-[#182f1d] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            {/* Simulated Barcode */}
            <div className="flex flex-col space-y-0.5">
              <div className="flex space-x-0.5 h-6 bg-transparent items-center">
                {[2, 1, 3, 1, 2, 4, 1, 2, 3, 1, 2, 1, 4, 2, 1, 3, 2, 1, 2].map((w, i) => (
                  <div
                    key={i}
                    className="h-full bg-emerald-400"
                    style={{ width: `${w * 1.5}px` }}
                  />
                ))}
              </div>
              <span className="text-[9px] tracking-widest text-zinc-500">7734-XZ-9982-HSS</span>
            </div>

            {/* Simulated Signature */}
            <div className="text-center px-4 py-1 rounded bg-[#060c08] border border-[#182f1d]">
              <span className="text-[9px] text-zinc-500 block font-arabic-display">توقيع الضابط المسؤول:</span>
              <span className="font-serif italic text-amber-200/90 text-sm tracking-wider font-bold">
                {operative.nameEn} — Shadow04
              </span>
            </div>

            {/* Fingerprint / QR stamp */}
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-emerald-500">
              <Fingerprint className="w-7 h-7 text-emerald-400" />
              <div className="text-[10px] text-zinc-400">
                <span className="block font-bold text-emerald-400">BIOMETRIC ENCRYPTED</span>
                <span>TOKEN: 0x99F4A...002B</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Operative Real-Time Vitals Telemetry (Col 9-12) */}
        <div className="lg:col-span-4 tactical-box p-5 rounded-sm bg-[#0a150e] border border-[#22422a] shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#1b3420] pb-3 mb-3">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                <h3 className="text-base font-arabic-display font-black text-zinc-100">
                  المؤشرات الحيوية والاتصال
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#132717] text-emerald-400 border border-[#274c2e]">
                LIVE TELEMETRY
              </span>
            </div>

            <div className="space-y-3 text-xs font-mono">
              {/* Heart Rate */}
              <div className="p-3 rounded bg-[#070e09] border border-[#182f1d] flex items-center justify-between">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Heart className="w-4 h-4 text-red-500 animate-pulse" />
                  <span className="text-zinc-400 font-arabic-display">معدل نبضات القلب:</span>
                </div>
                <span className="text-base font-bold text-emerald-300">
                  {operative.biometrics.heartRate} <span className="text-xs text-zinc-500">BPM</span>
                </span>
              </div>

              {/* SpO2 */}
              <div className="p-3 rounded bg-[#070e09] border border-[#182f1d] flex items-center justify-between">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span className="text-zinc-400 font-arabic-display">نسبة الأكسجين بالدم:</span>
                </div>
                <span className="text-base font-bold text-emerald-300">
                  {operative.biometrics.spo2}%
                </span>
              </div>

              {/* Stress Index */}
              <div className="p-3 rounded bg-[#070e09] border border-[#182f1d] flex items-center justify-between">
                <span className="text-zinc-400 font-arabic-display">مؤشر الضغط النفسي:</span>
                <span className="text-xs font-bold text-emerald-400">
                  {operative.biometrics.stressIndex}
                </span>
              </div>

              {/* Comms Signal */}
              <div className="p-3 rounded bg-[#070e09] border border-[#182f1d] flex items-center justify-between">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Radio className="w-4 h-4 text-emerald-400" />
                  <span className="text-zinc-400 font-arabic-display">قوة إشارة اللاسلكي:</span>
                </div>
                <span className="text-xs font-bold text-emerald-300">
                  {operative.biometrics.commSignal}
                </span>
              </div>
            </div>
          </div>

          {/* Last Activity Stamp */}
          <div className="mt-4 pt-3 border-t border-[#182f1d] flex items-center justify-between text-[11px] font-mono text-zinc-500">
            <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <span className="font-arabic-display text-zinc-300">{operative.lastActivity}</span>
            </div>
            <span className="text-emerald-500 font-bold">STATUS: OK</span>
          </div>
        </div>
      </div>
    </section>
  );
}
