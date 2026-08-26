import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RefreshCw, Sparkles, Brain } from 'lucide-react';
import { sound } from '../../lib/audioEffects';

interface CardItem {
  id: number;
  pairId: string;
  emoji: string;
  name: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const CARD_PAIRS = [
  { pairId: 'bear', emoji: '🧸', name: 'Ayıcık' },
  { pairId: 'rabbit', emoji: '🐰', name: 'Tavşan' },
  { pairId: 'car', emoji: '🚗', name: 'Araba' },
  { pairId: 'flower', emoji: '🌸', name: 'Çiçek' },
  { pairId: 'rocket', emoji: '🚀', name: 'Roket' },
  { pairId: 'star', emoji: '⭐', name: 'Yıldız' },
];

interface MemoryCardsGameProps {
  onGameComplete?: (score: number, stars: number) => void;
}

export function MemoryCardsGame({ onGameComplete }: MemoryCardsGameProps) {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchesFound, setMatchesFound] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const initGame = () => {
    // Duplicate and shuffle
    const deck: CardItem[] = [];
    let idCounter = 1;

    CARD_PAIRS.forEach((item) => {
      deck.push({
        id: idCounter++,
        pairId: item.pairId,
        emoji: item.emoji,
        name: item.name,
        isFlipped: false,
        isMatched: false
      });
      deck.push({
        id: idCounter++,
        pairId: item.pairId,
        emoji: item.emoji,
        name: item.name,
        isFlipped: false,
        isMatched: false
      });
    });

    const shuffled = deck.sort(() => 0.5 - Math.random());
    setCards(shuffled);
    setSelectedCards([]);
    setMoves(0);
    setMatchesFound(0);
    setIsCompleted(false);
    setIsChecking(false);
    sound.speak('Kartları çevir ve aynı olanları eşleştir!');
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleCardClick = (index: number) => {
    if (isChecking) return;
    const clickedCard = cards[index];
    if (clickedCard.isFlipped || clickedCard.isMatched) return;

    sound.playPop();

    // Flip card
    const updatedCards = [...cards];
    updatedCards[index].isFlipped = true;
    setCards(updatedCards);

    const newSelected = [...selectedCards, index];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setIsChecking(true);
      setMoves((m) => m + 1);

      const [firstIdx, secondIdx] = newSelected;
      const firstCard = updatedCards[firstIdx];
      const secondCard = updatedCards[secondIdx];

      if (firstCard.pairId === secondCard.pairId) {
        // Matched!
        setTimeout(() => {
          sound.playSuccess();
          sound.speak(`${firstCard.name}! Eşleşti!`);

          const matchedCards = [...updatedCards];
          matchedCards[firstIdx].isMatched = true;
          matchedCards[secondIdx].isMatched = true;
          setCards(matchedCards);
          setSelectedCards([]);
          setIsChecking(false);

          const newMatchCount = matchesFound + 1;
          setMatchesFound(newMatchCount);

          if (newMatchCount === CARD_PAIRS.length) {
            setIsCompleted(true);
            sound.playStarChime();
            confetti({
              particleCount: 60,
              spread: 80,
              origin: { y: 0.6 }
            });
            const calculatedScore = Math.max(60, 100 - (moves - CARD_PAIRS.length) * 5);
            const stars = calculatedScore >= 80 ? 5 : 4;
            if (onGameComplete) {
              onGameComplete(calculatedScore, stars);
            }
          }
        }, 500);
      } else {
        // Not matched
        setTimeout(() => {
          sound.playBoing();
          const unFlippedCards = [...updatedCards];
          unFlippedCards[firstIdx].isFlipped = false;
          unFlippedCards[secondIdx].isFlipped = false;
          setCards(unFlippedCards);
          setSelectedCards([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl shadow-purple-100/60 border-2 border-purple-200">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-purple-100 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-400 to-pink-300 text-white flex items-center justify-center text-2xl shadow-md">
            🧩
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
              Sevimli Hafıza Kartları
              <span className="text-xs bg-purple-100 text-purple-700 px-2.5 py-0.5 rounded-full font-medium border border-purple-200">
                Zeka & Dikkat Geliştirme
              </span>
            </h3>
            <p className="text-sm text-slate-500">Kartları çevir, gizli eşleri bularak hafızanı güçlendir!</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-purple-50 px-4 py-2 rounded-2xl border border-purple-200/80">
          <div className="flex items-center gap-1.5 text-purple-700 font-bold">
            <Brain className="w-5 h-5" />
            <span>{moves} Hamle</span>
          </div>
          <div className="w-px h-6 bg-purple-200" />
          <div className="text-sm font-semibold text-purple-700">
            Eşleşme: {matchesFound}/{CARD_PAIRS.length}
          </div>
        </div>
      </div>

      {!isCompleted ? (
        <div className="flex flex-col items-center">
          {/* Cards Grid (4 columns x 3 rows) */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4 w-full max-w-lg mx-auto my-2">
            {cards.map((card, idx) => {
              const isVisible = card.isFlipped || card.isMatched;

              return (
                <button
                  key={card.id}
                  id={`memory-card-${idx}`}
                  onClick={() => handleCardClick(idx)}
                  disabled={card.isMatched || isChecking}
                  className={`h-24 sm:h-28 rounded-2xl sm:rounded-3xl border-2 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer transform ${
                    card.isMatched
                      ? 'bg-emerald-100/90 border-emerald-300 scale-95 opacity-90'
                      : isVisible
                      ? 'bg-white border-purple-300 shadow-md scale-105'
                      : 'bg-gradient-to-br from-pink-300 via-purple-300 to-sky-300 border-white/80 hover:scale-105 active:scale-95 shadow-sm'
                  }`}
                >
                  {isVisible ? (
                    <div className="flex flex-col items-center animate-pulse-gentle">
                      <span className="text-3xl sm:text-4xl">{card.emoji}</span>
                      <span className="text-[10px] sm:text-xs font-bold text-slate-700 mt-1">
                        {card.name}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-2xl sm:text-3xl text-white drop-shadow font-black">?</span>
                      <Sparkles className="w-3 h-3 text-white/80 mt-1" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-4 text-xs text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-500" />
            Her turda 2 kart aç ve aynı resimleri bul!
          </div>
        </div>
      ) : (
        /* Completion screen */
        <div className="py-8 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-purple-100 text-purple-500 border-4 border-purple-300 flex items-center justify-center text-5xl mb-4 animate-bounce">
            🌟
          </div>
          <h4 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">
            Harika Bir Hafıza! 🧠
          </h4>
          <p className="text-slate-600 max-w-md mb-6">
            Tüm kart eşlerini {moves} hamlede başarıyla buldun!
          </p>

          <div className="bg-purple-50 border-2 border-purple-200 rounded-3xl p-6 mb-6 flex flex-col items-center">
            <div className="text-sm font-semibold text-purple-600 uppercase tracking-wide mb-1">Kazanılan Yıldızlar</div>
            <div className="flex gap-2 text-3xl text-amber-400 my-1">
              ⭐⭐⭐⭐⭐
            </div>
            <div className="text-lg font-bold text-slate-800 mt-1">Süper Başarı!</div>
          </div>

          <button
            id="play-again-memory-btn"
            onClick={initGame}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg shadow-purple-200 active:scale-95 transition cursor-pointer"
          >
            <RefreshCw className="w-5 h-5" />
            Tekrar Oyna
          </button>
        </div>
      )}
    </div>
  );
}
