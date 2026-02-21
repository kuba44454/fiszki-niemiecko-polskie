import React, { useState } from 'react';
import { BookOpen, Eye, EyeOff, ArrowRight, ArrowLeft, RefreshCw, CheckCircle2 } from 'lucide-react';
import flashcardsData from './data/fiszki.json';

interface Flashcard {
  niemiecki_slowo: string;
  polski_tlumaczenie: string;
  niemiecki_przyklad: string;
  polski_przyklad: string;
}

type FlashcardDatabase = Record<string, Flashcard[]>;
const allFlashcards: FlashcardDatabase = flashcardsData as FlashcardDatabase;

export default function App() {
  const [selectedSet, setSelectedSet] = useState<string | null>(null);
  const [sessionCards, setSessionCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const startNewSession = (setId: string) => {
    const cards = allFlashcards[setId] || [];
    // Kopiujemy tablicę, aby jej nie mutować
    const shuffled = [...cards].sort(() => 0.5 - Math.random());
    // Wybieramy maksymalnie 20 fiszek
    const selected = shuffled.slice(0, 20);
    
    setSelectedSet(setId);
    setSessionCards(selected);
    setCurrentIndex(0);
    setShowTranslation(false);
    setShowExample(false);
    setIsFinished(false);
  };

  const handleNext = () => {
    if (currentIndex < sessionCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowTranslation(false);
      setShowExample(false);
    } else {
      setIsFinished(true);
    }
  };

  // Ekran wyboru zestawu
  if (!selectedSet) {
    return (
      <div className="max-w-4xl mx-auto min-h-screen p-4 sm:p-8 flex flex-col">
        <header className="mb-12 text-center mt-8">
          <h1 className="text-4xl font-bold text-zinc-100 tracking-tight">Wybierz zestaw</h1>
          <p className="text-zinc-400 mt-2">Wybierz numer zestawu, z którego chcesz się uczyć</p>
        </header>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Object.keys(allFlashcards).map(setId => (
            <button
              key={setId}
              onClick={() => startNewSession(setId)}
              className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl hover:bg-zinc-800 hover:border-zinc-700 transition-all flex flex-col items-center gap-3 group"
            >
              <div className="w-12 h-12 rounded-full bg-zinc-950 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6 text-emerald-500" />
              </div>
              <div className="text-center">
                <span className="block text-xl font-bold text-zinc-100">Zestaw {setId}</span>
                <span className="block text-sm text-zinc-500 mt-1">
                  {allFlashcards[setId].length} fiszek
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Ekran pustego zestawu
  if (sessionCards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-6">
        <div className="text-center text-zinc-400">
          <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="text-xl">Ten zestaw jest jeszcze pusty.</p>
          <p className="text-sm mt-2">Dodaj fiszki do pliku data/fiszki.json w sekcji "{selectedSet}"</p>
        </div>
        <button
          onClick={() => setSelectedSet(null)}
          className="flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Wróć do wyboru zestawu
        </button>
      </div>
    );
  }

  // Ekran końcowy
  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-8">
        <div className="text-center space-y-4">
          <CheckCircle2 className="w-20 h-20 text-emerald-500 mx-auto" />
          <h1 className="text-4xl font-bold text-zinc-100">Koniec zestawu!</h1>
          <p className="text-zinc-400 text-lg">
            Przerobiłeś {sessionCards.length} słówek z zestawu {selectedSet}.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => startNewSession(selectedSet)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-colors shadow-lg shadow-emerald-900/20"
          >
            <RefreshCw className="w-5 h-5" />
            Powtórz ten zestaw
          </button>
          <button
            onClick={() => setSelectedSet(null)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Wybierz inny zestaw
          </button>
        </div>
      </div>
    );
  }

  const currentCard = sessionCards[currentIndex];

  return (
    <div className="max-w-2xl mx-auto min-h-screen flex flex-col p-4 sm:p-8">
      {/* Header / Progress */}
      <header className="flex items-center justify-between mb-12">
        <button 
          onClick={() => setSelectedSet(null)}
          className="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium tracking-wide uppercase text-sm hidden sm:inline">Zestaw {selectedSet}</span>
        </button>
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

          <div className="space-y-4 mt-8">
            {/* Example Section */}
            <div className="space-y-2">
              <button
                onClick={() => setShowExample(!showExample)}
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-colors ${
                  showExample 
                    ? 'bg-zinc-800 border-zinc-700 text-zinc-100' 
                    : 'border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                {showExample ? 'Ukryj zdanie przykładowe' : 'Pokaż zdanie przykładowe'}
              </button>
              
              {showExample && (
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <p className="text-zinc-200 font-medium">{currentCard.niemiecki_przyklad}</p>
                  <p className="text-zinc-500 text-sm">{currentCard.polski_przyklad}</p>
                </div>
              )}
            </div>

            {/* Translation Section */}
            <div className="space-y-2">
              <button
                onClick={() => setShowTranslation(!showTranslation)}
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-colors ${
                  showTranslation 
                    ? 'bg-indigo-950/50 border-indigo-900/50 text-indigo-200' 
                    : 'border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100'
                }`}
              >
                {showTranslation ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showTranslation ? 'Ukryj tłumaczenie' : 'Pokaż tłumaczenie'}
              </button>
              
              {showTranslation && (
                <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-900/50 text-center animate-in fade-in slide-in-from-top-2 duration-200">
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
