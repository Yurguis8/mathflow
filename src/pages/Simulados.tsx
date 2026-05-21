import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Search,
  Clock3,
  ArrowUp10,
  Play,
  Shuffle,
  ChevronDown,
  ChevronUp,
  Filter,
  Layers
} from "lucide-react";

import topicsData from "../data/allTopics";
import allExercises from "../data/allExercises";

export default function Simulados() {
  const navigate = useNavigate();

  // Configurações básicas
  const [search, setSearch] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState(10);
  const [time, setTime] = useState(30);
  const [randomMode, setRandomMode] = useState(true);

  // NOVOS FILTROS PEDIDOS (Dificuldade e Origem)
  const [difficultyFilter, setDifficultyFilter] = useState("Todos");
  const [sourceFilter, setSourceFilter] = useState("Todos");
  
  // Estado para controlar a expansão dos assuntos
  const [showAllTopics, setShowAllTopics] = useState(false);

  // Filtragem de tópicos pela barra de pesquisa
  const filteredTopics = useMemo(() => {
    return topicsData.filter((topic) =>
      topic.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  // Paginação dos assuntos (Ver Mais / Ver Menos)
  const displayedTopics = useMemo(() => {
    if (search.trim() !== "") return filteredTopics;
    return showAllTopics ? filteredTopics : filteredTopics.slice(0, 6);
  }, [filteredTopics, showAllTopics, search]);

  function toggleTopic(id: string) {
    if (selectedTopics.includes(id)) {
      setSelectedTopics((prev) => prev.filter((topicId) => topicId !== id));
    } else {
      setSelectedTopics((prev) => [...prev, id]);
    }
  }

  // Função auxiliar para padronizar e comparar os textos de filtros
  const normalizeText = (text: string) =>
    text ? text.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : "";

function handleStartSimulation() {
  if (selectedTopics.length === 0) return;

  // 1. Cria um novo array com os IDs selecionados convertidos para minúsculas
  const selectedTopicsLower = selectedTopics.map(id => id.toLowerCase().trim());

  // Filtra as questões comparando os textos normalizados
  let filteredQuestions = allExercises.filter((exercise) => {
    const exerciseTopicId = (exercise.topicId || exercise.topic || "").toLowerCase().trim();
    return selectedTopicsLower.includes(exerciseTopicId);
  });

  // 2. Filtra por Dificuldade (se não for "Todos")
  if (difficultyFilter !== "Todos") {
    filteredQuestions = filteredQuestions.filter(
      (exercise) => normalizeText(exercise.difficulty) === normalizeText(difficultyFilter)
    );
  }

  // 3. Filtra por Origem
  if (sourceFilter === "vestibulares") {
    filteredQuestions = filteredQuestions.filter(
      (exercise) => exercise.source && normalizeText(exercise.source) !== "autoral"
    );
  } else if (sourceFilter === "autoral") {
    filteredQuestions = filteredQuestions.filter(
      (exercise) => exercise.source && normalizeText(exercise.source) === "autoral"
    );
  }

  // Validação caso a combinação de filtros resulte em zero questões
  if (filteredQuestions.length === 0) {
    alert("Nenhuma questão foi encontrada com esses filtros para os assuntos selecionados.");
    return;
  }

    // 4. Aplica a ordem aleatória se estiver ativa
    if (randomMode) {
      filteredQuestions = [...filteredQuestions].sort(() => Math.random() - 0.5);
    }

    // 5. Corta para a quantidade desejada pelo usuário
    const finalQuestions = filteredQuestions.slice(0, questionCount);

    // Redireciona para o player usando o caminho correspondente à sua rota
    navigate("/simulados/play", {
      state: {
        questions: finalQuestions,
        time: time,
      },
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-0 pb-24">
      {/* HEADER */}
      <header className="mb-10 pt-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
          Criar Simulado
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-3xl leading-relaxed">
          Monte seu próprio simulado escolhendo os assuntos, a dificuldade, a origem das questões e o tempo de prova.
        </p>
      </header>

      {/* GRID DE PARÂMETROS - Bordas suaves rounded-md */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 mb-8">
        
        {/* QUANTIDADE DE QUESTÕES */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md p-5">
          <div className="flex items-center gap-2.5 mb-3">
            <ArrowUp10 className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-sm uppercase text-slate-500 dark:text-slate-400 tracking-wider">
              Questões
            </h2>
          </div>
          <input
            type="number"
            min={1}
            max={200}
            value={questionCount}
            onChange={(e) => setQuestionCount(Math.max(1, Number(e.target.value)))}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-3 py-2.5 outline-none font-medium text-slate-800 dark:text-white focus:border-blue-500 transition-colors"
          />
        </div>

        {/* TEMPO EM MINUTOS */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md p-5">
          <div className="flex items-center gap-2.5 mb-3">
            <Clock3 className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-sm uppercase text-slate-500 dark:text-slate-400 tracking-wider">
              Tempo (min)
            </h2>
          </div>
          <input
            type="number"
            min={1}
            max={600}
            value={time}
            onChange={(e) => setTime(Math.max(1, Number(e.target.value)))}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-3 py-2.5 outline-none font-medium text-slate-800 dark:text-white focus:border-blue-500 transition-colors"
          />
        </div>

        {/* FILTRO DE DIFICULDADE */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md p-5">
          <div className="flex items-center gap-2.5 mb-3">
            <Filter className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-sm uppercase text-slate-500 dark:text-slate-400 tracking-wider">
              Dificuldade
            </h2>
          </div>
          <select
  value={difficultyFilter}
  onChange={(e) => setDifficultyFilter(e.target.value)}
  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-3 py-2.5 outline-none font-medium text-slate-800 dark:text-white focus:border-blue-500 transition-colors cursor-pointer"
>
  <option value="Todos">Misturar Níveis</option>
  <option value="Fácil">Fácil (Verde)</option>
  <option value="Médio">Médio (Amarelo)</option>
  <option value="Difícil">Difícil (Vermelho)</option>
  <option value="Olímpico">Olímpico (Roxo e Dourado)</option>
</select>
        </div>

        {/* FILTRO DE ORIGEM (SOURCER) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md p-5">
          <div className="flex items-center gap-2.5 mb-3">
            <Layers className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-sm uppercase text-slate-500 dark:text-slate-400 tracking-wider">
              Origem
            </h2>
          </div>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-3 py-2.5 outline-none font-medium text-slate-800 dark:text-white focus:border-blue-500 transition-colors cursor-pointer"
          >
            <option value="Todos">Todas (ENEM + Autorais)</option>
            <option value="vestibulares">Apenas Vestibulares / ENEM</option>
            <option value="autoral">Apenas Questoes Autorais</option>
          </select>
        </div>

        {/* ORDENAÇÃO */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md p-5">
          <div className="flex items-center gap-2.5 mb-3">
            <Shuffle className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-sm uppercase text-slate-500 dark:text-slate-400 tracking-wider">
              Ordem
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setRandomMode(!randomMode)}
            className={`w-full py-2 rounded-md font-bold text-sm border transition-all ${
              randomMode
                ? "bg-blue-600 border-blue-600 text-white"
                : "bg-slate-100 dark:bg-slate-800 border-transparent dark:text-white"
            }`}
          >
            {randomMode ? "Aleatória" : "Padrão"}
          </button>
        </div>
      </div>

      {/* INPUT DE PESQUISA POR ASSUNTO */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Pesquisar assuntos para incluir no simulado..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
        />
      </div>

      {/* OPÇÃO DE SELECIONAR TODOS OS ASSUNTOS FILTRADOS */}
<div className="flex justify-end mb-4">
  <button
    type="button"
    onClick={() => {
      const allDisplayedIds = displayedTopics.map(t => t.id);
      const isAllSelected = allDisplayedIds.every(id => selectedTopics.includes(id));
      
      if (isAllSelected) {
        // Se todos já estão selecionados, remove apenas os que estão aparecendo na tela
        setSelectedTopics(prev => prev.filter(id => !allDisplayedIds.includes(id)));
      } else {
        // Caso contrário, adiciona todos os que estão aparecendo sem duplicar
        setSelectedTopics(prev => {
          const uniqueIds = new Set([...prev, ...allDisplayedIds]);
          return Array.from(uniqueIds);
        });
      }
    }}
    className="text-xs font-bold uppercase tracking-wider bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-md transition-colors border border-slate-200 dark:border-slate-700"
  >
    {displayedTopics.map(t => t.id).every(id => selectedTopics.includes(id)) 
      ? "Desmarcar Todos do Filtro" 
      : "Selecionar Todos do Filtro"}
  </button>
</div>

{/* GRID DE SELEÇÃO DE ASSUNTOS (COMPACTO, COM CHECKBOX E ALTURA IGUAL) */}
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 mb-6">
  {displayedTopics.map((topic) => {
    const selected = selectedTopics.includes(topic.id);

    return (
      <button
        key={topic.id}
        onClick={() => toggleTopic(topic.id)}
        className={`text-left p-3.5 rounded-md border h-24 overflow-hidden transition-all flex items-start gap-3 ${
          selected
            ? "bg-blue-600 border-blue-600 text-white shadow-sm"
            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 dark:text-white hover:border-blue-400"
        }`}
      >
        {/* QUADRADINHO DE MARCAÇÃO (CHECKBOX) */}
        <div 
          className={`w-4 h-4 shrink-0 mt-0.5 rounded-sm border flex items-center justify-center text-[10px] font-bold transition-colors ${
            selected 
              ? "bg-white border-white text-blue-600" 
              : "border-slate-300 dark:border-slate-700 bg-transparent"
          }`}
        >
          {selected && "✓"}
        </div>

        {/* TEXTOS COMPACTOS */}
        <div className="flex-1 min-w-0 h-full flex flex-col justify-center">
          <h3 className="font-bold text-sm mb-0.5 truncate">{topic.title}</h3>
          <p
            className={`text-xs leading-relaxed line-clamp-2 ${
              selected ? "text-blue-100" : "text-slate-500 dark:text-slate-400"
            }`}
          >
            {topic.description}
          </p>
        </div>
      </button>
    );
  })}
</div>

      {/* PAGINAÇÃO DE VER MAIS ASSUNTOS */}
      {search.trim() === "" && filteredTopics.length > 6 && (
        <div className="flex justify-center mb-10">
          <button
            onClick={() => setShowAllTopics(!showAllTopics)}
            className="flex items-center gap-2 px-5 py-2 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-semibold transition-all shadow-sm"
          >
            {showAllTopics ? (
              <>
                Ver menos assuntos <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                Ver mais assuntos ({filteredTopics.length - 6} adicionais){" "}
                <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      )}

      {/* BOTÃO PARA INICIAR */}
      <div className="flex justify-center mt-12">
        <button
          onClick={handleStartSimulation}
          disabled={selectedTopics.length === 0}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:cursor-not-allowed text-white px-12 py-4.5 rounded-md font-bold transition-all flex items-center gap-2.5 disabled:shadow-none text-base"
        >
          <Play className="w-4 h-4 fill-current" />
          Iniciar Simulado
        </button>
      </div>
    </div>
  );
}