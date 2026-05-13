import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { prisma } from '../lib/prisma.js';

export async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    const userExists = await prisma.users.findUnique({
      where: {
        email
      }
    });

    if (userExists) {
      return res.status(400).json({
        error: 'Usuário já existe'
      });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: {
        name,
        email,
        password_hash
      }
    });

    res.status(201).json({
      message: 'Usuário criado',
      user: {
        id: user.id.toString(),
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: 'Erro no cadastro'
    });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await prisma.users.findUnique({
      where: {
        email
      }
    });

    if (!user) {
      return res.status(400).json({
        error: 'Usuário não encontrado'
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatch) {
      return res.status(400).json({
        error: 'Senha inválida'
      });
    }

    const token = jwt.sign(
      {
        userId: String(user.id)
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d'
      }
    );

    res.json({
      message: 'Login realizado',
      token,
      user: {
        id: user.id.toString(),
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: 'Erro no login'
    });
  }
}