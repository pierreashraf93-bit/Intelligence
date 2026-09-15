import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldAlert,
  Calendar,
  Clock,
  MapPin,
  Users,
  AlertTriangle,
  FileText,
  Lock,
  Eye,
  EyeOff,
  Printer,
  CheckCircle2,
  Bookmark,
} from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { ClassifiedDocument } from '../types';

interface DossierModalProps {
  dossier: ClassifiedDocument | null;
  onClose: () => void;
  soundEnabled: boolean;
}

export function DossierModal({ dossier, onClose, soundEnabled }: DossierModalProps) {
  const [showRedactions, setShowRedactions] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'briefing' | 'timeline' | 'personnel' | 'notes'>('briefing');
  const [printSuccess, setPrintSuccess] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (soundEnabled) soundEngine.playUiClick(true);
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, soundEnabled]);

  if (!dossier) return null;

  const handleToggleRedactions = () => {
    if (soundEnabled) soundEngine.playUiClick(true);
    setShowRedactions((prev) => !prev);
  };

  const handleSimulatePrint = () => {
    if (soundEnabled) soundEngine.playAccessGranted(true);
    setPrintSuccess(true);
    setTimeout(() => setPrintSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm select-none animate-fadeIn overflow-y-auto">
      {/* Modal Container: Styled as an authentic intelligence dossier folder */}
      <div className="relative w-full max-w-4xl bg-[#dfd4be] text-[#1c1d1a] rounded-sm shadow-2xl border-2 border-[#8a7a60] flex flex-col my-auto max-h-[90vh] overflow-hidden">
        {/* Dossier Top Binding Header */}
        <div className="bg-[#cca869] border-b-2 border-[#8a7a60] px-4 sm:px-6 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <Bookmark className="w-5 h-5 text-[#4a3b22]" />
            <div>
              <span className="text-[11px] font-mono tracking-widest text-[#4a3b22] font-bold block">
                STATE SECURITY ARCHIVE // CLASSIFIED FOLDER
              </span>
              <span className="font-mono text-sm sm:text-base font-black text-[#261e12]">
                {dossier.fileNumber} — {dossier.codename}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            {/* Classification Stamp */}
            <div className="classified-stamp-red text-xs sm:text-sm py-0.5 px-2.5">
              {dossier.classificationAr}
            </div>

            {/* Close Button */}
            <button
              onClick={() => {
                if (soundEnabled) soundEngine.playUiClick(true);
                onClose();
              }}
              className="p-1.5 rounded-sm bg-[#8a7a60]/30 hover:bg-[#8a7a60]/60 text-[#261e12] transition-colors"
              title="إغلاق الملف [ESC]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Toolbar & Metadata */}
        <div className="bg-[#ede4d1] border-b border-[#a89b80] p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs w-full sm:w-auto">
            <div>
              <span className="text-[#6c614b] block text-[10px]">تاريخ الوثيقة:</span>
              <span className="font-bold text-[#1f201d]">{dossier.date}</span>
            </div>
            <div>
              <span className="text-[#6c614b] block text-[10px]">درجة التهديد:</span>
              <span className="font-bold text-red-800">{dossier.threatLevel}</span>
            </div>
            <div>
              <span className="text-[#6c614b] block text-[10px]">مستوى التفويض:</span>
              <span className="font-bold text-red-900">{dossier.clearance}</span>
            </div>
            <div>
              <span className="text-[#6c614b] block text-[10px]">الحالة الراهنة:</span>
              <span className="font-bold text-[#1a3821]">{dossier.status}</span>
            </div>
          </div>

          {/* Controls: Declassify & Print */}
          <div className="flex items-center space-x-2 rtl:space-x-reverse self-end sm:self-auto">
            <button
              onClick={handleToggleRedactions}
              className="flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1 rounded bg-[#dfd4be] hover:bg-[#d0c4ab] border border-[#a89b80] text-[#2c2b27] transition-colors"
            >
              {showRedactions ? <EyeOff className="w-3.5 h-3.5 text-red-800" /> : <Eye className="w-3.5 h-3.5" />}
              <span className="font-arabic-display text-xs">
                {showRedactions ? 'إعادة حجب الأسماء' : 'كشف المحتوى السري المحجوب'}
              </span>
            </button>

            <button
              onClick={handleSimulatePrint}
              className="flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1 rounded bg-[#dfd4be] hover:bg-[#d0c4ab] border border-[#a89b80] text-[#2c2b27] transition-colors"
              title="طباعة محضر الاستخبارات للأرشيف الورقي"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="font-arabic-display text-xs">
                {printSuccess ? 'تم الإرسال للأرشيف' : 'تصدير ورقي'}
              </span>
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="bg-[#d5c7ad] border-b border-[#a89b80] px-4 flex space-x-2 rtl:space-x-reverse overflow-x-auto">
          {[
            { id: 'briefing', labelAr: 'المحضر والتقرير', icon: FileText },
            { id: 'timeline', labelAr: 'الجدول الزمني الميداني', icon: Clock },
            { id: 'personnel', labelAr: 'الأفراد والوحدات', icon: Users },
            { id: 'notes', labelAr: 'تقييم المخاطر والملاحظات', icon: AlertTriangle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (soundEnabled) soundEngine.playUiClick(true);
                  setActiveTab(tab.id as any);
                }}
                className={`flex items-center space-x-1.5 rtl:space-x-reverse py-2 px-3 border-b-2 font-arabic-display text-xs font-bold transition-colors whitespace-nowrap ${
                  isActive
                    ? 'border-red-800 text-red-900 bg-[#dfd4be]'
                    : 'border-transparent text-[#574d3b] hover:text-[#261e12]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.labelAr}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body Content (Scrollable) */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-4 text-xs sm:text-sm leading-relaxed text-[#232520]">
          {activeTab === 'briefing' && (
            <div className="space-y-4">
              <div className="border-b border-[#a89b80] pb-2">
                <h4 className="text-base sm:text-lg font-arabic-display font-black text-[#1a1b18]">
                  {dossier.operationNameAr}
                </h4>
                <p className="text-xs font-mono text-[#6c614b]">
                  SECTOR: {dossier.sector} // COORD: {dossier.coordinates}
                </p>
              </div>

              <div className="bg-[#ede4d1] p-3 rounded border border-[#c2b59b] font-arabic-display">
                <span className="font-bold block text-red-900 mb-1">الملخص التنفيذي للعملية:</span>
                <p>{dossier.summaryAr}</p>
              </div>

              <div className="font-arabic-display whitespace-pre-line text-[#1f201d] bg-[#f2eada] p-4 rounded border border-[#c2b59b] shadow-inner">
                {showRedactions
                  ? dossier.fullBriefingAr.replaceAll('██████', ' [بيانات مفكوكة: المستودع الشمالي المشبوه] ')
                  : dossier.fullBriefingAr}
              </div>

              {/* Redaction Notice */}
              <div className="text-[11px] font-mono text-[#6c614b] flex items-center justify-between border-t border-[#a89b80] pt-2">
                <span>CHECKSUM: {dossier.checksum}</span>
                <span>STATUS: {showRedactions ? 'UNRESTRICTED PREVIEW' : 'SECURE REDACTED MODE'}</span>
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-3 font-arabic-display">
              <h5 className="font-bold text-sm text-[#1a1b18] border-b border-[#a89b80] pb-1">
                سجل الأحداث الميدانية المؤرشفة:
              </h5>
              <div className="space-y-2 font-mono">
                {dossier.timelineEntries.map((entry, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded bg-[#ede4d1] border border-[#c2b59b] flex items-start space-x-3 rtl:space-x-reverse"
                  >
                    <span className="px-2 py-0.5 rounded bg-red-900 text-white font-bold text-xs shrink-0">
                      {entry.time}
                    </span>
                    <div className="flex-1">
                      <p className="font-arabic-display text-xs sm:text-sm text-[#1f201d]">
                        {entry.eventAr}
                      </p>
                      <span className="text-[10px] text-emerald-800 font-bold block mt-0.5">
                        STATUS: {entry.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'personnel' && (
            <div className="space-y-3 font-arabic-display">
              <h5 className="font-bold text-sm text-[#1a1b18] border-b border-[#a89b80] pb-1">
                الوحدات والعناصر الاستخباراتية المشرفة على المهمة:
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
                {dossier.personnelInvolved.map((p, idx) => (
                  <div key={idx} className="p-3 rounded bg-[#ede4d1] border border-[#c2b59b]">
                    <div className="text-red-900 font-bold text-xs font-arabic-display">
                      {p.roleAr}
                    </div>
                    <div className="text-sm font-bold text-[#1a1b18] mt-1">
                      CODENAME: {p.codename}
                    </div>
                    <div className="text-[10px] text-[#4f4636] mt-0.5">
                      OPERATIONAL STANCE: <span className="text-emerald-800 font-bold">{p.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-3 font-arabic-display">
              <div className="bg-red-950/10 border border-red-800/40 p-3 rounded">
                <div className="flex items-center space-x-2 rtl:space-x-reverse text-red-900 font-bold text-xs mb-1">
                  <AlertTriangle className="w-4 h-4 text-red-800" />
                  <span>تقييم المخاطر التكتيكية:</span>
                </div>
                <p className="text-xs sm:text-sm text-red-950">{dossier.riskAssessment}</p>
              </div>

              <h5 className="font-bold text-sm text-[#1a1b18] border-b border-[#a89b80] pb-1 mt-4">
                الملاحظات الفنية للمحللين:
              </h5>
              <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-[#2b2b25]">
                {dossier.intelligenceNotes.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-[#cca869] border-t-2 border-[#8a7a60] p-3 px-6 flex items-center justify-between text-xs font-mono text-[#382b14]">
          <span>STATE SECURITY DEPARTMENT // THEATRICAL DRAMA MOCKUP</span>
          <button
            onClick={() => {
              if (soundEnabled) soundEngine.playUiClick(true);
              onClose();
            }}
            className="px-4 py-1 rounded bg-[#261e12] hover:bg-[#3d301c] text-[#dfd4be] font-arabic-display font-bold transition-colors"
          >
            إغلاق الملف
          </button>
        </div>
      </div>
    </div>
  );
}
