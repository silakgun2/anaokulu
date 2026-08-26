import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, Sparkles, RefreshCw, Trophy, Heart } from 'lucide-react';
import { sound } from '../../lib/audioEffects';

interface AnimalItem {
  id: string;
  nameTr: string;
  nameEn: string;
  emoji: string;
  soundType: string;
  description: string;
  color: string;
}

const ANIMALS: AnimalItem[] = [
  { id: 'cat', nameTr: 'Kedi', nameEn: 'Cat', emoji: '🐱', soundType: 'cat', description: 'Miyav miyav diye miyavlar, sütü çok sever!', color: 'bg-pink-100 border-pink-300 text-pink-700' },
  { id: 'dog', nameTr: 'Köpek', nameEn: 'Dog', emoji: '🐶', soundType: 'dog', description: 'Hav hav diye ses çıkarır, sadık bir dosttur!', color: 'bg-blue-100 border-blue-300 text-blue-700' },
  { id: 'cow', nameTr: 'İnek', nameEn: 'Cow', emoji: '🐮', soundType: 'cow', description: 'Mööö diye seslenir, bize lezzetli süt verir!', color: 'bg-emerald-100 border-emerald-300 text-emerald-700' },
  { id: 'duck', nameTr: 'Ördek', nameEn: 'Duck', emoji: '🦆', soundType: 'duck', description: 'Vak vak der, göllerde neşeyle yüzer!', color: 'bg-amber-100 border-amber-300 text-amber-700' },
  { id: 'sheep', nameTr: 'Kuzu & Koyun', nameEn: 'Sheep', emoji: '🐑', soundType: 'sheep', description: 'Meee meee diye seslenir, yünü sıcacıktır!', color: 'bg-purple-100 border-purple-300 text-purple-700' },
  { id: 'lion', nameTr: 'Aslan', nameEn: 'Lion', emoji: '🦁', soundType: 'lion', description: 'Ormanların kralıdır, güçlü bir şekilde kükrer!', color: 'bg-orange-100 border-orange-300 text-orange-700' },
  { id: 'bird', nameTr: 'Kuş', nameEn: 'Bird', emoji: '🐦', soundType: 'bird', description: 'Cik cik diye öter, gökyüzünde kanat çırpar!', color: 'bg-sky-100 border-sky-300 text-sky-700' },
];

interface AnimalSoundGameProps {
  onGameComplete?: (score: number, stars: number) => void;
}

export function AnimalSoundGame({ onGameComplete }: AnimalSoundGameProps) {
  const [targetAnimal, setTargetAnimal] = useState<AnimalItem>(ANIMALS[0]);
  const [options, setOptions] = useState<AnimalItem[]>([]);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const totalRounds = 5;

  const startNewRound = (nextRound: number) => {
    setFeedback(null);
    const shuffled = [...ANIMALS].sort(() => 0.5 - Math.random());
    const currentTarget = shuffled[0];
    setTargetAnimal(currentTarget);

    // Pick 3 options including target
    const otherOptions = shuffled.slice(1, 4);
    const roundOptions = [currentTarget, ...otherOptions].sort(() => 0.5 - Math.random());
    setOptions(roundOptions);

    // Play target sound after brief delay
    setTimeout(() => {
      sound.playAnimalSound(currentTarget.soundType);
    }, 400);
  };

  useEffect(() => {
    startNewRound(1);
  }, []);

  const handleSelectOption = (animal: AnimalItem) => {
    if (feedback) return; // already answered

    if (animal.id === targetAnimal.id) {
      sound.playSuccess();
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#F472B6', '#60A5FA', '#FBBF24', '#34D399']
      });

      const newScore = score + 20;
      setScore(newScore);
      setFeedback({
        isCorrect: true,
        message: `🎉 Harikasın! Bu ${animal.nameTr} (${animal.nameEn})!`
      });

      setTimeout(() => {
        if (round < totalRounds) {
          const nextR = round + 1;
          setRound(nextR);
          startNewRound(nextR);
        } else {
          setIsCompleted(true);
          sound.playStarChime();
          const earnedStars = Math.min(5, Math.ceil(newScore / 20));
          if (onGameComplete) {
            onGameComplete(newScore, earnedStars);
          }
        }
      }, 1800);
    } else {
      sound.playBoing();
      setFeedback({
        isCorrect: false,
        message: 'Tekrar dinleyelim mi? Sesi tekrar çalabilirsin! 🎧'
      });
      setTimeout(() => {
        setFeedback(null);
      }, 1500);
    }
  };

  const handleRestart = () => {
    setRound(1);
    setScore(0);
    setIsCompleted(false);
    startNewRound(1);
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl shadow-pink-100/60 border-2 border-pink-200">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-pink-100 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-400 to-rose-300 text-white flex items-center justify-center text-2xl shadow-md">
            🦁
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
              Hayvanlar ve Sevimli Sesleri
              <span className="text-xs bg-pink-100 text-pink-700 px-2.5 py-0.5 rounded-full font-medium border border-pink-200">
                Türkçe & İngilizce
              </span>
            </h3>
            <p className="text-sm text-slate-500">Sesi dinle, hangi sevimli hayvana ait olduğunu bul!</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-pink-50 px-4 py-2 rounded-2xl border border-pink-200/80">
          <div className="flex items-center gap-1.5 text-amber-500 font-bold">
            <Trophy className="w-5 h-5 fill-amber-400" />
            <span>{score} Puan</span>
          </div>
          <div className="w-px h-6 bg-pink-200" />
          <div className="text-sm font-semibold text-pink-700">
            Tur {round}/{totalRounds}
          </div>
        </div>
      </div>

      {!isCompleted ? (
        <div className="flex flex-col items-center">
          {/* Sound play center button */}
          <div className="my-4 flex flex-col items-center">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-pink-300 via-sky-300 to-pink-300 rounded-full blur-md opacity-70 group-hover:opacity-100 transition duration-300 animate-pulse" />
              <button
                id="play-animal-sound-btn"
                onClick={() => sound.playAnimalSound(targetAnimal.soundType)}
                className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-pink-400 to-sky-400 text-white shadow-xl flex flex-col items-center justify-center hover:scale-105 active:scale-95 transition cursor-pointer"
              >
                <Volume2 className="w-10 h-10 mb-1 animate-bounce" />
                <span className="text-xs font-bold uppercase tracking-wider">Sesi Dinle</span>
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-3 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-pink-500" /> Sesi tekrar duymak için butona tıkla!
            </p>
          </div>

          {/* Feedback badge */}
          {feedback && (
            <div
              className={`mb-6 px-6 py-3 rounded-2xl font-bold text-center text-sm sm:text-base transition animate-bounce ${
                feedback.isCorrect
                  ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-300'
                  : 'bg-rose-100 text-rose-800 border-2 border-rose-300'
              }`}
            >
              {feedback.message}
            </div>
          )}

          {/* Options Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full mt-2">
            {options.map((opt) => (
              <button
                key={opt.id}
                id={`animal-option-${opt.id}`}
                onClick={() => handleSelectOption(opt)}
                className="bg-gradient-to-b from-white to-pink-50/50 hover:to-pink-100/70 border-2 border-pink-200 hover:border-pink-400 rounded-3xl p-4 sm:p-5 flex flex-col items-center gap-2 shadow-sm hover:shadow-md transition duration-200 transform hover:-translate-y-1 active:scale-95 cursor-pointer group"
              >
                <div className="text-5xl sm:text-6xl group-hover:scale-110 transition duration-200">
                  {opt.emoji}
                </div>
                <div className="text-center">
                  <span className="block font-bold text-slate-800 text-base sm:text-lg">
                    {opt.nameTr}
                  </span>
                  <span className="block text-xs font-medium text-pink-600">
                    {opt.nameEn}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Educational hint list */}
          <div className="mt-8 w-full bg-sky-50/80 rounded-2xl p-4 border border-sky-200 flex flex-wrap items-center justify-between gap-2 text-xs text-sky-800">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
              <span>İpucu: Hayvanların çıkardığı sesler onların iletişim yoludur!</span>
            </div>
            <button
              onClick={() => sound.speak(targetAnimal.description)}
              className="text-sky-700 hover:text-sky-900 font-semibold underline cursor-pointer"
            >
              Açıklamayı Dinle 📢
            </button>
          </div>
        </div>
      ) : (
        /* Completion screen */
        <div className="py-8 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-amber-100 text-amber-500 border-4 border-amber-300 flex items-center justify-center text-5xl mb-4 animate-bounce">
            🌟
          </div>
          <h4 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">
            Tebrikler Minik Kaşif! 🎉
          </h4>
          <p className="text-slate-600 max-w-md mb-6">
            Hayvanlar ve Sesleri oyununu başarıyla tamamladın! Tüm sevimli hayvanların seslerini öğrendin.
          </p>

          <div className="bg-pink-50 border-2 border-pink-200 rounded-3xl p-6 mb-6 flex flex-col items-center">
            <div className="text-sm font-semibold text-pink-600 uppercase tracking-wide mb-1">Kazanılan Yıldızlar</div>
            <div className="flex gap-2 text-3xl text-amber-400 my-1">
              {'⭐'.repeat(Math.min(5, Math.ceil(score / 20)))}
            </div>
            <div className="text-lg font-bold text-slate-800 mt-1">Toplam Puan: {score} / 100</div>
          </div>

          <button
            id="play-again-animal-btn"
            onClick={handleRestart}
            className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg shadow-pink-200 active:scale-95 transition cursor-pointer"
          >
            <RefreshCw className="w-5 h-5" />
            Tekrar Oyna
          </button>
        </div>
      )}
    </div>
  );
}
