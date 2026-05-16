import React, { useState, useMemo } from "react";
import { Search, Filter, ChevronDown } from "lucide-react";
import TopicCard from "../components/TopicCard";
import type { Topic } from "../types";

import topicsData from "../data/allTopics";

export default function Topics() {
  // Carrega direto do JSON
  const [topics] = useState<Topic[]>(topicsData as Topic[]);

  const [search, setSearch] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<string>("Todos");

  const loading = false;

  // Normaliza texto para evitar problema com acento
  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  // Filtro otimizado
  const filteredTopics = useMemo(() => {
    return topics.filter((topic) => {
      const normalizedSearch = normalizeText(search);

      const matchesSearch =
        normalizeText(topic.title).includes(normalizedSearch) ||
        normalizeText(topic.description || "").includes(normalizedSearch);

      const matchesDifficulty =
        selectedDifficulty === "Todos" ||
        normalizeText(topic.difficulty) ===
          normalizeText(selectedDifficulty);

      return matchesSearch && matchesDifficulty;
    });
  }, [topics, search, selectedDifficulty]);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-0">
      <header className="mb-10 text-center lg:text-left pt-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4 break-words">
          Assuntos
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
          Navegue pela nossa biblioteca de assuntos matemáticos.
        </p>
      </header>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {/* Campo de Busca */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />

          <input
            type="text"
            placeholder="Pesquisar por assunto..."
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 dark:text-white rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filtro */}
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
          </select>

          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 rounded-2xl h-64 animate-pulse border border-slate-100 dark:border-slate-800"
            />
          ))}
        </div>
      ) : filteredTopics.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTopics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 text-center border border-dashed border-slate-300 dark:border-slate-700">
          <p className="text-slate-500 dark:text-slate-400 font-medium break-words">
            Nenhum assunto encontrado para:
            <span className="font-bold"> "{search || selectedDifficulty}"</span>
          </p>
        </div>
      )}
    </div>
  );
}