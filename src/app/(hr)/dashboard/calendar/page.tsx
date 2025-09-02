"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, ChevronLeft, ChevronRight, Clock } from "lucide-react"

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  
  // Mock AI interviews data
  const aiInterviews = [
    { 
      id: 1, 
      time: "10:00 AM", 
      candidateName: "Ivan Petrov", 
      position: "Frontend Developer", 
      duration: "45 min", 
      matchScore: 92,
      status: "scheduled"
    },
    { 
      id: 2, 
      time: "11:00 AM", 
      candidateName: "Maria Kozlova", 
      position: "Backend Developer", 
      duration: "30 min", 
      matchScore: 88,
      status: "in-progress"
    },
    { 
      id: 3, 
      time: "2:30 PM", 
      candidateName: "Alexander Smirnov", 
      position: "Data Scientist", 
      duration: "60 min", 
      matchScore: 95,
      status: "scheduled"
    },
    { 
      id: 4, 
      time: "4:00 PM", 
      candidateName: "Elena Petrova", 
      position: "Product Manager", 
      duration: "45 min", 
      matchScore: 87,
      status: "scheduled"
    },
  ]

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', 
    '5:00 PM', '6:00 PM'
  ]

  const navigateDate = (direction: 'prev' | 'next' | 'today') => {
    const newDate = new Date(currentDate)
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1)
    } else if (direction === 'next') {
      newDate.setDate(newDate.getDate() + 1)
    } else {
      return setCurrentDate(new Date())
    }
    setCurrentDate(newDate)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  return (
    <div className="p-4 pt-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Interview Calendar</h1>
          <p className="text-muted-foreground">
            Manage and view all scheduled AI interviews
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigateDate('prev')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant={isToday(currentDate) ? "default" : "outline"} 
            size="sm"
            onClick={() => navigateDate('today')}
          >
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigateDate('next')}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Date Display */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">
                {formatDate(currentDate)}
              </CardTitle>
              <CardDescription className="mt-1">
                {aiInterviews.length} interviews scheduled • {aiInterviews.filter(i => i.status === 'in-progress').length} in progress
              </CardDescription>
            </div>
            {isToday(currentDate) && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                Live Today
              </Badge>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Day Schedule */}
      <Card>
        <CardContent className="p-0">
          <div className="border rounded-lg">
            {timeSlots.map((time, index) => {
              // Find interviews for this time slot
              const slotInterviews = aiInterviews.filter(interview => 
                interview.time === time
              )
              
              return (
                <div 
                  key={time} 
                  className={`flex border-b last:border-b-0 ${
                    index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  }`}
                >
                  {/* Time column */}
                  <div className="w-32 p-4 text-sm text-gray-500 font-medium border-r flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {time}
                  </div>
                  
                  {/* Interview slot */}
                  <div className="flex-1 p-4">
                    {slotInterviews.length > 0 ? (
                      slotInterviews.map((interview) => (
                        <div 
                          key={interview.id} 
                          className={`rounded-lg p-4 ${
                            interview.status === 'in-progress' 
                              ? 'bg-blue-100 border border-blue-300' 
                              : 'bg-green-50 border border-green-200'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-base">{interview.candidateName}</p>
                                {interview.status === 'in-progress' && (
                                  <Badge className="bg-blue-500 text-white text-xs px-2 py-0 h-5">
                                    LIVE NOW
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{interview.position}</p>
                              <div className="flex items-center gap-4 mt-2">
                                <span className="text-sm text-gray-500">
                                  Duration: {interview.duration}
                                </span>
                                <span className="text-sm font-medium text-green-600">
                                  Match: {interview.matchScore}%
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                              {interview.status === 'in-progress' && (
                                <Button variant="default" size="sm">
                                  Join Interview
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-400">Available</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

    </div>
  )
}