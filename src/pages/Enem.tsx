import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  GraduationCap,
  ChevronRight,
  CheckCircle2,
  Search,
  X,
  Calendar
} from "lucide-react";

import topicsData from "../data/allTopics";

export default function Enem() {
  const navigate = useNavigate();
  
  // Isola apenas os dados pertencentes à área "enem"
  const enemYears = useMemo(() => {
    return topicsData.filter(topic => topic.area === "enem");
  }, []);

  const [search, setSearch] = useState("");

  // Estados do Modal simplificado
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeYear, setActiveYear] = useState<any>(null);

  // Normalização padrão de texto do seu projeto
  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  // Filtra as edições conforme digitação no campo de busca
  const filteredYears = useMemo(() => {
    return enemYears.filter((year) => {
      const normalizedSearch = normalizeText(search);
      return (
        normalizeText(year.title).includes(normalizedSearch) ||
        normalizeText(year.description || "").includes(normalizedSearch)
      );
    });
  }, [enemYears, search]);

  const handleYearClick = (year: any) => {
    setActiveYear(year);
    setIsModalOpen(true);
  };

  const handleStartPractice = () => {
    if (!activeYear) return;
    setIsModalOpen(false);

    // Envia direto para o ExercisePlayer mantendo os parâmetros originais dele intactos
    navigate(`/exercises/${activeYear.area}/${activeYear.id}`, {
      state: {
        selectedLevel: "Todos", // Passa padrão para não quebrar a lógica interna do Player
        onlyEnem: true          // Garante a ativação fixa do filtro ENEM
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-0 relative">
      {/* HEADER */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shrink-0 shadow-md shadow-blue-500/20">
            <GraduationCap className="text-white w-6 h-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
            Provas do ENEM
          </h1>
        </div>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
          Selecione uma edição do exame para resolver as questões oficiais organizadas por ano de aplicação.
        </p>
      </header>

      {/* BARRA DE PESQUISA */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Pesquisar ano da prova (ex: 2026)..."
          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 dark:text-white rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* LISTAGEM DOS ANOS */}
      {filteredYears.length > 0 ? (
        <div className="grid gap-4">
          {filteredYears.map((year) => (
            <button
              key={year.id}
              onClick={() => handleYearClick(year)}
              className="w-full text-left bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg hover:shadow-blue-500/5 transition-all"
            >
              <div className="flex items-start sm:items-center gap-4 sm:gap-6 min-w-0">
                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 flex items-center justify-center rounded-xl shrink-0 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/40 transition-colors">
                  <Calendar className="w-6 h-6 text-slate-400 dark:text-slate-600 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                </div>

                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {year.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 line-clamp-1 mt-0.5">
                    {year.description}
                  </p>
                  <div className="flex flex-wrap items-center mt-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                      Caderno Oficial de Matemática
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs sm:text-sm uppercase tracking-widest opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0">
                <span>Selecionar</span>
                <ChevronRight className="w-5 h-5" />
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 text-center border border-dashed border-slate-300 dark:border-slate-700">
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Nenhuma edição do ENEM encontrada para a sua busca.
          </p>
        </div>
      )}

      {/* MODAL CONFIGURAÇÃO DIRETA */}
      {isModalOpen && activeYear && (
        <div className="fixed inset-0 bg-slate-900/45 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
              Iniciar Prova Oficial
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Você está prestes a carregar as questões do <span className="font-semibold text-slate-700 dark:text-slate-300">{activeYear.title}</span>.
            </p>

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
                Confirmar e Iniciar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}