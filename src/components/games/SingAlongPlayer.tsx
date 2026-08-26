import { useState, useEffect } from 'react';
import { Play, Pause, Volume2, Sparkles, Music, Star, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../lib/audioEffects';

interface SongItem {
  id: string;
  title: string;
  category: string;
  emoji: string;
  lyrics: string[];
  audioNotes: string;
  themeColor: string;
}

const SONGS: SongItem[] = [
  {
    id: 'song-1',
    title: 'Ali Baba\'nın Bir Çiftliği Var',
    category: 'Türkçe Şarkı & Hayvanlar',
    emoji: '🚜',
    lyrics: [
      'Ali Baba\'nın bir çiftliği var,',
      'Çiftliğinde kuzuları var!',
      '"Mee mee" diye bağırır,',
      'Çiftliğinde Ali Baba\'nın!',
      'Ali Baba\'nın bir çiftliği var,',
      'Çiftliğinde inekleri var!',
      '"Möö möö" diye bağırır,',
      'Çiftliğinde Ali Baba\'nın!'
    ],
    audioNotes: 'Hayvan seslerini taklit ederek neşeyle şarkı söylüyoruz!',
    themeColor: 'from-pink-400 to-rose-400'
  },
  {
    id: 'song-2',
    title: 'Colors & Rainbow Song (İngilizce Renkler)',
    category: 'İngilizce Neşeli Şarkı',
    emoji: '🌈',
    lyrics: [
      'Red and yellow and pink and green,',
      'Purple and orange and blue!',
      'I can sing a rainbow,',
      'Sing a rainbow,',
      'Sing a rainbow too!'
    ],
    audioNotes: 'İngilizce renk telaffuzlarını müzikle kalıcı hale getiriyoruz.',
    themeColor: 'from-sky-400 to-blue-400'
  },
  {
    id: 'song-3',
    title: '1, 2, 3 Haydi Sayalım (Sayılar Şarkısı)',
    category: 'Matematik & Ritim',
    emoji: '🔢',
    lyrics: [
      '1, 2, 3 haydi sayalım,',
      '4, 5, 6 neşeyle zıplayalım!',
      '7, 8, 9 alkış tutalım,',
      '10 deyince yıldızları yakalayalım! ⭐'
    ],
    audioNotes: 'Ritim tutarak sayma becerisi kazanıyoruz.',
    themeColor: 'from-amber-400 to-orange-400'
  },
  {
    id: 'song-4',
    title: 'Sihirli Nezaket Sözcükleri',
    category: 'Değerler Eğitimi',
    emoji: '💖',
    lyrics: [
      'Bir şey isterken "Lütfen" deriz,',
      'Teşekkür edip sevgiyle gülümseriz!',
      'Hata yaparsak "Özür dilerim",',
      'Biz neşeli ve nazik minikleriz!'
    ],
    audioNotes: 'Nezaket sözcükleri çocukların sosyal uyumunu güçlendirir.',
    themeColor: 'from-purple-400 to-pink-400'
  }
];

interface SingAlongPlayerProps {
  onSongCompleted?: (songTitle: string) => void;
}

export function SingAlongPlayer({ onSongCompleted }: SingAlongPlayerProps) {
  const [selectedSong, setSelectedSong] = useState<SongItem>(SONGS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeLine, setActiveLine] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      sound.speak(selectedSong.lyrics[activeLine]);

      timer = setTimeout(() => {
        if (activeLine < selectedSong.lyrics.length - 1) {
          setActiveLine((prev) => prev + 1);
        } else {
          setIsPlaying(false);
          setActiveLine(0);
          sound.playSuccess();
          confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
          if (onSongCompleted) {
            onSongCompleted(selectedSong.title);
          }
        }
      }, 3200);
    }

    return () => clearTimeout(timer);
  }, [isPlaying, activeLine, selectedSong]);

  const handleTogglePlay = () => {
    if (!isPlaying) {
      sound.playPop();
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
      window.speechSynthesis?.cancel();
    }
  };

  const handleSelectSong = (song: SongItem) => {
    window.speechSynthesis?.cancel();
    setSelectedSong(song);
    setIsPlaying(false);
    setActiveLine(0);
    sound.playPop();
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl shadow-pink-100/60 border-2 border-pink-200">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-pink-100 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-400 to-rose-300 text-white flex items-center justify-center text-2xl shadow-md">
            🎵
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
              Eğitici Şarkılar & Karaoke
              <span className="text-xs bg-pink-100 text-pink-700 px-2.5 py-0.5 rounded-full font-medium border border-pink-200">
                Sing-Along
              </span>
            </h3>
            <p className="text-sm text-slate-500">Şarkıları dinle, ritim tut ve sözlere neşeyle eşlik et!</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTogglePlay}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl font-bold text-white shadow-md active:scale-95 transition cursor-pointer ${
              isPlaying
                ? 'bg-rose-500 hover:bg-rose-600'
                : 'bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-5 h-5" /> Duraklat
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-white" /> Şarkıyı Başlat
              </>
            )}
          </button>
        </div>
      </div>

      {/* Song Selector Pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {SONGS.map((song) => {
          const isSelected = song.id === selectedSong.id;
          return (
            <button
              key={song.id}
              onClick={() => handleSelectSong(song)}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 border transition cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white border-pink-500 shadow-md shadow-pink-200'
                  : 'bg-pink-50/70 hover:bg-pink-100 text-slate-700 border-pink-200'
              }`}
            >
              <span>{song.emoji}</span>
              <span>{song.title}</span>
            </button>
          );
        })}
      </div>

      {/* Karaoke Screen Display */}
      <div className="bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[260px] text-center border-4 border-pink-300/40">
        {/* Floating animated sparkles */}
        <div className="absolute top-4 left-6 text-pink-400 animate-pulse">✨</div>
        <div className="absolute top-6 right-8 text-yellow-300 animate-bounce">⭐</div>
        <div className="absolute bottom-4 left-8 text-sky-400 animate-float">🎵</div>
        <div className="absolute bottom-6 right-6 text-pink-300 animate-pulse">🌸</div>

        {/* Current Song Title */}
        <div className="mb-4 flex items-center gap-2 text-pink-300 text-xs sm:text-sm font-semibold tracking-wider uppercase">
          <Music className="w-4 h-4" />
          <span>{selectedSong.category}</span>
        </div>

        {/* Big Bouncing Emoji */}
        <div className="text-5xl sm:text-6xl mb-4 animate-bounce">
          {selectedSong.emoji}
        </div>

        {/* Dynamic Lyrics display */}
        <div className="space-y-2 max-w-lg w-full px-4">
          {selectedSong.lyrics.map((line, idx) => {
            const isCurrent = idx === activeLine;
            return (
              <p
                key={idx}
                className={`text-base sm:text-xl font-bold transition-all duration-300 ${
                  isCurrent
                    ? 'text-yellow-300 scale-110 drop-shadow-md py-1 font-extrabold'
                    : 'text-slate-400 opacity-60 text-sm sm:text-base'
                }`}
              >
                {isCurrent && <span className="inline-block mr-2 animate-pulse">🎤</span>}
                {line}
              </p>
            );
          })}
        </div>

        {/* Song control helper */}
        <div className="mt-8 flex items-center gap-4 text-xs text-slate-300">
          <button
            onClick={() => {
              setActiveLine(0);
              setIsPlaying(false);
              window.speechSynthesis?.cancel();
            }}
            className="flex items-center gap-1 hover:text-white transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Başa Sar
          </button>
          <span>•</span>
          <span className="flex items-center gap-1 text-yellow-400">
            <Star className="w-3.5 h-3.5 fill-yellow-400" /> Şarkıyı bitir ve yıldız kazan!
          </span>
        </div>
      </div>
    </div>
  );
}
