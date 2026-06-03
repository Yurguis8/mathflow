import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Search,
  Clock3,
  ArrowUp10,
  Play,
  Shuffle,
  ChevronDown,
  Calendar,
  ChevronUp,
  Filter,
  Layers,
  SlidersHorizontal,
  BookOpen
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
  const [yearFilter, setYearFilter] = useState("Todos");
  
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

  const handleStartSimulation = () => {
    // 1. Pega todas as questões dos tópicos selecionados
    let pool = allExercises.filter((ex) => selectedTopics.includes(ex.topicId));
    console.log("Total de questões encontradas nos tópicos selecionados:", pool.length);

    // 2. Filtra por Dificuldade
    if (difficultyFilter !== "Todos") {
      pool = pool.filter((ex) => {
        if (!ex.difficulty) return false;
        return normalizeText(ex.difficulty) === normalizeText(difficultyFilter);
      });
      console.log("Sobraram após filtro de Dificuldade:", pool.length);
    }

    // 3. Filtra por Origem
    if (sourceFilter !== "Todos") {
      pool = pool.filter((ex) => {
        if (!ex.source) return false;
        return normalizeText(ex.source) === normalizeText(sourceFilter);
      });
      console.log("Sobraram após filtro de Origem:", pool.length);
    }

    // 4. Filtra por Ano
    if (yearFilter !== "Todos") {
      pool = pool.filter((ex) => {
        if (ex.year && String(ex.year) === yearFilter) return true;
        
        const idStr = ex.id ? String(ex.id).toLowerCase() : "";
        const questionStr = ex.question ? String(ex.question).toLowerCase() : "";
        return idStr.includes(yearFilter.toLowerCase()) || questionStr.includes(yearFilter.toLowerCase());
      });
      console.log("Sobraram após filtro de Ano:", pool.length);
    }

    if (pool.length === 0) {
      alert("Nenhuma questão encontrada com os filtros selecionados para estes tópicos.");
      return;
    }

    // 5. Ordenação Aleatória ou Padrão
    if (randomMode) {
      pool = [...pool].sort(() => Math.random() - 0.5);
    }

    // 6. Limita a quantidade máxima pedida pelo usuário
    const selectedQuestions = pool.slice(0, questionCount);
    console.log("Total final enviado para o player:", selectedQuestions.length);

    // 7. Navega enviando os dados para a ROTA CORRETA
    navigate("/simulados/play", {
      state: {
        questions: selectedQuestions,
        time: time,
        topics: selectedTopics,
        difficulty: difficultyFilter,
        source: sourceFilter,
        year: yearFilter
      },
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-8">
      {/* HEADER PROFISSIONAL */}
      <header className="mb-10 text-center sm:text-left flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
            Área de Simulados
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Configure parâmetros e monte um caderno de questões sob medida para seus estudos.
          </p>
        </div>
      </header>

      {/* SEÇÃO 1: CONFIGURAÇÕES DO SIMULADO */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4 text-slate-800 dark:text-slate-200">
          <SlidersHorizontal className="w-4 h-4 text-brand-main" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            1. Parâmetros da Prova
          </h2>
        </div>

        {/* BARRA UNIFICADA DE FILTROS - Sem sub-blocos exagerados */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-custom-lg p-5 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            
            {/* QUANTIDADE DE QUESTÕES */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <ArrowUp10 className="w-3.5 h-3.5 text-slate-400" /> N° Questões
              </label>
              <input
                type="number"
                min={1}
                max={200}
                value={questionCount}
                onChange={(e) => setQuestionCount(Math.max(1, Number(e.target.value)))}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-custom-md px-3 py-2 outline-none font-medium text-slate-800 dark:text-white text-sm focus:border-brand-main focus:ring-1 focus:ring-brand-main transition-all"
              />
            </div>

            {/* TEMPO EM MINUTOS */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <Clock3 className="w-3.5 h-3.5 text-slate-400" /> Duração (min)
              </label>
              <input
                type="number"
                min={1}
                max={600}
                value={time}
                onChange={(e) => setTime(Math.max(1, Number(e.target.value)))}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-custom-md px-3 py-2 outline-none font-medium text-slate-800 dark:text-white text-sm focus:border-brand-main focus:ring-1 focus:ring-brand-main transition-all"
              />
            </div>

            {/* FILTRO DE DIFICULDADE */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-slate-400" /> Dificuldade
              </label>
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-custom-md px-3 py-2 outline-none font-medium text-slate-800 dark:text-white text-sm focus:border-brand-main focus:ring-1 focus:ring-brand-main transition-all cursor-pointer dynamic-select"
              >
                <option value="Todos">Misturar Níveis</option>
                <option value="Fácil">Fácil</option>
                <option value="Médio">Médio</option>
                <option value="Difícil">Difícil</option>
                <option value="Olímpico">Olímpico</option>
              </select>
            </div>

            {/* FILTRO DE ORIGEM */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-slate-400" /> Origem
              </label>
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-custom-md px-3 py-2 outline-none font-medium text-slate-800 dark:text-white text-sm focus:border-brand-main focus:ring-1 focus:ring-brand-main transition-all cursor-pointer dynamic-select"
              >
                <option value="Todos">Todas as Bancas</option>
                <option value="vestibulares">ENEM / Vestibulares</option>
                <option value="autoral">Autorais</option>
              </select>
            </div>

            {/* FILTRO DE ANO */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Ano do Exame
              </label>
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-custom-md px-3 py-2 outline-none font-medium text-slate-800 dark:text-white text-sm focus:border-brand-main focus:ring-1 focus:ring-brand-main transition-all cursor-pointer dynamic-select"
              >
                <option value="Todos">Todos os Anos</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
              </select>
            </div>

            {/* ORDENAÇÃO */}
            <div className="flex flex-col gap-1.5 justify-end">
              <button
                type="button"
                onClick={() => setRandomMode(!randomMode)}
                className={`w-full py-2 px-3 rounded-custom-md font-semibold text-sm border transition-all flex items-center justify-center gap-2 h-[38px] ${
                  randomMode
                    ? "bg-brand-main border-brand-main text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                <Shuffle className="w-3.5 h-3.5" />
                {randomMode ? "Aleatória" : "Padrão"}
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* SEÇÃO 2: SELEÇÃO DE ASSUNTOS */}
      <section className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-brand-main" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              2. Selecione os Tópicos
            </h2>
            <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2.5 py-0.5 rounded-full font-medium">
              {selectedTopics.length} selecionado(s)
            </span>
          </div>

          {/* BOTÃO SELECIONAR TODOS (Estilo discreto e profissional) */}
          <button
            type="button"
            onClick={() => {
              const allFilteredIds = filteredTopics.map(t => t.id);
              const isAllSelected = allFilteredIds.every(id => selectedTopics.includes(id));
              
              if (isAllSelected) {
                setSelectedTopics(prev => prev.filter(id => !allFilteredIds.includes(id)));
              } else {
                setSelectedTopics(prev => {
                  const uniqueIds = new Set([...prev, ...allFilteredIds]);
                  return Array.from(uniqueIds);
                });
              }
            }}
            className="text-xs font-semibold text-brand-main hover:text-brand-dark transition-colors self-end sm:self-auto"
          >
            {filteredTopics.map(t => t.id).every(id => selectedTopics.includes(id)) 
              ? "Desmarcar todos os resultados" 
              : "Selecionar todos os resultados"}
          </button>
        </div>

        {/* BARRA DE BUSCA COMPACTA */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar por assunto ex: Álgebra, Cinemática..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-custom-md py-2.5 pl-11 pr-4 outline-none focus:ring-1 focus:ring-brand-main focus:border-brand-main dark:text-white text-sm transition-all shadow-sm"
          />
        </div>

        {/* GRID DE CARDS CORRIGIDO (Bug de cores resolvido aqui) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {displayedTopics.map((topic) => {
            const selected = selectedTopics.includes(topic.id);

            return (
              <button
                key={topic.id}
                onClick={() => toggleTopic(topic.id)}
                // CORREÇÃO DO BUG: Forçado bg-white / bg-slate-900 explicitamente quando falso
                className={`text-left p-4 rounded-custom-lg border transition-all flex items-start gap-3 h-24 shadow-sm ${
                  selected
                    ? "bg-brand-main border-brand-main text-white shadow-md shadow-brand-main/10 dark:bg-brand-dark dark:border-brand-dark"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-brand-main dark:hover:border-brand-main"
                }`}
              >
                {/* CHECKBOX CUSTOMIZADO */}
                <div 
                  className={`w-4 h-4 shrink-0 mt-0.5 rounded border flex items-center justify-center text-[10px] font-bold transition-all ${
                    selected 
                      ? "bg-white border-white text-brand-main" 
                      : "border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800"
                  }`}
                >
                  {selected && "✓"}
                </div>

                {/* TEXTOS */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm truncate tracking-tight mb-0.5">{topic.title}</h3>
                  <p
                    className={`text-xs leading-normal line-clamp-2 ${
                      selected ? "text-brand-light/90" : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {topic.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* PAGINAÇÃO DE VER MAIS ASSUNTOS */}
      {search.trim() === "" && filteredTopics.length > 6 && (
        <div className="flex justify-center mb-10">
          <button
            onClick={() => setShowAllTopics(!showAllTopics)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-custom-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium transition-all shadow-sm"
          >
            {showAllTopics ? (
              <>
                Ocultar tópicos extras <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                Mostrar mais tópicos ({filteredTopics.length - 6}) <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      )}

      {/* BOTÃO PARA INICIAR SIMULADO */}
      <div className="flex justify-center mt-12 border-t border-slate-100 dark:border-slate-800 pt-8">
        <button
          onClick={handleStartSimulation}
          disabled={selectedTopics.length === 0}
          className="w-full sm:w-auto bg-brand-main hover:bg-brand-dark disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed text-white px-10 py-3.5 rounded-custom-md font-bold transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-brand-main/15 static"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          Gerar e Iniciar Prova
        </button>
      </div>
    </div>
  );
}