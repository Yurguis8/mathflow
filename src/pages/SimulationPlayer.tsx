import React, { useState, useEffect } from "react";
import { useLocation, Navigate, Link } from "react-router-dom";

import {
  CheckCircle2,
  XCircle,
  ChevronRight,
  Trophy,
  Timer,
} from "lucide-react";

export default function SimulationPlayer() {
  const location = useLocation();
  const state = location.state;

  // Se não vier state válido ou sem as questões injetadas, redireciona de volta
  if (!state || !state.questions) {
    return <Navigate to="/simulados" replace />;
  }

  const shuffledQuestions = state.questions;
  // Pegamos o tempo vindo do estado. Se por acaso não vier nada, assume 30 minutos.
  const initialTimeInMinutes = Number(state.time) && Number(state.time) > 0 ? Number(state.time) : 30;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);

  // Inicializa o estado diretamente com o cálculo correto de minutos para segundos
  const [timeLeft, setTimeLeft] = useState(() => initialTimeInMinutes * 60);

  // Efeito do Cronômetro corrigido
  useEffect(() => {
    if (finished) return;

    if (timeLeft <= 0) {
      setFinished(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, finished]);

  // Função auxiliar para formatar os segundos em MM:SS ou HH:MM:SS caso o tempo seja muito longo
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const currentQuestion = shuffledQuestions[currentIndex];

  // Nenhuma questão encontrada no payload recebido
  if (!shuffledQuestions.length) {
    return (
      <div className="max-w-3xl mx-auto p-10 text-center">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10">
          <h1 className="text-2xl font-bold mb-4 dark:text-white">
            Nenhuma questão encontrada
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            Por favor, selecione assuntos que contenham exercícios cadastrados.
          </p>
          <Link
            to="/simulados"
            className="inline-flex bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold transition-all"
          >
            Voltar para a seleção
          </Link>
        </div>
      </div>
    );
  }

  // Tela de resultados finais
  if (finished) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-10 text-center">
          <div className="w-20 h-20 rounded-full bg-yellow-100 dark:bg-yellow-950/50 flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10 text-yellow-600" />
          </div>

          <h1 className="text-4xl font-bold mb-4 dark:text-white">
            Simulado Finalizado
          </h1>

          <p className="text-slate-500 dark:text-slate-400 mb-4">
            {timeLeft <= 0 ? "⚠️ O tempo limite foi esgotado!" : "Parabéns por concluir!"}
          </p>

          <p className="text-slate-500 dark:text-slate-400 mb-8">
            Você acertou {score} de {shuffledQuestions.length} questões.
          </p>

          <div className="text-5xl font-bold text-blue-600 mb-8">
            {shuffledQuestions.length > 0 
              ? `${Math.round((score / shuffledQuestions.length) * 100)}%`
              : "0%"}
          </div>

          <Link
            to="/simulados"
            className="inline-flex bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold transition-all"
          >
            Voltar ao Início
          </Link>
        </div>
      </div>
    );
  }

  const handleConfirm = () => {
    if (selectedOption === null) return;
    setConfirmed(true);
    if (selectedOption === currentQuestion.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    const isLast = currentIndex + 1 >= shuffledQuestions.length;
    if (isLast) {
      setFinished(true);
      return;
    }
    setCurrentIndex((prev) => prev + 1);
    setSelectedOption(null);
    setConfirmed(false);
  };

  // Alerta visual caso falte menos de 1 minuto (60 segundos)
  const isUrgent = timeLeft < 60;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      {/* Header e Progresso */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <h1 className="text-3xl sm:text-4xl font-bold dark:text-white">
            Simulado em Andamento
          </h1>

          {/* CRONÔMETRO VISUAL */}
          <div 
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl border font-mono font-bold text-lg transition-all shadow-sm shrink-0
              ${isUrgent 
                ? "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 animate-pulse" 
                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
              }`}
          >
            <Timer className={`w-5 h-5 ${isUrgent ? "text-red-500" : "text-blue-600"}`} />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Info de progresso de questões */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-black uppercase tracking-wider text-slate-400">
            Progresso das Questões
          </span>
          <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
            {currentIndex + 1} / {shuffledQuestions.length}
          </span>
        </div>

        {/* Barra de Progresso */}
        <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{
              width: `${((currentIndex + 1) / shuffledQuestions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Card da Questão */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800">
        <h2 className="text-xl sm:text-2xl font-semibold mb-8 whitespace-pre-line dark:text-white leading-relaxed">
          {currentQuestion.question}
        </h2>

        {/* Opções de Resposta */}
        <div className="space-y-4">
          {currentQuestion.options.map((option: string, index: number) => {
            const isSelected = selectedOption === index;
            const isCorrect = index === currentQuestion.correctIndex;

            let style = "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700";

            if (confirmed) {
              if (isCorrect) {
                style = "border-green-500 bg-green-50 dark:bg-green-950/30 text-green-900 dark:text-green-100";
              } else if (isSelected) {
                style = "border-red-500 bg-red-50 dark:bg-red-950/30 text-red-900 dark:text-red-100";
              }
            } else if (isSelected) {
              style = "border-blue-500 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-500";
            }

            return (
              <button
                key={index}
                onClick={() => {
                  if (!confirmed) {
                    setSelectedOption(index);
                  }
                }}
                disabled={confirmed}
                className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${style}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="dark:text-white font-medium">
                    {option}
                  </span>

                  {confirmed && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                  )}

                  {confirmed && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Botão de Ação */}
        <div className="mt-8">
          {!confirmed ? (
            <button
              onClick={handleConfirm}
              disabled={selectedOption === null}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 text-white px-6 py-4 rounded-2xl font-bold transition-all"
            >
              Confirmar resposta
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all"
            >
              {currentIndex + 1 >= shuffledQuestions.length
                ? "Finalizar Simulado"
                : "Próxima Questão"}

              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}