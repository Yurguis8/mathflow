import React, { useState, useEffect } from 'react';
import { Sun, Moon, Bell, CheckCircle, Flame } from 'lucide-react';

export default function Header() {
  const [isDark, setIsDark] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [percentDone, setPercentDone] = useState(0);

  const userData = JSON.parse(localStorage.getItem('user') || '{"name": "Estudante"}');

  useEffect(() => {
    // 1. Lógica do Tema
    const savedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }

    // 2. Busca o progresso real usando a rota do seu Controller
    if (userData.id) {
      fetch(`http://localhost:3000/progress/dashboard/${userData.id}`)
        .then(res => res.json())
        .then(data => {
          // Usando o 'totalCompleted' que seu backend já calcula!
          const feito = data.totalCompleted || 0;
          
          // Defina aqui o total de questões que existem na sua plataforma
          // Se você tem 2 tópicos com 5 questões cada, a meta é 10.
          const metaTotal = 20; 
          
          const calculo = (feito / metaTotal) * 100;
          setPercentDone(calculo > 100 ? 100 : calculo);
        })
        .catch(err => console.error("Erro ao buscar progresso:", err));
    }
  }, [userData.id]);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  return (
    <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 md:px-8 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <div className="hidden md:block">
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Olá, {userData.name.split(' ')[0]}!</p>
          <div className="flex items-center gap-2">
            <div className="w-32 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${percentDone}%` }}
              ></div>
            </div>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter">
              {Math.round(percentDone)}% concluído
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        <button onClick={toggleTheme} className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all shadow-sm">
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <div className="relative">
          <button onClick={() => setShowNotifications(!showNotifications)} className={`p-2.5 rounded-xl transition-all ${showNotifications ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 py-4 z-50 animate-in fade-in zoom-in duration-200">
              <div className="px-4 mb-4 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Notificações</h3>
              </div>
              <div className="space-y-1">
                <div className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center shrink-0"><CheckCircle className="w-4 h-4" /></div>
                  <div>
                    <p className="text-xs font-bold dark:text-slate-200">Plataforma Ativa!</p>
                    <p className="text-[10px] text-slate-500">Seu sistema de progresso está rodando localmente.</p>
                  </div>
                </div>
                <div className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0"><Flame className="w-4 h-4" /></div>
                  <div>
                    <p className="text-xs font-bold dark:text-slate-200">Primeiro Passo!</p>
                    <p className="text-[10px] text-slate-500">Bem-vindo ao MathFlow. Comece a estudar hoje.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{userData.name}</p>
            <p className="text-[10px] font-bold text-blue-600 uppercase">Estudante</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-blue-500/20">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`} alt="Avatar" className="w-full h-full rounded-[10px] bg-white dark:bg-slate-800" />
          </div>
        </div>
      </div>
    </header>
  );
}