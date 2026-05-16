import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Topics from "./pages/Topics";
import TopicDetail from "./pages/TopicDetail";
import ExercisesList from "./pages/ExercisesList";
import ExercisePlayer from "./pages/ExercisePlayer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AnimatePresence, motion } from "motion/react";
import Areas from "./pages/Areas";
import AreaDetail from "./pages/AreaDetail";
import Simulados from "./pages/Simulados";
import SimuladosPlayer from "./pages/SimulationPlayer";

export default function App() {
  // Inicializamos o estado verificando se o token já existe
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  // Este efeito vai monitorar o localStorage a cada segundo para garantir o redirecionamento
  // É a forma mais segura quando não se usa Context API
  useEffect(() => {
    const checkToken = () => {
      const currentToken = localStorage.getItem('token');
      if (currentToken !== token) {
        setToken(currentToken);
      }
    };

    const interval = setInterval(checkToken, 500); // Checa a cada 500ms
    return () => clearInterval(interval);
  }, [token]);

  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          {/* Se houver token e o usuário tentar ir para o login, mandamos para a dashboard */}
          <Route 
            path="/login" 
            element={token ? <Navigate to="/" replace /> : <Login />} 
          />
          <Route path="/register" element={<Register />} />

          {/* Rota Protegida */}
          <Route
            path="/*"
            element={
              token
                ? <ProtectedLayout />
                : <Navigate to="/login" replace />
            }
          />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}

function ProtectedLayout() {
  // Captura o usuário logado no localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!user.id) return;

    // Registra o exato milissegundo em que o usuário entrou no sistema
    const startTime = Date.now();

    const salvarTempoNoBanco = () => {
      const endTime = Date.now();
      // Transforma a diferença de milissegundos em segundos inteiros
      const secondsSpent = Math.floor((endTime - startTime) / 1000);

      if (secondsSpent > 0) {
        const url = `https://mathflow-l58o.onrender.com/progress/track-time`;
        const payload = JSON.stringify({
          userId: user.id.toString(),
          seconds: secondsSpent
        });

        // O 'navigator.sendBeacon' garante o envio assíncrono para o back-end 
        // mesmo se o usuário fechar a aba do navegador de forma abrupta
        if (navigator.sendBeacon) {
          navigator.sendBeacon(url, new Blob([payload], { type: 'application/json' }));
        } else {
          // Fallback caso o navegador não suporte beacon
          fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payload,
            keepalive: true // Mantém o fetch vivo mesmo após fechar a janela
          }).catch((err) => console.error(err));
        }
      }
    };

    // Escuta quando o usuário fecha a aba, muda de site ou atualiza a página (F5)
    window.addEventListener("beforeunload", salvarTempoNoBanco);

    // Executa ao deslogar ou desmontar o layout de dentro da aplicação
    return () => {
      window.removeEventListener("beforeunload", salvarTempoNoBanco);
      salvarTempoNoBanco();
    };
  }, [user.id]);

  return (
    <div className="
      flex
      min-h-screen
      bg-slate-50
      dark:bg-slate-950
      transition-colors
      duration-300
    ">
      <Sidebar />

      <div className="
        flex-1
        flex
        flex-col
        min-w-0
        md:ml-64
      ">
        <Header />

        <main className="
          flex-1
          p-4
          md:p-8
        ">
          <AnimatePresence mode="wait">
            <Routes>
              <Route
                path="/"
                element={
                  <PageTransition>
                    <Dashboard />
                  </PageTransition>
                }
              />

              <Route
                path="/topics"
                element={
                  <PageTransition>
                    <Topics />
                  </PageTransition>
                }
              />

              <Route
                path="/topic/:id"
                element={
                  <PageTransition>
                    <TopicDetail />
                  </PageTransition>
                }
              />

              <Route
                path="/exercises"
                element={
                  <PageTransition>
                    <ExercisesList />
                  </PageTransition>
                }
              />

              <Route path="/areas" 
              element={
                <PageTransition>
                  <Areas />
                </PageTransition>
              } />

              <Route path="/areas/:id" 
              element={
                <PageTransition>
                  <AreaDetail />
                </PageTransition>
              } />

              <Route
                path="/exercises/:topicId"
                element={
                  <PageTransition>
                    <ExercisePlayer />
                  </PageTransition>
                }
              />
              <Route path="/simulados" 
              element={
                <PageTransition>
                  <Simulados />
                </PageTransition>
              } />
              <Route path="/simulados/play" element={<SimuladosPlayer />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function PageTransition({
  children
}: {
  children: React.ReactNode
}) {

  return (

    <motion.div
      initial={{
        opacity: 0,
        scale: 0.98
      }}
      animate={{
        opacity: 1,
        scale: 1
      }}
      exit={{
        opacity: 0,
        scale: 1.02
      }}
      transition={{
        duration: 0.25,
        ease: "easeOut"
      }}
      className="h-full"
    >

      {children}

    </motion.div>
  );
}