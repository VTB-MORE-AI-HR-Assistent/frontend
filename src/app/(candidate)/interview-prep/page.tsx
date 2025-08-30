"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { 
  Calendar, Clock, MapPin, Users, Briefcase, Target, 
  BookOpen, Lightbulb, ChevronRight, Video, Phone,
  User, Building, Globe, Award, TrendingUp, FileText,
  AlertCircle, CheckCircle, Star, ArrowRight, MessageSquare,
  Laptop, Coffee, Presentation, HelpCircle, Brain, Sparkles,
  Filter, Download
} from "lucide-react"

// Mock data for scheduled interviews
const scheduledInterviews = [
  {
    id: 1,
    position: "Senior Frontend Developer",
    company: "VTB Bank",
    date: "2024-12-05",
    time: "10:00 AM",
    type: "Technical Interview",
    interviewer: "Alexander Petrov",
    interviewerRole: "Tech Lead",
    location: "Online (Zoom)",
    duration: "60 min",
    round: "Round 2 of 3",
    status: "upcoming",
    daysUntil: 2,
    preparationProgress: 75
  },
  {
    id: 2,
    position: "Senior Frontend Developer",
    company: "VTB Bank",
    date: "2024-12-08",
    time: "2:00 PM",
    type: "HR Interview",
    interviewer: "Marina Sokolova",
    interviewerRole: "HR Manager",
    location: "VTB Office, Moscow",
    duration: "45 min",
    round: "Final Round",
    status: "upcoming",
    daysUntil: 5,
    preparationProgress: 40
  },
  {
    id: 3,
    position: "Product Manager",
    company: "VTB Capital",
    date: "2024-12-10",
    time: "11:00 AM",
    type: "Case Study",
    interviewer: "Dmitry Ivanov",
    interviewerRole: "Senior PM",
    location: "Online (Teams)",
    duration: "90 min",
    round: "Round 1 of 2",
    status: "upcoming",
    daysUntil: 7,
    preparationProgress: 20
  }
]

// Mock preparation resources
const preparationResources = {
  technical: [
    { id: 1, title: "JavaScript Advanced Concepts", type: "Article", duration: "15 min", difficulty: "Advanced", completed: true },
    { id: 2, title: "React Performance Optimization", type: "Video", duration: "30 min", difficulty: "Intermediate", completed: true },
    { id: 3, title: "System Design Fundamentals", type: "Course", duration: "2 hours", difficulty: "Advanced", completed: false },
    { id: 4, title: "Data Structures Practice", type: "Exercise", duration: "45 min", difficulty: "Intermediate", completed: false },
    { id: 5, title: "TypeScript Best Practices", type: "Article", duration: "20 min", difficulty: "Intermediate", completed: true }
  ],
  behavioral: [
    { id: 1, title: "STAR Method Guide", type: "Article", duration: "10 min", difficulty: "Basic", completed: true },
    { id: 2, title: "Common Behavioral Questions", type: "PDF", duration: "25 min", difficulty: "Basic", completed: false },
    { id: 3, title: "Leadership Scenarios", type: "Video", duration: "35 min", difficulty: "Intermediate", completed: false },
    { id: 4, title: "Conflict Resolution Examples", type: "Article", duration: "15 min", difficulty: "Intermediate", completed: true }
  ],
  company: [
    { id: 1, title: "VTB Annual Report 2023", type: "PDF", duration: "30 min", difficulty: "Basic", completed: true },
    { id: 2, title: "Company Culture Video", type: "Video", duration: "12 min", difficulty: "Basic", completed: true },
    { id: 3, title: "Recent News & Updates", type: "Article", duration: "10 min", difficulty: "Basic", completed: false },
    { id: 4, title: "Product Portfolio Overview", type: "Presentation", duration: "20 min", difficulty: "Intermediate", completed: false }
  ]
}

// Mock company information
const companyInfo = {
  name: "VTB Bank",
  industry: "Banking & Financial Services",
  founded: "1990",
  employees: "80,000+",
  headquarters: "Moscow, Russia",
  revenue: "$15.2B (2023)",
  website: "www.vtb.com",
  description: "VTB is one of the leading universal banks of Russia, providing a wide range of banking services to corporate and retail customers.",
  values: ["Innovation", "Integrity", "Customer Focus", "Excellence", "Teamwork"],
  benefits: [
    "Competitive salary",
    "Health insurance",
    "Professional development",
    "Flexible working",
    "Performance bonuses",
    "Pension plan"
  ],
  techStack: ["React", "TypeScript", "Node.js", "Python", "Java", "Kubernetes", "AWS"],
  recentAchievements: [
    "Best Digital Bank 2023",
    "Top Employer Award",
    "Innovation in FinTech Prize"
  ]
}

// Interview tips data
const interviewTips = {
  before: [
    { icon: <Brain className="h-4 w-4" />, title: "Research thoroughly", description: "Study the company, role, and recent news" },
    { icon: <FileText className="h-4 w-4" />, title: "Prepare your stories", description: "Have 5-7 STAR stories ready" },
    { icon: <Laptop className="h-4 w-4" />, title: "Test your tech", description: "Check camera, mic, and internet connection" },
    { icon: <Coffee className="h-4 w-4" />, title: "Rest well", description: "Get good sleep and eat a healthy meal" }
  ],
  during: [
    { icon: <MessageSquare className="h-4 w-4" />, title: "Be concise", description: "Answer clearly without rambling" },
    { icon: <Star className="h-4 w-4" />, title: "Show enthusiasm", description: "Express genuine interest in the role" },
    { icon: <HelpCircle className="h-4 w-4" />, title: "Ask questions", description: "Prepare thoughtful questions to ask" },
    { icon: <Target className="h-4 w-4" />, title: "Stay focused", description: "Listen carefully and stay on topic" }
  ],
  after: [
    { icon: <CheckCircle className="h-4 w-4" />, title: "Send thank you", description: "Email within 24 hours" },
    { icon: <TrendingUp className="h-4 w-4" />, title: "Follow up", description: "Check status after a week" },
    { icon: <BookOpen className="h-4 w-4" />, title: "Reflect", description: "Note what went well and areas to improve" },
    { icon: <Sparkles className="h-4 w-4" />, title: "Stay positive", description: "Keep momentum for next steps" }
  ]
}

export default function InterviewPrepPage() {
  const [selectedInterview, setSelectedInterview] = useState(scheduledInterviews[0])
  const [activeResourceTab, setActiveResourceTab] = useState("technical")
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Page Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Interview Preparation</h2>
          <p className="text-muted-foreground">
            Prepare for your upcoming interviews with resources and tips
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Calendar
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-[#1B4F8C] to-[#2563EB] text-white">
            <Video className="mr-2 h-4 w-4" />
            Practice Interview
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Interviews</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scheduledInterviews.length}</div>
            <p className="text-xs text-muted-foreground">
              Next in 2 days
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Preparation Progress</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">75%</div>
            <p className="text-xs text-muted-foreground">
              Above average
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resources Completed</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8/13</div>
            <p className="text-xs text-muted-foreground">
              5 remaining
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Practice Sessions</CardTitle>
            <Presentation className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">
              2 this week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Scheduled Interviews */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Scheduled Interviews
            </CardTitle>
            <CardDescription>Your upcoming interview sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {scheduledInterviews.map((interview) => (
                  <div
                    key={interview.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                      selectedInterview.id === interview.id
                        ? "border-blue-500 bg-blue-50/50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedInterview(interview)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div>
                          <h4 className="font-semibold">{interview.position}</h4>
                          <p className="text-sm text-muted-foreground">{interview.company}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary">
                            <Calendar className="mr-1 h-3 w-3" />
                            {interview.date}
                          </Badge>
                          <Badge variant="secondary">
                            <Clock className="mr-1 h-3 w-3" />
                            {interview.time}
                          </Badge>
                          <Badge className="bg-blue-100 text-blue-700">
                            {interview.type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {interview.interviewer}
                          </span>
                          <span className="flex items-center gap-1">
                            {interview.location.includes("Online") ? (
                              <Video className="h-3 w-3" />
                            ) : (
                              <MapPin className="h-3 w-3" />
                            )}
                            {interview.location}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{interview.round}</Badge>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Prep Progress</span>
                            <Progress value={interview.preparationProgress} className="w-20 h-2" />
                            <span className="text-xs font-medium">{interview.preparationProgress}%</span>
                          </div>
                        </div>
                      </div>
                      {interview.daysUntil <= 3 && (
                        <Badge variant="destructive" className="ml-2">
                          {interview.daysUntil} days
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Interview Details & Actions */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Interview Details
            </CardTitle>
            <CardDescription>Information about your selected interview</CardDescription>
          </CardHeader>
          <CardContent>
            {selectedInterview && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-lg">{selectedInterview.position}</h4>
                  <p className="text-muted-foreground">{selectedInterview.company}</p>
                </div>
                
                <Separator />
                
                <div className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Date & Time</span>
                    <span className="font-medium">{selectedInterview.date} at {selectedInterview.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Interview Type</span>
                    <Badge>{selectedInterview.type}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Duration</span>
                    <span className="font-medium">{selectedInterview.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Location</span>
                    <span className="font-medium flex items-center gap-1">
                      {selectedInterview.location.includes("Online") ? (
                        <Video className="h-4 w-4" />
                      ) : (
                        <MapPin className="h-4 w-4" />
                      )}
                      {selectedInterview.location}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Round</span>
                    <Badge variant="outline">{selectedInterview.round}</Badge>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h5 className="font-medium mb-2">Interviewer</h5>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{selectedInterview.interviewer.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedInterview.interviewer}</p>
                      <p className="text-sm text-muted-foreground">{selectedInterview.interviewerRole}</p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium">Preparation Progress</h5>
                    <span className="text-sm font-medium">{selectedInterview.preparationProgress}%</span>
                  </div>
                  <Progress value={selectedInterview.preparationProgress} className="h-2" />
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button className="flex-1">
                    <Video className="mr-2 h-4 w-4" />
                    Join Interview
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <FileText className="mr-2 h-4 w-4" />
                    View Prep Notes
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Preparation Resources */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Preparation Resources
              </CardTitle>
              <CardDescription>Study materials and practice exercises</CardDescription>
            </div>
            <Input
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeResourceTab} onValueChange={setActiveResourceTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="technical">Technical</TabsTrigger>
              <TabsTrigger value="behavioral">Behavioral</TabsTrigger>
              <TabsTrigger value="company">Company Research</TabsTrigger>
            </TabsList>
            
            <TabsContent value="technical" className="mt-4">
              <div className="space-y-3">
                {preparationResources.technical
                  .filter(resource => resource.title.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((resource) => (
                  <div
                    key={resource.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      resource.completed ? "bg-green-50 border-green-200" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {resource.completed ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                      )}
                      <div>
                        <h4 className="font-medium">{resource.title}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {resource.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            <Clock className="inline h-3 w-3 mr-1" />
                            {resource.duration}
                          </span>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              resource.difficulty === "Advanced" ? "border-red-300 text-red-700" :
                              resource.difficulty === "Intermediate" ? "border-yellow-300 text-yellow-700" :
                              "border-green-300 text-green-700"
                            }`}
                          >
                            {resource.difficulty}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant={resource.completed ? "ghost" : "outline"}>
                      {resource.completed ? "Review" : "Start"}
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="behavioral" className="mt-4">
              <div className="space-y-3">
                {preparationResources.behavioral
                  .filter(resource => resource.title.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((resource) => (
                  <div
                    key={resource.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      resource.completed ? "bg-green-50 border-green-200" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {resource.completed ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                      )}
                      <div>
                        <h4 className="font-medium">{resource.title}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {resource.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            <Clock className="inline h-3 w-3 mr-1" />
                            {resource.duration}
                          </span>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              resource.difficulty === "Advanced" ? "border-red-300 text-red-700" :
                              resource.difficulty === "Intermediate" ? "border-yellow-300 text-yellow-700" :
                              "border-green-300 text-green-700"
                            }`}
                          >
                            {resource.difficulty}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant={resource.completed ? "ghost" : "outline"}>
                      {resource.completed ? "Review" : "Start"}
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="company" className="mt-4">
              <div className="space-y-3">
                {preparationResources.company
                  .filter(resource => resource.title.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((resource) => (
                  <div
                    key={resource.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      resource.completed ? "bg-green-50 border-green-200" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {resource.completed ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                      )}
                      <div>
                        <h4 className="font-medium">{resource.title}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {resource.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            <Clock className="inline h-3 w-3 mr-1" />
                            {resource.duration}
                          </span>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              resource.difficulty === "Advanced" ? "border-red-300 text-red-700" :
                              resource.difficulty === "Intermediate" ? "border-yellow-300 text-yellow-700" :
                              "border-green-300 text-green-700"
                            }`}
                          >
                            {resource.difficulty}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant={resource.completed ? "ghost" : "outline"}>
                      {resource.completed ? "Review" : "Start"}
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Company Information & Interview Tips */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Company Information
            </CardTitle>
            <CardDescription>{companyInfo.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">About</p>
                <p className="text-sm">{companyInfo.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">Industry</p>
                  <p className="font-medium">{companyInfo.industry}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Founded</p>
                  <p className="font-medium">{companyInfo.founded}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Employees</p>
                  <p className="font-medium">{companyInfo.employees}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="font-medium">{companyInfo.revenue}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-2">Core Values</p>
                <div className="flex flex-wrap gap-2">
                  {companyInfo.values.map((value) => (
                    <Badge key={value} variant="secondary">
                      {value}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-2">Tech Stack</p>
                <div className="flex flex-wrap gap-2">
                  {companyInfo.techStack.map((tech) => (
                    <Badge key={tech} variant="outline">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-2">Recent Achievements</p>
                <ul className="space-y-1">
                  {companyInfo.recentAchievements.map((achievement) => (
                    <li key={achievement} className="flex items-center gap-2 text-sm">
                      <Award className="h-3 w-3 text-yellow-600" />
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
              
              <Button variant="outline" className="w-full">
                <Globe className="mr-2 h-4 w-4" />
                Visit Website
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Interview Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Interview Tips
            </CardTitle>
            <CardDescription>Best practices for your interview</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="before">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="before">Before</TabsTrigger>
                <TabsTrigger value="during">During</TabsTrigger>
                <TabsTrigger value="after">After</TabsTrigger>
              </TabsList>
              
              <TabsContent value="before" className="mt-4 space-y-3">
                {interviewTips.before.map((tip, index) => (
                  <div key={index} className="flex gap-3 p-3 rounded-lg bg-blue-50">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      {tip.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{tip.title}</h4>
                      <p className="text-sm text-muted-foreground">{tip.description}</p>
                    </div>
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="during" className="mt-4 space-y-3">
                {interviewTips.during.map((tip, index) => (
                  <div key={index} className="flex gap-3 p-3 rounded-lg bg-green-50">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      {tip.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{tip.title}</h4>
                      <p className="text-sm text-muted-foreground">{tip.description}</p>
                    </div>
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="after" className="mt-4 space-y-3">
                {interviewTips.after.map((tip, index) => (
                  <div key={index} className="flex gap-3 p-3 rounded-lg bg-purple-50">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                      {tip.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{tip.title}</h4>
                      <p className="text-sm text-muted-foreground">{tip.description}</p>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
            
            <Separator className="my-4" />
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-50">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <span className="text-sm font-medium">Mock Interview Available</span>
                </div>
                <Button size="sm" variant="outline">
                  Start Practice
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}