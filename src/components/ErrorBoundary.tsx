import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Terminal, ShieldAlert } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('CRITICAL SYSTEM FAILURE (ErrorBoundary):', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {
      // ignore
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div
          dir="rtl"
          className="min-h-screen bg-[#050806] text-emerald-400 p-6 flex flex-col items-center justify-center font-mono selection:bg-red-500/30"
        >
          <div className="max-w-xl w-full bg-[#0a110c] border-2 border-red-600/80 rounded-lg p-6 shadow-[0_0_40px_rgba(220,38,38,0.25)] relative overflow-hidden">
            {/* Top red header */}
            <div className="flex items-center space-x-3 rtl:space-x-reverse border-b border-red-900/60 pb-4 mb-5">
              <ShieldAlert className="w-8 h-8 text-red-500 animate-pulse shrink-0" />
              <div>
                <h1 className="text-lg font-bold text-red-400 tracking-wider">
                  SYSTEM EXCEPTION // خطأ تقني في المنظومة
                </h1>
                <p className="text-xs text-zinc-400 font-arabic-display">
                  حدث خطأ غير متوقع أثناء تشغيل واجهة العمليات السرية
                </p>
              </div>
            </div>

            {/* Error diagnosis box */}
            <div className="bg-black/80 border border-red-950 p-4 rounded text-xs text-zinc-300 space-y-2 mb-6 font-mono overflow-x-auto">
              <div className="text-red-400 font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                <span>FAULT: {this.state.error?.name || 'RuntimeError'}</span>
              </div>
              <div className="text-zinc-400 break-words">
                {this.state.error?.message || 'Unknown component initialization exception.'}
              </div>
            </div>

            {/* Recovery actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleReload}
                className="flex-1 flex items-center justify-center space-x-2 rtl:space-x-reverse px-4 py-2.5 rounded bg-emerald-700 hover:bg-emerald-600 text-white font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="font-arabic-display">إعادة تشغيل المنظومة (Reload)</span>
              </button>

              <button
                onClick={() => {
                  window.location.href = window.location.pathname;
                }}
                className="px-4 py-2.5 rounded border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white font-bold transition-all text-sm font-arabic-display"
              >
                العودة للصفحة الرئيسية
              </button>
            </div>

            {/* Terminal status hint */}
            <div className="mt-5 pt-3 border-t border-zinc-800 text-[11px] text-zinc-500 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Terminal className="w-3 h-3 text-emerald-600" />
                SEC-NODE: FAILSAFE-ACTIVE
              </span>
              <span>ERR-CODE: 0xDEADBEEF</span>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
