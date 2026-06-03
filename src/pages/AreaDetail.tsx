import { useParams } from "react-router-dom";
import TopicCard from "../components/TopicCard";

import algebraTopicsData from "../data/areas/algebra/topics.json";
import aritmeticaTopicsData from "../data/areas/aritmetica/topics.json";
import geometriaPlanaTopicsData from "../data/areas/geometria-plana/topics.json";
import geometriaEspacialTopicsData from "../data/areas/geometria-espacial/topics.json";
import funcoesTopicsData from "../data/areas/funcoes/topics.json";
import trigonometriaTopicsData from "../data/areas/trigonometria/topics.json";
import probabilidadeEstatisticaTopicsData from "../data/areas/probabilidade-estatistica/topics.json";
import analiseCombinatoriaTopicsData from "../data/areas/analise-combinatoria/topics.json";
import geometriaAnaliticaTopicsData from "../data/areas/geometria-analitica/topics.json";
import matrizesTopicsData from "../data/areas/matrizes/topics.json";
import logaritmosTopicsData from "../data/areas/logaritmos/topics.json";
import calculoTopicsData from "../data/areas/calculo/topics.json";

const areasMap: Record<string, { title: string; topics: any[] }> = {
  algebra: { title: "Álgebra", topics: algebraTopicsData as any[] },
  aritmetica: { title: "Aritmética", topics: aritmeticaTopicsData as any[] },
  "geometria-plana": { title: "Geometria Plana", topics: geometriaPlanaTopicsData as any[] },
  "geometria-espacial": { title: "Geometria Espacial", topics: geometriaEspacialTopicsData as any[] },
  funcoes: { title: "Funções", topics: funcoesTopicsData as any[] },
  trigonometria: { title: "Trigonometria", topics: trigonometriaTopicsData as any[] },
  "probabilidade-estatistica": { title: "Probabilidade e Estatística", topics: probabilidadeEstatisticaTopicsData as any[] },
  "analise-combinatoria": { title: "Análise Combinatória", topics: analiseCombinatoriaTopicsData as any[] },
  "geometria-analitica": { title: "Geometria Analítica", topics: geometriaAnaliticaTopicsData as any[] },
  matrizes: { title: "Matrizes", topics: matrizesTopicsData as any[] },
  logaritmos: { title: "Logaritmos", topics: logaritmosTopicsData as any[] },
  calculo: { title: "Cálculo", topics: calculoTopicsData as any[] },
};

export default function AreaDetail() {
  const { id } = useParams();
  const area = areasMap[id || ""];
  const topics = area?.topics || [];
  const title = area?.title || "Área";

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-0">
      <header className="mb-10 pt-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
          {title}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
          Explore os assuntos desta área da matemática.
        </p>
      </header>

      {topics.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic: any) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      ) : (
        /* Trocado rounded-3xl para rounded-custom-lg (Sincronizado com o Painel de Design) */
        <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 rounded-custom-lg p-10 text-center">
          <p className="text-slate-500 dark:text-slate-400">
            Nenhum assunto encontrado nesta área.
          </p>
        </div>
      )}
    </div>
  );
}