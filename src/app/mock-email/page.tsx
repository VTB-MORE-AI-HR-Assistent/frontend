// Mock Email Preview - Simulates receiving an interview invitation email
"use client"

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EmailLinkService } from '@/lib/interview/email-link-service'
import { registerTestSession } from '@/lib/api/interview'
import { Mail, Calendar, Clock, Headphones, ExternalLink, ChevronRight, User, Inbox, Star } from 'lucide-react'

export default function MockEmailPage() {
  const [interviewLink, setInterviewLink] = useState('')
  const [emailContent, setEmailContent] = useState<{ subject: string; htmlBody: string; textBody: string } | null>(null)
  
  useEffect(() => {
    // Generate interview data
    const sessionId = `interview-${Date.now()}`
    const interviewDate = new Date()
    interviewDate.setMinutes(interviewDate.getMinutes() + 5) // Interview in 5 minutes
    
    const candidateData = {
      candidateName: 'Александр Иванов',
      candidateEmail: 'alexander.ivanov@gmail.com',
      position: 'Senior Frontend Developer',
      duration: 30
    }
    
    // Register the session
    registerTestSession({
      sessionId,
      candidateName: candidateData.candidateName,
      candidateEmail: candidateData.candidateEmail,
      position: candidateData.position,
      scheduledTime: interviewDate,
      duration: candidateData.duration
    })
    
    // Generate the interview link
    const link = EmailLinkService.generateInterviewLink({
      sessionId,
      candidateEmail: candidateData.candidateEmail,
      candidateName: candidateData.candidateName,
      interviewDate,
      duration: candidateData.duration,
      position: candidateData.position
    })
    
    setInterviewLink(link)
    
    // Generate email content
    const email = EmailLinkService.createEmailInvitation({
      to: candidateData.candidateEmail,
      candidateName: candidateData.candidateName,
      position: candidateData.position,
      scheduledDate: interviewDate,
      duration: candidateData.duration,
      link,
      hrContactEmail: 'hr@vtb.ru',
      hrContactPhone: '+7 (495) 777-24-24',
      instructions: [
        'Убедитесь, что у вас стабильное интернет-соединение',
        'Найдите тихое место без посторонних шумов',
        'Проверьте работу микрофона перед началом',
        'Подготовьте резюме для справки'
      ]
    })
    
    setEmailContent(email)
  }, [])
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }
  
  const openInterviewLink = () => {
    window.open(interviewLink, '_blank')
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Gmail-like Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-medium text-gray-900">Gmail</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">АИ</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex h-[calc(100vh-60px)]">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r p-4 hidden lg:block">
          <div className="space-y-1">
            <div className="flex items-center space-x-3 bg-red-50 text-red-600 px-3 py-2 rounded-lg">
              <Inbox className="h-5 w-5" />
              <span className="font-medium">Входящие</span>
              <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">1</span>
            </div>
            <div className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer">
              <Star className="h-5 w-5" />
              <span>Помеченные</span>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Email List Preview */}
          <div className="bg-white border-b">
            <div className="px-6 py-3 hover:bg-gray-50 cursor-pointer border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#1B4F8C] to-[#2563EB] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">VTB</span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-gray-900">ВТБ HR</span>
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full">Важное</span>
                    </div>
                    <div className="text-sm font-medium text-gray-900">Приглашение на интервью - Senior Frontend Developer</div>
                    <div className="text-sm text-gray-500">Уважаемый Александр Иванов, благодарим Вас за интерес к позиции...</div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  13:45
                </div>
              </div>
            </div>
          </div>
          
          {/* Email Content */}
          <div className="max-w-4xl mx-auto p-6">
        
            <Card className="bg-white shadow-sm">
              {/* Email Header */}
              <div className="border-b p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-normal text-gray-900 mb-4">
                      Приглашение на интервью - Senior Frontend Developer - ВТБ
                    </h2>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#1B4F8C] to-[#2563EB] rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">VTB</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">ВТБ HR Team</div>
                          <div className="text-gray-500">noreply@vtb.ru</div>
                        </div>
                      </div>
                      <div className="text-gray-500">
                        кому: мне
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(new Date())}
                  </div>
                </div>
              </div>
          
          {/* Email Body */}
          <div className="p-6">
            {/* VTB Header */}
            <div className="bg-gradient-to-r from-[#1B4F8C] to-[#2563EB] text-white p-8 rounded-t-lg text-center">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-2xl">VTB</span>
              </div>
              <h1 className="text-2xl font-bold">ВТБ Банк</h1>
              <p className="mt-2 text-blue-100">Приглашение на интервью</p>
            </div>
            
            {/* Main Content */}
            <div className="bg-white border-x border-b rounded-b-lg p-6">
              <p className="mb-4">Уважаемый(ая) <strong>Александр Иванов</strong>,</p>
              
              <p className="mb-4">
                Благодарим Вас за интерес к позиции <strong>Senior Frontend Developer</strong> в ВТБ Банке.
              </p>
              
              <p className="mb-6">
                Приглашаем Вас на онлайн-интервью с нашим AI-ассистентом.
              </p>
              
              {/* Interview Details Box */}
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">Детали интервью:</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-[#1B4F8C] mr-3" />
                    <div>
                      <strong>Дата и время:</strong> {formatDate(new Date(Date.now() + 5 * 60000))}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-[#1B4F8C] mr-3" />
                    <div>
                      <strong>Продолжительность:</strong> 30 минут
                    </div>
                  </div>
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-[#1B4F8C] mr-3" />
                    <div>
                      <strong>Позиция:</strong> Senior Frontend Developer
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Headphones className="h-5 w-5 text-[#1B4F8C] mr-3" />
                    <div>
                      <strong>Формат:</strong> Аудио-интервью (видео не требуется)
                    </div>
                  </div>
                </div>
              </div>
              
              {/* CTA Button */}
              <div className="text-center mb-6">
                <Button
                  onClick={openInterviewLink}
                  className="bg-[#1B4F8C] hover:bg-[#143A66] text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  Перейти к интервью
                  <ExternalLink className="ml-2 h-5 w-5" />
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  Вы сможете присоединиться за 15 минут до начала
                </p>
              </div>
              
              {/* Requirements */}
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <h4 className="font-bold text-gray-900 mb-2">Технические требования:</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Современный браузер (Chrome, Firefox, Safari, Edge)</li>
                  <li>• Стабильное интернет-соединение</li>
                  <li>• Работающий микрофон</li>
                  <li>• Тихое помещение без посторонних шумов</li>
                </ul>
              </div>
              
              {/* Instructions */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-bold text-gray-900 mb-2">Инструкции:</h4>
                <ol className="space-y-1 text-sm text-gray-700">
                  <li>1. Убедитесь, что у вас стабильное интернет-соединение</li>
                  <li>2. Найдите тихое место без посторонних шумов</li>
                  <li>3. Проверьте работу микрофона перед началом</li>
                  <li>4. Подготовьте резюме для справки</li>
                </ol>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                <strong>Важно:</strong> Ссылка активна в течение 48 часов. Вы сможете присоединиться к интервью за 15 минут до назначенного времени.
              </p>
              
              {/* Contact Info */}
              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-2">
                  При возникновении вопросов, пожалуйста, свяжитесь с нами:
                </p>
                <ul className="text-sm text-gray-600">
                  <li>• Email: <a href="mailto:hr@vtb.ru" className="text-[#1B4F8C] hover:underline">hr@vtb.ru</a></li>
                  <li>• Телефон: +7 (495) 777-24-24</li>
                </ul>
              </div>
              
              <div className="mt-6 pt-4 border-t">
                <p className="text-sm text-gray-600">
                  С уважением,<br />
                  Команда подбора персонала<br />
                  ВТБ Банк
                </p>
              </div>
            </div>
          </div>
          
          {/* Email Footer */}
          <div className="bg-gray-50 px-6 py-4 text-center border-t">
            <p className="text-xs text-gray-500">
              Это автоматическое сообщение. Пожалуйста, не отвечайте на него.<br />
              © 2025 ВТБ Банк. Все права защищены.
            </p>
          </div>
        </Card>
        
            {/* Developer Info (Hidden in realistic view, shown for testing) */}
            <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-gray-300">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-600">🧪 Тестовая информация для разработчика</span>
                <button 
                  onClick={() => navigator.clipboard.writeText(interviewLink)}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  Скопировать ссылку
                </button>
              </div>
              <p className="text-xs text-gray-600 font-mono break-all">
                {interviewLink}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}