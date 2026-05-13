import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { BookOpen, GraduationCap, LayoutDashboard, Calculator, Menu, X } from "lucide-react";
import { clsx } from "clsx";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Assuntos", path: "/topics", icon: BookOpen },
    { name: "Exercícios", path: "/exercises", icon: Calculator },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-5 left-4 z-[60] md:hidden bg-blue-600 text-white p-2 rounded-md shadow-none"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[50] md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={clsx(
        "fixed left-0 top-0 h-screen w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 z-50 transition-all duration-300 md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 mt-14 md:mt-0 flex items-center gap-3">
          <div className="bg-gray-600 p-2 rounded-md shrink-0">
            <GraduationCap className="text-white w-6 h-6" />
          </div>
          <span className="font-display font-bold text-xl text-slate-800 dark:text-white tracking-tight">MathFlow</span>
        </div>

        <nav className="mt-8 px-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                  isActive
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100"
                )
              }
            >
              <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span>{item.name}</span>
              <div className={clsx(
                "absolute left-0 w-1 h-6 bg-blue-600 rounded-r-full transition-opacity",
                "opacity-0" // Controlled by isActive but handled by parent class usually, here we keep it simple
              )} />
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-8 left-0 w-full px-8">
          <div className="bg-slate-900 dark:bg-slate-800 border border-slate-800 dark:border-slate-700 rounded-2xl p-4 text-white">
            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Seu Status</p>
            <p className="text-sm font-bold">Focado & Pronto</p>
          </div>
        </div>
      </aside>
    </>
  );
}
