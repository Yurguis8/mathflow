import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Play, 
  Clock, 
  Trophy, 
  ArrowRight, 
  TrendingUp, 
  BookOpen, 
  Calculator, 
  Target,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion'; // Ajustado para o nome correto da biblioteca se necessário

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const response = await fetch(`https://mathflow-l58o.onrender.com/progress/dashboard/${user.id}`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    if (user.id) {
      fetchDashboard();
    }
  }, [user.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const dashboardData = data || {
    totalCompleted: 0,
    totalStudyTime: 0,
    accuracy: 0,
    progress: []
  };

  const totalExercises = dashboardData.totalCompleted;

let medal = {
  label: "Bronze",
  color: "text-amber-700 dark:text-amber-300",
  bg: "bg-amber-100 dark:bg-amber-900/30",
  border: "border-amber-300 dark:border-amber-700"
};

if (totalExercises >= 70) {
  medal = {
    label: "Ouro",
    color: "text-yellow-600 dark:text-yellow-300",
    bg: "bg-yellow-100 dark:bg-yellow-900/30",
    border: "border-yellow-300 dark:border-yellow-700"
  };
} else if (totalExercises >= 20) {
  medal = {
    label: "Prata",
    color: "text-slate-500 dark:text-slate-300",
    bg: "bg-slate-200 dark:bg-slate-700/40",
    border: "border-slate-300 dark:border-slate-600"
  };
}

  const stats = [
    { 
      label: "Exercícios Concluídos", 
      value: dashboardData.totalCompleted.toString(), 
      icon: Calculator, 
      color: "text-blue-600 dark:text-blue-300", 
      bg: "bg-blue-50 dark:bg-slate-800" 
    },
    { 
      label: "Tempo de Estudo", 
      value: `${Math.floor(dashboardData.totalStudyTime / 3600)}h`, 
      icon: Clock, 
      color: "text-amber-600 dark:text-amber-300", 
      bg: "bg-amber-50 dark:bg-slate-800" 
    },
    { 
      label: "Média de Acertos", 
      value: `${dashboardData.accuracy}%`, 
      icon: Target, 
      color: "text-green-600 dark:text-green-300", 
      bg: "bg-green-50 dark:bg-slate-800" 
    },
    { 
      label: "Nível", 
      value: medal.label, 
      icon: Trophy, 
      color: medal.color, 
      bg: medal.bg,
      border: medal.border
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      <section>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Olá, {user.name || 'Estudante'}!
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              {dashboardData.totalCompleted > 0 
                ? `Você já resolveu ${dashboardData.totalCompleted} questões. Continue assim!` 
                : "Comece seus estudos para ver seu progresso aqui."}
            </p>
          </div>
          <Link 
            to="/topics" 
            // Removido shadow-blue e adicionado dark:bg-white dark:text-slate-900
            className="flex items-center gap-2 bg-blue-600 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-md font-bold text-sm hover:opacity-90 transition-all border border-transparent dark:border-white shadow-sm"
          >
            Continuar Estudos
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl">
              <div className={`${stat.bg} ${stat.color} p-2.5 rounded-xl w-fit mb-4`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-slate-800 dark:text-white uppercase tracking-tighter">{stat.value}</p>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-3 dark:text-slate-200">
            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-white" />
            Seu progresso por tópico
          </h2>
          
          <div className="space-y-4">
            {dashboardData.progress.length > 0 ? (
              dashboardData.progress.map((topic) => (
                <Link 
                  key={topic.id}
                  to={`/topic/${topic.topic_name.toLowerCase().replace(/ /g, '-')}`}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 group transition-all hover:border-blue-500 dark:hover:border-white"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center shrink-0">
                      <BookOpen className="w-7 h-7 text-blue-600 dark:text-blue-300" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-blue-100 group-hover:text-blue-600 dark:group-hover:text-white transition-colors">
                        {topic.topic_name}
                      </h3>
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        {topic.correct_answers} acertos de {topic.completed_questions} questões
                      </p>
                    </div>
                  </div>
                  
                  <div className="w-full sm:w-48">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-1.5 dark:text-slate-500">
                      <span>Aproveitamento</span>
                      {/* Azul vira Branco no texto do progresso tbm */}
                      <span className="text-blue-600 dark:text-white">
                        {topic.completed_questions > 0 
                          ? Math.round((topic.correct_answers / topic.completed_questions) * 100) 
                          : 0}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(topic.correct_answers / topic.completed_questions) * 100}%` }}
                        // Azul vira Branco na barra de progresso
                        className="h-full bg-blue-600 dark:bg-white rounded-full"
                      />
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                <p className="text-slate-500">Nenhum progresso registrado ainda.</p>
              </div>
            )}
          </div>

          {/* Banner de Desafio - Removido brilhos e sombras fortes */}
          <div className="bg-slate-900 dark:bg-white border border-slate-800 dark:border-slate-200 rounded-2xl p-8 text-white dark:text-slate-900 relative overflow-hidden shadow-sm">
             <div className="absolute -right-10 -bottom-10 opacity-5">
                <Calculator className="w-64 h-64 text-white dark:text-slate-900" />
             </div>
             <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-2">Desafio do Dia!</h3>
                <p className="text-slate-400 dark:text-slate-500 mb-6 max-w-sm font-medium">Resolva 5 questões de Geometria para desbloquear uma nova medalha.</p>
                <Link 
                  to="/exercises" 
                  className="inline-flex items-center gap-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all border border-slate-200 dark:border-slate-700 shadow-sm"
                >
                  Aceitar Desafio
                  <ArrowRight className="w-5 h-5" />
                </Link>
             </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-3 dark:text-slate-200">
            <Play className="w-5 h-5 text-yellow-500 dark:text-yellow-300" />
            Sugestões
          </h2>
          
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl border-l-4 border-l-yellow-600 dark:border-l-yellow-300">
               <p className="text-xs font-bold text-yellow-600 dark:text-yellow-300 uppercase mb-2 tracking-widest">Recomendado</p>
               <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1">Potenciação e Radiciação</h4>
               <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">Útil para seus próximos simulados escolares.</p>
               <Link to="/topics" className="text-xs font-bold text-slate-400 hover:text-yellow-600 dark:hover:text-white transition-colors uppercase tracking-widest flex items-center gap-1">
                 Ver Detalhes <ChevronRight className="w-3 h-3" />
               </Link>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
            <h4 className="font-bold text-slate-900 dark:text-white mb-4">Dica de Estudo</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic">
              "Estudar 25 minutos e descansar 5 pode aumentar sua concentração em 20%."
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
            <h4 className="font-bold text-slate-900 dark:text-white mb-4">Aumente seu nível</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic">
              Complete 20 exercícios para subir de nível!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}