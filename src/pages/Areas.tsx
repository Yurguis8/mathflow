import { Link } from "react-router-dom";
import { ArrowRight, BookOpen } from "lucide-react";

import areas from "../data/areas";

export default function Areas() {
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-0">
      <header className="mb-10 text-center lg:text-left pt-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
          Áreas da Matemática
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-3xl">
          Explore os principais campos da matemática, encontre exercícios,
          teoria, videoaulas e materiais complementares organizados por área.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {areas.map((area) => (
          <div
            key={area.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-slate-800 flex items-center justify-center">
                <BookOpen className="text-blue-600" size={26} />
              </div>

              <span
                className={`text-xs px-3 py-1 rounded-full font-semibold ${
                  area.difficulty === "Fácil"
                    ? "bg-green-100 text-green-700"
                    : area.difficulty === "Médio"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {area.difficulty}
              </span>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              {area.title}
            </h2>

            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
              {area.description}
            </p>

            <div className="flex flex-col gap-3">
              <Link
                to={`/areas/${area.id}`}
                className="flex items-center justify-between bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-4 py-3 font-semibold transition-colors"
              >
                Explorar área

                <ArrowRight size={18} />
              </Link>

              <a
                href={area.pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="text-center border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl px-4 py-3 font-medium text-slate-700 dark:text-slate-300 transition-colors"
              >
                Baixar material PDF
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}