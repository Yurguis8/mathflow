import { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import { loginUser } from '../services/api';

export default function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

  async function handleLogin() {

    try {

      setLoading(true);

      const response = await loginUser({
        email,
        password
      });

      if (response.token) {

        localStorage.setItem(
          'token',
          response.token
        );

        localStorage.setItem(
          'user',
          JSON.stringify(response.user)
        );

        navigate('/');
      }

      else {

        alert(response.error || 'Erro no login');
      }

    } catch (error) {

      console.log(error);

      alert('Erro ao conectar');

    } finally {

      setLoading(false);
    }
  }

  return (

    <div className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-slate-100
      dark:bg-slate-950
      px-4
    ">

      <div className="
        w-full
        max-w-md
        p-8
        rounded-3xl
        bg-white
        dark:bg-slate-900
        border
        border-slate-200
        dark:border-slate-800
        shadow-xl
      ">

        <h1 className="
          text-3xl
          font-bold
          text-center
          mb-2
          text-slate-800
          dark:text-white
        ">
          Entrar
        </h1>

        <p className="
          text-center
          text-slate-500
          mb-8
        ">
          Faça login para acessar a plataforma
        </p>

        <div className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            className="
              w-full
              p-4
              rounded-xl
              border
              border-slate-300
              dark:border-slate-700
              bg-white
              dark:bg-slate-800
              dark:text-white
              outline-none
            "
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Senha"
            className="
              w-full
              p-4
              rounded-xl
              border
              border-slate-300
              dark:border-slate-700
              bg-white
              dark:bg-slate-800
              dark:text-white
              outline-none
            "
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="
              w-full
              p-4
              rounded-xl
              bg-blue-600
              hover:bg-blue-700
              text-white
              font-semibold
              transition
            "
          >
            {
              loading
                ? 'Entrando...'
                : 'Entrar'
            }
          </button>

        </div>

        <p className="
          mt-6
          text-center
          text-slate-500
        ">
          Não possui conta?

          <Link
            to="/register"
            className="
              text-blue-600
              ml-2
              font-semibold
            "
          >
            Criar conta
          </Link>

        </p>

      </div>

    </div>
  );
}