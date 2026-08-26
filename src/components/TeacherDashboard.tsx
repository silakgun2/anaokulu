import { useState, type FormEvent } from 'react';
import {
  Users,
  GraduationCap,
  Video,
  Clock,
  Star,
  Plus,
  Trash2,
  Edit2,
  Search,
  Filter,
  CheckCircle2,
  Award,
  Sparkles,
  Database,
  Copy,
  Check,
  TrendingUp,
  Eye,
  BookOpen,
  Gamepad2,
  FolderPlus
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Classroom, Student, VideoLesson, WatchLog, GameActivity, LessonCategory } from '../types';
import { CATEGORIES } from '../data/mockData';
import { SUPABASE_SQL_SETUP_CODE } from '../lib/supabaseClient';
import { sound } from '../lib/audioEffects';

interface TeacherDashboardProps {
  classes: Classroom[];
  students: Student[];
  videos: VideoLesson[];
  watchLogs: WatchLog[];
  gameActivities: GameActivity[];
  onAddClass: (newClass: Omit<Classroom, 'id' | 'createdAt'>) => void;
  onDeleteClass: (classId: string) => void;
  onUpdateStudent: (studentId: string, updates: Partial<Student>) => void;
  onDeleteStudent: (studentId: string) => void;
  onAddVideo: (newVideo: Omit<VideoLesson, 'id' | 'addedAt'>) => void;
  onDeleteVideo: (videoId: string) => void;
  onAwardStars: (studentId: string, starsToAdd: number, badgeTitle?: string, note?: string) => void;
}

export function TeacherDashboard({
  classes,
  students,
  videos,
  watchLogs,
  gameActivities,
  onAddClass,
  onDeleteClass,
  onUpdateStudent,
  onDeleteStudent,
  onAddVideo,
  onDeleteVideo,
  onAwardStars
}: TeacherDashboardProps) {
  const [activeTab, setActiveTab] = useState<
    'students' | 'classes' | 'videos' | 'watch-analytics' | 'game-analytics' | 'supabase-sql'
  >('students');

  // Search & Filters
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('all');
  const [videoCategoryFilter, setVideoCategoryFilter] = useState('all');

  // Modal / Form States
  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassAge, setNewClassAge] = useState('4-5 Yaş');
  const [newClassIcon, setNewClassIcon] = useState('🌸');
  const [newClassColor, setNewClassColor] = useState('bg-pink-100 text-pink-800 border-pink-300');
  const [newClassDesc, setNewClassDesc] = useState('');

  const [isAddVideoModalOpen, setIsAddVideoModalOpen] = useState(false);
  const [newVidTitle, setNewVidTitle] = useState('');
  const [newVidCategory, setNewVidCategory] = useState<LessonCategory>('turkce');
  const [newVidUrl, setNewVidUrl] = useState('');
  const [newVidDuration, setNewVidDuration] = useState(240);
  const [newVidDesc, setNewVidDesc] = useState('');
  const [newVidAge, setNewVidAge] = useState('3-6 Yaş');
  const [newVidLyrics, setNewVidLyrics] = useState('');

  // Star & Note Awarding Modal
  const [selectedStudentForGrading, setSelectedStudentForGrading] = useState<Student | null>(null);
  const [starsToGive, setStarsToGive] = useState(5);
  const [teacherEvaluationNote, setTeacherEvaluationNote] = useState('');
  const [badgeTitleToAward, setBadgeTitleToAward] = useState('🌟 Süper Başarı');

  // SQL Copy state
  const [copiedSql, setCopiedSql] = useState(false);

  // Stats
  const totalWatchSeconds = watchLogs.reduce((acc, curr) => acc + curr.watchSeconds, 0);
  const totalWatchMinutes = Math.round(totalWatchSeconds / 60);
  const totalStarsGiven = students.reduce((acc, curr) => acc + (curr.starsCount || 0), 0);

  const handleCreateClass = (e: FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    onAddClass({
      name: newClassName.trim(),
      ageGroup: newClassAge,
      icon: newClassIcon,
      color: newClassColor,
      description: newClassDesc || 'Sevimli minikler eğitim sınıfı.'
    });

    sound.playSuccess();
    setIsAddClassModalOpen(false);
    setNewClassName('');
    setNewClassDesc('');
  };

  const handleCreateVideo = (e: FormEvent) => {
    e.preventDefault();
    if (!newVidTitle.trim()) return;

    let cleanUrl = newVidUrl.trim();
    // Convert regular YouTube watch link to embed if needed
    if (cleanUrl.includes('watch?v=')) {
      cleanUrl = cleanUrl.replace('watch?v=', 'embed/');
    } else if (cleanUrl.includes('youtu.be/')) {
      cleanUrl = cleanUrl.replace('youtu.be/', 'www.youtube.com/embed/');
    } else if (!cleanUrl) {
      cleanUrl = 'https://www.youtube.com/embed/1BskZzF-6x4';
    }

    onAddVideo({
      title: newVidTitle.trim(),
      category: newVidCategory,
      durationSeconds: Number(newVidDuration) || 240,
      videoUrl: cleanUrl,
      description: newVidDesc || 'Okul öncesi eğitici video dersi.',
      targetAge: newVidAge,
      thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=80',
      lyricsOrNotes: newVidLyrics,
      teacherName: 'Sıla Öğretmen'
    });

    sound.playSuccess();
    setIsAddVideoModalOpen(false);
    setNewVidTitle('');
    setNewVidUrl('');
    setNewVidDesc('');
    setNewVidLyrics('');
  };

  const handleSaveEvaluation = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForGrading) return;

    onAwardStars(
      selectedStudentForGrading.id,
      starsToGive,
      badgeTitleToAward,
      teacherEvaluationNote
    );

    sound.playStarChime();
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 }
    });

    setSelectedStudentForGrading(null);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SETUP_CODE);
    setCopiedSql(true);
    sound.playPop();
    setTimeout(() => setCopiedSql(false), 2500);
  };

  // Filtered students
  const filteredStudents = students.filter((std) => {
    const matchesSearch =
      std.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      std.parentName.toLowerCase().includes(studentSearch.toLowerCase()) ||
      std.email.toLowerCase().includes(studentSearch.toLowerCase());
    const matchesClass = selectedClassFilter === 'all' || std.classId === selectedClassFilter;
    return matchesSearch && matchesClass;
  });

  // Filtered videos
  const filteredVideos = videos.filter((v) => {
    return videoCategoryFilter === 'all' || v.category === videoCategoryFilter;
  });

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-[#a7c7e7] via-[#f8c8dc] to-[#a7c7e7]/80 rounded-[32px] p-6 sm:p-8 text-[#395679] shadow-sm border-2 border-[#8fb5da]/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase border border-white/80 text-[#4e6a8e]">
            <GraduationCap className="w-4 h-4" /> Sıla Öğretmen Yönetici Paneli
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#324a68]">
            Hoş Geldiniz, Sıla Öğretmenim! 🌸
          </h2>
          <p className="text-[#4e6a8e] text-sm max-w-xl font-medium">
            Öğrenci kayıtlarını takip edebilir, sınıfları yönetebilir, video dersler yükleyebilir ve çocukların ders izleme sürelerini analiz edip yıldızlar verebilirsiniz.
          </p>
        </div>

        {/* Quick actions in hero */}
        <div className="flex flex-wrap gap-2.5 z-10">
          <button
            onClick={() => {
              setIsAddVideoModalOpen(true);
              sound.playPop();
            }}
            className="flex items-center gap-2 bg-white text-[#4e6a8e] hover:bg-[#f8fcfd] border border-[#8fb5da] font-bold px-4 py-2.5 rounded-2xl text-xs sm:text-sm shadow-xs active:scale-95 transition cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#4e6a8e]" /> Video Ders Yükle
          </button>
          <button
            onClick={() => {
              setIsAddClassModalOpen(true);
              sound.playPop();
            }}
            className="flex items-center gap-2 bg-[#f8c8dc] hover:bg-[#f5b7d1] text-gray-800 font-bold px-4 py-2.5 rounded-2xl text-xs sm:text-sm border border-[#f5b7d1] active:scale-95 transition cursor-pointer shadow-xs"
          >
            <FolderPlus className="w-4 h-4 text-gray-700" /> Yeni Sınıf Ekle
          </button>
        </div>
      </div>

      {/* Top 4 Statistical Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-[#e1eef5] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#f8c8dc]/40 text-[#4e6a8e] flex items-center justify-center text-2xl font-bold border border-[#f8c8dc]/60">
            👶
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-500 block">Kayıtlı Öğrenciler</span>
            <span className="text-2xl font-extrabold text-[#395679]">{students.length}</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-[#e1eef5] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#a7c7e7]/30 text-[#4e6a8e] flex items-center justify-center text-2xl font-bold border border-[#8fb5da]/50">
            🏫
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-500 block">Aktif Sınıflar</span>
            <span className="text-2xl font-extrabold text-[#395679]">{classes.length}</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-[#e1eef5] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl font-bold border border-amber-200">
            ⏱️
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-500 block">Toplam İzleme</span>
            <span className="text-2xl font-extrabold text-[#395679]">{totalWatchMinutes} Dk</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-[#e1eef5] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#f8c8dc]/30 text-rose-500 flex items-center justify-center text-2xl font-bold border border-[#f8c8dc]/50">
            ⭐
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-500 block">Verilen Yıldızlar</span>
            <span className="text-2xl font-extrabold text-[#395679]">{totalStarsGiven}</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#f8fcfd] rounded-3xl border border-[#e1eef5] shadow-2xs">
        <button
          onClick={() => {
            setActiveTab('students');
            sound.playPop();
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition cursor-pointer ${
            activeTab === 'students'
              ? 'bg-[#f8c8dc] text-gray-800 border border-[#f5b7d1] shadow-xs'
              : 'text-[#4e6a8e] hover:bg-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Öğrenci Listesi & Not Girişi ({students.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('classes');
            sound.playPop();
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition cursor-pointer ${
            activeTab === 'classes'
              ? 'bg-[#a7c7e7] text-[#395679] border border-[#8fb5da] shadow-xs'
              : 'text-[#4e6a8e] hover:bg-white'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Sınıf Yönetimi ({classes.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('videos');
            sound.playPop();
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition cursor-pointer ${
            activeTab === 'videos'
              ? 'bg-[#a7c7e7] text-[#395679] border border-[#8fb5da] shadow-xs'
              : 'text-[#4e6a8e] hover:bg-white'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Video Dersler ({videos.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('watch-analytics');
            sound.playPop();
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition cursor-pointer ${
            activeTab === 'watch-analytics'
              ? 'bg-[#f8c8dc] text-gray-800 border border-[#f5b7d1] shadow-xs'
              : 'text-[#4e6a8e] hover:bg-white'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Ders İzleme Süre Takibi ({watchLogs.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('game-analytics');
            sound.playPop();
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition cursor-pointer ${
            activeTab === 'game-analytics'
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-xs'
              : 'text-[#4e6a8e] hover:bg-white'
          }`}
        >
          <Gamepad2 className="w-4 h-4" />
          <span>Oyun & Aktivite Analizi</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('supabase-sql');
            sound.playPop();
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition cursor-pointer ml-auto ${
            activeTab === 'supabase-sql'
              ? 'bg-[#395679] text-white shadow-xs'
              : 'text-[#4e6a8e] hover:bg-white'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Supabase SQL Kodu</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: STUDENTS LIST & GRADING & STAR AWARDS              */}
      {/* ========================================================= */}
      {activeTab === 'students' && (
        <div className="space-y-6">
          {/* Filter and Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-[#e1eef5] shadow-xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                placeholder="Öğrenci veya veli adı ara..."
                className="w-full pl-10 pr-4 py-2 text-sm rounded-2xl border border-[#8fb5da]/50 focus:border-[#4e6a8e] focus:outline-none bg-[#f8fcfd]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={selectedClassFilter}
                onChange={(e) => setSelectedClassFilter(e.target.value)}
                className="px-3.5 py-2 rounded-2xl border border-[#8fb5da]/50 focus:border-[#4e6a8e] focus:outline-none text-xs sm:text-sm font-medium bg-[#f8fcfd] text-[#4e6a8e] w-full sm:w-auto"
              >
                <option value="all">Tüm Sınıflar</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Students Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((std) => {
              // Find student watch stats
              const stdWatchLogs = watchLogs.filter((w) => w.studentId === std.id);
              const totalSecs = stdWatchLogs.reduce((acc, curr) => acc + curr.watchSeconds, 0);
              const mins = Math.round(totalSecs / 60);

              return (
                <div
                  key={std.id}
                  className="bg-white rounded-3xl p-6 border border-[#e1eef5] shadow-xs hover:border-[#8fb5da] transition flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Top Row: Avatar & Class */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-[#f8c8dc]/40 border-2 border-white flex items-center justify-center text-3xl shadow-xs">
                          {std.avatar || '🐰'}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800 text-lg">{std.name}</h4>
                          <span className="text-xs bg-[#f8c8dc]/40 text-[#4e6a8e] px-2.5 py-0.5 rounded-full font-semibold border border-[#f8c8dc]">
                            {std.age} Yaşında
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1 rounded-2xl border border-amber-200 font-bold text-sm">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span>{std.starsCount || 0}</span>
                      </div>
                    </div>

                    {/* Class & Parent details */}
                    <div className="bg-[#f8fcfd] rounded-2xl p-3.5 space-y-1.5 text-xs text-gray-600 border border-[#e1eef5]">
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-500">Sınıfı:</span>
                        <span className="font-bold text-[#395679]">{std.className}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-500">Veli:</span>
                        <span className="font-medium text-gray-700">{std.parentName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-500">Telefon:</span>
                        <span className="font-medium text-gray-700">{std.parentPhone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-500">Toplam İzleme:</span>
                        <span className="font-bold text-[#4e6a8e]">{mins} Dakika ({stdWatchLogs.length} Ders)</span>
                      </div>
                    </div>

                    {/* Teacher's Note / Evaluation */}
                    {std.teacherNote && (
                      <div className="bg-[#f8c8dc]/20 border border-[#f8c8dc] rounded-2xl p-3 text-xs text-gray-800">
                        <span className="font-bold block mb-0.5 text-[#4e6a8e]">🌸 Öğretmen Notu:</span>
                        <p className="italic">"{std.teacherNote}"</p>
                      </div>
                    )}

                    {/* Student Badges */}
                    {std.badges && std.badges.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {std.badges.map((b) => (
                          <span
                            key={b.id}
                            className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-amber-200"
                            title={b.reason}
                          >
                            {b.title}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions & Sınıf Değiştirme / Not Verme */}
                  <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                    {/* Class Selector dropdown for teacher to change student's class */}
                    <select
                      value={std.classId}
                      onChange={(e) => {
                        const newC = classes.find((c) => c.id === e.target.value);
                        if (newC) {
                          onUpdateStudent(std.id, {
                            classId: newC.id,
                            className: newC.name
                          });
                          sound.playPop();
                        }
                      }}
                      className="text-[11px] font-semibold bg-[#f8fcfd] border border-[#8fb5da]/50 rounded-xl px-2 py-1.5 text-[#4e6a8e] focus:outline-none"
                    >
                      {classes.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                          {cls.name.split(' ')[1] || cls.name}
                        </option>
                      ))}
                    </select>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setSelectedStudentForGrading(std);
                          setTeacherEvaluationNote(std.teacherNote || '');
                          sound.playPop();
                        }}
                        className="flex items-center gap-1 bg-[#f8c8dc] hover:bg-[#f5b7d1] text-gray-800 font-bold text-xs px-3 py-1.5 rounded-xl border border-[#f5b7d1] shadow-2xs transition cursor-pointer"
                      >
                        <Award className="w-3.5 h-3.5 text-gray-700" />
                        Not & Yıldız Ver
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`${std.name} isimli öğrenciyi sistemden silmek istediğinize emin misiniz?`)) {
                            onDeleteStudent(std.id);
                            sound.playPop();
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                        title="Öğrenciyi Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: CLASS MANAGEMENT                                  */}
      {/* ========================================================= */}
      {activeTab === 'classes' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white p-5 rounded-3xl border border-[#e1eef5] shadow-xs">
            <div>
              <h3 className="font-bold text-gray-800 text-lg">Mevcut Anaokulu Sınıfları</h3>
              <p className="text-xs text-gray-500">
                Sınıflarınızı yaş gruplarına göre organize edin ve öğrencileri atayın.
              </p>
            </div>
            <button
              onClick={() => {
                setIsAddClassModalOpen(true);
                sound.playPop();
              }}
              className="flex items-center gap-2 bg-[#a7c7e7] hover:bg-[#8fb5da] text-[#395679] font-bold text-xs sm:text-sm px-4 py-2.5 rounded-2xl border border-[#8fb5da] shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Yeni Sınıf Ekle
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {classes.map((cls) => {
              const classStudents = students.filter((s) => s.classId === cls.id);

              return (
                <div
                  key={cls.id}
                  className="bg-white rounded-3xl p-6 border border-[#e1eef5] shadow-xs flex flex-col justify-between space-y-4 hover:border-[#8fb5da] transition"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-4xl">{cls.icon || '🌸'}</span>
                      <span className="text-xs bg-[#a7c7e7]/30 text-[#4e6a8e] px-3 py-1 rounded-full font-bold border border-[#8fb5da]/50">
                        {cls.ageGroup}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-gray-800 text-base">{cls.name}</h4>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{cls.description}</p>
                    </div>

                    <div className="bg-[#f8fcfd] p-3 rounded-2xl border border-[#e1eef5]">
                      <span className="text-xs font-bold text-[#4e6a8e] block">
                        Kayıtlı Öğrenciler: {classStudents.length}
                      </span>
                      <div className="flex -space-x-1.5 overflow-hidden mt-1.5">
                        {classStudents.slice(0, 5).map((s) => (
                          <span
                            key={s.id}
                            className="inline-block w-7 h-7 rounded-full bg-white border border-[#f8c8dc] flex items-center justify-center text-sm shadow-2xs"
                            title={s.name}
                          >
                            {s.avatar || '🐰'}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[11px] text-gray-400 font-medium">Oluşturuldu: {cls.createdAt}</span>
                    <button
                      onClick={() => {
                        if (confirm(`${cls.name} sınıfını silmek istediğinize emin misiniz?`)) {
                          onDeleteClass(cls.id);
                          sound.playPop();
                        }
                      }}
                      className="text-xs text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-1.5 rounded-xl font-semibold transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: VIDEO LESSON MANAGEMENT                           */}
      {/* ========================================================= */}
      {activeTab === 'videos' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#e1eef5] shadow-xs">
            <div>
              <h3 className="font-bold text-gray-800 text-lg">Online Video Dersler</h3>
              <p className="text-xs text-gray-500">
                Okul öncesi 5 temel alanda video dersler, çocuk şarkıları ve eğitici animasyonlar
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={videoCategoryFilter}
                onChange={(e) => setVideoCategoryFilter(e.target.value)}
                className="px-3.5 py-2 rounded-2xl border border-[#8fb5da]/50 focus:border-[#4e6a8e] focus:outline-none text-xs sm:text-sm font-medium bg-[#f8fcfd] text-[#4e6a8e]"
              >
                <option value="all">Tüm Kategoriler</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.shortName}
                  </option>
                ))}
              </select>

              <button
                onClick={() => {
                  setIsAddVideoModalOpen(true);
                  sound.playPop();
                }}
                className="flex items-center gap-2 bg-[#f8c8dc] hover:bg-[#f5b7d1] text-gray-800 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-2xl border border-[#f5b7d1] shadow-xs transition cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Video Ekle
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((vid) => {
              const catInfo = CATEGORIES.find((c) => c.id === vid.category);
              const mins = Math.floor(vid.durationSeconds / 60);
              const secs = vid.durationSeconds % 60;

              return (
                <div
                  key={vid.id}
                  className="bg-white rounded-3xl overflow-hidden border border-[#e1eef5] shadow-xs flex flex-col justify-between hover:border-[#8fb5da] transition"
                >
                  <div>
                    {/* Thumbnail banner */}
                    <div className="relative aspect-video bg-[#395679]/20 overflow-hidden">
                      <img
                        src={vid.thumbnail}
                        alt={vid.title}
                        className="w-full h-full object-cover opacity-90"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3.5">
                        <span className="text-xs bg-black/60 backdrop-blur-md text-white px-2 py-0.5 rounded-md font-semibold">
                          ⏱️ {mins}:{secs.toString().padStart(2, '0')}
                        </span>
                      </div>
                      <span className="absolute top-3 left-3 text-xs bg-white/90 text-[#4e6a8e] px-2.5 py-1 rounded-xl font-bold shadow-2xs border border-[#e1eef5]">
                        {catInfo?.icon} {catInfo?.shortName}
                      </span>
                    </div>

                    <div className="p-5 space-y-2">
                      <h4 className="font-bold text-gray-800 text-base leading-snug">
                        {vid.title}
                      </h4>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                        {vid.description}
                      </p>
                      {vid.lyricsOrNotes && (
                        <div className="bg-[#f8c8dc]/20 p-2 rounded-xl text-[11px] text-[#4e6a8e] italic line-clamp-1 border border-[#f8c8dc]/50">
                          🎵 {vid.lyricsOrNotes}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <span>Hedef Yaş: {vid.targetAge}</span>
                    <button
                      onClick={() => {
                        if (confirm(`${vid.title} dersini silmek istediğinize emin misiniz?`)) {
                          onDeleteVideo(vid.id);
                          sound.playPop();
                        }
                      }}
                      className="text-rose-500 hover:text-rose-700 p-1 rounded-lg transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: REAL-TIME WATCH ANALYTICS (Öğrenci İzleme Takibi)    */}
      {/* ========================================================= */}
      {activeTab === 'watch-analytics' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-[#e1eef5] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#4e6a8e]" />
                Öğrenci Video Ders İzleme Süre Takibi
              </h3>
              <p className="text-xs text-gray-500">
                Öğrencilerinizin hangi ders videosunu ne kadar süre izlediğini ve tamamlama oranını canlı takip edin.
              </p>
            </div>

            <div className="text-xs bg-[#f8c8dc]/30 text-[#4e6a8e] px-4 py-2 rounded-2xl border border-[#f8c8dc] font-bold">
              Toplam {watchLogs.length} İzleme Kaydı
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#e1eef5] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#f8fcfd] border-b border-[#e1eef5] text-[#4e6a8e] font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-4">Öğrenci</th>
                    <th className="p-4">İzlenen Ders Videosu</th>
                    <th className="p-4">Kategori</th>
                    <th className="p-4">İzleme Süresi</th>
                    <th className="p-4">Tamamlama %</th>
                    <th className="p-4">Son İzleme Zamanı</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {watchLogs.map((log) => {
                    const catMeta = CATEGORIES.find((c) => c.id === log.category);
                    const watchedMin = Math.floor(log.watchSeconds / 60);
                    const watchedSec = log.watchSeconds % 60;
                    const totalMin = Math.floor(log.totalDurationSeconds / 60);
                    const totalSec = log.totalDurationSeconds % 60;

                    return (
                      <tr key={log.id} className="hover:bg-[#f8fcfd] transition">
                        <td className="p-4 font-bold text-gray-800 flex items-center gap-2">
                          <span className="w-7 h-7 rounded-full bg-[#f8c8dc]/40 text-[#4e6a8e] flex items-center justify-center text-xs">
                            👶
                          </span>
                          {log.studentName}
                        </td>
                        <td className="p-4 font-medium text-gray-700 max-w-xs truncate">
                          {log.videoTitle}
                        </td>
                        <td className="p-4">
                          <span className="bg-[#a7c7e7]/30 text-[#4e6a8e] px-2.5 py-1 rounded-xl text-xs font-semibold border border-[#8fb5da]/50">
                            {catMeta?.icon} {catMeta?.shortName || log.category}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-gray-800">
                          {watchedMin}:{watchedSec.toString().padStart(2, '0')} / {totalMin}:{totalSec.toString().padStart(2, '0')}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-[#a7c7e7] h-2 rounded-full"
                                style={{ width: `${Math.min(100, log.completedPercent)}%` }}
                              />
                            </div>
                            <span className="font-bold text-xs text-[#4e6a8e]">
                              %{log.completedPercent}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-xs text-gray-500 font-medium">
                          {log.lastWatchedAt}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: GAME & EDUCATIONAL ACTIVITY ANALYTICS             */}
      {/* ========================================================= */}
      {activeTab === 'game-analytics' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-[#e1eef5] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-emerald-600" />
                Okul Öncesi Eğitici Oyun Aktiviteleri
              </h3>
              <p className="text-xs text-gray-500">
                Öğrencilerin oynadıkları zeka, sayı ve hayvan sesi eşleştirme oyun skorları
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#e1eef5] shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#f8fcfd] border-b border-[#e1eef5] text-[#4e6a8e] font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4">Öğrenci</th>
                  <th className="p-4">Oyun Adı</th>
                  <th className="p-4">Skor</th>
                  <th className="p-4">Kazanılan Yıldız</th>
                  <th className="p-4">Oynanma Zamanı</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {gameActivities.map((ga) => (
                  <tr key={ga.id} className="hover:bg-emerald-50/20 transition">
                    <td className="p-4 font-bold text-gray-800">{ga.studentName}</td>
                    <td className="p-4 font-semibold text-emerald-800">{ga.gameTitle}</td>
                    <td className="p-4 font-extrabold text-gray-800">{ga.score} / {ga.maxScore}</td>
                    <td className="p-4 text-amber-500 font-bold">
                      {'⭐'.repeat(ga.starsAwarded)} ({ga.starsAwarded} Yıldız)
                    </td>
                    <td className="p-4 text-gray-500 text-xs">{ga.playedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 6: SUPABASE SQL CODE EXPORT & SETUP GUIDE            */}
      {/* ========================================================= */}
      {activeTab === 'supabase-sql' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e1eef5] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2 text-[#4e6a8e] font-bold text-xs uppercase tracking-wide mb-1">
                <Database className="w-4 h-4" /> Supabase Veri Tabanı Entegrasyonu
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                Supabase SQL Kurulum Kodu
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Aşağıdaki SQL kodunu Supabase Dashboard'unuzdaki <strong>SQL Editor</strong> bölümüne yapıştırıp <strong>RUN</strong> butonuna basabilirsiniz.
              </p>
            </div>

            <button
              onClick={handleCopySql}
              className="flex items-center gap-2 bg-[#a7c7e7] hover:bg-[#8fb5da] text-[#395679] border border-[#8fb5da] font-bold px-5 py-2.5 rounded-2xl shadow-xs active:scale-95 transition cursor-pointer text-xs sm:text-sm"
            >
              {copiedSql ? (
                <>
                  <Check className="w-4 h-4" /> Kopyalandı!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" /> SQL Kodunu Kopyala
                </>
              )}
            </button>
          </div>

          <div className="bg-slate-900 text-emerald-400 p-5 rounded-2xl font-mono text-xs sm:text-sm overflow-x-auto max-h-96 shadow-inner">
            <pre>{SUPABASE_SQL_SETUP_CODE}</pre>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gray-600">
            <div className="bg-[#f8fcfd] p-4 rounded-2xl border border-[#e1eef5]">
              <span className="font-bold text-gray-800 block mb-1">1. SQL Editor'e Gidin</span>
              Supabase panelinizde sol menüdeki SQL Editor sekmesini açın.
            </div>
            <div className="bg-[#f8fcfd] p-4 rounded-2xl border border-[#e1eef5]">
              <span className="font-bold text-gray-800 block mb-1">2. Kodu Yapıştırın</span>
              Yukarıdaki SQL kodunu kopyalayıp yeni bir SQL sorgusuna yapıştırın.
            </div>
            <div className="bg-[#f8fcfd] p-4 rounded-2xl border border-[#e1eef5]">
              <span className="font-bold text-gray-800 block mb-1">3. RUN Butonuna Basın</span>
              Tüm tablolar (classes, students, videos, watch_logs, game_activities) ve RLS izinleri anında oluşturulur.
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD NEW CLASS                                     */}
      {/* ========================================================= */}
      {isAddClassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl shadow-xl border border-[#e1eef5] max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
              <span>🌸</span> Yeni Sınıf Oluştur
            </h3>

            <form onSubmit={handleCreateClass} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#4e6a8e] mb-1">Sınıf Adı *</label>
                <input
                  type="text"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="Örn: 🎈 Neşeli Balonlar Sınıfı"
                  required
                  className="w-full px-3.5 py-2 rounded-2xl border border-[#8fb5da]/50 text-sm focus:outline-none focus:border-[#4e6a8e] font-medium bg-[#f8fcfd]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4e6a8e] mb-1">Yaş Grubu</label>
                <select
                  value={newClassAge}
                  onChange={(e) => setNewClassAge(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-2xl border border-[#8fb5da]/50 text-sm focus:outline-none focus:border-[#4e6a8e] font-medium bg-[#f8fcfd] text-[#4e6a8e]"
                >
                  <option value="3-4 Yaş">3-4 Yaş (Küçük Grup)</option>
                  <option value="4-5 Yaş">4-5 Yaş (Orta Grup)</option>
                  <option value="5-6 Yaş">5-6 Yaş (Büyük Grup / Hazırlık)</option>
                  <option value="4-6 Yaş (Karma)">4-6 Yaş (Karma Grup)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4e6a8e] mb-1">Sınıf İkonu</label>
                <div className="flex gap-2">
                  {['🌸', '⭐', '🚀', '🎨', '🎈', '🦁', '🦋', '🧸'].map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setNewClassIcon(ic)}
                      className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition cursor-pointer ${
                        newClassIcon === ic ? 'bg-[#a7c7e7] text-white scale-110 shadow-2xs border border-[#8fb5da]' : 'bg-[#f8fcfd] hover:bg-[#a7c7e7]/20 border border-[#e1eef5]'
                      }`}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4e6a8e] mb-1">Açıklama / Hedef</label>
                <textarea
                  value={newClassDesc}
                  onChange={(e) => setNewClassDesc(e.target.value)}
                  placeholder="Sınıfın eğitim hedefleri..."
                  rows={2}
                  className="w-full px-3.5 py-2 rounded-2xl border border-[#8fb5da]/50 text-sm focus:outline-none focus:border-[#4e6a8e] font-medium bg-[#f8fcfd]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddClassModalOpen(false)}
                  className="flex-1 py-2.5 rounded-2xl font-bold text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-2xl font-bold text-xs bg-[#a7c7e7] hover:bg-[#8fb5da] text-[#395679] border border-[#8fb5da] shadow-xs active:scale-95 cursor-pointer"
                >
                  Sınıfı Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD VIDEO LESSON                                  */}
      {/* ========================================================= */}
      {isAddVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl shadow-xl border border-[#e1eef5] max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
              <span>🎬</span> Yeni Online Video Ders Yükle
            </h3>

            <form onSubmit={handleCreateVideo} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#4e6a8e] mb-1">Ders Başlığı *</label>
                <input
                  type="text"
                  value={newVidTitle}
                  onChange={(e) => setNewVidTitle(e.target.value)}
                  placeholder="Örn: Renkleri ve Şekilleri Tanıyalım"
                  required
                  className="w-full px-3.5 py-2 rounded-2xl border border-[#8fb5da]/50 text-sm focus:outline-none focus:border-[#4e6a8e] font-medium bg-[#f8fcfd]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#4e6a8e] mb-1">Ders Alanı (Kategori) *</label>
                  <select
                    value={newVidCategory}
                    onChange={(e) => setNewVidCategory(e.target.value as LessonCategory)}
                    className="w-full px-3.5 py-2 rounded-2xl border border-[#8fb5da]/50 text-sm focus:outline-none focus:border-[#4e6a8e] font-medium bg-[#f8fcfd] text-[#4e6a8e]"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.shortName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4e6a8e] mb-1">Tahmini Süre (Saniye)</label>
                  <input
                    type="number"
                    value={newVidDuration}
                    onChange={(e) => setNewVidDuration(Number(e.target.value))}
                    placeholder="240"
                    className="w-full px-3.5 py-2 rounded-2xl border border-[#8fb5da]/50 text-sm focus:outline-none focus:border-[#4e6a8e] font-medium bg-[#f8fcfd]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4e6a8e] mb-1">
                  Video / YouTube Embed URL *
                </label>
                <input
                  type="text"
                  value={newVidUrl}
                  onChange={(e) => setNewVidUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3.5 py-2 rounded-2xl border border-[#8fb5da]/50 text-sm focus:outline-none focus:border-[#4e6a8e] font-medium bg-[#f8fcfd]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4e6a8e] mb-1">Hedef Yaş Grubu</label>
                <input
                  type="text"
                  value={newVidAge}
                  onChange={(e) => setNewVidAge(e.target.value)}
                  placeholder="3-6 Yaş"
                  className="w-full px-3.5 py-2 rounded-2xl border border-[#8fb5da]/50 text-sm focus:outline-none focus:border-[#4e6a8e] font-medium bg-[#f8fcfd]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4e6a8e] mb-1">Ders Açıklaması</label>
                <textarea
                  value={newVidDesc}
                  onChange={(e) => setNewVidDesc(e.target.value)}
                  placeholder="Çocukların bu derste öğrenecekleri..."
                  rows={2}
                  className="w-full px-3.5 py-2 rounded-2xl border border-[#8fb5da]/50 text-sm focus:outline-none focus:border-[#4e6a8e] font-medium bg-[#f8fcfd]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4e6a8e] mb-1">Şarkı Sözleri / Notlar</label>
                <textarea
                  value={newVidLyrics}
                  onChange={(e) => setNewVidLyrics(e.target.value)}
                  placeholder="Sing-along sözleri veya öğretmen ipuçları..."
                  rows={2}
                  className="w-full px-3.5 py-2 rounded-2xl border border-[#8fb5da]/50 text-sm focus:outline-none focus:border-[#4e6a8e] font-medium bg-[#f8fcfd]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddVideoModalOpen(false)}
                  className="flex-1 py-2.5 rounded-2xl font-bold text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-2xl font-bold text-xs bg-[#f8c8dc] hover:bg-[#f5b7d1] text-gray-800 border border-[#f5b7d1] shadow-xs active:scale-95 cursor-pointer"
                >
                  Videoyu Yükle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: GRADE & STAR AWARDING MODAL                       */}
      {/* ========================================================= */}
      {selectedStudentForGrading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl shadow-xl border border-[#e1eef5] max-w-md w-full p-6 space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center text-3xl mx-auto mb-2 border border-amber-200">
                {selectedStudentForGrading.avatar || '🐰'}
              </div>
              <h3 className="font-bold text-gray-800 text-lg">
                {selectedStudentForGrading.name} için Değerlendirme
              </h3>
              <p className="text-xs text-gray-500">
                Öğrencinin video izleme ve oyun aktivitesine göre not ve yıldız verin
              </p>
            </div>

            <form onSubmit={handleSaveEvaluation} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#4e6a8e] mb-1">
                  Eklenecek Yıldız Sayısı
                </label>
                <div className="flex justify-center gap-2 p-2 bg-[#f8fcfd] rounded-2xl border border-[#e1eef5]">
                  {[1, 2, 3, 4, 5].map((starNum) => (
                    <button
                      key={starNum}
                      type="button"
                      onClick={() => {
                        setStarsToGive(starNum);
                        sound.playPop();
                      }}
                      className={`text-2xl transition cursor-pointer transform hover:scale-125 ${
                        starNum <= starsToGive ? 'scale-110 drop-shadow' : 'opacity-30'
                      }`}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
                <div className="text-center text-xs font-bold text-amber-700 mt-1">
                  +{starsToGive} Yıldız Eklenecek
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4e6a8e] mb-1">
                  Başarı Rozeti Seçin
                </label>
                <select
                  value={badgeTitleToAward}
                  onChange={(e) => setBadgeTitleToAward(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-2xl border border-[#8fb5da]/50 text-sm font-medium bg-[#f8fcfd] text-[#4e6a8e] focus:outline-none"
                >
                  <option value="🌟 Matematik Dehası">🌟 Matematik Dehası</option>
                  <option value="🦁 Hayvan Dostu">🦁 Hayvan Dostu</option>
                  <option value="🇬🇧 İngilizce Yıldızı">🇬🇧 İngilizce Yıldızı</option>
                  <option value="🧩 Zeka Şampiyonu">🧩 Zeka Şampiyonu</option>
                  <option value="💖 Nezaket ve Paylaşım">💖 Nezaket ve Paylaşım</option>
                  <option value="🎬 Süper İzleyici">🎬 Süper İzleyici</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4e6a8e] mb-1">
                  Öğretmen Gelişim / Değerlendirme Notu
                </label>
                <textarea
                  value={teacherEvaluationNote}
                  onChange={(e) => setTeacherEvaluationNote(e.target.value)}
                  placeholder="Öğrencinin dersteki gayreti, ilgisi ve gelişim durumu..."
                  rows={3}
                  className="w-full px-3.5 py-2 rounded-2xl border border-[#8fb5da]/50 text-sm focus:outline-none font-medium bg-[#f8fcfd]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedStudentForGrading(null)}
                  className="flex-1 py-2.5 rounded-2xl font-bold text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-2xl font-bold text-xs bg-gradient-to-r from-amber-400 to-[#f8c8dc] text-gray-800 border border-amber-300 shadow-xs active:scale-95 cursor-pointer"
                >
                  Kaydet ve Yıldızları Gönder 🎉
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
