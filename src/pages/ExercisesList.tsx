import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";

import {
  Calculator,
  ChevronRight,
  CheckCircle2,
  Search,
  Filter,
  ChevronDown,
} from "lucide-react";

import type { Topic } from "../types";

import topicsData from "../data/allTopics";

export default function ExercisesList() {
  const [topics] = useState<Topic[]>(topicsData);

  const [search, setSearch] = useState("");

  const [selectedDifficulty, setSelectedDifficulty] =
    useState("Todos");

  const loading = false;

  // NORMALIZA TEXTO
  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  // FILTRO
  const filteredTopics = useMemo(() => {
    return topics.filter((topic) => {
      const normalizedSearch = normalizeText(search);

      const matchesSearch =
        normalizeText(topic.title).includes(
          normalizedSearch
        ) ||
        normalizeText(topic.description || "").includes(
          normalizedSearch
        );

      const matchesDifficulty =
        selectedDifficulty === "Todos" ||
        normalizeText(topic.difficulty) ===
          normalizeText(selectedDifficulty);

      return matchesSearch && matchesDifficulty;
    });
  }, [topics, search, selectedDifficulty]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-0">
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
          Escolha um assunto abaixo para testar seus
          conhecimentos.
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
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        {/* FILTRO */}
        <div className="relative w-full md:w-64 shrink-0">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />

          <select
            className="appearance-none w-full pl-12 pr-12 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-600 dark:text-slate-300 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-colors"
            value={selectedDifficulty}
            onChange={(e) =>
              setSelectedDifficulty(e.target.value)
            }
          >
            <option value="Todos">
              Todas as dificuldades
            </option>

            <option value="Fácil">Fácil</option>

            <option value="Médio">Médio</option>

            <option value="Difícil">Difícil</option>
          </select>

          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* LOADING */}
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
            <Link
              key={topic.id}
              to={`/exercises/${topic.id}`}
              className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg hover:shadow-blue-500/5 transition-all"
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
                    <span>
                      {topic.difficulty}
                    </span>

                    <span className="hidden sm:block text-slate-300 dark:text-slate-700">
                      •
                    </span>

                    <span className="flex items-center gap-1 whitespace-nowrap">
                      <CheckCircle2 className="w-3 h-3 text-green-500 shrink-0" />
                      Pronto para iniciar
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs sm:text-sm uppercase tracking-widest opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0">
                <span>Praticar</span>

                <ChevronRight className="w-5 h-5" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 text-center border border-dashed border-slate-300 dark:border-slate-700">
          <p className="text-slate-500 dark:text-slate-400 font-medium break-words">
            Nenhum exercício encontrado para:
            <span className="font-bold">
              {" "}
              "{search || selectedDifficulty}"
            </span>
          </p>
        </div>
      )}
    </div>
  );
}