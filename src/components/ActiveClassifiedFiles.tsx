import React, { useState } from 'react';
import {
  Folder,
  Lock,
  Eye,
  ShieldAlert,
  Clock,
  ExternalLink,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';
import { ClassifiedDocument } from '../types';
import { soundEngine } from '../utils/audio';

interface ActiveClassifiedFilesProps {
  documents: ClassifiedDocument[];
  onOpenDossier: (doc: ClassifiedDocument) => void;
  soundEnabled: boolean;
}

export function ActiveClassifiedFiles({ documents, onOpenDossier, soundEnabled }: ActiveClassifiedFilesProps) {
  const [hoveredDocId, setHoveredDocId] = useState<string | null>(null);

  const getThreatBadgeClass = (threat: string) => {
    switch (threat) {
      case 'CRITICAL':
        return 'bg-red-950/80 text-red-300 border-red-700/80';
      case 'HIGH':
        return 'bg-amber-950/80 text-amber-300 border-amber-700/80';
      case 'ELEVATED':
        return 'bg-yellow-950/60 text-yellow-300 border-yellow-700/80';
      default:
        return 'bg-emerald-950/60 text-emerald-300 border-emerald-700/80';
    }
  };

  return (
    <section id="dossiers" className="w-full max-w-[1720px] mx-auto px-3 sm:px-6 my-6 select-none">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1f3825] pb-3 mb-5 gap-2">
        <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
          <div className="p-1.5 rounded bg-[#102214] border border-[#264c2e]">
            <Folder className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-arabic-display font-black text-zinc-100 tracking-wide">
              الملفات الاستخباراتية النشطة — الأرشيف السري
            </h2>
            <p className="text-xs text-zinc-400 font-arabic-display">
              ملفات العمليات الحالية الخاضعة لأمر الحظر الفوري بموجب المرسوم الأمني رقم 44
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 rtl:space-x-reverse text-xs font-mono text-emerald-500">
          <span className="hidden md:inline">ENCRYPTION: HARDENED</span>
          <span className="px-2.5 py-1 rounded bg-[#0d1c11] border border-[#23452a] text-emerald-300 font-bold">
            TOTAL DOSSIERS: {documents.length}
          </span>
        </div>
      </div>

      {/* Dossier Cards Grid (2x3 or 3x2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {documents.map((doc) => {
          const isHovered = hoveredDocId === doc.id;
          return (
            <div
              key={doc.id}
              onMouseEnter={() => {
                setHoveredDocId(doc.id);
                if (soundEnabled) soundEngine.playUiClick(true);
              }}
              onMouseLeave={() => setHoveredDocId(null)}
              onClick={() => {
                if (soundEnabled) soundEngine.playDossierOpen(true);
                onOpenDossier(doc);
              }}
              className={`relative rounded-sm bg-[#111c14] border transition-all duration-300 cursor-pointer overflow-hidden p-4 sm:p-5 flex flex-col justify-between shadow-lg group ${
                isHovered
                  ? 'border-emerald-400 -translate-y-1.5 shadow-[0_12px_28px_rgba(0,0,0,0.8),0_0_15px_rgba(34,197,94,0.2)] bg-[#142318]'
                  : 'border-[#223d29] hover:border-[#35613f]'
              }`}
            >
              {/* Subtle Scanning Line on Hover */}
              {isHovered && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent animate-scanline" />
                </div>
              )}

              {/* Folder Top Tab & Classification Stamp */}
              <div>
                <div className="flex items-start justify-between border-b border-[#1e3824] pb-3 mb-3">
                  <div>
                    <span className="text-[11px] font-mono text-zinc-400 font-bold tracking-wider block">
                      {doc.fileNumber}
                    </span>
                    <h3 className="text-lg font-arabic-display font-black text-zinc-100 group-hover:text-emerald-300 transition-colors mt-0.5">
                      {doc.operationNameAr}
                    </h3>
                    <span className="text-xs font-mono text-zinc-500">
                      CODENAME: {doc.codename}
                    </span>
                  </div>

                  {/* Classification Stamp with subtle hover tilt */}
                  <div
                    className={`classified-stamp-red text-[10px] sm:text-xs py-0.5 px-2 transition-transform duration-300 ${
                      isHovered ? 'scale-105 -rotate-6' : '-rotate-3'
                    }`}
                  >
                    {doc.classificationAr.split('—')[0].trim()}
                  </div>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-[#09120c] p-2.5 rounded border border-[#182e1d] mb-3">
                  <div>
                    <span className="text-zinc-500 block text-[10px]">مستوى التفويض:</span>
                    <span className="font-bold text-red-400">{doc.clearance}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px]">مستوى التهديد:</span>
                    <span className={`px-1 rounded border text-[10px] font-bold ${getThreatBadgeClass(doc.threatLevel)}`}>
                      {doc.threatLevel}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px]">الحالة:</span>
                    <span className="text-emerald-400 font-bold">{doc.status}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px]">آخر تحديث:</span>
                    <span className="text-zinc-300">{doc.lastUpdate}</span>
                  </div>
                </div>

                {/* Summary Snippet with Redacted Bar */}
                <p className="text-xs font-arabic-display text-zinc-300 leading-relaxed line-clamp-2 mb-3">
                  {doc.summaryAr}
                </p>
              </div>

              {/* Progress & Bottom Bar */}
              <div className="pt-3 border-t border-[#1a3320] flex flex-col gap-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                  <span>INVESTIGATION PROGRESS</span>
                  <span className="text-emerald-400 font-bold">{doc.progress}%</span>
                </div>
                <div className="w-full bg-[#09120c] h-1.5 rounded overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded transition-all duration-300"
                    style={{ width: `${doc.progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between pt-1 text-[11px] font-arabic-display text-zinc-400 group-hover:text-emerald-300">
                  <span className="flex items-center space-x-1 rtl:space-x-reverse">
                    <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>انقر لفتح الملف الميداني الكامل</span>
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
