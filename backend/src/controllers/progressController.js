import { prisma } from '../lib/prisma.js';

// SALVAR PROGRESSO ACUMULATIVO (Para Exercícios e Simulados)
export async function saveProgress(req, res) {
  try {
    const {
      user_id,
      topic_name,
      completed_questions, // Quantidade de questões feitas NESTA SESSÃO específica
      correct_answers,     // Quantidade de acertos NESTA SESSÃO específica
      last_question_index, // Índice atual da questão
      study_time_seconds   // Segundos gastos NESTA SESSÃO específica
    } = req.body;

    const userIdBigInt = BigInt(user_id);

    // Busca se já existe registro desse usuário para este tópico específico
    const existingProgress = await prisma.user_topic_progress.findFirst({
      where: {
        user_id: userIdBigInt,
        topic_name: topic_name
      }
    });

    let result;

    if (existingProgress) {
      // 💡 Se existir, incrementa (soma) os valores antigos com os novos que estão chegando
      result = await prisma.user_topic_progress.update({
        where: {
          id: existingProgress.id
        },
        data: {
          completed_questions: { increment: parseInt(completed_questions || 0) },
          correct_answers: { increment: parseInt(correct_answers || 0) },
          study_time_seconds: { increment: parseInt(study_time_seconds || 0) },
          // O índice da última questão e data continuam sendo atualizados normalmente
          last_question_index: parseInt(last_question_index || 0),
          updated_at: new Date()
        }
      });
    } else {
      // Se não existir, cria o primeiro registro normalmente com os valores iniciais
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

// BUSCAR DASHBOARD
export async function getDashboard(req, res) {
  try {
    const { userId } = req.params;
    const userIdBigInt = BigInt(userId);

    // Puxa todos os registros de progresso do usuário (exceto a linha acumulativa global 'Geral')
    const progress = await prisma.user_topic_progress.findMany({
      where: {
        user_id: userIdBigInt,
        NOT: {
          topic_name: 'Geral'
        }
      }
    });

    // Puxa a linha global 'Geral' para ler o tempo de tela totalizado
    const generalProgress = await prisma.user_topic_progress.findFirst({
      where: {
        user_id: userIdBigInt,
        topic_name: 'Geral'
      }
    });

    // Cálculos estatísticos gerais baseados no acúmulo real do banco de dados
    const totalCompleted = progress.reduce((sum, item) => sum + item.completed_questions, 0);
    const totalCorrect = progress.reduce((sum, item) => sum + item.correct_answers, 0);
    
    // O tempo total de estudo prioriza a linha geral, senão soma o tempo de cada matéria
    const totalStudyTime = generalProgress 
      ? generalProgress.study_time_seconds 
      : progress.reduce((sum, item) => sum + item.study_time_seconds, 0);

    const accuracy = totalCompleted > 0 
      ? Math.round((totalCorrect / totalCompleted) * 100) 
      : 0;

    // Converte os BigInts internos da lista para string antes de enviar para o Frontend
    const formattedProgress = progress.map(item => ({
      ...item,
      id: item.id.toString(),
      user_id: item.user_id.toString()
    }));

    return res.json({
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

// REGISTRAR O TEMPO DE TELA GLOBAL
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
      // Também modificado para usar o operador incremental nativo por segurança
      await prisma.user_topic_progress.update({
        where: { id: existingProgress.id },
        data: {
          study_time_seconds: { increment: secondsInt },
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

    return res.json({ success: true });

  } catch (error) {
    console.error('Erro no trackTime:', error);
    return res.status(500).json({ error: 'Erro interno ao rastrear tempo' });
  }
}