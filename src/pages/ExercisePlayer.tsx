import React, { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  ChevronRight,
  HelpCircle,
  Trophy,
  Menu,
  Award,
  GraduationCap
} from "lucide-react";

import { motion, AnimatePresence } from "motion/react";
import type { Exercise } from "../types";

export default function ExercisePlayer() {
  const { areaId, topicId } = useParams();
  const location = useLocation();

  // Captura os filtros configurados no Modal (caso não existam, assume o padrão "Todos" e "false")
  const targetedLevel = location.state?.selectedLevel || "Todos";
  const onlyEnem = location.state?.onlyEnem || false;
  const targetedYear = location.state?.selectedYear || "Todos";

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  
  const [showResolution, setShowResolution] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showQuestionNavigator, setShowQuestionNavigator] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // CRONÔMETRO
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!finished) {
      timer = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [finished]);

  // CARREGAMENTO DINÂMICO CUSTOMIZADO COM OS NOVOS FILTROS DE QUESTÕES
  useEffect(() => {
    let isMounted = true;

    async function loadAreaExercises() {
      if (!areaId || areaId === "undefined" || !topicId) {
        if (isMounted) {
          setExercises([]);
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        
        const module = await import(`../data/areas/${areaId}/exercises.json`);
        const areaExercises = module.default;

        const cleanStr = (str: string) => 
          str.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        // 1. Filtra separando pelo TopicId correto
        let filtered = areaExercises.filter((exercise: any) => {
          const currentExerciseTopic = exercise.topicId || exercise.topic || "";
          return cleanStr(currentExerciseTopic) === cleanStr(topicId);
        });

        // 2. Filtra por nível de Dificuldade da questão individual se não for "Todos"
        if (targetedLevel !== "Todos") {
          filtered = filtered.filter((exercise: any) => 
            cleanStr(exercise.difficulty || "") === cleanStr(targetedLevel)
          );
        }

        // 3. Filtra apenas questões do ENEM se a caixinha foi marcada
        if (onlyEnem) {
          filtered = filtered.filter((exercise: any) => 
            cleanStr(exercise.source || "") === "enem"
          );
        }

        // 4. Filtra pelo Ano procurando dentro do ID ou do Enunciado da questão
        if (targetedYear !== "Todos") {
          filtered = filtered.filter((exercise: any) => {
            const exerciseId = String(exercise.id || "");
            const exerciseQuestion = String(exercise.question || "");
            
            return exerciseId.includes(targetedYear) || exerciseQuestion.includes(targetedYear);
          });
        }

        if (isMounted) {
          setExercises(filtered);
        }
      } catch (error) {
        console.error(`Erro ao importar o arquivo da área: ${areaId}`, error);
        if (isMounted) setExercises([]); 
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadAreaExercises();

    return () => {
      isMounted = false;
    };
  }, [areaId, topicId, targetedLevel, onlyEnem, targetedYear]);

  // SALVA PROGRESSO
  const saveProgressToDB = async (isFinal = false) => {
    if (!user.id) return;

    const progressData = {
      user_id: user.id,
      topic_name: topicId,
      completed_questions: currentIndex + (isFinal ? 1 : 0),
      correct_answers: score,
      last_question_index: currentIndex,
      study_time_seconds: seconds,
    };

    try {
      await fetch("https://mathflow-l58o.onrender.com/progress/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(progressData),
      });
    } catch (error) {
      console.error("Erro ao salvar progresso:", error);
    }
  };

  const handleOptionSelect = (idx: number) => {
    if (isConfirmed) return;
    setSelectedOption(idx);
  };

  const handleConfirmAnswer = () => {
    if (selectedOption === null || isConfirmed) return;

    setIsConfirmed(true);
    const correct = selectedOption === exercises[currentIndex].correctIndex;
    setIsCorrect(correct);

    if (correct) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    const isLast = currentIndex + 1 === exercises.length;
    saveProgressToDB(isLast);

    if (!isLast) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsConfirmed(false);
      setIsCorrect(null);
      setShowResolution(false);
    } else {
      setFinished(true);
    }
  };

  // FUNÇÃO AUXILIAR PARA DEFINIR AS CORES DA DIFICULDADE
  const getDifficultyColors = (difficulty: string) => {
    const diff = String(difficulty || "Mista")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

    if (diff === "facil") {
      return "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/40";
    }
    if (diff === "medio") {
      return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/40";
    }
    if (diff === "dificil") {
      return "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/40";
    }
    if (diff === "olimpico") {
      return "bg-purple-600 text-amber-300 border-purple-700 font-extrabold dark:bg-purple-900 dark:text-amber-400 dark:border-purple-800";
    }
    return "bg-slate-50 text-slate-700 border-slate-100 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-900/40";
  };

  if (loading) {
    return <div className="h-screen flex items-center justify-center">Carregando exercícios...</div>;
  }

  // TELA DE ERRO SE NÃO HOUVER QUESTÕES COM ESSE FILTRO COMBINADO
  if (!exercises.length) {
    return (
      <div className="p-8 text-center text-slate-500 max-w-lg mx-auto mt-24 bg-white dark:bg-slate-900 rounded-custom-lg border border-slate-200 dark:border-slate-800 shadow-sm">
        <p className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 font-display">Nenhuma questão disponível</p>
        <p className="text-sm text-slate-400 dark:text-slate-500 mb-6">
          Não existem exercícios de nível <span className="font-semibold text-brand-main">"{targetedLevel}"</span> {onlyEnem && "vindos do ENEM "}cadastrados para este assunto ainda.
        </p>
        <Link to="/exercises" className="inline-block bg-slate-900 dark:bg-slate-800 text-white px-6 py-3 rounded-custom-md font-bold text-sm hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors">
          Voltar aos Tópicos
        </Link>
      </div>
    );
  }

  // TELA FINALIZADO
  if (finished) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="bg-white dark:bg-slate-900 rounded-custom-lg p-10 border border-slate-200 dark:border-slate-800 text-center shadow-sm">
          <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10" />
          </div>

          <h2 className="text-3xl font-bold mb-2 font-display">Excelente trabalho!</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">Seu progresso foi salvo.</p>

          <div className="bg-slate-50 dark:bg-slate-800/40 rounded-custom-lg p-6 mb-8 flex justify-around border border-slate-100 dark:border-slate-800">
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Acertos</p>
              <p className="text-3xl font-bold text-brand-main">{score} / {exercises.length}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Tempo</p>
              <p className="text-3xl font-bold text-green-600">{Math.floor(seconds / 60)}m {seconds % 60}s</p>
            </div>
          </div>

          <div className="flex gap-4">
            <Link to="/exercises" className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 py-4 rounded-custom-md font-bold text-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Voltar</Link>
            <Link to="/" className="flex-1 bg-brand-main text-white py-4 rounded-custom-md font-bold text-center hover:bg-brand-dark transition-colors shadow-sm">Dashboard</Link>
          </div>
        </div>
      </div>
    );
  }

  const currentExercise = exercises[currentIndex];
  const progress = ((currentIndex + 1) / exercises.length) * 100;

  return (
    <div className="max-w-4xl mx-auto px-4 pb-24">
      <div className="flex items-center justify-between mb-8 pt-4">
        {/* BOTÃO DE ABANDONAR QUE ATIVA O MODAL */}
        <button 
          type="button"
          onClick={() => setShowLeaveModal(true)} 
          className="flex items-center gap-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Sair
        </button>

        {/* METADADOS/BADGES DINÂMICAS DA QUESTÃO */}
        <div className="flex items-center gap-2">
          {currentExercise.source?.toLowerCase() === "enem" && (
            <span className="flex items-center gap-1 text-[10px] bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/40 px-2 py-0.5 rounded-sm font-bold uppercase tracking-wider">
              <GraduationCap className="w-3 h-3" /> ENEM
            </span>
          )}
          <span className={`text-[10px] px-2 py-0.5 rounded-sm font-bold uppercase tracking-wider border ${getDifficultyColors(currentExercise.difficulty)}`}>
            {currentExercise.difficulty || "Geral"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowQuestionNavigator(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-custom-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Menu className="w-4 h-4" />
            <span className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300">
              Questões
            </span>
          </button>

          <span className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-wider">
            {currentIndex + 1} / {exercises.length}
          </span>
        </div>
      </div>

      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 mb-10 overflow-hidden rounded-none">
        <motion.div animate={{ width: `${progress}%` }} className="h-full bg-brand-main" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          className="bg-white dark:bg-slate-900 rounded-custom-lg p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm"
        >
          <h2 className="text-base sm:text-md md:text-2xl font-semibold mb-6 whitespace-pre-wrap text-slate-800 dark:text-slate-100 tracking-tight leading-relaxed font-display">
            {currentExercise.question}
          </h2>

          {/* RETÂNGULO DE IMAGEM */}
          {currentExercise.image && (
            <div className="mb-8 overflow-hidden rounded-custom-md border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/10 p-4 flex justify-center">
              <img
                src={currentExercise.image}
                alt={`Imagem de suporte para o exercício ${currentExercise.id}`}
                className="max-h-72 object-contain"
                loading="lazy"
              />
            </div>
          )}

          {/* ALTERNATIVAS */}
          <div className="grid grid-cols-1 gap-3">
            {currentExercise.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectTarget = idx === currentExercise.correctIndex;
              const isImageOption = typeof option === "string" && (option.startsWith("http://") || option.startsWith("https://"));

              let style = "border-slate-200 dark:border-slate-800 hover:border-brand-main dark:hover:border-brand-main hover:bg-brand-light dark:hover:bg-brand-main/5";

              if (selectedOption !== null && !isConfirmed) {
                if (isSelected) style = "border-brand-main bg-brand-light text-brand-dark dark:bg-brand-main/10 dark:text-brand-main font-medium";
                else style = "border-slate-200 dark:border-slate-800 opacity-60";
              }
              else if (isConfirmed) {
                if (isCorrectTarget) style = "border-green-500 bg-green-50/50 text-green-700 dark:bg-green-950/20 dark:text-green-400 font-semibold";
                else if (isSelected) style = "border-red-500 bg-red-50/50 text-red-700 dark:bg-red-950/20 dark:text-red-400";
                else style = "opacity-40 border-slate-100 dark:border-slate-800";
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleOptionSelect(idx)}
                  disabled={isConfirmed}
                  className={`w-full p-4 rounded-custom-md border text-left transition-all text-sm bg-white dark:bg-slate-900 ${style}`}
                >
                  <div className="flex justify-between items-center gap-4">
                    {isImageOption ? (
                      <div className="bg-white dark:bg-slate-800 p-2 rounded-sm border border-slate-100 dark:border-slate-700 max-w-[200px] max-h-[120px] flex items-center justify-center overflow-hidden">
                        <img 
                          src={option} 
                          alt={`Alternativa ${String.fromCharCode(65 + idx)}`} 
                          className="max-w-full max-h-full object-contain mix-blend-multiply dark:mix-blend-normal"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <span>{option}</span>
                    )}

                    {isConfirmed && isCorrectTarget && <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />}
                    {isConfirmed && isSelected && !isCorrectTarget && <XCircle className="w-4 h-4 text-red-600 shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* PAINEL DE AÇÕES */}
          <div className="flex flex-col gap-3 mt-6">
            {!isConfirmed ? (
              <button
                type="button"
                onClick={handleConfirmAnswer}
                disabled={selectedOption === null}
                className="w-full bg-brand-main hover:bg-brand-dark disabled:opacity-50 text-white py-3.5 rounded-custom-md font-bold text-sm transition-all shadow-sm text-center"
              >
                Confirmar Resposta
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button
                  type="button"
                  onClick={() => setShowResolution(!showResolution)}
                  className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 py-3.5 rounded-custom-md font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
                >
                  {showResolution ? "Esconder Explicação" : "Ver Resolução"}
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white py-3.5 rounded-custom-md font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  {currentIndex + 1 === exercises.length ? "Finalizar" : "Próxima Questão"}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* RESOLUÇÃO COMENTADA */}
          <AnimatePresence>
            {showResolution && isConfirmed && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-6 p-5 bg-slate-50 dark:bg-slate-800/40 rounded-custom-md border border-slate-200 dark:border-slate-800 whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-400">
                  <p className="font-bold mb-2 text-slate-800 dark:text-slate-200">Explicação:</p>
                  {currentExercise.resolution}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* MODAL DE SAÍDA */}
      <AnimatePresence>
        {showLeaveModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-custom-xl p-6 w-full max-w-md border border-slate-200 dark:border-slate-800 shadow-xl"
            >
              <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white font-display">
                Sair da sessão?
              </h3>

              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Seu progresso atual será salvo automaticamente.
              </p>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowLeaveModal(false)}
                  className="flex-1 py-3 rounded-custom-md bg-slate-100 dark:bg-slate-800 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm"
                >
                  Cancelar
                </button>

                <Link
                  to="/exercises"
                  className="flex-1 py-3 rounded-custom-md bg-red-600 hover:bg-red-700 text-white font-semibold text-center transition-colors text-sm shadow-sm"
                >
                  Sair
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL NAVEGAÇÃO DE QUESTÕES */}
      <AnimatePresence>
        {showQuestionNavigator && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-custom-xl w-full max-w-lg p-6 border border-slate-200 dark:border-slate-800 shadow-xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-display">
                  Navegar Questões
                </h3>

                <button
                  type="button"
                  onClick={() => setShowQuestionNavigator(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-5 sm:grid-cols-6 gap-3 max-h-[60vh] overflow-y-auto pr-1">
                {exercises.map((_, idx) => {
                  const isActive = idx === currentIndex;

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setCurrentIndex(idx);
                        setSelectedOption(null);
                        setIsConfirmed(false);
                        setIsCorrect(null);
                        setShowResolution(false);
                        setShowQuestionNavigator(false);
                      }}
                      className={`
                        h-12
                        rounded-custom-md
                        text-sm
                        font-bold
                        transition-all
                        border
                        ${
                          isActive
                            ? "bg-brand-main text-white border-brand-main shadow-sm"
                            : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-brand-main"
                        }
                      `}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}