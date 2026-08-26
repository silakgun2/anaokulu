import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, RefreshCw, Volume2 } from 'lucide-react';
import { sound } from '../../lib/audioEffects';

const FRUITS_OBJECTS = [
  { emoji: '🍎', name: 'Elma', color: 'text-rose-500' },
  { emoji: '🍓', name: 'Çilek', color: 'text-pink-500' },
  { emoji: '🍌', name: 'Muz', color: 'text-yellow-500' },
  { emoji: '⭐', name: 'Yıldız', color: 'text-amber-400' },
  { emoji: '🧸', name: 'Ayıcık', color: 'text-amber-700' },
  { emoji: '🎈', name: 'Balon', color: 'text-sky-500' },
  { emoji: '🥕', name: 'Havuç', color: 'text-orange-500' },
  { emoji: '🌸', name: 'Çiçek', color: 'text-pink-400' },
];

interface NumberMatchGameProps {
  onGameComplete?: (score: number, stars: number) => void;
}

export function NumberMatchGame({ onGameComplete }: NumberMatchGameProps) {
  const [targetCount, setTargetCount] = useState<number>(3);
  const [currentObject, setCurrentObject] = useState(FRUITS_OBJECTS[0]);
  const [countedIndices, setCountedIndices] = useState<number[]>([]);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [options, setOptions] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const totalRounds = 5;

  const startRound = (nextRound: number) => {
    setFeedback(null);
    setCountedIndices([]);

    // Random count between 1 and 8 for kindergarten
    const count = Math.floor(Math.random() * 8) + 1;
    setTargetCount(count);

    const randomObj = FRUITS_OBJECTS[Math.floor(Math.random() * FRUITS_OBJECTS.length)];
    setCurrentObject(randomObj);

    // Generate 4 unique choices including count
    const choices = new Set<number>([count]);
    while (choices.size < 4) {
      const wrong = Math.floor(Math.random() * 9) + 1;
      choices.add(wrong);
    }
    setOptions(Array.from(choices).sort(() => 0.5 - Math.random()));

    sound.speak(`Kaç tane ${randomObj.name} var? Hadi sayalım!`);
  };

  useEffect(() => {
    startRound(1);
  }, []);

  const handleTapItem = (index: number) => {
    if (!countedIndices.includes(index)) {
      const newIndices = [...countedIndices, index];
      setCountedIndices(newIndices);
      sound.playPop();
      sound.speak(`${newIndices.length}`);
    }
  };

  const handleSelectNumber = (num: number) => {
    if (feedback) return;

    if (num === targetCount) {
      sound.playSuccess();
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F472B6', '#38BDF8', '#FBBF24', '#34D399']
      });

      const newScore = score + 20;
      setScore(newScore);
      setFeedback({
        isCorrect: true,
        message: `🌟 Tebrikler! Tam ${num} tane ${currentObject.name} var!`
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
      }, 1600);
    } else {
      sound.playBoing();
      setFeedback({
        isCorrect: false,
        message: 'Tekrar sayalım! Nesnelerin üzerine tıklayarak sayabilirsin! 👆'
      });
      setTimeout(() => {
        setFeedback(null);
      }, 1400);
    }
  };

  const handleRestart = () => {
    setRound(1);
    setScore(0);
    setIsCompleted(false);
    startRound(1);
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl shadow-sky-100/60 border-2 border-sky-200">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-sky-100 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-400 to-blue-300 text-white flex items-center justify-center text-2xl shadow-md">
            🔢
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
              Sayı Eşleştirme & Meyve Sayma
              <span className="text-xs bg-sky-100 text-sky-700 px-2.5 py-0.5 rounded-full font-medium border border-sky-200">
                Okul Öncesi Matematik
              </span>
            </h3>
            <p className="text-sm text-slate-500">Nesnelere dokunarak say ve doğru sayıyı seç!</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-sky-50 px-4 py-2 rounded-2xl border border-sky-200/80">
          <div className="flex items-center gap-1.5 text-amber-500 font-bold">
            <Trophy className="w-5 h-5 fill-amber-400" />
            <span>{score} Puan</span>
          </div>
          <div className="w-px h-6 bg-sky-200" />
          <div className="text-sm font-semibold text-sky-700">
            Tur {round}/{totalRounds}
          </div>
        </div>
      </div>

      {!isCompleted ? (
        <div className="flex flex-col items-center">
          {/* Question Banner */}
          <div className="mb-4 text-center">
            <h4 className="text-lg sm:text-xl font-bold text-slate-700 flex items-center justify-center gap-2">
              Ekranda Kaç Tane <span className="text-sky-600 underline">{currentObject.name}</span> Var?
              <button
                onClick={() => sound.speak(`Kaç tane ${currentObject.name} var?`)}
                className="p-1.5 text-sky-500 hover:text-sky-700 hover:bg-sky-50 rounded-full transition cursor-pointer"
                title="Soruyu seslendir"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              (İpucu: Resimlerin üzerine tıklayarak tek tek sayabilirsin!)
            </p>
          </div>

          {/* Interactive Counting Objects Area */}
          <div className="w-full min-h-[160px] bg-gradient-to-br from-sky-50/70 via-pink-50/40 to-yellow-50/60 rounded-3xl p-6 border-2 border-dashed border-sky-200 flex flex-wrap items-center justify-center gap-4 my-2">
            {Array.from({ length: targetCount }).map((_, idx) => {
              const isCounted = countedIndices.includes(idx);
              const countNumber = countedIndices.indexOf(idx) + 1;

              return (
                <button
                  key={idx}
                  id={`count-object-${idx}`}
                  onClick={() => handleTapItem(idx)}
                  className={`relative p-3 sm:p-4 rounded-2xl transition duration-200 transform hover:scale-110 active:scale-95 cursor-pointer ${
                    isCounted
                      ? 'bg-amber-100/90 shadow-md ring-4 ring-amber-300'
                      : 'bg-white/80 hover:bg-white shadow-sm'
                  }`}
                >
                  <span className="text-5xl sm:text-6xl select-none block animate-float">
                    {currentObject.emoji}
                  </span>
                  {isCounted && (
                    <span className="absolute -top-2 -right-2 w-7 h-7 bg-amber-500 text-white font-black text-sm rounded-full flex items-center justify-center shadow-md animate-bounce">
                      {countNumber}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Counted status */}
          <div className="text-sm font-semibold text-sky-700 my-2">
            Şu ana kadar sayılan: <span className="font-extrabold text-lg text-pink-600">{countedIndices.length}</span>
          </div>

          {/* Feedback banner */}
          {feedback && (
            <div
              className={`my-3 px-6 py-3 rounded-2xl font-bold text-center text-sm sm:text-base transition animate-bounce ${
                feedback.isCorrect
                  ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-300'
                  : 'bg-rose-100 text-rose-800 border-2 border-rose-300'
              }`}
            >
              {feedback.message}
            </div>
          )}

          {/* Big Bouncy Number Choice Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full mt-4">
            {options.map((num) => (
              <button
                key={num}
                id={`number-option-${num}`}
                onClick={() => handleSelectNumber(num)}
                className="h-20 sm:h-24 bg-gradient-to-b from-white to-sky-50 hover:to-sky-100 border-3 border-sky-300 hover:border-sky-500 rounded-3xl flex flex-col items-center justify-center shadow-md hover:shadow-lg transition duration-200 transform hover:-translate-y-1 active:scale-95 cursor-pointer group"
              >
                <span className="text-4xl sm:text-5xl font-black text-sky-700 group-hover:scale-110 group-hover:text-sky-800 transition">
                  {num}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {num === 1 ? 'Bir' : num === 2 ? 'İki' : num === 3 ? 'Üç' : num === 4 ? 'Dört' : num === 5 ? 'Beş' : num === 6 ? 'Altı' : num === 7 ? 'Yedi' : num === 8 ? 'Sekiz' : 'Dokuz'}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Completion screen */
        <div className="py-8 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-sky-100 text-sky-500 border-4 border-sky-300 flex items-center justify-center text-5xl mb-4 animate-bounce">
            🏆
          </div>
          <h4 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">
            Muhteşem Sayma Becerisi! 🌟
          </h4>
          <p className="text-slate-600 max-w-md mb-6">
            Tüm nesneleri doğru saydın ve sayıları harika eşleştirdin!
          </p>

          <div className="bg-sky-50 border-2 border-sky-200 rounded-3xl p-6 mb-6 flex flex-col items-center">
            <div className="text-sm font-semibold text-sky-600 uppercase tracking-wide mb-1">Kazanılan Yıldızlar</div>
            <div className="flex gap-2 text-3xl text-amber-400 my-1">
              {'⭐'.repeat(Math.min(5, Math.ceil(score / 20)))}
            </div>
            <div className="text-lg font-bold text-slate-800 mt-1">Toplam Puan: {score} / 100</div>
          </div>

          <button
            id="play-again-number-btn"
            onClick={handleRestart}
            className="flex items-center gap-2 bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg shadow-sky-200 active:scale-95 transition cursor-pointer"
          >
            <RefreshCw className="w-5 h-5" />
            Tekrar Oyna
          </button>
        </div>
      )}
    </div>
  );
}
