import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Estado para a mensagem de feedback visual
  const [status, setStatus] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  async function handleLogin() {
    try {
      setLoading(true);
      setStatus(null); // Limpa mensagens anteriores

      const response = await loginUser({
        email,
        password
      });

      if (response.token) {
        // Armazena os dados
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));

        // Define a mensagem de sucesso
        setStatus({ message: 'Login realizado com sucesso! Redirecionando...', type: 'success' });

        // O segredo para o Netlify/Celular: um pequeno delay garante que o 
        // localStorage seja gravado antes da navegação mudar o contexto
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setStatus({ message: response.error || 'Email ou senha inválidos', type: 'error' });
      }

    } catch (error) {
      console.log(error);
      setStatus({ message: 'Erro ao conectar com o servidor. Tente novamente.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 px-4">
      <div className="w-full max-w-md p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-2 text-slate-800 dark:text-white">
          Entrar
        </h1>

        <p className="text-center text-slate-500 mb-8">
          Faça login para acessar a plataforma
        </p>

        {/* ÁREA DE FEEDBACK VISUAL */}
        {status && (
          <div className={`mb-6 p-4 rounded-xl border text-sm font-medium text-center animate-in fade-in zoom-in duration-300 ${
            status.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-900/50 dark:text-green-400' 
              : 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-400'
          }`}>
            {status.message}
          </div>
        )}

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Senha"
            className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full p-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
          >
            {loading ? 'Verificando...' : 'Entrar'}
          </button>
        </div>

        <p className="mt-6 text-center text-slate-500">
          Não possui conta?
          <Link to="/register" className="text-blue-600 ml-2 font-semibold hover:underline">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}