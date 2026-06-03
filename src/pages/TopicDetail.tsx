import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Play, FileText, ChevronRight, Activity } from "lucide-react";
import type { Topic } from "../types";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

// IMPORTANTE: Importar os dados locais para buscar o tópico pelo ID
import topicsData from "../data/allTopics";

export default function TopicDetail() {
  const { id } = useParams();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Em vez de fetch, filtramos o tópico diretamente do nosso arquivo JSON
    const foundTopic = topicsData.find((t) => t.id === id);
    
    if (foundTopic) {
      setTopic(foundTopic as Topic);
    }
    
    // Pequeno delay apenas para manter o seu visual de "Carregando"
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center dark:text-white">Carregando...</div>;
  if (!topic) return <div className="p-8 text-center dark:text-white">Assunto não encontrado.</div>;

  return (
    <div className="max-w-4xl mx-auto pb-20 px-4 lg:px-0">
      <Link 
        to={`/areas/${topic.area}`} // Ajustado para voltar para a lista de tópicos
        className="inline-flex items-center gap-2 text-slate-500 hover:text-brand-500 font-medium mb-8 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Voltar para a lista
      </Link>

      <header className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-500 text-xs font-bold uppercase tracking-widest rounded-md">
            {topic.difficulty}
          </span>
          <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">•</span>
          <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">Matemática Básica</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
          {topic.title}
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-light">
          {topic.description}
        </p>
      </header>

      <div className="space-y-12">
        {/* Vídeo */}
        {topic.content?.videoUrl && topic.content?.videoUrl !== "#" ? (
          <section className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 dark:text-white">
              <Play className="w-6 h-6 text-red-600" />
              Videoaula
            </h2>
            <div className="aspect-video rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950 shadow-inner ring-1 ring-slate-200 dark:ring-slate-800">
              <iframe 
                width="100%" 
                height="100%" 
                src={topic.content.videoUrl} 
                title={topic.title}
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              />
            </div>
          </section>
        ) : (
          <div className="w-full h-64 bg-slate-100 dark:bg-slate-800 rounded-xl flex flex-col items-center justify-center p-4 text-center border border-dashed border-slate-300 dark:border-slate-700">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              A explicação em vídeo estará disponível em breve! 🚀
            </p>
          </div>
        )}

        {/* Explicação */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl p-8 lg:p-10 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden relative">
          <div className="absolute top-0 right-4 p-2 text-brand-50 dark:text-brand-500/5 -rotate-12 hidden md:block">
            <FileText className="w-24 h-24" />
          </div>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 dark:text-white">
            <span className="w-8 h-8 bg-brand-500 text-white rounded-md flex items-center justify-center text-sm">1</span>
            Explicação Didática
          </h2>
          <div className="markdown-body text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
            {topic.content?.explanation}
          </div>
        </section>

        {/* Fórmulas e Exemplo */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-900 rounded-xl p-8 text-white shadow-xl">
            <h2 className="text-xl font-bold mb-6 text-brand-500 flex items-center gap-3">
              <Activity className="w-5 h-5" />
              Fórmulas Importantes
            </h2>
            <ul className="space-y-4">
              {topic.content?.formulas?.map((formula, idx) => (
                <li key={idx} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 font-medium ring-1 ring-white/5">
                  <div className="w-2 h-2 rounded-full bg-brand-500 shrink-0 mt-2" />
                  {/* Renderização com KaTeX (LaTeX) */}
                  <div className="text-lg overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700 w-full py-1">
                    <InlineMath math={formula} />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-brand-500 rounded-xl p-8 text-white shadow-xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
              <ChevronRight className="w-5 h-5" />
              Exemplo Resolvido
            </h2>
            <div className="bg-white/10 rounded-xl p-6 border border-white/20 italic text-lg leading-relaxed">
              {topic.content?.example}
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-8 border-t border-slate-200 dark:border-slate-800">
          {topic.content?.pdfUrl && (
            <a 
              href={topic.content.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-4 rounded-md border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-bold text-slate-700 dark:text-slate-300 w-full sm:w-auto justify-center"
            >
              <FileText className="w-5 h-5 text-brand-500" />
              Baixar Material PDF
            </a>
          )}
          
          <Link 
            to={`/exercises/${topic.area}/${topic.id}`}
            state={{
              selectedLevel: "Todos",
              onlyEnem: false,
              selectedYear: "Todos"
            }}
            className="flex items-center justify-center gap-3 bg-brand-500 text-white px-6 py-4 rounded-md font-bold text-lg hover:bg-brand-600 transition-all hover:-translate-y-0.5 w-full sm:w-auto"
          >
            Começar Exercícios
            <ArrowLeft className="w-5 h-5 rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
}