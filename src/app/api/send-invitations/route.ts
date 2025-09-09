import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendInvitationRequest {
  candidates: Array<{
    id: string;
    name: string;
    email: string;
    score: number;
  }>;
  vacancy: {
    title: string;
    company: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: SendInvitationRequest = await request.json();
    const { candidates, vacancy } = body;

    if (!candidates || candidates.length === 0) {
      return NextResponse.json(
        { error: 'Список кандидатов не может быть пустым' },
        { status: 400 }
      );
    }

    const results = [];

    for (const candidate of candidates) {
      try {
        // Для демо отправляем все письма на ваш email
        const mockEmail = "a_zhuravlev_9785@mail.ru";
        
        const { data, error } = await resend.emails.send({
          from: 'ВТБ HR Assistant <onboarding@resend.dev>',
          to: [mockEmail], // Используем мокированный email
          subject: `Приглашение на собеседование - ${vacancy.title}`,
          html: generateInvitationEmail(candidate, vacancy),
        });

        if (error) {
          console.error(`Ошибка отправки письма кандидату ${candidate.name}:`, error);
          results.push({
            candidateId: candidate.id,
            success: false,
            error: error.message,
            mockEmail
          });
        } else {
          console.log(`Письмо успешно отправлено кандидату ${candidate.name} на ${mockEmail}`);
          results.push({
            candidateId: candidate.id,
            success: true,
            emailId: data?.id,
            mockEmail
          });
        }
      } catch (candidateError) {
        console.error(`Ошибка при отправке письма кандидату ${candidate.name}:`, candidateError);
        results.push({
          candidateId: candidate.id,
          success: false,
          error: candidateError instanceof Error ? candidateError.message : 'Неизвестная ошибка',
          mockEmail: `candidate-${candidate.id}@mock-vtb-hr.com`
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;

    return NextResponse.json({
      success: true,
      message: `Отправлено ${successCount} из ${totalCount} приглашений`,
      results,
      summary: {
        total: totalCount,
        sent: successCount,
        failed: totalCount - successCount
      }
    });

  } catch (error) {
    console.error('Ошибка при отправке приглашений:', error);
    return NextResponse.json(
      { 
        error: 'Внутренняя ошибка сервера при отправке приглашений',
        details: error instanceof Error ? error.message : 'Неизвестная ошибка'
      },
      { status: 500 }
    );
  }
}

function generateInvitationEmail(candidate: { id: string; name: string; score: number }, vacancy: { title: string; company: string }): string {
  return `
    <!DOCTYPE html>
    <html lang="ru">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Приглашение на собеседование</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #1B4F8C 0%, #2563EB 100%);
          color: white;
          padding: 30px;
          border-radius: 12px 12px 0 0;
          text-align: center;
        }
        .content {
          background: #ffffff;
          padding: 30px;
          border: 1px solid #e5e7eb;
          border-top: none;
        }
        .footer {
          background: #f8fafc;
          padding: 20px 30px;
          border: 1px solid #e5e7eb;
          border-top: none;
          border-radius: 0 0 12px 12px;
          text-align: center;
          font-size: 14px;
          color: #6b7280;
        }
        .button {
          display: inline-block;
          background: linear-gradient(135deg, #1B4F8C 0%, #2563EB 100%);
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          margin: 20px 0;
        }
        .score-badge {
          background: #10b981;
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
        }
        .highlight {
          background: #f0f9ff;
          border-left: 4px solid #1B4F8C;
          padding: 16px;
          margin: 20px 0;
          border-radius: 0 8px 8px 0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🎯 Приглашение на собеседование</h1>
        <p>ВТБ AI HR Assistant</p>
      </div>
      
      <div class="content">
        <h2>Здравствуйте, ${candidate.name}!</h2>
        
        <p>Мы рассмотрели ваше резюме и рады сообщить, что вы прошли первичный отбор на позицию:</p>
        
        <div class="highlight">
          <h3>📋 ${vacancy.title}</h3>
          <p><strong>Компания:</strong> ${vacancy.company}</p>
          <p><strong>Ваш рейтинг:</strong> <span class="score-badge">${candidate.score}%</span></p>
        </div>
        
        <p>Наш ИИ-ассистент провел анализ вашего профиля и определил высокую степень соответствия требованиям позиции.</p>
        
        <h3>🎤 Следующий этап - Интервью с ИИ</h3>
        <p>Мы приглашаем вас пройти инновационное интервью с нашим ИИ-ассистентом. Это современный и объективный способ оценки кандидатов, который позволяет:</p>
        
        <ul>
          <li>✅ Пройти интервью в удобное для вас время</li>
          <li>✅ Получить объективную оценку ваших навыков</li>
          <li>✅ Избежать предвзятости человеческого фактора</li>
          <li>✅ Сэкономить время на первичном отборе</li>
        </ul>
        
        <div style="text-align: center;">
          <a href="#" class="button">🚀 Начать интервью</a>
        </div>
        
        <div class="highlight">
          <h4>📝 Что вас ждет:</h4>
          <ul>
            <li>Продолжительность: 15-20 минут</li>
            <li>Формат: Аудио-интервью с ИИ</li>
            <li>Вопросы: Профессиональные и поведенческие</li>
            <li>Результат: Получите обратную связь сразу после завершения</li>
          </ul>
        </div>
        
        <p>Если у вас есть вопросы, не стесняйтесь обращаться к нашей HR-команде.</p>
        
        <p>Удачи на интервью!</p>
        
        <p><strong>С уважением,<br>
        Команда ВТБ AI HR Assistant</strong></p>
      </div>
      
      <div class="footer">
        <p>Это автоматическое сообщение от ВТБ AI HR Assistant</p>
        <p>© 2024 ВТБ. Все права защищены.</p>
        <p><em>Мокированный email: candidate-${candidate.id}@mock-vtb-hr.com</em></p>
      </div>
    </body>
    </html>
  `;
}
