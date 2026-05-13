import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, XCircle, ChevronRight, HelpCircle, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { Exercise } from "../types";

// IMPORTANTE: Importando o JSON local diretamente
import exercisesData from "../../data/exercises.json";

export default function ExercisePlayer() {
  const { topicId } = useParams();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResolution, setShowResolution] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);

  // Estados para o Backend (Progresso)
  const [seconds, setSeconds] = useState(0);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // 1. Inicia o cronômetro de estudo
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!finished) { // O tempo só conta se NÃO tiver terminado
      timer = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [finished]); // Limpa o timer assim que 'finished' mudar para true

  // 2. Carrega os exercícios do arquivo local (sem precisar de API para isso)
  useEffect(() => {
    if (topicId && exercisesData[topicId as keyof typeof exercisesData]) {
      setExercises(exercisesData[topicId as keyof typeof exercisesData]);
    }
    setLoading(false);
  }, [topicId]);

  // 3. Função que salva no Banco de Dados (Backend)
  const saveProgressToDB = async (isFinal = false) => {
    if (!user.id) return;

    const progressData = {
      user_id: user.id,
      topic_name: topicId,
      completed_questions: currentIndex + (isFinal ? 1 : 0),
      correct_answers: score,
      last_question_index: currentIndex,
      study_time_seconds: seconds
    };

    try {
      // Aqui sim usamos o backend (conforme sua estrutura de rotas)
      await fetch('http://localhost:3000/progress/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(progressData)
      });
    } catch (error) {
      console.error("Erro ao salvar progresso no banco:", error);
    }
  };

  const handleOptionSelect = (idx: number) => {
    if (selectedOption !== null) return;
    
    setSelectedOption(idx);
    const correct = idx === exercises[currentIndex].correctIndex;
    setIsCorrect(correct);
    if (correct) setScore(s => s + 1);
  };

  const handleNext = () => {
    const isLast = currentIndex + 1 === exercises.length;
    
    // Salva o progresso no banco de dados
    saveProgressToDB(isLast);

    if (!isLast) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsCorrect(null);
      setShowResolution(false);
    } else {
      setFinished(true);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center text-slate-600 font-medium">Carregando exercícios...</div>;
  if (!exercises.length) return <div className="p-8 text-center text-slate-500">Nenhum exercício encontrado para este assunto.</div>;

  if (finished) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center px-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl p-12 shadow-xl border border-slate-200">
          <div className="w-20 h-20 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Excelente trabalho!</h2>
          <p className="text-slate-600 mb-8">Seu progresso foi sincronizado com seu perfil.</p>
          
          <div className="bg-slate-50 rounded-2xl p-6 mb-8 flex justify-around">
            <div className="text-center">
              <p className="text-xs text-slate-400 uppercase font-bold mb-1">Acertos</p>
              <p className="text-3xl font-bold text-blue-600">{score} / {exercises.length}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-400 uppercase font-bold mb-1">Tempo</p>
              <p className="text-3xl font-bold text-green-600">{Math.floor(seconds / 60)}m {seconds % 60}s</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/exercises" className="flex-1 bg-slate-100 text-slate-700 px-6 py-4 rounded-xl font-bold hover:bg-slate-200 transition-colors">Voltar</Link>
            <Link to="/" className="flex-1 bg-blue-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors">Ver Meu Painel</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentExercise = exercises[currentIndex];
  const progress = ((currentIndex + 1) / exercises.length) * 100;

  return (
    <div className="max-w-3xl mx-auto pb-20 px-4">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-8 py-4">
        <Link to="/exercises" className="text-slate-500 hover:text-slate-900 font-medium flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Sair
        </Link>
        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">
           Questão {currentIndex + 1} de {exercises.length}
        </span>
      </div>

      {/* Barra de Progresso */}
      <div className="w-full h-2 bg-slate-200 rounded-full mb-12 overflow-hidden shadow-inner">
        <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-blue-600" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={currentIndex} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-slate-200">
          <h2 className="text-2xl font-semibold text-slate-800 leading-relaxed mb-10">{currentExercise.question}</h2>

          <div className="space-y-4">
            {currentExercise.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectTarget = idx === currentExercise.correctIndex;
              let style = "border-slate-200 hover:border-blue-400 hover:bg-blue-50";
              if (selectedOption !== null) {
                if (isCorrectTarget) style = "border-green-500 bg-green-50 text-green-700 ring-1 ring-green-500";
                else if (isSelected) style = "border-red-500 bg-red-50 text-red-700 ring-1 ring-red-500";
                else style = "border-slate-100 opacity-50 cursor-not-allowed";
              }

              return (
                <button key={idx} onClick={() => handleOptionSelect(idx)} disabled={selectedOption !== null} className={`w-full p-5 rounded-2xl border-2 text-left font-medium transition-all flex items-center justify-between group ${style}`}>
                  <span className="flex items-center gap-4">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold border ${selectedOption !== null && isCorrectTarget ? "bg-green-600 text-white border-green-600" : selectedOption === idx ? "bg-red-600 text-white border-red-600" : "bg-white border-slate-200 text-slate-500"}`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {option}
                  </span>
                  {selectedOption !== null && isCorrectTarget && <CheckCircle2 className="w-6 h-6 text-green-600" />}
                  {selectedOption === idx && !isCorrectTarget && <XCircle className="w-6 h-6 text-red-600" />}
                </button>
              );
            })}
          </div>

          <div className="mt-12 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <button onClick={() => setShowResolution(!showResolution)} disabled={selectedOption === null} className={`flex items-center gap-2 font-bold text-sm uppercase tracking-widest ${selectedOption === null ? "text-slate-300" : "text-blue-600 hover:text-blue-700"}`}>
              <HelpCircle className="w-4 h-4" /> {showResolution ? "Esconder Resolução" : "Ver Resolução"}
            </button>
            {selectedOption !== null && (
              <button onClick={handleNext} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-600 transition-all flex items-center gap-2 w-full sm:w-auto">
                {currentIndex + 1 === exercises.length ? "Finalizar" : "Próxima Questão"} <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
          
          <AnimatePresence>
            {showResolution && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="mt-8 p-6 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 leading-relaxed whitespace-pre-wrap text-sm">
                  <p className="font-bold text-slate-400 uppercase mb-4">Explicação:</p>
                  {currentExercise.resolution}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}