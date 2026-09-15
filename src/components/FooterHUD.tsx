import React from 'react';
import { ShieldAlert, Terminal, Lock, Scale, AlertTriangle } from 'lucide-react';

export function FooterHUD() {
  return (
    <footer className="w-full bg-[#050a06] border-t-2 border-[#162a1a] text-zinc-400 select-none mt-12 py-8 px-4 sm:px-8 font-mono text-xs">
      <div className="max-w-[1720px] mx-auto space-y-6">
        {/* Top Disclaimer Box */}
        <div className="p-4 rounded bg-[#09120c] border border-red-900/40 text-center space-y-2">
          <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse text-red-400 font-bold font-arabic-display text-sm">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span>إشعار أمني وقانوني مشدد // CLASSIFIED LEGAL DIRECTIVE</span>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <p className="font-arabic-display text-xs text-zinc-300 max-w-4xl mx-auto leading-relaxed">
            "كافة البيانات والوثائق المعروضة في هذه المنظومة خاضعة لأمر الحظر الفوري بموجب المرسوم الأمني رقم 44 لسنة 2026. يمنع النسخ أو التسريب تحت طائلة الملاحقة الميدانية."
          </p>
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider">
            ALL INTEL & COMMUNICATIONS PROPRIETARY TO GENERAL DIRECTORATE OF MILITARY RECONNAISSANCE & SPECIAL SIGNALS
          </div>
        </div>

        {/* Technical Metadata Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-[11px] border-t border-[#132417] pt-4">
          <div>
            <span className="text-zinc-600 block">BUILD VERSION:</span>
            <span className="text-zinc-300 font-bold">v9.42.0-MIL-SPEC</span>
          </div>
          <div>
            <span className="text-zinc-600 block">PROTOCOL CODE:</span>
            <span className="text-emerald-400 font-bold">SEC-PROTO-44-X</span>
          </div>
          <div>
            <span className="text-zinc-600 block">DEPARTMENT:</span>
            <span className="text-zinc-300 font-arabic-display">شعبة الاستطلاع والإشارة</span>
          </div>
          <div>
            <span className="text-zinc-600 block">SESSION ID:</span>
            <span className="text-emerald-400 font-bold">SIG-88219-XZ</span>
          </div>
          <div>
            <span className="text-zinc-600 block">CLEARANCE RESTRICTION:</span>
            <span className="text-red-400 font-bold">LEVEL 06 / EYES ONLY</span>
          </div>
          <div>
            <span className="text-zinc-600 block">TERMINAL STATUS:</span>
            <span className="text-emerald-400 font-bold">AIR-GAPPED // ENCRYPTED</span>
          </div>
        </div>

        {/* Bottom Theatrical Notice */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[10px] text-zinc-600 border-t border-[#101e13] pt-4 gap-2">
          <span>FICTIONAL THEATRICAL INTELLIGENCE SIMULATION INTERFACE</span>
          <span>© 2026 GENERAL INTELLIGENCE COMMAND. ALL RIGHTS RESTRICTED.</span>
        </div>
      </div>
    </footer>
  );
}
