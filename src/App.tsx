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
import { AnimatePresence, motion } from "framer-motion"; // Ajustado import se necessário
import Areas from "./pages/Areas";
import AreaDetail from "./pages/AreaDetail";
import Simulados from "./pages/Simulados";
import SimuladosPlayer from "./pages/SimulationPlayer";

export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  useEffect(() => {
    const checkToken = () => {
      const currentToken = localStorage.getItem('token');
      if (currentToken !== token) {
        setToken(currentToken);
      }
    };

    const interval = setInterval(checkToken, 500);
    return () => clearInterval(interval);
  }, [token]);

  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
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
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!user.id) return;

    let localSeconds = 0;
    const intervalTime = 60; // Intervalo para sincronizar com o banco (em segundos)
    const url = `https://mathflow-l58o.onrender.com/progress/track-time`;

    // Função centralizada para enviar dados ao backend
    const sendTimeToBackend = (secondsToSend: number, useBeacon = false) => {
      if (secondsToSend <= 0) return;

      const payload = JSON.stringify({
        userId: user.id.toString(),
        seconds: secondsToSend
      });

      if (useBeacon && navigator.sendBeacon) {
        navigator.sendBeacon(url, new Blob([payload], { type: 'application/json' }));
      } else {
        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true 
        }).catch((err) => console.error("Erro ao computar tempo:", err));
      }
    };

    // 1. Cronômetro em segundo plano (acumula e envia a cada 15 segundos)
    const timer = setInterval(() => {
      localSeconds += 1;

      if (localSeconds >= intervalTime) {
        sendTimeToBackend(localSeconds);
        localSeconds = 0; // Reseta o acumulador local após o envio com sucesso
      }
    }, 1000);

    // 2. Envio emergencial caso a aba seja fechada no meio de um intervalo
    const handleBeforeUnload = () => {
      if (localSeconds > 0) {
        sendTimeToBackend(localSeconds, true);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Limpeza ao desmontar o layout (ex: usuário fez logout)
    return () => {
      clearInterval(timer);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (localSeconds > 0) {
        sendTimeToBackend(localSeconds);
      }
    };
  }, [user.id]);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 md:ml-64">
        <Header />

        <main className="flex-1 p-4 md:p-8">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<PageTransition><Dashboard /></PageTransition>} />
              <Route path="/topics" element={<PageTransition><Topics /></PageTransition>} />
              <Route path="/topic/:id" element={<PageTransition><TopicDetail /></PageTransition>} />
              <Route path="/exercises" element={<PageTransition><ExercisesList /></PageTransition>} />
              <Route path="/areas" element={<PageTransition><Areas /></PageTransition>} />
              <Route path="/areas/:id" element={<PageTransition><AreaDetail /></PageTransition>} />
              <Route path="/exercises/:areaId/:topicId" element={<PageTransition><ExercisePlayer /></PageTransition>} />
              <Route path="/simulados" element={<PageTransition><Simulados /></PageTransition>} />
              <Route path="/simulados/play" element={<SimuladosPlayer />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
}