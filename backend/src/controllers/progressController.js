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

    // Formata o array para o frontend (converte BigInt para String)
    const formattedProgress = progress.map(item => {
      totalCorrect += item.correct_answers;
      totalCompleted += item.completed_questions;
      totalStudyTime += item.study_time_seconds;

      return {
        ...item,
        id: item.id.toString(),
        user_id: item.user_id.toString()
      };
    });

    const accuracy = totalCompleted > 0
      ? Math.round((totalCorrect / totalCompleted) * 100)
      : 0;

    return res.json({
      totalCorrect,
      totalCompleted,
      totalStudyTime,
      accuracy,
      progress: formattedProgress // Array formatado sem BigInt
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: 'Erro ao carregar dashboard'
    });
  }
}