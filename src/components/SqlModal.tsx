import { useState } from 'react';
import { Database, Copy, Check, Download, X, Terminal, CheckCircle2, ShieldCheck } from 'lucide-react';
import { SUPABASE_SQL_SETUP_CODE } from '../lib/supabaseClient';
import { sound } from '../lib/audioEffects';

interface SqlModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SqlModal({ isOpen, onClose }: SqlModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SETUP_CODE);
    setCopied(true);
    sound.playSuccess();
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownload = () => {
    const blob = new Blob([SUPABASE_SQL_SETUP_CODE], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'minik_adimlar_supabase_schema.sql';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    sound.playPop();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-[#fdfcfb] rounded-3xl shadow-2xl border border-[#e1eef5] max-w-4xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#f8fcfd] p-4 sm:p-5 flex items-center justify-between border-b border-[#e1eef5]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#a7c7e7] text-[#395679] flex items-center justify-center text-xl shadow-xs border border-[#8fb5da]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-800 text-base sm:text-lg">
                  Supabase & PostgreSQL SQL Kurulum Kodları
                </h3>
                <span className="hidden sm:inline-block bg-[#f8c8dc] text-gray-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#f5b7d1]">
                  5 Tablo + RLS
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Minik Adımlar Anaokulu veritabanı tablolarını tek seferde oluşturmak için hazır SQL scripti.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white hover:bg-gray-100 text-gray-600 hover:text-gray-900 border border-[#e1eef5] flex items-center justify-center transition cursor-pointer"
            title="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls & Summary Badges */}
        <div className="bg-white px-4 sm:px-6 py-3 border-b border-[#e1eef5] flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="font-semibold text-gray-500 mr-1">Tablolar:</span>
            <span className="bg-[#eef6fc] text-[#395679] font-medium px-2 py-0.5 rounded-lg border border-[#8fb5da]/40">
              classes
            </span>
            <span className="bg-[#eef6fc] text-[#395679] font-medium px-2 py-0.5 rounded-lg border border-[#8fb5da]/40">
              students
            </span>
            <span className="bg-[#eef6fc] text-[#395679] font-medium px-2 py-0.5 rounded-lg border border-[#8fb5da]/40">
              videos
            </span>
            <span className="bg-[#eef6fc] text-[#395679] font-medium px-2 py-0.5 rounded-lg border border-[#8fb5da]/40">
              watch_logs
            </span>
            <span className="bg-[#eef6fc] text-[#395679] font-medium px-2 py-0.5 rounded-lg border border-[#8fb5da]/40">
              game_activities
            </span>
            <span className="bg-[#fcf2f6] text-[#96476c] font-medium px-2 py-0.5 rounded-lg border border-[#f3d5dc]">
              RLS Güvenlik Politikaları
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 bg-white hover:bg-gray-50 text-[#395679] border border-[#8fb5da] font-bold text-xs px-3.5 py-2 rounded-xl transition cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>.sql İndir</span>
            </button>

            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer shadow-xs ${
                copied
                  ? 'bg-emerald-500 text-white'
                  : 'bg-[#a7c7e7] hover:bg-[#8fb5da] text-[#395679] border border-[#8fb5da]'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Kopyalandı! 🎉</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>SQL Kodunu Kopyala</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Step by Step Guide & Error Resolution Notice */}
        <div className="bg-[#eef6fc]/70 px-4 sm:px-6 py-2.5 border-b border-[#e1eef5] text-xs text-gray-700 space-y-1.5">
          <div className="flex flex-wrap items-center gap-y-1 gap-x-4">
            <span className="font-bold text-[#395679] flex items-center gap-1">
              <Terminal className="w-3.5 h-3.5" /> Nasıl Çalıştırılır?
            </span>
            <span className="flex items-center gap-1">
              <strong className="text-gray-900">1.</strong> SQL Kodunu Kopyala
            </span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-1">
              <strong className="text-gray-900">2.</strong> Supabase Dashboard &gt; <strong>SQL Editor</strong>'e git
            </span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-1">
              <strong className="text-gray-900">3.</strong> Yapıştır ve <strong>"RUN"</strong> (Çalıştır) butonuna bas
            </span>
          </div>
          <p className="text-[11px] text-emerald-800 font-medium bg-emerald-50/90 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>
              <strong>Tip Uyuşmazlığı (UUID / TEXT) Çözüldü:</strong> Bu güncel kod, önceki çakışan tabloları <code>CASCADE</code> ile temizleyip tüm yabancı anahtarları (Foreign Key) uyumlu olarak sıfırdan kurar.
            </span>
          </p>
        </div>

        {/* Code Content Viewport */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-[#1e293b] text-slate-100 font-mono text-xs sm:text-[13px] leading-relaxed relative selection:bg-[#a7c7e7] selection:text-slate-900">
          <button
            onClick={handleCopy}
            className="absolute top-4 right-4 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-sans font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-md z-10"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Kopyalandı' : 'Kopyala'}
          </button>
          <pre className="whitespace-pre overflow-x-auto pb-4 pt-1">
            <code>{SUPABASE_SQL_SETUP_CODE}</code>
          </pre>
        </div>

        {/* Footer Note */}
        <div className="bg-[#f8fcfd] p-3 sm:p-4 border-t border-[#e1eef5] flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Tüm tablolar için Row Level Security (RLS) politikaları ve arama indeksleri dahildir.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white hover:bg-gray-100 text-gray-700 font-semibold border border-[#e1eef5] cursor-pointer"
          >
            Pencereyi Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
