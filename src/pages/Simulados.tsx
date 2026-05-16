import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ClipboardList,
  Search,
  Clock3,
  ArrowUp10,
  Play,
  Shuffle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import topicsData from "../data/allTopics";
import allExercises from "../data/allExercises";

export default function Simulados() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState(10);
  const [time, setTime] = useState(30);
  const [randomMode, setRandomMode] = useState(true);
  
  // Estado para controlar a expansão dos assuntos
  const [showAllTopics, setShowAllTopics] = useState(false);

  const filteredTopics = useMemo(() => {
    return topicsData.filter((topic) =>
      topic.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  // Se o usuário estiver pesquisando, mostra tudo o que foi filtrado.
  // Caso contrário, respeita o estado de ver mais/ver menos limitando a 5 itens.
  const displayedTopics = useMemo(() => {
    if (search.trim() !== "") return filteredTopics;
    return showAllTopics ? filteredTopics : filteredTopics.slice(0, 5);
  }, [filteredTopics, showAllTopics, search]);

  function toggleTopic(id: string) {
    if (selectedTopics.includes(id)) {
      setSelectedTopics((prev) =>
        prev.filter((topicId) => topicId !== id)
      );
    } else {
      setSelectedTopics((prev) => [...prev, id]);
    }
  }

  function handleStartSimulation() {
    let selectedQuestions: any[] = [];

    selectedQuestions = allExercises.filter((exercise) =>
      selectedTopics.includes(exercise.topicId)
    );

    if (randomMode) {
      selectedQuestions = [...selectedQuestions].sort(
        () => Math.random() - 0.5
      );
    }

    selectedQuestions = selectedQuestions.slice(
      0,
      questionCount
    );

    navigate("/simulados/play", {
      state: {
        questions: selectedQuestions,
        time,
      },
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-0 pb-24">
      <header className="mb-10 pt-8">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white">
            Criar Simulado
          </h1>
        </div>

        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-3xl leading-relaxed">
          Monte seu próprio simulado escolhendo os assuntos,
          quantidade de questões e tempo da prova.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <ArrowUp10 className="w-5 h-5 text-blue-600" />

            <h2 className="font-bold text-lg dark:text-white">
              Quantidade
            </h2>
          </div>

          <input
            type="number"
            min={1}
            max={100}
            value={questionCount}
            onChange={(e) =>
              setQuestionCount(Number(e.target.value))
            }
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-4 outline-none dark:text-white"
          />
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <Clock3 className="w-5 h-5 text-blue-600" />

            <h2 className="font-bold text-lg dark:text-white">
              Tempo (minutos)
            </h2>
          </div>

          <input
            type="number"
            min={1}
            max={300}
            value={time}
            onChange={(e) => setTime(Number(e.target.value))}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-4 outline-none dark:text-white"
          />
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shuffle className="w-5 h-5 text-blue-600" />

            <h2 className="font-bold text-lg dark:text-white">
              Modo
            </h2>
          </div>

          <button
            onClick={() => setRandomMode(!randomMode)}
            className={`w-full py-4 rounded-2xl font-bold transition-all ${
              randomMode
                ? "bg-blue-600 text-white"
                : "bg-slate-100 dark:bg-slate-800 dark:text-white"
            }`}
          >
            {randomMode
              ? "Questões Aleatórias"
              : "Questões na Ordem"}
          </button>
        </div>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />

        <input
          type="text"
          placeholder="Pesquisar assuntos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
        />
      </div>

      {/* Grid de Assuntos */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
        {displayedTopics.map((topic) => {
          const selected = selectedTopics.includes(topic.id);

          return (
            <button
              key={topic.id}
              onClick={() => toggleTopic(topic.id)}
              className={`text-left p-5 rounded-md border transition-all ${
                selected
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 dark:text-white hover:border-blue-400"
              }`}
            >
              <h3 className="font-bold text-lg mb-2">
                {topic.title}
              </h3>

              <p
                className={`text-sm leading-relaxed ${
                  selected
                    ? "text-blue-100"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {topic.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Botão Ver Mais / Ver Menos (só aparece se a busca estiver vazia e houver mais de 5 itens) */}
      {search.trim() === "" && filteredTopics.length > 5 && (
        <div className="flex justify-center mb-10">
          <button
            onClick={() => setShowAllTopics(!showAllTopics)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-semibold transition-all shadow-sm"
          >
            {showAllTopics ? (
              <>
                Ver menos assuntos <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                Ver mais assuntos ({filteredTopics.length - 5} adicionais){" "}
                <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      )}

      <div className="flex justify-center mt-12">
        <button
          onClick={handleStartSimulation}
          disabled={selectedTopics.length === 0}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-10 py-5 rounded-2md font-bold transition-all flex items-center gap-3 shadow-lg shadow-blue-600/20 disabled:shadow-none"
        >
          <Play className="w-5 h-5 fill-current" />
          Iniciar Simulado
        </button>
      </div>
    </div>
  );
}