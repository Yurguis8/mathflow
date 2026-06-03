import { prisma } from '../lib/prisma.js';

export async function saveProgress(req, res) {
  try {
    const {
      user_id,
      topic_name,
      completed_questions,
      correct_answers,
      last_question_index,
      study_time_seconds
    } = req.body;

    const userIdBigInt = BigInt(user_id);

    // Busca se já existe progresso desse usuário para este tópico específico
    const existingProgress = await prisma.user_topic_progress.findFirst({
      where: {
        user_id: userIdBigInt,
        topic_name: topic_name
      }
    });

    let result;

    if (existingProgress) {
      // Se existir, atualiza os dados
      result = await prisma.user_topic_progress.update({
        where: {
          id: existingProgress.id
        },
        data: {
          completed_questions,
          correct_answers,
          last_question_index,
          study_time_seconds,
          updated_at: new Date()
        }
      });
    } else {
      // Se não existir, cria um novo registro
      result = await prisma.user_topic_progress.create({
        data: {
          user_id: userIdBigInt,
          topic_name,
          completed_questions,
          correct_answers,
          last_question_index,
          study_time_seconds
        }
      });
    }

    // Retorna o resultado convertendo BigInt para String para não quebrar o JSON
    return res.json({
      ...result,
      id: result.id.toString(),
      user_id: result.user_id.toString()
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: 'Erro ao salvar progresso'
    });
  }
}

export async function getDashboard(req, res) {
  try {
    const { user_id } = req.params;

    const progress = await prisma.user_topic_progress.findMany({
      where: {
        user_id: BigInt(user_id)
      }
    });

    let totalCorrect = 0;
    let totalCompleted = 0;
    let totalStudyTime = 0;

    const formattedProgress = [];

    // Formata o array para o frontend (converte BigInt para String)
    progress.forEach(item => {
      // O tempo de estudo acumula de TODOS os registos (incluindo o "Geral")
      totalStudyTime += item.study_time_seconds;

      // Se for o registo do tempo global da plataforma, não o adicionamos 
      // à listagem visual de tópicos para não estragar os teus gráficos/listas
      if (item.topic_name === 'Geral') {
        return;
      }

      // Dados de exercícios contam apenas para os tópicos reais de estudo
      totalCorrect += item.correct_answers;
      totalCompleted += item.completed_questions;

      formattedProgress.push({
        ...item,
        id: item.id.toString(),
        user_id: item.user_id.toString()
      });
    });

    const accuracy = totalCompleted > 0
      ? Math.round((totalCorrect / totalCompleted) * 100)
      : 0;

    return res.json({
      totalCorrect,
      totalCompleted,
      totalStudyTime, // Tempo Total = Tempo de Exercícios + Tempo de Plataforma Aberta
      accuracy,
      progress: formattedProgress // Removeu o tópico "Geral" da lista visual
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: 'Erro ao carregar dashboard'
    });
  }
}

// NOVA FUNÇÃO: Rota simplificada para registrar o tempo de tela
export async function trackTime(req, res) {
  try {
    const { userId, seconds } = req.body;

    if (!userId || !seconds) {
      return res.status(400).json({ error: 'Dados inválidos' });
    }

    const userIdBigInt = BigInt(userId);
    const secondsInt = parseInt(seconds);

    // Verifica se já existe a linha de acumulação "Geral" do usuário
    const existingProgress = await prisma.user_topic_progress.findFirst({
      where: {
        user_id: userIdBigInt,
        topic_name: 'Geral'
      }
    });

    if (existingProgress) {
      await prisma.user_topic_progress.update({
        where: { id: existingProgress.id },
        data: {
          study_time_seconds: existingProgress.study_time_seconds + secondsInt,
          updated_at: new Date()
        }
      });
    } else {
      await prisma.user_topic_progress.create({
        data: {
          user_id: userIdBigInt,
          topic_name: 'Geral',
          study_time_seconds: secondsInt,
          completed_questions: 0,
          correct_answers: 0,
          last_question_index: 0
        }
      });
    }

    return res.status(200).send('Tempo computado com sucesso');
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao salvar tempo de tela' });
  }
}