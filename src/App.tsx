import React, { useState, useEffect } from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Dashboard from "./pages/Dashboard";
import Topics from "./pages/Topics";
import TopicDetail from "./pages/TopicDetail";
import ExercisesList from "./pages/ExercisesList";
import ExercisePlayer from "./pages/ExercisePlayer";

import Login from "./pages/Login";
import Register from "./pages/Register";

import {
  AnimatePresence,
  motion
} from "motion/react";

export default function App() {
  // 1. Criamos um estado para o token
  const [token, setToken] = useState(localStorage.getItem('token'));

  // 2. Este efeito pode rodar para sincronizar o estado caso necessário
  // Mas o truque principal é atualizar o estado após o login
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 3. Agora o React vai re-renderizar quando o token mudar */}
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

              <Route
                path="/exercises/:topicId"
                element={
                  <PageTransition>
                    <ExercisePlayer />
                  </PageTransition>
                }
              />

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