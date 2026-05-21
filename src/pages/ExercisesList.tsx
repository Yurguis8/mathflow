import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom"; // Mudamos o Link para useNavigate

import {
  Calculator,
  ChevronRight,
  CheckCircle2,
  Search,
  Filter,
  ChevronDown,
  X,
  Award,
  GraduationCap
} from "lucide-react";

import type { Topic } from "../types";
import topicsData from "../data/allTopics";

export default function ExercisesList() {
  const navigate = useNavigate();
  const [topics] = useState<Topic[]>(topicsData);
  const [search, setSearch] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("Todos");

  // Estados para o Modal de Configuração do Treino
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTopic, setActiveTopic] = useState<Topic | null>(null);
  const [modalLevel, setModalLevel] = useState("Todos");
  const [onlyEnem, setOnlyEnem] = useState(false);

  const loading = false;

  // NORMALIZA TEXTO
  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  // FILTRO DA LISTA PRINCIPAL
const filteredTopics = useMemo(() => {
  return topics.filter((topic) => {
    // 1. IGNORA TOTALMENTE OS TÓPICOS DO ENEM
    // Se o id ou o title do tópico contiver "enem", ele é pulado e não entra na lista
    if (
      topic.id.toLowerCase().includes("enem") || 
      topic.title.toLowerCase().includes("enem")
    ) {
      return false;
    }

    // 2. ABAIXO SEGUE A SUA LÓGICA DE FILTRO DO CODIGO ORIGINAL:
    const normalizedSearch = normalizeText(search);

    const matchesSearch =
      normalizeText(topic.title).includes(normalizedSearch) ||
      normalizeText(topic.description).includes(normalizedSearch);

    const matchesDifficulty =
      selectedDifficulty === "Todos" ||
      topic.difficulty === selectedDifficulty;

    return matchesSearch && matchesDifficulty;
  });
}, [topics, search, selectedDifficulty]);

  // ABRE AS OPÇÕES DO TÓPICO
  const handleTopicClick = (topic: Topic) => {
    setActiveTopic(topic);
    setModalLevel("Todos"); // Valor padrão inicial no modal
    setOnlyEnem(false);     // Padrão desativado
    setIsModalOpen(true);
  };

  // INICIA O PLAYER ENVIANDO OS FILTROS REAIS DO EXERCÍCIO
  const handleStartPractice = () => {
    if (!activeTopic) return;
    
    setIsModalOpen(false);
    navigate(`/exercises/${activeTopic.area}/${activeTopic.id}`, {
      state: {
        selectedLevel: modalLevel,
        onlyEnem: onlyEnem
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-0 relative">
      {/* HEADER */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-600 rounded-md shrink-0">
            <Calculator className="text-white w-6 h-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white tracking-tight break-words">
            Praticar Exercícios
          </h1>
        </div>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
          Escolha um assunto abaixo para testar seus conhecimentos.
        </p>
      </header>

      {/* BUSCA + FILTRO */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {/* PESQUISA */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Pesquisar exercício..."
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 dark:text-white rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* FILTRO DE DIFICULDADE DO TÓPICO */}
        <div className="relative w-full md:w-64 shrink-0">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
          <select
            className="appearance-none w-full pl-12 pr-12 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-600 dark:text-slate-300 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-colors"
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
          >
            <option value="Todos">Todas as dificuldades</option>
            <option value="Fácil">Fácil</option>
            <option value="Médio">Médio</option>
            <option value="Difícil">Difícil</option>
            <option value="Olímpico">Olímpico</option> {/* ADICIONADO ADICIONAL OLÍMPICO */}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* LISTA DE TÓPICOS */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 rounded-2xl h-24 animate-pulse border border-slate-100 dark:border-slate-800"
            />
          ))}
        </div>
      ) : filteredTopics.length > 0 ? (
        <div className="grid gap-4">
          {filteredTopics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => handleTopicClick(topic)}
              className="w-full text-left bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg hover:shadow-blue-500/5 transition-all"
            >
              <div className="flex items-start sm:items-center gap-4 sm:gap-6 min-w-0">
                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 flex items-center justify-center rounded-xl shrink-0 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/40 transition-colors">
                  <Calculator className="w-6 h-6 text-slate-400 dark:text-slate-600 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                </div>

                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors break-words">
                    {topic.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-slate-500 dark:text-slate-400">
                    <span>{topic.difficulty}</span>
                    <span className="hidden sm:block text-slate-300 dark:text-slate-700">•</span>
                    <span className="flex items-center gap-1 whitespace-nowrap">
                      <CheckCircle2 className="w-3 h-3 text-green-500 shrink-0" />
                      Pronto para personalizar
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs sm:text-sm uppercase tracking-widest opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0">
                <span>Configurar</span>
                <ChevronRight className="w-5 h-5" />
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 text-center border border-dashed border-slate-300 dark:border-slate-700">
          <p className="text-slate-500 dark:text-slate-400 font-medium break-words">
            Nenhum exercício encontrado para:
            <span className="font-bold"> "{search || selectedDifficulty}"</span>
          </p>
        </div>
      )}

      {/* MODAL INTERMEDIÁRIO DE CONFIGURAÇÃO */}
      {isModalOpen && activeTopic && (
        <div className="fixed inset-0 bg-slate-900/45 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
              Configurar Exercícios
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              {activeTopic.title}
            </p>

            {/* SELEÇÃO DE DIFICULDADE DO EXERCÍCIO */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">
                Dificuldade das Questões
              </label>
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                <select
                  className="appearance-none w-full pl-11 pr-10 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  value={modalLevel}
                  onChange={(e) => setModalLevel(e.target.value)}
                >
                  <option value="Todos">Todas as dificuldades (Misturado)</option>
                  <option value="Fácil">Apenas Fácil</option>
                  <option value="Médio">Apenas Médio</option>
                  <option value="Difícil">Apenas Difícil</option>
                  <option value="Olímpico">Apenas Olímpico (OBMEP)</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* FILTRO DE APENAS ENEM */}
            <div className="mb-6">
              <label className="relative flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer group select-none transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
                <input
                  type="checkbox"
                  className="accent-blue-600 w-4 h-4 cursor-pointer"
                  checked={onlyEnem}
                  onChange={(e) => setOnlyEnem(e.target.checked)}
                />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-blue-600" />
                    Filtrar apenas questões do ENEM
                  </span>
                  <span className="text-xs text-slate-400 mt-0.5">
                    Ignora questões autorais ou de vestibulares comuns.
                  </span>
                </div>
              </label>
            </div>

            {/* BOTÕES */}
            <div className="flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 py-3 rounded-xl text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700/80 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleStartPractice}
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl text-sm font-bold hover:bg-blue-700 shadow-md shadow-blue-600/10 transition-colors"
              >
                Iniciar Treino
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}