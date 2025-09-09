// Простой тест для проверки работы Resend API
const { Resend } = require('resend');

// Загружаем переменные окружения
require('dotenv').config({ path: '.env.local' });

const resend = new Resend(process.env.RESEND_API_KEY);

async function testResend() {
  console.log('🚀 Тестируем Resend API...');
  console.log('API Key:', process.env.RESEND_API_KEY ? 'Найден ✅' : 'НЕ НАЙДЕН ❌');
  
  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY не найден в .env.local');
    return;
  }

  try {
    // Тестовое письмо
    const { data, error } = await resend.emails.send({
      from: 'ВТБ HR Assistant <onboarding@resend.dev>', // Используем тестовый домен Resend
      to: ['test@example.com'], // Тестовый получатель
      subject: '🎯 Тест отправки письма из ВТБ AI HR Assistant',
      html: `
        <h2>Тестовое письмо</h2>
        <p>Это тестовое письмо для проверки интеграции с Resend API.</p>
        <p><strong>Время отправки:</strong> ${new Date().toLocaleString('ru-RU')}</p>
        <p>Если вы получили это письмо, значит интеграция работает! ✅</p>
      `,
    });

    if (error) {
      console.error('❌ Ошибка при отправке письма:', error);
      return;
    }

    console.log('✅ Письмо успешно отправлено!');
    console.log('📧 ID письма:', data?.id);
    console.log('📊 Данные ответа:', data);

  } catch (error) {
    console.error('❌ Критическая ошибка:', error.message);
  }
}

// Запускаем тест
testResend();
