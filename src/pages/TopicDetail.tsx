import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Play, FileText, ChevronRight, Activity } from "lucide-react";
import type { Topic } from "../types";

export default function TopicDetail() {
  const { id } = useParams();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/topics/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setTopic(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center">Carregando...</div>;
  if (!topic) return <div className="p-8 text-center">Assunto não encontrado.</div>;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium mb-8 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Voltar para a lista
      </Link>

      <header className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold uppercase tracking-widest rounded-full">
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
        {/* Explicação */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 lg:p-10 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden relative">
           <div className="absolute top-0 right-0 p-8 text-blue-100 dark:text-blue-900/20 -rotate-12">
              <FileText className="w-24 h-24" />
           </div>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 dark:text-white">
            <span className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm">1</span>
            Explicação Didática
          </h2>
          <div className="markdown-body text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
            {topic.content?.explanation}
          </div>
        </section>

        {/* Fórmulas */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl">
            <h2 className="text-xl font-bold mb-6 text-blue-400 flex items-center gap-3">
              <Activity className="w-5 h-5" />
              Fórmulas Importantes
            </h2>
            <ul className="space-y-4">
              {topic.content?.formulas.map((formula, idx) => (
                <li key={idx} className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10 font-mono text-lg font-medium ring-1 ring-white/5">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  {formula}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl">
             <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
              < ChevronRight className="w-5 h-5" />
              Exemplo Resolvido
            </h2>
            <div className="bg-white/10 rounded-2xl p-6 border border-white/20 italic text-lg leading-relaxed">
              {topic.content?.example}
            </div>
          </div>
        </section>

        {/* Vídeo */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 dark:text-white">
            <Play className="w-6 h-6 text-red-600" />
            Videoaula
          </h2>
          <div className="aspect-video rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 shadow-inner ring-1 ring-slate-200 dark:ring-slate-800">
             <iframe 
                width="100%" 
                height="100%" 
                src={topic.content?.videoUrl} 
                title={topic.title}
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              />
          </div>
        </section>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-8 border-t border-slate-200">
          <a 
            href={topic.content?.pdfUrl}
            className="flex items-center gap-2 px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-bold text-slate-700 dark:text-slate-300 w-full sm:w-auto justify-center"
          >
            <FileText className="w-5 h-5 text-blue-600" />
            Baixar Material PDF
          </a>
          
          <Link 
            to={`/exercises/${topic.id}`}
            className="flex items-center justify-center gap-3 bg-blue-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 hover:-translate-y-1 w-full sm:w-auto"
          >
            Começar Exercícios
            <ArrowLeft className="w-5 h-5 rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
}
