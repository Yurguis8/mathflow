import React from "react";
import { Link } from "react-router-dom";
import * as LucideIcons from "lucide-react";
import type { Topic } from "../types";

export default function TopicCard({ topic }: { topic: Topic; key?: string }) {
  // @ts-ignore
  const Icon = LucideIcons[topic.icon as keyof typeof LucideIcons] || LucideIcons.Book;

  return (
    <Link 
      to={`/topic/${topic.id}`}
      className="math-card p-6 flex flex-col h-full group bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
      id={`topic-${topic.id}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-3 rounded-md group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
          <Icon className="w-6 h-6" />
        </div>
        <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded-md ${
          topic.difficulty === "Fácil" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" :
          topic.difficulty === "Médio" ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400" :
          "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
        }`}>
          {topic.difficulty}
        </span>
      </div>
      
      <h3 className="text-xl font-display font-bold text-slate-800 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
        {topic.title}
      </h3>
      
      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed flex-grow">
        {topic.description}
      </p>
      
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
        <span>Estudar agora</span>
        <LucideIcons.ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
