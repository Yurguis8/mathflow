import React, { useState, useEffect, useMemo } from "react";
import { useLocation, Navigate, Link } from "react-router-dom";

import {
  CheckCircle2,
  XCircle,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  Trophy,
  Timer,
  ArrowLeft
} from "lucide-react";

export default function SimulationPlayer() {
  const location = useLocation();
  const state = location.state;

  // Proteção contra acesso direto via URL sem dados do simulado
  if (!state || !state.questions) {
    return <Navigate to="/simulados" replace />;
  }

  const questions = state.questions;
  const initialTimeInMinutes = Number(state.time) && Number(state.time) > 0 ? Number(state.time) : 30;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: number }>({});
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(() => initialTimeInMinutes * 60);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  // CONTROLADOR DO CRONÔMETRO
  useEffect(() => {
    if (finished) return;

    if (timeLeft <= 0) {
      setFinished(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, finished]);

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex];

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  function handleSelectOption(optionIdx: number) {
    setUserAnswers({
      ...userAnswers,
      [currentIndex]: optionIdx,
    });
  }

  // CÁLCULO ESTÁTICO DO RENDIMENTO FINAL
  const results = useMemo(() => {
    let correctCount = 0;
    let wrongCount = 0;
    let unansweredCount = 0;

    questions.forEach((q: any, idx: number) => {
      const answer = userAnswers[idx];
      if (answer === undefined) {
        unansweredCount++;
      } else if (answer === q.correctIndex) {
        correctCount++;
      } else {
        wrongCount++;
      }
    });

    return { correctCount, wrongCount, unansweredCount };
  }, [userAnswers, questions]);

  // ================= TELA 1: RESULTADOS E GABARITO =================
  const [expandedQuestions, setExpandedQuestions] = useState<{ [key: number]: boolean }>({});

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
    return "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/40";
  };

  if (finished) {
    const toggleQuestion = (idx: number) => {
      setExpandedQuestions((prev) => ({
        ...prev,
        [idx]: !prev[idx],
      }));
    };

    return (
      <div className="max-w-4xl mx-auto px-4 py-10 pb-24">
        {/* CARD DE RENDIMENTO / SCORE */}
        <div className="bg-white dark:bg-slate-900 rounded-md p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm text-center mb-8">
          <div className="w-14 h-14 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-md flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-7 h-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Simulado Concluído!
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto mb-8">
            Veja abaixo o seu desempenho geral e a revisão de cada questão respondida.
          </p>

          <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto bg-slate-50 dark:bg-slate-800/40 p-4 sm:p-6 rounded-md border border-slate-100 dark:border-slate-800">
            <div className="text-center">
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Acertos</span>
              <span className="text-2xl sm:text-3xl font-black text-green-600 mt-1 block">{results.correctCount}</span>
            </div>
            <div className="text-center border-x border-slate-200 dark:border-slate-700">
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Erros</span>
              <span className="text-2xl sm:text-3xl font-black text-red-500 mt-1 block">{results.wrongCount}</span>
            </div>
            <div className="text-center">
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Em branco</span>
              <span className="text-2xl sm:text-3xl font-black text-slate-400 mt-1 block">{results.unansweredCount}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10 max-w-sm mx-auto">
            <Link to="/simulados" className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 py-3 rounded-md font-bold text-sm text-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              Voltar ao Início
            </Link>
            <Link to="/" className="flex-1 bg-blue-600 text-white py-3 rounded-md font-bold text-sm text-center hover:bg-blue-700 transition-colors shadow-md">
              Dashboard
            </Link>
          </div>
        </div>

        {/* LISTAGEM DE REVISÃO DO GABARITO (ESTILO ACCORDION) */}
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 px-1">Revisão das Questões</h3>
        
        <div className="space-y-3">
          {questions.map((q: any, idx: number) => {
            const userAnswer = userAnswers[idx];
            const isCorrect = userAnswer === q.correctIndex;
            const isOpen = !!expandedQuestions[idx];

            return (
              <div 
                key={q.id || idx} 
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md shadow-sm overflow-hidden"
              >
                {/* BARRINHA DO TOPO (CLICKÁVEL) */}
                <button
                  type="button"
                  onClick={() => toggleQuestion(idx)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors gap-4"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      Questão {(idx + 1).toString().padStart(2, "0")}
                    </span>
                    
                    {/* METADADOS */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded-sm font-bold uppercase tracking-wider border border-slate-200/60 dark:border-slate-700">
                        {q.source || "Geral"}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-sm font-bold uppercase tracking-wider border ${getDifficultyColors(q.difficulty)}`}>
                        {q.difficulty || "Mista"}
                      </span>
                    </div>

                    {/* STATUS DE ACERTO/ERRO */}
                    {isCorrect ? (
                      <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-950/30 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Acertou
                      </span>
                    ) : userAnswer === undefined ? (
                      <span className="text-xs font-bold text-slate-400 bg-slate-50 dark:bg-slate-800 px-2.5 py-0.5 rounded-md">
                        Em Branco
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-red-500 bg-red-50 dark:bg-red-950/30 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> Errou
                      </span>
                    )}
                  </div>

                  <div className="text-slate-400 dark:text-slate-500 shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {/* CONTEÚDO EXPANSÍVEL */}
                {isOpen && (
                  <div className="border-t border-slate-100 dark:border-slate-800 p-6 bg-white dark:bg-slate-900">
                    <p className="text-slate-800 dark:text-slate-200 font-semibold mb-4 text-base whitespace-pre-wrap">
                      {q.question}
                    </p>

                    {/* IMAGENS DE SUPORTE NO GABARITO */}
                    {q.image && (
                      <div className="mb-4 border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/20 p-3 flex justify-center rounded-md">
                        <img src={q.image} alt="Suporte" className="max-h-48 object-contain rounded-sm" loading="lazy" />
                      </div>
                    )}

                    {/* OPÇÕES DA QUESTÃO NA REVISÃO com suporte a imagem */}
                    <div className="space-y-2 mb-4">
                      {(q.options || []).map((opt: string, oIdx: number) => {
                        const isCorrectOption = oIdx === q.correctIndex;
                        const isUserChoice = oIdx === userAnswer;
                        const isImageOption = typeof opt === "string" && (opt.startsWith("http://") || opt.startsWith("https://"));
                        
                        let optStyle = "border-slate-100 dark:border-slate-800 opacity-60";
                        if (isCorrectOption) optStyle = "border-green-500 bg-green-50/50 dark:bg-green-950/20 text-green-700 dark:text-green-400 font-medium opacity-100";
                        else if (isUserChoice && !isCorrectOption) optStyle = "border-red-400 bg-red-50/50 dark:bg-red-950/20 text-red-600 dark:text-red-400 opacity-100";

                        return (
                          <div key={oIdx} className={`p-3.5 border rounded-md text-sm ${optStyle} flex justify-between items-center gap-4`}>
                            {isImageOption ? (
                              <div className="bg-white dark:bg-slate-800 p-2 rounded-sm border border-slate-100 dark:border-slate-700 max-w-[200px] max-h-[120px] flex items-center justify-center overflow-hidden">
                                <img 
                                  src={opt} 
                                  alt={`Alternativa ${String.fromCharCode(65 + oIdx)}`} 
                                  className="max-w-full max-h-full object-contain mix-blend-multiply dark:mix-blend-normal"
                                  loading="lazy"
                                />
                              </div>
                            ) : (
                              <span>{opt}</span>
                            )}
                            {isCorrectOption && <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />}
                            {isUserChoice && !isCorrectOption && <XCircle className="w-4 h-4 text-red-500 shrink-0" />}
                          </div>
                        );
                      })}
                    </div>

                    {/* EXPLICAÇÃO / RESOLUÇÃO */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-md border border-slate-100 dark:border-slate-800 whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-400">
                      <span className="font-bold block text-slate-800 dark:text-slate-200 mb-1">Resolução comentada:</span>
                      {q.resolution}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ================= TELA 2: EXECUTANDO O SIMULADO =================
  return (
    <div className="max-w-4xl mx-auto px-4 pb-24">
      
      {/* BARRA SUPERIOR DE CONTROLES */}
      <div className="flex items-center justify-between mb-6 pt-4">
        <button
          type="button"
          onClick={() => setShowLeaveModal(true)}
          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Abandonar
        </button>

        <div className="flex items-center gap-4">
          {(() => {
            const totalSeconds = initialTimeInMinutes * 60;
            const isTimeCritical = timeLeft < totalSeconds * 0.2;

            return (
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border font-mono text-sm font-bold transition-colors ${
                  isTimeCritical
                    ? "bg-red-100 border-red-300 text-red-700 dark:bg-red-950/40 dark:border-red-900 dark:text-red-400 animate-pulse"
                    : "bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-300"
                }`}
              >
                <Timer className="w-4 h-4" />
                {formatTime(timeLeft)}
              </div>
            );
          })()}
          <span className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-wider">
            Questão {currentIndex + 1} de {totalQuestions}
          </span>
        </div>
      </div>

      {/* BARRA DE PROGRESSO RETANGULAR */}
      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 mb-8 overflow-hidden rounded-none">
        <div
          className="h-full bg-blue-600 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
        />
      </div>

      {/* NAVEGAÇÃO DIRETA ENTRE AS QUESTÕES */}
      <div className="flex flex-wrap gap-2 mb-6">
        {questions.map((_, idx) => {
          const isCurrent = idx === currentIndex;
          const isAnswered = userAnswers[idx] !== undefined;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`w-9 h-9 font-bold text-xs rounded-md border transition-all ${
                isCurrent
                  ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                  : isAnswered
                  ? "bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-950/30 dark:border-blue-900/50 dark:text-blue-400"
                  : "bg-white border-slate-200 text-slate-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 hover:border-slate-300"
              }`}
            >
              {(idx + 1).toString().padStart(2, "0")}
            </button>
          );
        })}
      </div>

      {/* BOX DO ENUNCIADO ATUAL */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md p-6 sm:p-8 shadow-sm mb-6">
        
        <div className="flex items-center gap-1.5 mb-4">
          <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-sm font-bold uppercase">
            {currentQuestion.source || "Geral"}
          </span>
          <span className={`text-[10px] border px-2 py-0.5 rounded-sm font-bold uppercase tracking-wider ${getDifficultyColors(currentQuestion.difficulty)}`}>
            {currentQuestion.difficulty || "Mista"}
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-6 whitespace-pre-wrap tracking-tight">
          {currentQuestion.question}
        </h2>

        {currentQuestion.image && (
          <div className="mb-6 border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/10 p-4 flex justify-center rounded-md">
            <img
              src={currentQuestion.image}
              alt={`Suporte Visual ${currentQuestion.id || currentIndex}`}
              className="max-h-64 object-contain"
              loading="lazy"
            />
          </div>
        )}

        {/* SELEÇÃO DAS ALTERNATIVAS ADAPTADA PARA SUPORTAR IMAGENS */}
        <div className="space-y-3">
          {currentQuestion.options.map((option: string, idx: number) => {
            const isSelected = userAnswers[currentIndex] === idx;
            const isImageOption = typeof option === "string" && (option.startsWith("http://") || option.startsWith("https://"));

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOption(idx)}
                className={`w-full p-4 sm:p-5 rounded-md border text-left text-sm sm:text-base transition-all ${
                  isSelected
                    ? "border-blue-500 bg-blue-50/40 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900"
                }`}
              >
                <div className="flex items-center gap-3 justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-5 h-5 rounded-sm border flex items-center justify-center text-xs font-bold shrink-0 ${
                      isSelected ? "bg-blue-600 border-blue-600 text-white" : "border-slate-300 text-slate-400"
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    
                    {/* Renderização dinâmica: Imagem ou Texto */}
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
                      <span className="flex-1">{option}</span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* CONTROLES DE NAVEGAÇÃO */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
        <button
          type="button"
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="w-full sm:w-auto px-5 py-3 border border-slate-200 dark:border-slate-800 dark:text-slate-300 bg-white dark:bg-slate-900 rounded-md font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800/50 disabled:opacity-40 flex items-center justify-center gap-2 transition-all"
        >
          <ChevronLeft className="w-4 h-4" /> Anterior
        </button>

        <div className="w-full sm:w-auto text-center sm:text-right">
          {currentIndex + 1 >= totalQuestions ? (
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Deseja realmente finalizar o simulado e gerar o seu gabarito?")) {
                  setFinished(true);
                }
              }}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-8 py-3.5 rounded-md font-bold text-sm transition-all shadow-md"
            >
              Finalizar Simulado
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setCurrentIndex((prev) => prev + 1)}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-md font-bold text-sm flex items-center justify-center gap-2 transition-all sm:ml-auto"
            >
              Próxima <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* MODAL DE CONFIRMAÇÃO DE SAÍDA */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md max-w-md w-full p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Abandonar Simulado?
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
              Todo o progresso feito nesta sessão será perdido permanentemente. Tem certeza de que deseja sair?
            </p>
            
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowLeaveModal(false)}
                className="px-4 py-2 text-sm font-semibold rounded-md border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Continuar Simulado
              </button>
              <button
                type="button"
                onClick={() => window.history.back()}
                className="px-4 py-2 text-sm font-semibold rounded-md bg-red-600 hover:bg-red-700 text-white shadow-md transition-colors"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}