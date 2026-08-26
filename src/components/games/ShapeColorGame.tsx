import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, RefreshCw } from 'lucide-react';
import { sound } from '../../lib/audioEffects';

interface ShapeItem {
  id: string;
  name: string;
  shapeEmoji: string;
  colorName: string;
  colorHex: string;
  colorClass: string;
}

const SHAPES_DATA: ShapeItem[] = [
  { id: 'circle-pink', name: 'Pembe Daire', shapeEmoji: '⭕', colorName: 'Pembe', colorHex: '#F472B6', colorClass: 'text-pink-500 bg-pink-100 border-pink-300' },
  { id: 'square-blue', name: 'Mavi Kare', shapeEmoji: '🟦', colorName: 'Mavi', colorHex: '#60A5FA', colorClass: 'text-blue-500 bg-blue-100 border-blue-300' },
  { id: 'triangle-green', name: 'Yeşil Üçgen', shapeEmoji: '🔺', colorName: 'Yeşil', colorHex: '#34D399', colorClass: 'text-emerald-500 bg-emerald-100 border-emerald-300' },
  { id: 'star-yellow', name: 'Sarı Yıldız', shapeEmoji: '⭐', colorName: 'Sarı', colorHex: '#FBBF24', colorClass: 'text-amber-500 bg-amber-100 border-amber-300' },
  { id: 'heart-red', name: 'Kırmızı Kalp', shapeEmoji: '❤️', colorName: 'Kırmızı', colorHex: '#F43F5E', colorClass: 'text-rose-500 bg-rose-100 border-rose-300' },
  { id: 'diamond-purple', name: 'Mor Elmas', shapeEmoji: '🔷', colorName: 'Mor', colorHex: '#A855F7', colorClass: 'text-purple-500 bg-purple-100 border-purple-300' }
];

interface ShapeColorGameProps {
  onGameComplete?: (score: number, stars: number) => void;
}

export function ShapeColorGame({ onGameComplete }: ShapeColorGameProps) {
  const [target, setTarget] = useState<ShapeItem>(SHAPES_DATA[0]);
  const [options, setOptions] = useState<ShapeItem[]>([]);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const totalRounds = 5;

  const startRound = (nextRound: number) => {
    setFeedback(null);
    const shuffled = [...SHAPES_DATA].sort(() => 0.5 - Math.random());
    const currentTarget = shuffled[0];
    setTarget(currentTarget);

    const roundChoices = [currentTarget, ...shuffled.slice(1, 4)].sort(() => 0.5 - Math.random());
    setOptions(roundChoices);

    sound.speak(`Hangisi ${currentTarget.name}? Hadi bulalım!`);
  };

  useEffect(() => {
    startRound(1);
  }, []);

  const handleSelect = (item: ShapeItem) => {
    if (feedback) return;

    if (item.id === target.id) {
      sound.playSuccess();
      confetti({
        particleCount: 45,
        spread: 70,
        origin: { y: 0.6 }
      });

      const newScore = score + 20;
      setScore(newScore);
      setFeedback({
        isCorrect: true,
        message: `🌟 Harika! Bu bir ${item.name}!`
      });

      setTimeout(() => {
        if (round < totalRounds) {
          const nextR = round + 1;
          setRound(nextR);
          startRound(nextR);
        } else {
          setIsCompleted(true);
          sound.playStarChime();
          const earnedStars = Math.min(5, Math.ceil(newScore / 20));
          if (onGameComplete) {
            onGameComplete(newScore, earnedStars);
          }
        }
      }, 1500);
    } else {
      sound.playBoing();
      setFeedback({
        isCorrect: false,
        message: 'Tekrar deneyelim! Renge ve şekle dikkat et! 🎨'
      });
      setTimeout(() => {
        setFeedback(null);
      }, 1200);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl shadow-rose-100/60 border-2 border-rose-200">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-rose-100 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-400 to-pink-300 text-white flex items-center justify-center text-2xl shadow-md">
            🎨
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
              Şekil & Renk Eşleştirme
              <span className="text-xs bg-rose-100 text-rose-700 px-2.5 py-0.5 rounded-full font-medium border border-rose-200">
                Görsel Algı & Renkler
              </span>
            </h3>
            <p className="text-sm text-slate-500">Sorulan şekli ve rengi bularak eşleştir!</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-rose-50 px-4 py-2 rounded-2xl border border-rose-200/80">
          <div className="flex items-center gap-1.5 text-amber-500 font-bold">
            <Trophy className="w-5 h-5 fill-amber-400" />
            <span>{score} Puan</span>
          </div>
          <div className="w-px h-6 bg-rose-200" />
          <div className="text-sm font-semibold text-rose-700">
            Tur {round}/{totalRounds}
          </div>
        </div>
      </div>

      {!isCompleted ? (
        <div className="flex flex-col items-center">
          {/* Target Question Box */}
          <div className="my-3 px-8 py-4 bg-gradient-to-r from-pink-50 via-rose-50 to-pink-50 border-2 border-rose-300 rounded-3xl text-center shadow-sm">
            <span className="text-xs uppercase font-bold text-rose-600 tracking-wider block mb-1">
              Hedef Şekil ve Renk
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-800 flex items-center justify-center gap-2">
              <span>{target.name}</span>
              <span className="text-4xl animate-bounce">{target.shapeEmoji}</span>
            </div>
          </div>

          {/* Feedback */}
          {feedback && (
            <div
              className={`my-3 px-6 py-2.5 rounded-2xl font-bold text-center text-sm sm:text-base transition animate-bounce ${
                feedback.isCorrect
                  ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-300'
                  : 'bg-rose-100 text-rose-800 border-2 border-rose-300'
              }`}
            >
              {feedback.message}
            </div>
          )}

          {/* Choice cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full mt-4">
            {options.map((item) => (
              <button
                key={item.id}
                id={`shape-opt-${item.id}`}
                onClick={() => handleSelect(item)}
                className={`p-6 rounded-3xl border-2 flex flex-col items-center justify-center gap-3 transition transform hover:scale-105 active:scale-95 shadow-sm hover:shadow-md cursor-pointer ${item.colorClass}`}
              >
                <span className="text-6xl">{item.shapeEmoji}</span>
                <span className="font-bold text-slate-800 text-sm sm:text-base">
                  {item.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="py-8 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-rose-100 text-rose-500 border-4 border-rose-300 flex items-center justify-center text-5xl mb-4 animate-bounce">
            🎨
          </div>
          <h4 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">
            Harika Renkler ve Şekiller! 🌟
          </h4>
          <p className="text-slate-600 max-w-md mb-6">
            Tüm şekil ve renkleri doğru eşleştirdin!
          </p>

          <div className="bg-rose-50 border-2 border-rose-200 rounded-3xl p-6 mb-6 flex flex-col items-center">
            <div className="text-sm font-semibold text-rose-600 uppercase tracking-wide mb-1">Kazanılan Yıldızlar</div>
            <div className="flex gap-2 text-3xl text-amber-400 my-1">
              {'⭐'.repeat(Math.min(5, Math.ceil(score / 20)))}
            </div>
            <div className="text-lg font-bold text-slate-800 mt-1">Puan: {score} / 100</div>
          </div>

          <button
            onClick={() => {
              setRound(1);
              setScore(0);
              setIsCompleted(false);
              startRound(1);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg shadow-rose-200 active:scale-95 transition cursor-pointer"
          >
            <RefreshCw className="w-5 h-5" />
            Tekrar Oyna
          </button>
        </div>
      )}
    </div>
  );
}
