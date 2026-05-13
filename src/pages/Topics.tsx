import React, { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import TopicCard from "../components/TopicCard";
import type { Topic } from "../types";

export default function Topics() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mantendo seu fetch atual que você disse que funciona
    fetch("/api/topics")
      .then((res) => res.json())
      .then((data) => {
        setTopics(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // ESTA É A LÓGICA DO FILTRO
  const filteredTopics = topics.filter(topic => 
    topic.title.toLowerCase().includes(search.toLowerCase()) ||
    (topic.description && topic.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-0">
      <header className="mb-10 text-center lg:text-left pt-8">
        <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
          Assuntos
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
          Navegue pela nossa biblioteca de assuntos matemáticos.
        </p>
      </header>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Pesquisar por assunto..."
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 dark:text-white rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)} // Atualiza o termo de busca
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl h-64 animate-pulse" />
          ))}
        </div>
      ) : filteredTopics.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* AQUI ESTAVA O ERRO: Mapeando os tópicos FILTRADOS */}
          {filteredTopics.map((topic: Topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-dashed border-slate-300 dark:border-slate-700">
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Nenhum assunto encontrado para "{search}".
          </p>
        </div>
      )}
    </div>
  );
}