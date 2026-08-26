import { useState, useEffect } from 'react';
import { X, Play, Award, Clock, BookOpen, Volume2, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { VideoLesson } from '../types';
import { sound } from '../lib/audioEffects';

interface VideoPlayerModalProps {
  video: VideoLesson | null;
  studentName?: string;
  onClose: () => void;
  onWatchProgress: (videoId: string, watchedSeconds: number, totalSeconds: number) => void;
}

export function VideoPlayerModal({
  video,
  studentName = 'Minik Öğrenci',
  onClose,
  onWatchProgress
}: VideoPlayerModalProps) {
  if (!video) return null;

  const [watchedSeconds, setWatchedSeconds] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    setWatchedSeconds(0);
    setIsCompleted(false);
    setIsPlaying(true);
  }, [video]);

  // Timer simulation for watching duration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !isCompleted) {
      interval = setInterval(() => {
        setWatchedSeconds((prev) => {
          const next = prev + 1;
          // Notify parent of progress every 3 seconds or on completion
          if (next % 3 === 0 || next >= video.durationSeconds) {
            onWatchProgress(video.id, next, video.durationSeconds);
          }

          if (next >= video.durationSeconds && !isCompleted) {
            setIsCompleted(true);
            sound.playSuccess();
            confetti({
              particleCount: 50,
              spread: 70,
              origin: { y: 0.6 }
            });
          }
          return next;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying, isCompleted, video, onWatchProgress]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.min(100, Math.round((watchedSeconds / video.durationSeconds) * 100));

  const handleSimulateFinish = () => {
    const full = video.durationSeconds;
    setWatchedSeconds(full);
    setIsCompleted(true);
    onWatchProgress(video.id, full, full);
    sound.playStarChime();
    confetti({ particleCount: 60, spread: 80, origin: { y: 0.6 } });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-[#fdfcfb] rounded-3xl shadow-xl border border-[#e1eef5] max-w-3xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#f8fcfd] p-4 sm:p-5 flex items-center justify-between border-b border-[#e1eef5]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#f8c8dc] text-gray-800 flex items-center justify-center text-xl shadow-xs">
              🎬
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-base sm:text-lg line-clamp-1">
                {video.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="font-semibold text-[#4e6a8e]">Öğretmen: {video.teacherName || 'Sıla Öğretmen'}</span>
                <span>•</span>
                <span>Hedef: {video.targetAge}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              onWatchProgress(video.id, watchedSeconds, video.durationSeconds);
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-white hover:bg-gray-100 text-gray-600 hover:text-gray-900 border border-[#e1eef5] flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Area */}
        <div className="relative bg-gray-900 w-full aspect-video flex items-center justify-center overflow-hidden">
          {video.videoUrl.includes('youtube.com') || video.videoUrl.includes('youtu.be') ? (
            <iframe
              src={`${video.videoUrl}?autoplay=1&rel=0&modestbranding=1`}
              title={video.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="relative w-full h-full flex flex-col items-center justify-center bg-[#2d3748] p-6 text-white text-center">
              <div className="w-20 h-20 rounded-full bg-[#f8c8dc]/90 text-gray-800 flex items-center justify-center text-3xl mb-3 shadow-md animate-pulse">
                🎬
              </div>
              <h4 className="text-xl font-bold mb-1">{video.title}</h4>
              <p className="text-sm text-gray-200 max-w-md">{video.description}</p>
            </div>
          )}
        </div>

        {/* Real-time Watch Progress Bar for Teacher Tracking */}
        <div className="bg-[#f8fcfd] px-5 py-3 border-y border-[#e1eef5] flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-600">
            <div className="flex items-center gap-1.5 text-[#4e6a8e]">
              <Clock className="w-4 h-4" />
              <span>İzleme Süresi: <strong>{formatTime(watchedSeconds)}</strong> / {formatTime(video.durationSeconds)}</span>
            </div>
            <span className="bg-[#f8c8dc]/40 text-[#96476c] px-2.5 py-0.5 rounded-full border border-[#f3d5dc] font-bold">
              %{progressPercent} Tamamlandı
            </span>
          </div>

          <div className="w-full bg-[#e1eef5] rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#f8c8dc] to-[#a7c7e7] h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Lesson Notes & Sing-along lyrics */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 bg-[#fdfcfb]">
          <div className="bg-[#fcf2f6] rounded-2xl p-4 border border-[#f3d5dc]">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-bold text-[#96476c] flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#96476c]" />
                Ders Notları & Şarkı Sözleri
              </h4>
              {video.lyricsOrNotes && (
                <button
                  onClick={() => sound.speak(video.lyricsOrNotes || '')}
                  className="text-xs text-[#96476c] hover:text-[#742d4f] font-semibold flex items-center gap-1 cursor-pointer bg-white px-2.5 py-1 rounded-xl border border-[#f3d5dc] shadow-xs"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  Sesli Dinle
                </button>
              )}
            </div>
            <p className="text-sm text-gray-700 leading-relaxed font-medium">
              {video.lyricsOrNotes || video.description}
            </p>
          </div>

          {/* Student Praise box */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#eef6fc] rounded-2xl p-4 border border-[#8fb5da]/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-500 flex items-center justify-center text-xl shadow-xs">
                ⭐
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">
                  Harika Gidiyorsun, {studentName}! 🎈
                </p>
                <p className="text-[11px] text-gray-500">
                  Videoyu izledikçe Sıla Öğretmen izleme süreni görüp sana yıldızlar verecek!
                </p>
              </div>
            </div>

            <button
              onClick={handleSimulateFinish}
              className="text-xs font-bold bg-amber-300 hover:bg-amber-400 text-amber-950 px-3.5 py-2 rounded-xl border border-amber-400 shadow-xs active:scale-95 transition cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Dersi Tamamladım!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
