import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Download, Compass } from "lucide-react";

import areas from "../data/areas";

export default function Areas() {
  return (
    <div className="max-w-5xl mx-auto px-4 pt-8 pb-16 relative">
      
      {/* LINHA DE FUNDO DO ROADMAP (Fixa no centro em todas as telas) */}
      <div className="absolute left-1/2 top-[240px] bottom-20 w-1 bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-600 -translate-x-1/2 opacity-30 dark:opacity-20 z-0" />

      {/* HEADER DE JORNADA */}
      <header className="mb-12 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-100 dark:border-blue-900/60">
          <Compass size={14} />
          Trilha de Aprendizado
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 dark:from-white dark:via-blue-200 dark:to-white bg-clip-text text-transparent">
          Mapa da Matemática
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Siga a sequência ideal de estudos. Domine a base conceitual e avance pelas ramificações mais complexas da ciência exata.
        </p>
      </header>

      {/* LISTA DO ROADMAP (Sem delays, carrega tudo de vez e bem aproximado verticalmente) */}
      <div className="space-y-4 md:space-y-20 relative z-10">
        {areas.map((area, index) => {
          const isEven = index % 2 === 0;

          return (
            <div 
              key={area.id} 
              className={`flex items-center justify-between w-full relative ${
                isEven ? "flex-row" : "flex-row-reverse"
              }`}
            >
              {/* CARD DO ROADMAP */}
              {/* No mobile, demos mais largura 'w-[calc(50%-8px)]' para achatar o bloco lateralmente */}
              <div className="w-[calc(50%-8px)] sm:w-[calc(50%-24px)] md:w-[calc(50%-30px)] z-10">
                {/* Reduzido o padding no mobile (p-3) para o card ficar menor e mais compacto */}
                <div className="bg-white dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800/80 rounded-xl md:rounded-2xl p-3 sm:p-6 shadow-sm hover:shadow-xl hover:border-blue-400 dark:hover:border-blue-500/50 transition-all duration-300 group">

                  {/* Topo do Card diminuído no mobile */}
                  <div className="flex items-start justify-between gap-2 mb-2 sm:mb-4">
                    <div className="p-1.5 sm:p-3 rounded-lg md:rounded-xl bg-slate-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                      <BookOpen className="w-4 h-4 sm:w-[22px] sm:h-[22px]" />
                    </div>

                    <span
                      className={`text-[9px] sm:text-xs px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                        area.difficulty === "Fácil"
                          ? "bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 border border-green-200/50 dark:border-green-900/30"
                          : area.difficulty === "Médio"
                          ? "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/30"
                          : "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-200/50 dark:border-rose-900/30"
                      }`}
                    >
                      {area.difficulty}
                    </span>
                  </div>

                  <h2 className="text-xs sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                    {area.title}
                  </h2>

                  {/* O SEGREDO DO RETÂNGULO DEITADO: 'line-clamp-1' no mobile impede que a altura cresça */}
                  <p className="text-[10px] sm:text-sm text-slate-600 dark:text-slate-400 leading-tight mb-3 line-clamp-1 sm:line-clamp-none">
                    {area.description}
                  </p>

                  {/* Botões de Ação mais baixos no mobile */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-4 border-t border-slate-100 dark:border-slate-800/60">
                    <Link
                      to={`/areas/${area.id}`}
                      className="flex-1 inline-flex items-center justify-center gap-1 bg-slate-900 hover:bg-blue-600 dark:bg-slate-800 dark:hover:bg-blue-600 text-white rounded-lg md:rounded-xl px-2 py-1.5 text-[10px] sm:text-sm font-semibold transition-colors shadow-sm"
                    >
                      <span>Explorar</span>
                      <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </Link>

                    {area.pdf && (
                      <a
                        href={area.pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center p-1.5 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg md:rounded-xl border border-slate-200 dark:border-slate-700/60 transition-colors"
                        title="Baixar PDF"
                      >
                        <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* NÓ CENTRAL PERFEITAMENTE ALINHADO NO CENTRO DA ALTURA */}
              <div className="absolute left-1/2 -translate-x-1/2 w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-slate-100 dark:bg-slate-900 border-2 sm:border-4 border-blue-500 shadow-md flex items-center justify-center z-20">
                <span className="text-[10px] sm:text-xs font-black text-slate-700 dark:text-slate-300">
                  {index + 1}
                </span>
              </div>

              {/* ESPAÇADOR FLUIDO */}
              <div className="w-[calc(50%-8px)] sm:w-[calc(50%-24px)] md:w-[calc(50%-30px)]" />
            </div>
          );
        })}
      </div>
    </div>
  );
}