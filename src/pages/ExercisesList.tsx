import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calculator, ChevronRight, CheckCircle2 } from "lucide-react";
import type { Topic } from "../types";

export default function ExercisesList() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/topics")
      .then((res) => res.json())
      .then((data) => {
        setTopics(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-600 rounded-md">
             <Calculator className="text-white w-6 h-6" />
          </div>
          <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
            Praticar Exercícios
          </h1>
        </div>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
          Escolha um assunto abaixo para testar seus conhecimentos. O progresso é salvo automaticamente no seu navegador.
        </p>
      </header>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl h-24 animate-pulse border border-slate-100 dark:border-slate-800" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4">
          {topics.map((topic) => (
            <Link
              key={topic.id}
              to={`/exercises/${topic.id}`}
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between group hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg hover:shadow-blue-500/5 transition-all"
            >
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 flex items-center justify-center rounded-xl group-hover:bg-blue-50 dark:group-hover:bg-blue-900/40 transition-colors">
                   <Calculator className="w-6 h-6 text-slate-400 dark:text-slate-600 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {topic.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-slate-500 dark:text-slate-400">
                    <span>{topic.difficulty}</span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                      Pronto para iniciar
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Praticar</span>
                <ChevronRight className="w-5 h-5" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
