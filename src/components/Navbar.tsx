import { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Lock,
  UserPlus,
  LogOut,
  Sparkles,
  GraduationCap,
  Star,
  User,
  Database
} from 'lucide-react';
import type { CurrentUser, Student } from '../types';
import { sound } from '../lib/audioEffects';

interface NavbarProps {
  currentUser: CurrentUser;
  onOpenAuthModal: (tab: 'teacher' | 'student-register' | 'student-login') => void;
  onLogout: () => void;
  onSelectStudent: (student: Student) => void;
  allStudents: Student[];
  onOpenSqlModal: () => void;
}

export function Navbar({
  currentUser,
  onOpenAuthModal,
  onLogout,
  onSelectStudent,
  allStudents,
  onOpenSqlModal
}: NavbarProps) {
  const [soundActive, setSoundActive] = useState(true);

  const toggleSound = () => {
    const next = !soundActive;
    setSoundActive(next);
    sound.soundEnabled = next;
    if (next) sound.playPop();
  };

  return (
    <header className="sticky top-0 z-40 bg-[#a7c7e7]/95 backdrop-blur-md border-b-2 border-[#8fb5da] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-3 sm:gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 bg-[#f8c8dc] rounded-full flex items-center justify-center border-2 border-white shadow-xs text-lg sm:text-xl animate-float shrink-0">
            🧸
          </div>
          <div>
            <span className="block font-extrabold text-base sm:text-xl text-[#395679] tracking-tight leading-none">
              Minik Adımlar
            </span>
            <span className="block text-[10px] sm:text-[11px] font-bold text-[#4e6a8e] uppercase tracking-wider mt-0.5">
              Online Anaokulu Portalı
            </span>
          </div>
        </div>

        {/* User Status / Role Badge & Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Prominent SQL Code Button visible at the very top */}
          <button
            id="btn-nav-sql-code"
            onClick={() => {
              onOpenSqlModal();
              sound.playPop();
            }}
            className="flex items-center gap-1.5 bg-[#fdfcfb] hover:bg-white text-[#395679] border-2 border-[#8fb5da] font-bold text-xs sm:text-sm px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl transition cursor-pointer shadow-xs active:scale-95"
            title="Supabase & PostgreSQL Veritabanı SQL Kodlarını Görüntüle"
          >
            <Database className="w-4 h-4 text-[#395679]" />
            <span className="font-extrabold">SQL Kodu</span>
          </button>

          {/* Sound Mute/Unmute */}
          <button
            onClick={toggleSound}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/70 hover:bg-white text-[#4e6a8e] flex items-center justify-center transition border border-[#8fb5da] cursor-pointer shadow-2xs shrink-0"
            title={soundActive ? 'Sesi Kapat' : 'Sesi Aç'}
          >
            {soundActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Current User Badge */}
          {currentUser.role === 'teacher' ? (
            <div className="flex items-center gap-2 bg-white/80 border border-white px-3.5 py-1.5 rounded-full shadow-2xs">
              <div className="w-7 h-7 rounded-full bg-[#f8c8dc] text-slate-800 flex items-center justify-center text-xs font-bold border border-white">
                🌸
              </div>
              <div className="hidden sm:block text-left">
                <span className="block text-xs font-bold text-[#4e6a8e]">Sıla Öğretmen</span>
                <span className="block text-[10px] text-[#6d8cae] font-semibold uppercase">Yönetici Paneli</span>
              </div>
              <button
                onClick={onLogout}
                className="ml-1 p-1 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                title="Çıkış Yap"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : currentUser.role === 'student' && currentUser.student ? (
            <div className="flex items-center gap-2 bg-white/80 border border-white px-3.5 py-1.5 rounded-full shadow-2xs">
              <span className="text-xl">{currentUser.student.avatar || '🐰'}</span>
              <div className="hidden sm:block text-left">
                <span className="block text-xs font-bold text-[#4e6a8e]">{currentUser.student.name}</span>
                <span className="block text-[10px] text-amber-600 font-semibold">
                  {currentUser.student.starsCount} ⭐ Yıldız
                </span>
              </div>

              {/* Quick switch to another student */}
              {allStudents.length > 1 && (
                <select
                  value={currentUser.student.id}
                  onChange={(e) => {
                    const std = allStudents.find((s) => s.id === e.target.value);
                    if (std) onSelectStudent(std);
                  }}
                  className="text-xs bg-white/90 border border-[#8fb5da] rounded-lg px-1.5 py-1 text-[#4e6a8e] font-medium focus:outline-none"
                  title="Öğrenci Değiştir"
                >
                  {allStudents.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              )}

              <button
                onClick={onLogout}
                className="ml-1 p-1 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                title="Çıkış Yap"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Guest Buttons */
            <div className="flex items-center gap-2">
              <button
                id="btn-nav-teacher-login"
                onClick={() => {
                  onOpenAuthModal('teacher');
                  sound.playPop();
                }}
                className="flex items-center gap-1.5 bg-white hover:bg-[#f8fcfd] text-[#4e6a8e] border border-[#8fb5da] font-bold text-xs sm:text-sm px-3.5 py-2 rounded-xl transition cursor-pointer shadow-2xs"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Öğretmen Girişi</span>
              </button>

              <button
                id="btn-nav-student-register"
                onClick={() => {
                  onOpenAuthModal('student-register');
                  sound.playPop();
                }}
                className="flex items-center gap-1.5 bg-[#f8c8dc] hover:bg-[#f5b7d1] text-gray-800 border border-[#f5b7d1] font-bold text-xs sm:text-sm px-4 py-2 rounded-xl shadow-xs active:scale-95 transition cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5 text-gray-700" />
                <span>Öğrenci Kaydı</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
