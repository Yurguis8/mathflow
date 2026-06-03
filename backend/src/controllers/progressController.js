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
      // Agora acumula os dados em vez de substituir
      result = await prisma.user_topic_progress.update({
        where: {
          id: existingProgress.id
        },
        data: {
          completed_questions: {
            increment: parseInt(completed_questions || 0)
          },
          correct_answers: {
            increment: parseInt(correct_answers || 0)
          },
          study_time_seconds: {
            increment: parseInt(study_time_seconds || 0)
          },
          last_question_index: parseInt(last_question_index || 0),
          updated_at: new Date()
        }
      });
    } else {
      // Se não existir, cria um novo registro
      result = await prisma.user_topic_progress.create({
        data: {
          user_id: userIdBigInt,
          topic_name,
          completed_questions: parseInt(completed_questions || 0),
          correct_answers: parseInt(correct_answers || 0),
          last_question_index: parseInt(last_question_index || 0),
          study_time_seconds: parseInt(study_time_seconds || 0)
        }
      });
    }

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

    progress.forEach(item => {
      totalStudyTime += Number(item.study_time_seconds);

      if (item.topic_name === 'Geral') {
        return;
      }

      totalCorrect += Number(item.correct_answers);
      totalCompleted += Number(item.completed_questions);

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
      totalStudyTime,
      accuracy,
      progress: formattedProgress
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: 'Erro ao carregar dashboard'
    });
  }
}

export async function trackTime(req, res) {
  try {
    const { userId, seconds } = req.body;

    if (!userId || !seconds) {
      return res.status(400).json({ error: 'Dados inválidos' });
    }

    const userIdBigInt = BigInt(userId);
    const secondsInt = parseInt(seconds);

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
          study_time_seconds: {
            increment: secondsInt
          },
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
    return res.status(500).json({
      error: 'Erro ao salvar tempo de tela'
    });
  }
}