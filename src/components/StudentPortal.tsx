import { useState } from 'react';
import {
  Sparkles,
  Star,
  Play,
  Award,
  BookOpen,
  Gamepad2,
  Music,
  CheckCircle2,
  Heart,
  Volume2,
  Clock,
  Zap
} from 'lucide-react';
import type { Student, VideoLesson, WatchLog, GameActivity, LessonCategory } from '../types';
import { CATEGORIES } from '../data/mockData';
import { AnimalSoundGame } from './games/AnimalSoundGame';
import { NumberMatchGame } from './games/NumberMatchGame';
import { MemoryCardsGame } from './games/MemoryCardsGame';
import { ShapeColorGame } from './games/ShapeColorGame';
import { SingAlongPlayer } from './games/SingAlongPlayer';
import { sound } from '../lib/audioEffects';

interface StudentPortalProps {
  student: Student;
  videos: VideoLesson[];
  watchLogs: WatchLog[];
  onOpenVideo: (video: VideoLesson) => void;
  onGameFinish: (gameId: 'animal_sounds' | 'number_match' | 'memory_cards' | 'shape_color', gameTitle: string, score: number, stars: number) => void;
}

export function StudentPortal({
  student,
  videos,
  watchLogs,
  onOpenVideo,
  onGameFinish
}: StudentPortalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeMainSection, setActiveMainSection] = useState<'videos' | 'games' | 'songs' | 'report'>('videos');
  const [selectedGame, setSelectedGame] = useState<'animal_sounds' | 'number_match' | 'memory_cards' | 'shape_color'>('animal_sounds');

  const studentWatchLogs = watchLogs.filter((w) => w.studentId === student.id);
  const totalWatchedSeconds = studentWatchLogs.reduce((acc, curr) => acc + curr.watchSeconds, 0);
  const totalMinutes = Math.round(totalWatchedSeconds / 60);

  const filteredVideos = videos.filter((v) => {
    if (selectedCategory === 'all') return true;
    return v.category === selectedCategory;
  });

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Playful Pastel Hero Header with Natural Tones */}
      <div className="bg-gradient-to-r from-[#f8c8dc]/70 via-[#f8c8dc]/40 to-[#a7c7e7]/60 rounded-3xl p-6 sm:p-8 text-[#4e6a8e] shadow-xs border border-[#f3d5dc] flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        {/* Floating background playful emojis */}
        <span className="absolute -top-3 left-10 text-5xl opacity-25 select-none animate-float">🎈</span>
        <span className="absolute bottom-2 right-16 text-5xl opacity-25 select-none animate-bounce">⭐</span>
        <span className="absolute top-4 right-1/3 text-4xl opacity-20 select-none animate-float">🌸</span>

        <div className="flex items-center gap-5 z-10">
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white shadow-xs border-2 border-[#f8c8dc] flex items-center justify-center text-5xl sm:text-6xl animate-bounce">
              {student.avatar || '🐰'}
            </div>
            <span className="absolute -bottom-2 -right-2 bg-amber-300 text-amber-900 font-black text-xs px-2.5 py-0.5 rounded-full border-2 border-white shadow-xs">
              {student.age} Yaş
            </span>
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-xs text-[#4e6a8e] px-3 py-0.5 rounded-full text-xs font-extrabold border border-[#f3d5dc]">
              <Sparkles className="w-3.5 h-3.5 text-[#d97d9e]" /> {student.className}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-800">
              Hoş Geldin, {student.name}! 🌟
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm font-semibold max-w-md">
              Bugün yeni eğitici videolar izleyebilir, hayvan seslerini tahmin edebilir ve bolca yıldız kazanabilirsin!
            </p>
          </div>
        </div>

        {/* Child's Top Badges & Stars Counter */}
        <div className="flex flex-row md:flex-col gap-3 z-10 w-full md:w-auto justify-center">
          <div className="bg-white/95 backdrop-blur-xs rounded-2xl p-4 border border-amber-200 shadow-xs flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center text-2xl">
              ⭐
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-500 block uppercase tracking-wider">
                Yıldızlarım
              </span>
              <span className="text-2xl font-black text-amber-600">
                {student.starsCount || 0} Yıldız
              </span>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-xs rounded-2xl p-4 border border-[#8fb5da]/40 shadow-xs flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#eef6fc] text-[#395679] flex items-center justify-center text-2xl">
              ⏱️
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-500 block uppercase tracking-wider">
                İzleme Süresi
              </span>
              <span className="text-xl font-black text-[#395679]">
                {totalMinutes} Dakika
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Mode Switcher */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          id="btn-nav-videos"
          onClick={() => {
            setActiveMainSection('videos');
            sound.playPop();
          }}
          className={`p-4 rounded-3xl border flex items-center gap-3 transition cursor-pointer ${
            activeMainSection === 'videos'
              ? 'bg-[#f8c8dc] text-gray-800 border-[#e5a8c2] shadow-xs'
              : 'bg-white hover:bg-[#f8c8dc]/20 border-[#e1eef5] text-gray-700'
          }`}
        >
          <div className="w-11 h-11 rounded-2xl bg-white/60 flex items-center justify-center text-2xl">
            🎬
          </div>
          <div className="text-left">
            <span className="block font-bold text-sm sm:text-base">Video Dersler</span>
            <span className="block text-[11px] text-gray-500 font-medium">5 Temel Alan</span>
          </div>
        </button>

        <button
          id="btn-nav-games"
          onClick={() => {
            setActiveMainSection('games');
            sound.playPop();
          }}
          className={`p-4 rounded-3xl border flex items-center gap-3 transition cursor-pointer ${
            activeMainSection === 'games'
              ? 'bg-[#a7c7e7] text-gray-800 border-[#8fb5da] shadow-xs'
              : 'bg-white hover:bg-[#a7c7e7]/20 border-[#e1eef5] text-gray-700'
          }`}
        >
          <div className="w-11 h-11 rounded-2xl bg-white/60 flex items-center justify-center text-2xl">
            🎮
          </div>
          <div className="text-left">
            <span className="block font-bold text-sm sm:text-base">Eğitici Oyunlar</span>
            <span className="block text-[11px] text-gray-500 font-medium">Sayı & Ses Eşleştirme</span>
          </div>
        </button>

        <button
          id="btn-nav-songs"
          onClick={() => {
            setActiveMainSection('songs');
            sound.playPop();
          }}
          className={`p-4 rounded-3xl border flex items-center gap-3 transition cursor-pointer ${
            activeMainSection === 'songs'
              ? 'bg-amber-200 text-amber-900 border-amber-300 shadow-xs'
              : 'bg-white hover:bg-amber-50 border-[#e1eef5] text-gray-700'
          }`}
        >
          <div className="w-11 h-11 rounded-2xl bg-white/60 flex items-center justify-center text-2xl">
            🎵
          </div>
          <div className="text-left">
            <span className="block font-bold text-sm sm:text-base">Şarkılar & Animasyon</span>
            <span className="block text-[11px] text-gray-500 font-medium">Karaoke & Masallar</span>
          </div>
        </button>

        <button
          id="btn-nav-report"
          onClick={() => {
            setActiveMainSection('report');
            sound.playPop();
          }}
          className={`p-4 rounded-3xl border flex items-center gap-3 transition cursor-pointer ${
            activeMainSection === 'report'
              ? 'bg-purple-200 text-purple-900 border-purple-300 shadow-xs'
              : 'bg-white hover:bg-purple-50 border-[#e1eef5] text-gray-700'
          }`}
        >
          <div className="w-11 h-11 rounded-2xl bg-white/60 flex items-center justify-center text-2xl">
            💖
          </div>
          <div className="text-left">
            <span className="block font-bold text-sm sm:text-base">Gelişim Raporum</span>
            <span className="block text-[11px] text-gray-500 font-medium">Öğretmenimin Notu</span>
          </div>
        </button>
      </div>

      {/* ========================================================= */}
      {/* SECTION 1: VIDEO LESSONS (5 ANAOKULU KATEGORİSİ)          */}
      {/* ========================================================= */}
      {activeMainSection === 'videos' && (
        <div className="space-y-6">
          {/* Subject Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => {
                setSelectedCategory('all');
                sound.playPop();
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-gray-800 text-white shadow-xs'
                  : 'bg-white hover:bg-gray-100 text-gray-700 border border-[#e1eef5]'
              }`}
            >
              <span>🌟</span>
              <span>Tüm Dersler ({videos.length})</span>
            </button>

            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    sound.playPop();
                  }}
                  className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
                    isSelected
                      ? 'bg-[#f8c8dc] text-gray-800 border border-[#e5a8c2] shadow-xs'
                      : 'bg-white hover:bg-[#f8c8dc]/20 text-gray-700 border border-[#e1eef5]'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.shortName}</span>
                </button>
              );
            })}
          </div>

          {/* Videos Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((vid) => {
              const catMeta = CATEGORIES.find((c) => c.id === vid.category);
              const watchRecord = studentWatchLogs.find((w) => w.videoId === vid.id);
              const isWatched = watchRecord && watchRecord.completedPercent >= 90;
              const mins = Math.floor(vid.durationSeconds / 60);
              const secs = vid.durationSeconds % 60;

              return (
                <div
                  key={vid.id}
                  className="bg-white rounded-3xl overflow-hidden border border-[#e1eef5] shadow-xs hover:shadow-md hover:border-[#8fb5da] transition duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Thumbnail banner */}
                    <div className="relative aspect-video bg-gray-900 overflow-hidden cursor-pointer" onClick={() => onOpenVideo(vid)}>
                      <img
                        src={vid.thumbnail}
                        alt={vid.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-[#f8c8dc] text-gray-800 flex items-center justify-center pl-1 shadow-md group-hover:scale-110 transition">
                          <Play className="w-7 h-7 fill-gray-800 text-gray-800" />
                        </div>
                      </div>

                      {/* Top Badges */}
                      <span className="absolute top-3 left-3 text-xs bg-white/95 text-gray-800 px-3 py-1 rounded-xl font-bold shadow-xs">
                        {catMeta?.icon} {catMeta?.shortName}
                      </span>

                      <span className="absolute bottom-3 right-3 text-xs bg-black/70 backdrop-blur-xs text-white px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {mins}:{secs.toString().padStart(2, '0')}
                      </span>

                      {isWatched && (
                        <span className="absolute top-3 right-3 bg-emerald-500 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" /> İzlendi
                        </span>
                      )}
                    </div>

                    <div className="p-5 space-y-2">
                      <h4 className="font-bold text-gray-800 text-base leading-snug group-hover:text-[#4e6a8e] transition">
                        {vid.title}
                      </h4>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                        {vid.description}
                      </p>

                      {/* Watch Progress if any */}
                      {watchRecord && (
                        <div className="pt-2">
                          <div className="flex justify-between text-[11px] font-semibold text-gray-500 mb-1">
                            <span>İzleme: %{watchRecord.completedPercent}</span>
                            <span className="text-[#4e6a8e] font-bold">{Math.round(watchRecord.watchSeconds / 60)} dk</span>
                          </div>
                          <div className="w-full bg-[#e1eef5]/60 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-[#f8c8dc] to-[#a7c7e7] h-2 rounded-full"
                              style={{ width: `${watchRecord.completedPercent}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 border-t border-[#e1eef5] bg-[#fdfcfb] flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-medium">
                      🎯 {vid.targetAge}
                    </span>
                    <button
                      onClick={() => onOpenVideo(vid)}
                      className="flex items-center gap-1.5 bg-[#a7c7e7] hover:bg-[#8fb5da] text-[#395679] font-bold text-xs px-4 py-2 rounded-xl border border-[#8fb5da] shadow-xs active:scale-95 transition cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-[#395679]" /> Dersi İzle
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 2: PRESCHOOL GAMES HUB                            */}
      {/* ========================================================= */}
      {activeMainSection === 'games' && (
        <div className="space-y-6">
          {/* Game Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => {
                setSelectedGame('animal_sounds');
                sound.playPop();
              }}
              className={`p-3.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border transition cursor-pointer ${
                selectedGame === 'animal_sounds'
                  ? 'bg-[#f8c8dc] text-gray-800 border-[#e5a8c2] shadow-xs'
                  : 'bg-white text-gray-700 border-[#e1eef5] hover:bg-[#f8c8dc]/20'
              }`}
            >
              <span>🦁</span>
              <span>Hayvanlar & Sesleri</span>
            </button>

            <button
              onClick={() => {
                setSelectedGame('number_match');
                sound.playPop();
              }}
              className={`p-3.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border transition cursor-pointer ${
                selectedGame === 'number_match'
                  ? 'bg-[#a7c7e7] text-gray-800 border-[#8fb5da] shadow-xs'
                  : 'bg-white text-gray-700 border-[#e1eef5] hover:bg-[#a7c7e7]/20'
              }`}
            >
              <span>🔢</span>
              <span>Sayı Eşleştirme</span>
            </button>

            <button
              onClick={() => {
                setSelectedGame('memory_cards');
                sound.playPop();
              }}
              className={`p-3.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border transition cursor-pointer ${
                selectedGame === 'memory_cards'
                  ? 'bg-purple-100 text-purple-900 border-purple-300 shadow-xs'
                  : 'bg-white text-gray-700 border-[#e1eef5] hover:bg-purple-50'
              }`}
            >
              <span>🃏</span>
              <span>Hafıza Kartları</span>
            </button>

            <button
              onClick={() => {
                setSelectedGame('shape_color');
                sound.playPop();
              }}
              className={`p-3.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border transition cursor-pointer ${
                selectedGame === 'shape_color'
                  ? 'bg-rose-100 text-rose-900 border-rose-300 shadow-xs'
                  : 'bg-white text-gray-700 border-[#e1eef5] hover:bg-rose-50'
              }`}
            >
              <span>🎨</span>
              <span>Şekil & Renkler</span>
            </button>
          </div>

          {/* Active Game Component */}
          {selectedGame === 'animal_sounds' && (
            <AnimalSoundGame
              onGameComplete={(score, stars) =>
                onGameFinish('animal_sounds', '🦁 Hayvanlar ve Sesleri', score, stars)
              }
            />
          )}

          {selectedGame === 'number_match' && (
            <NumberMatchGame
              onGameComplete={(score, stars) =>
                onGameFinish('number_match', '🔢 Meyve Sayma & Sayı Eşleştirme', score, stars)
              }
            />
          )}

          {selectedGame === 'memory_cards' && (
            <MemoryCardsGame
              onGameComplete={(score, stars) =>
                onGameFinish('memory_cards', '🃏 Sevimli Hafıza Kartları', score, stars)
              }
            />
          )}

          {selectedGame === 'shape_color' && (
            <ShapeColorGame
              onGameComplete={(score, stars) =>
                onGameFinish('shape_color', '🎨 Şekil & Renk Eşleştirme', score, stars)
              }
            />
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 3: SONGS & KARAOKE PLAYER                         */}
      {/* ========================================================= */}
      {activeMainSection === 'songs' && (
        <div className="space-y-6">
          <SingAlongPlayer
            onSongCompleted={(songTitle) => {
              onGameFinish('animal_sounds', `🎵 ${songTitle} Şarkısı`, 100, 2);
            }}
          />
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 4: MY REPORT & TEACHER FEEDBACK                   */}
      {/* ========================================================= */}
      {activeMainSection === 'report' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e1eef5] shadow-xs space-y-6">
            <div className="flex items-center gap-4 pb-4 border-b border-[#e1eef5]">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#f8c8dc] to-[#a7c7e7] text-gray-800 flex items-center justify-center text-3xl shadow-xs">
                🎓
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                  {student.name} - Gelişim Karnesi
                </h3>
                <p className="text-xs text-gray-500">
                  Sıla Öğretmen'in değerlendirme notları, kazanılan yıldızlar ve başarı rozetleri
                </p>
              </div>
            </div>

            {/* Teacher's Note Special Box */}
            <div className="bg-[#fdfcfb] rounded-3xl p-6 border border-[#f3d5dc] shadow-xs relative overflow-hidden">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">👩‍🏫</span>
                <h4 className="font-bold text-[#4e6a8e] text-base">
                  Sıla Öğretmen'in Değerlendirmesi:
                </h4>
              </div>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed italic pl-9">
                "{student.teacherNote || 'Öğrencimiz derslerine neşeyle katılıyor, oyunlarda büyük başarı gösteriyor!'}"
              </p>
            </div>

            {/* Badges Earned */}
            <div>
              <h4 className="font-bold text-gray-800 text-base mb-3 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                Kazanılan Başarı Rozetleri
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {(student.badges || []).map((b) => (
                  <div
                    key={b.id}
                    className="bg-[#fdfcfb] border border-amber-200 rounded-2xl p-4 flex items-center gap-3 shadow-xs"
                  >
                    <span className="text-3xl">{b.icon || '🏆'}</span>
                    <div>
                      <h5 className="font-bold text-gray-800 text-sm">{b.title}</h5>
                      <p className="text-xs text-gray-500 mt-0.5">{b.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Student's Watch and Play History summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-[#eef6fc] rounded-2xl p-4 border border-[#8fb5da]/40">
                <span className="text-xs font-bold text-[#395679] uppercase tracking-wide block mb-1">
                  İzlenen Video Dersler
                </span>
                <span className="text-2xl font-black text-[#395679]">{studentWatchLogs.length} Ders</span>
                <p className="text-xs text-gray-600 mt-1">Toplam {totalMinutes} dakika odaklanma süresi</p>
              </div>

              <div className="bg-[#fcf2f6] rounded-2xl p-4 border border-[#f3d5dc]">
                <span className="text-xs font-bold text-[#96476c] uppercase tracking-wide block mb-1">
                  Toplam Toplanan Yıldızlar
                </span>
                <span className="text-2xl font-black text-[#96476c]">{student.starsCount || 0} ⭐</span>
                <p className="text-xs text-gray-600 mt-1">Harika bir başarı grafiği!</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
