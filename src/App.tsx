import { useState, useEffect } from 'react';
import { Database, Sparkles, Terminal } from 'lucide-react';
import type { Classroom, Student, VideoLesson, WatchLog, GameActivity, CurrentUser } from './types';
import {
  INITIAL_CLASSES,
  INITIAL_STUDENTS,
  INITIAL_VIDEOS,
  INITIAL_WATCH_LOGS,
  INITIAL_GAME_ACTIVITIES
} from './data/mockData';
import { supabase } from './lib/supabaseClient';
import { Navbar } from './components/Navbar';
import { TeacherDashboard } from './components/TeacherDashboard';
import { StudentPortal } from './components/StudentPortal';
import { AuthModal } from './components/AuthModal';
import { VideoPlayerModal } from './components/VideoPlayerModal';
//import { SqlModal } from './components/SqlModal';
import { sound } from './lib/audioEffects';

export default function App() {
  // 1. Data States with LocalStorage Persistence
  const [classes, setClasses] = useState<Classroom[]>(() => {
    const saved = localStorage.getItem('minik_classes');
    return saved ? JSON.parse(saved) : INITIAL_CLASSES;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('minik_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [videos, setVideos] = useState<VideoLesson[]>(() => {
    const saved = localStorage.getItem('minik_videos');
    return saved ? JSON.parse(saved) : INITIAL_VIDEOS;
  });

  const [watchLogs, setWatchLogs] = useState<WatchLog[]>(() => {
    const saved = localStorage.getItem('minik_watch_logs');
    return saved ? JSON.parse(saved) : INITIAL_WATCH_LOGS;
  });

  const [gameActivities, setGameActivities] = useState<GameActivity[]>(() => {
    const saved = localStorage.getItem('minik_game_activities');
    return saved ? JSON.parse(saved) : INITIAL_GAME_ACTIVITIES;
  });

  // Current session user (Teacher or Active Student)
  const [currentUser, setCurrentUser] = useState<CurrentUser>(() => {
    const saved = localStorage.getItem('minik_current_user');
    if (saved) {
      return JSON.parse(saved);
    }
    // Default to student Ayşe Yılmaz for lively immediate preview experience
    return {
      role: 'student',
      student: INITIAL_STUDENTS[0],
      name: INITIAL_STUDENTS[0].name
    };
  });

  // Modal controls
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSqlModalOpen, setIsSqlModalOpen] = useState(false);
  const [authModalInitialTab, setAuthModalInitialTab] = useState<'teacher' | 'student-register' | 'student-login'>('student-register');
  const [activeVideo, setActiveVideo] = useState<VideoLesson | null>(null);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('minik_classes', JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem('minik_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('minik_videos', JSON.stringify(videos));
  }, [videos]);

  useEffect(() => {
    localStorage.setItem('minik_watch_logs', JSON.stringify(watchLogs));
  }, [watchLogs]);

  useEffect(() => {
    localStorage.setItem('minik_game_activities', JSON.stringify(gameActivities));
  }, [gameActivities]);

  useEffect(() => {
    localStorage.setItem('minik_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  // Try fetching / syncing from Supabase asynchronously if remote tables are ready
  useEffect(() => {
    async function loadFromSupabase() {
      try {
        const { data: dbClasses } = await supabase.from('classes').select('*');
        if (dbClasses && dbClasses.length > 0) {
          // Sync if exists
        }
      } catch {
        // Fallback to local state seamlessly
      }
    }
    loadFromSupabase();
  }, []);

  // Handlers for Teacher Actions
  const handleAddClass = (newClassData: Omit<Classroom, 'id' | 'createdAt'>) => {
    const newClass: Classroom = {
      ...newClassData,
      id: `cls-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setClasses((prev) => [newClass, ...prev]);

    // Async attempt to persist in Supabase
    (async () => {
      try {
        await supabase.from('classes').insert({
          id: newClass.id,
          name: newClass.name,
          color: newClass.color,
          icon: newClass.icon,
          age_group: newClass.ageGroup,
          description: newClass.description
        });
      } catch {
        // local state fallback
      }
    })();
  };

  const handleDeleteClass = (classId: string) => {
    setClasses((prev) => prev.filter((c) => c.id !== classId));
    (async () => {
      try {
        await supabase.from('classes').delete().eq('id', classId);
      } catch {
        // ignore
      }
    })();
  };

  const handleUpdateStudent = (studentId: string, updates: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          const updated = { ...s, ...updates };
          // If this is the current active student, update session too
          if (currentUser.student?.id === studentId) {
            setCurrentUser((u) => ({ ...u, student: updated, name: updated.name }));
          }
          return updated;
        }
        return s;
      })
    );

    (async () => {
      try {
        await supabase.from('students').update(updates).eq('id', studentId);
      } catch {
        // ignore
      }
    })();
  };

  const handleDeleteStudent = (studentId: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
    if (currentUser.student?.id === studentId) {
      setCurrentUser({ role: 'guest', name: 'Ziyaretçi' });
    }
    (async () => {
      try {
        await supabase.from('students').delete().eq('id', studentId);
      } catch {
        // ignore
      }
    })();
  };

  const handleAddVideo = (newVideoData: Omit<VideoLesson, 'id' | 'addedAt'>) => {
    const newVid: VideoLesson = {
      ...newVideoData,
      id: `vid-${Date.now()}`,
      addedAt: new Date().toISOString().split('T')[0]
    };
    setVideos((prev) => [newVid, ...prev]);

    (async () => {
      try {
        await supabase.from('videos').insert({
          id: newVid.id,
          title: newVid.title,
          category: newVid.category,
          duration_seconds: newVid.durationSeconds,
          video_url: newVid.videoUrl,
          description: newVid.description,
          target_age: newVid.targetAge,
          thumbnail: newVid.thumbnail,
          lyrics_or_notes: newVid.lyricsOrNotes,
          teacher_name: newVid.teacherName
        });
      } catch {
        // ignore
      }
    })();
  };

  const handleDeleteVideo = (videoId: string) => {
    setVideos((prev) => prev.filter((v) => v.id !== videoId));
    (async () => {
      try {
        await supabase.from('videos').delete().eq('id', videoId);
      } catch {
        // ignore
      }
    })();
  };

  const handleAwardStars = (
    studentId: string,
    starsToAdd: number,
    badgeTitle?: string,
    note?: string
  ) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          const newStars = (s.starsCount || 0) + starsToAdd;
          const updatedBadges = [...(s.badges || [])];
          if (badgeTitle) {
            updatedBadges.push({
              id: `b-${Date.now()}`,
              title: badgeTitle,
              icon: '⭐',
              awardedAt: new Date().toISOString().split('T')[0],
              reason: 'Sıla Öğretmen tarafından başarıyla ödüllendirildi.'
            });
          }
          const updatedStudent = {
            ...s,
            starsCount: newStars,
            teacherNote: note !== undefined ? note : s.teacherNote,
            badges: updatedBadges
          };

          if (currentUser.student?.id === studentId) {
            setCurrentUser((u) => ({ ...u, student: updatedStudent }));
          }

          return updatedStudent;
        }
        return s;
      })
    );
  };

  // Student Registration & Login Handlers
  const handleStudentRegister = (
    newStudentData: Omit<Student, 'id' | 'registeredAt' | 'starsCount'>
  ) => {
    const newStudent: Student = {
      ...newStudentData,
      id: `std-${Date.now()}`,
      registeredAt: new Date().toISOString().split('T')[0],
      starsCount: 5,
      badges: [
        {
          id: `b-${Date.now()}`,
          title: 'Aramıza Hoş Geldin! 🎈',
          icon: '🎉',
          awardedAt: new Date().toISOString().split('T')[0],
          reason: 'Minik Adımlar ailesine katıldı'
        }
      ]
    };

    setStudents((prev) => [newStudent, ...prev]);
    setCurrentUser({
      role: 'student',
      student: newStudent,
      name: newStudent.name
    });

    (async () => {
      try {
        await supabase.from('students').insert({
          id: newStudent.id,
          name: newStudent.name,
          age: newStudent.age,
          parent_name: newStudent.parentName,
          parent_phone: newStudent.parentPhone,
          email: newStudent.email,
          password: newStudent.password,
          class_id: newStudent.classId,
          class_name: newStudent.className,
          avatar: newStudent.avatar,
          stars_count: newStudent.starsCount,
          teacher_note: newStudent.teacherNote
        });
      } catch {
        // ignore
      }
    })();
  };

  const handleStudentLogin = (student: Student) => {
    setCurrentUser({
      role: 'student',
      student,
      name: student.name
    });
  };

  const handleTeacherLogin = () => {
    setCurrentUser({
      role: 'teacher',
      username: 'sıla',
      name: 'Sıla Öğretmen'
    });
  };

  const handleLogout = () => {
    sound.playPop();
    setCurrentUser({
      role: 'guest',
      name: 'Ziyaretçi'
    });
  };

  // Watch duration logging in real-time
  const handleWatchProgress = (
    videoId: string,
    watchedSeconds: number,
    totalSeconds: number
  ) => {
    const currentStd = currentUser.student || students[0];
    if (!currentStd) return;

    const targetVid = videos.find((v) => v.id === videoId);
    if (!targetVid) return;

    const completedPercent = Math.min(100, Math.round((watchedSeconds / totalSeconds) * 100));
    const nowStr = new Date().toLocaleString('tr-TR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    setWatchLogs((prev) => {
      const existingIdx = prev.findIndex(
        (w) => w.studentId === currentStd.id && w.videoId === videoId
      );

      if (existingIdx >= 0) {
        const updated = [...prev];
        const prevRecord = updated[existingIdx];
        const maxSec = Math.max(prevRecord.watchSeconds, watchedSeconds);
        updated[existingIdx] = {
          ...prevRecord,
          watchSeconds: maxSec,
          completedPercent: Math.min(100, Math.round((maxSec / totalSeconds) * 100)),
          lastWatchedAt: nowStr
        };
        return updated;
      } else {
        const newLog: WatchLog = {
          id: `wl-${Date.now()}`,
          studentId: currentStd.id,
          studentName: currentStd.name,
          videoId,
          videoTitle: targetVid.title,
          category: targetVid.category,
          watchSeconds: watchedSeconds,
          totalDurationSeconds: totalSeconds,
          completedPercent,
          lastWatchedAt: nowStr
        };
        return [newLog, ...prev];
      }
    });
  };

  // Game activity completion handler
  const handleGameFinish = (
    gameId: 'animal_sounds' | 'number_match' | 'memory_cards' | 'shape_color',
    gameTitle: string,
    score: number,
    starsEarned: number
  ) => {
    const currentStd = currentUser.student || students[0];
    if (!currentStd) return;

    const nowStr = new Date().toLocaleString('tr-TR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const newActivity: GameActivity = {
      id: `ga-${Date.now()}`,
      studentId: currentStd.id,
      studentName: currentStd.name,
      gameId,
      gameTitle,
      score,
      maxScore: 100,
      starsAwarded: starsEarned,
      playedAt: nowStr
    };

    setGameActivities((prev) => [newActivity, ...prev]);

    // Give student stars
    handleAwardStars(currentStd.id, starsEarned);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfcfb] selection:bg-[#f8c8dc]/50 selection:text-[#4e6a8e]">
      {/* Top Navigation */}
      <Navbar
        currentUser={currentUser}
        allStudents={students}
        onSelectStudent={(std) => {
          handleStudentLogin(std);
          sound.playSuccess();
        }}
        onOpenAuthModal={(tab) => {
          setAuthModalInitialTab(tab);
          setIsAuthModalOpen(true);
        }}
        onOpenSqlModal={() => {
          setIsSqlModalOpen(true);
        }}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-12">
        {/* Prominent Top SQL Code Quick Bar */}
        <div className="mb-4 bg-gradient-to-r from-[#eef6fc] via-[#fdfcfb] to-[#fcf2f6] p-3 sm:p-4 rounded-3xl border-2 border-[#8fb5da]/50 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white text-[#395679] border border-[#8fb5da] flex items-center justify-center font-bold text-xl shrink-0 shadow-2xs">
              💾
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base text-[#395679]">
                  Supabase / PostgreSQL SQL Kodları
                </span>
                <span className="bg-[#f8c8dc] text-gray-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-[#f5b7d1]">
                  5 Tablo + RLS Güvenlik Kuralları
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-0.5">
                Sınıflar (classes), Öğrenciler (students), Videolar (videos), İzleme Takibi (watch_logs) ve Oyunlar (game_activities) tabloları.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              id="btn-top-open-sql"
              onClick={() => {
                setIsSqlModalOpen(true);
                sound.playPop();
              }}
              className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#a7c7e7] hover:bg-[#8fb5da] text-[#395679] font-extrabold text-xs sm:text-sm px-4 py-2.5 rounded-2xl border border-[#8fb5da] shadow-xs active:scale-95 transition cursor-pointer"
            >
              <Database className="w-4 h-4" />
              <span>SQL Kodunu Gör & Kopyala 📋</span>
            </button>
          </div>
        </div>

        {/* Quick Role Switcher pill for easy demonstration */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-[#f8fcfd] p-3 rounded-2xl border border-[#e1eef5] shadow-2xs">
          <div className="flex items-center gap-2 text-xs text-[#4e6a8e] font-semibold">
            <span className="text-base">🎈</span>
            <span>Hızlı Görünüm Değiştir:</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                handleTeacherLogin();
                sound.playSuccess();
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                currentUser.role === 'teacher'
                  ? 'bg-[#f8c8dc] text-gray-800 border border-[#f5b7d1] shadow-2xs'
                  : 'bg-white hover:bg-[#f8c8dc]/20 text-[#4e6a8e] border border-[#e1eef5]'
              }`}
            >
              👩‍🏫 Sıla Öğretmen Paneli
            </button>

            <button
              onClick={() => {
                if (students[0]) {
                  handleStudentLogin(students[0]);
                  sound.playSuccess();
                }
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                currentUser.role === 'student'
                  ? 'bg-[#a7c7e7] text-[#395679] border border-[#8fb5da] shadow-2xs'
                  : 'bg-white hover:bg-[#a7c7e7]/20 text-[#4e6a8e] border border-[#e1eef5]'
              }`}
            >
              👶 Öğrenci Portalı ({currentUser.student?.name || students[0]?.name || 'Öğrenci'})
            </button>
          </div>
        </div>

        {/* View Switcher based on current user role */}
        {currentUser.role === 'teacher' ? (
          <TeacherDashboard
            classes={classes}
            students={students}
            videos={videos}
            watchLogs={watchLogs}
            gameActivities={gameActivities}
            onAddClass={handleAddClass}
            onDeleteClass={handleDeleteClass}
            onUpdateStudent={handleUpdateStudent}
            onDeleteStudent={handleDeleteStudent}
            onAddVideo={handleAddVideo}
            onDeleteVideo={handleDeleteVideo}
            onAwardStars={handleAwardStars}
          />
        ) : (
          <StudentPortal
            student={currentUser.student || students[0]}
            videos={videos}
            watchLogs={watchLogs}
            onOpenVideo={(vid) => setActiveVideo(vid)}
            onGameFinish={handleGameFinish}
          />
        )}
      </main>

      {/* Video Lesson Player Modal with Real-time Watch Progress tracking */}
      <VideoPlayerModal
        video={activeVideo}
        studentName={currentUser.student?.name || 'Minik Öğrenci'}
        onClose={() => setActiveVideo(null)}
        onWatchProgress={handleWatchProgress}
      />

      {/* Auth & Registration Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialTab={authModalInitialTab}
        classes={classes}
        existingStudents={students}
        onClose={() => setIsAuthModalOpen(false)}
        onTeacherLogin={handleTeacherLogin}
        onStudentLogin={handleStudentLogin}
        onStudentRegister={handleStudentRegister}
      />

      {/* Dedicated Top-Level SQL Code Modal */}
      <SqlModal
        isOpen={isSqlModalOpen}
        onClose={() => setIsSqlModalOpen(false)}
      />

      {/* Natural Tones Kindergarten Footer */}
      <footer className="bg-white border-t border-[#e1eef5] py-6 text-center text-xs text-gray-500 font-medium space-y-1">
        <div className="flex items-center justify-center gap-2 text-[#4e6a8e] font-bold">
          <span>🌸 Minik Adımlar Anaokulu</span>
          <span>•</span>
          <span>Online Eğitim & Oyun Portalı</span>
        </div>
        <p className="text-gray-400">
          Okul öncesi Türkçe, İngilizce, Matematik, Zeka Oyunları ve Değerler Eğitimi
        </p>
      </footer>
    </div>
  );
}
