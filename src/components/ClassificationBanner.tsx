import React from 'react';
import { ShieldAlert, Lock } from 'lucide-react';

export function ClassificationBanner() {
  return (
    <div className="w-full classified-hazard-bar text-white py-1.5 px-4 flex items-center justify-between border-b border-red-950 select-none shadow-md z-30">
      <div className="flex items-center space-x-2 rtl:space-x-reverse text-xs font-mono tracking-widest text-red-200">
        <Lock className="w-3.5 h-3.5 text-red-300 animate-pulse" />
        <span className="font-bold">TOP SECRET // NOFORN // ORCON</span>
      </div>

      <div className="flex items-center space-x-2 rtl:space-x-reverse text-xs md:text-sm font-arabic-display font-black tracking-wider text-red-100 uppercase">
        <ShieldAlert className="w-4 h-4 text-red-300 animate-pulse" />
        <span>سري للغاية — تفويض من المستوى السادس فما فوق — حظر تداول الوثيقة</span>
        <ShieldAlert className="w-4 h-4 text-red-300 animate-pulse" />
      </div>

      <div className="hidden sm:flex items-center space-x-2 rtl:space-x-reverse text-xs font-mono text-red-300">
        <span>DEFCON 2</span>
        <span>//</span>
        <span>CLEARANCE: LVL-06</span>
      </div>
    </div>
  );
}
