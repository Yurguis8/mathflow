import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  BookOpen,
  LayoutDashboard,
  Calculator,
  Menu,
  Blocks,
  Pi,
  X,
  NotebookText,
  LogOut,
} from "lucide-react";
import { clsx } from "clsx";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Áreas", path: "/areas", icon: Blocks },
    { name: "Assuntos", path: "/topics", icon: BookOpen },
    { name: "Exercícios", path: "/exercises", icon: Calculator },
    { name: "Simulados", path: "/simulados", icon: NotebookText },
  ];

  function handleLogout() {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-[70] md:hidden bg-brand-main text-white p-2 rounded-custom-md shadow-lg"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={clsx(
          "fixed top-0 left-0 h-dvh w-[85%] max-w-[280px] md:w-64",
          "bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800",
          "z-[65] transition-transform duration-300",
          "flex flex-col overflow-hidden",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="p-6 mt-14 md:mt-0 flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="bg-brand-main p-2 rounded-custom-sm shrink-0">
            <Pi className="text-white w-6 h-6" />
          </div>
          <span className="font-bold text-xl text-slate-800 dark:text-white tracking-tight">
            MathFlow
          </span>
        </div>

        {/* Links de Navegação */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1 min-h-0 custom-scrollbar">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-custom-md transition-all duration-200",
                  "text-sm sm:text-base",
                  isActive
                    ? "bg-brand-light dark:bg-brand-dark/20 text-brand-main dark:text-brand-light font-semibold"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white"
                )
              }
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shrink-0">
          <div className="hidden sm:block bg-slate-900 dark:bg-slate-800 border border-slate-800 dark:border-slate-700 rounded-custom-md p-4 text-white mb-4">
            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">
              Seu Status
            </p>
            <p className="text-sm font-bold">Focado & Pronto</p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-custom-md bg-slate-200 dark:bg-slate-800 hover:bg-red-600 hover:text-white text-slate-700 dark:text-slate-300 font-semibold transition-all duration-200"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span>Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
}