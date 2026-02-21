import React, { useState, useEffect } from 'react';
import { BookOpen, Eye, ArrowRight, RefreshCw, CheckCircle2 } from 'lucide-react';
import allFlashcards from './data/fiszki.json';

interface Flashcard {
  niemiecki_slowo: string;
  polski_tlumaczenie: string;
  niemiecki_przyklad: string;
  polski_przyklad: string;
}

export default function App() {
  const [sessionCards, setSessionCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Funkcja do losowania i przygotowania nowej sesji
  const startNewSession = () => {
    // Kopiujemy tablicę, aby jej nie mutować
    const shuffled = [...allFlashcards].sort(() => 0.5 - Math.random());
    // Wybieramy maksymalnie 20 fiszek
    const selected = shuffled.slice(0, 20);
    
    setSessionCards(selected);
    setCurrentIndex(0);
    setShowTranslation(false);
    setShowExample(false);
    setIsFinished(false);
  };

  // Inicjalizacja pierwszej sesji po załadowaniu komponentu
  useEffect(() => {
    startNewSession();
  }, []);

  const handleNext = () => {
    if (currentIndex < sessionCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowTranslation(false);
      setShowExample(false);
    } else {
      setIsFinished(true);
    }
  };

  if (sessionCards.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center text-zinc-400">
          <p>Brak fiszek w bazie danych.</p>
        </div>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-8">
        <div className="text-center space-y-4">
          <CheckCircle2 className="w-20 h-20 text-emerald-500 mx-auto" />
          <h1 className="text-4xl font-bold text-zinc-100">Koniec zestawu!</h1>
          <p className="text-zinc-400 text-lg">
            Przerobiłeś {sessionCards.length} słówek w tej sesji.
          </p>
        </div>
        <button
          onClick={startNewSession}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-colors shadow-lg shadow-emerald-900/20"
        >
          <RefreshCw className="w-5 h-5" />
          Zacznij nowy zestaw
        </button>
      </div>
    );
  }

  const currentCard = sessionCards[currentIndex];

  return (
    <div className="max-w-2xl mx-auto min-h-screen flex flex-col p-4 sm:p-8">
      {/* Header / Progress */}
      <header className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-2 text-zinc-400">
          <BookOpen className="w-5 h-5" />
          <span className="font-medium tracking-wide uppercase text-sm">Fiszki DE-PL</span>
        </div>
        <div className="text-zinc-500 font-mono text-sm bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
          {currentIndex + 1} / {sessionCards.length}
        </div>
      </header>

      {/* Main Card Area */}
      <main className="flex-1 flex flex-col">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 sm:p-12 shadow-2xl flex-1 flex flex-col relative overflow-hidden">
          
          {/* German Word */}
          <div className="flex-1 flex items-center justify-center min-h-[200px]">
            <h2 className="text-4xl sm:text-6xl font-bold text-center text-zinc-100 tracking-tight break-words">
              {currentCard.niemiecki_slowo}
            </h2>
          </div>

          <div className="space-y-6 mt-8">
            {/* Example Section */}
            <div className="space-y-3">
              {!showExample ? (
                <button
                  onClick={() => setShowExample(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  Pokaż zdanie przykładowe
                </button>
              ) : (
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <p className="text-zinc-200 font-medium">{currentCard.niemiecki_przyklad}</p>
                  <p className="text-zinc-500 text-sm">{currentCard.polski_przyklad}</p>
                </div>
              )}
            </div>

            {/* Translation Section */}
            <div className="space-y-3">
              {!showTranslation ? (
                <button
                  onClick={() => setShowTranslation(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Pokaż tłumaczenie
                </button>
              ) : (
                <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-900/50 text-center animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <p className="text-2xl font-semibold text-indigo-200">
                    {currentCard.polski_tlumaczenie}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Next Button */}
        <div className="mt-8">
          <button
            onClick={handleNext}
            className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-zinc-100 hover:bg-white text-zinc-900 rounded-2xl font-bold text-lg transition-all active:scale-[0.98]"
          >
            Następny
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </main>
    </div>
  );
}
