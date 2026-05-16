import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  ChevronRight,
  HelpCircle,
  Trophy,
} from "lucide-react";

import { motion, AnimatePresence } from "motion/react";

import type { Exercise } from "../types";

import allExercises from "../data/allExercises";

export default function ExercisePlayer() {
  const { topicId } = useParams();

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [selectedOption, setSelectedOption] =
    useState<number | null>(null);

  const [showResolution, setShowResolution] = useState(false);

  const [isCorrect, setIsCorrect] =
    useState<boolean | null>(null);

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

  // CARREGA EXERCÍCIOS
  useEffect(() => {
    if (topicId) {
      const filteredExercises = allExercises.filter(
        (exercise: any) => exercise.topicId === topicId
      );

      setExercises(filteredExercises);
    }

    setLoading(false);
  }, [topicId]);

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
      await fetch(
        "https://mathflow-l58o.onrender.com/progress/save",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(progressData),
        }
      );
    } catch (error) {
      console.error("Erro ao salvar progresso:", error);
    }
  };

  const handleOptionSelect = (idx: number) => {
    if (selectedOption !== null) return;

    setSelectedOption(idx);

    const correct =
      idx === exercises[currentIndex].correctIndex;

    setIsCorrect(correct);

    if (correct) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    const isLast =
      currentIndex + 1 === exercises.length;

    saveProgressToDB(isLast);

    if (!isLast) {
      setCurrentIndex((prev) => prev + 1);

      setSelectedOption(null);

      setIsCorrect(null);

      setShowResolution(false);
    } else {
      setFinished(true);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Carregando exercícios...
      </div>
    );
  }

  if (!exercises.length) {
    return (
      <div className="p-8 text-center text-slate-500">
        Nenhum exercício encontrado.
      </div>
    );
  }

  // FINALIZADO
  if (finished) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center">
          <div className="w-20 h-20 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10" />
          </div>

          <h2 className="text-3xl font-bold mb-2">
            Excelente trabalho!
          </h2>

          <p className="text-slate-600 mb-8">
            Seu progresso foi salvo.
          </p>

          <div className="bg-slate-50 rounded-2xl p-6 mb-8 flex justify-around">
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold">
                Acertos
              </p>

              <p className="text-3xl font-bold text-blue-600">
                {score} / {exercises.length}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400 uppercase font-bold">
                Tempo
              </p>

              <p className="text-3xl font-bold text-green-600">
                {Math.floor(seconds / 60)}m {seconds % 60}s
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <Link
              to="/exercises"
              className="flex-1 bg-slate-100 py-4 rounded-xl font-bold"
            >
              Voltar
            </Link>

            <Link
              to="/"
              className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentExercise = exercises[currentIndex];

  const progress =
    ((currentIndex + 1) / exercises.length) * 100;

  return (
    <div className="max-w-4xl mx-auto px-4 pb-24">
      <div className="flex items-center justify-between mb-8 pt-4">
        <Link
          to="/exercises"
          className="flex items-center gap-2 text-slate-500"
        >
          <ArrowLeft className="w-4 h-4" />
          Sair
        </Link>

        <span className="text-sm font-bold text-slate-400 uppercase">
          Questão {currentIndex + 1} de {exercises.length}
        </span>
      </div>

      <div className="w-full h-2 bg-slate-200 rounded-full mb-10 overflow-hidden">
        <motion.div
          animate={{ width: `${progress}%` }}
          className="h-full bg-blue-600"
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          className="bg-white rounded-3xl p-8 border border-slate-200"
        >
          <h2 className="text-2xl font-semibold mb-8 whitespace-pre-wrap">
            {currentExercise.question}
          </h2>

          <div className="space-y-4">
            {currentExercise.options.map((option, idx) => {
              const isSelected = selectedOption === idx;

              const isCorrectTarget =
                idx === currentExercise.correctIndex;

              let style =
                "border-slate-200 hover:border-blue-400 hover:bg-blue-50";

              if (selectedOption !== null) {
                if (isCorrectTarget) {
                  style =
                    "border-green-500 bg-green-50 text-green-700";
                } else if (isSelected) {
                  style =
                    "border-red-500 bg-red-50 text-red-700";
                } else {
                  style = "opacity-50";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  disabled={selectedOption !== null}
                  className={`w-full p-5 rounded-2xl border-2 text-left transition-all ${style}`}
                >
                  <div className="flex justify-between items-center gap-4">
                    <span>{option}</span>

                    {selectedOption !== null &&
                      isCorrectTarget && (
                        <CheckCircle2 className="text-green-600" />
                      )}

                    {isSelected &&
                      !isCorrectTarget && (
                        <XCircle className="text-red-600" />
                      )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-10 flex flex-col gap-4">
            <button
              onClick={() =>
                setShowResolution(!showResolution)
              }
              disabled={selectedOption === null}
              className="text-blue-600 font-bold flex items-center gap-2"
            >
              <HelpCircle className="w-4 h-4" />

              {showResolution
                ? "Esconder resolução"
                : "Ver resolução"}
            </button>

            {selectedOption !== null && (
              <button
                onClick={handleNext}
                className="bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
              >
                {currentIndex + 1 === exercises.length
                  ? "Finalizar"
                  : "Próxima questão"}

                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>

          <AnimatePresence>
            {showResolution && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: "auto",
                  opacity: 1,
                }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-200 whitespace-pre-wrap">
                  <p className="font-bold mb-3">
                    Explicação:
                  </p>

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