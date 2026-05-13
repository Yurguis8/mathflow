import { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import { registerUser } from '../services/api';

export default function Register() {

  const navigate = useNavigate();

  const [name, setName] = useState('');

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

  async function handleRegister() {

    try {

      setLoading(true);

      const response = await registerUser({
        name,
        email,
        password
      });

      if (response.user) {

        alert('Conta criada');

        navigate('/login');
      }

      else {

        alert(response.error || 'Erro');
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
          Criar Conta
        </h1>

        <p className="
          text-center
          text-slate-500
          mb-8
        ">
          Cadastre-se para acessar a plataforma
        </p>

        <div className="space-y-4">

          <input
            type="text"
            placeholder="Nome"
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
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

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
            onClick={handleRegister}
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
                ? 'Criando...'
                : 'Criar conta'
            }
          </button>

        </div>

        <p className="
          mt-6
          text-center
          text-slate-500
        ">
          Já possui conta?

          <Link
            to="/login"
            className="
              text-blue-600
              ml-2
              font-semibold
            "
          >
            Entrar
          </Link>

        </p>

      </div>

    </div>
  );
}