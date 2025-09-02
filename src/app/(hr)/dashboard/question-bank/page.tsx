"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Copy,
  Save,
  X,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Code,
  Users,
  Briefcase,
  AlertCircle,
  CheckCircle,
  FileQuestion
} from "lucide-react"

type QuestionType = "technical" | "behavioral" | "experience"
type QuestionDifficulty = "easy" | "medium" | "hard"

interface Question {
  id: string
  question: string
  type: QuestionType
  difficulty: QuestionDifficulty
  expectedAnswer?: string
  timeLimit?: number // in minutes
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

interface Role {
  id: string
  name: string
  level: string // Junior, Middle, Senior, Lead
  department: string // Backend, Frontend, DevOps, QA, etc.
  questions: Question[]
  createdAt: Date
}

// Mock data
const initialRoles: Role[] = [
  {
    id: "role-1",
    name: "Java Developer",
    level: "Junior",
    department: "Backend",
    questions: [
      {
        id: "q-1",
        question: "What is the difference between JDK, JRE, and JVM?",
        type: "technical",
        difficulty: "easy",
        expectedAnswer: "JDK is Java Development Kit, JRE is Java Runtime Environment, JVM is Java Virtual Machine...",
        timeLimit: 3,
        tags: ["java", "fundamentals"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "q-2",
        question: "Tell me about a time when you had to learn something new quickly.",
        type: "behavioral",
        difficulty: "medium",
        timeLimit: 5,
        tags: ["learning", "adaptability"],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    createdAt: new Date()
  },
  {
    id: "role-2",
    name: "React Developer",
    level: "Middle",
    department: "Frontend",
    questions: [
      {
        id: "q-3",
        question: "Explain the Virtual DOM and how React uses it.",
        type: "technical",
        difficulty: "medium",
        expectedAnswer: "Virtual DOM is a JavaScript representation of the real DOM...",
        timeLimit: 5,
        tags: ["react", "virtual-dom", "performance"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "q-4",
        question: "What projects have you worked on using React?",
        type: "experience",
        difficulty: "easy",
        timeLimit: 5,
        tags: ["projects", "react"],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    createdAt: new Date()
  },
  {
    id: "role-3",
    name: "GoLang Developer",
    level: "Senior",
    department: "Backend",
    questions: [
      {
        id: "q-5",
        question: "Explain Go's concurrency model and how goroutines work.",
        type: "technical",
        difficulty: "hard",
        expectedAnswer: "Go uses CSP (Communicating Sequential Processes) model...",
        timeLimit: 7,
        tags: ["golang", "concurrency", "goroutines"],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    createdAt: new Date()
  }
]

export default function QuestionBankPage() {
  const [roles, setRoles] = useState<Role[]>(initialRoles)
  const [selectedRole, setSelectedRole] = useState<Role | null>(roles[0])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<QuestionType | "all">("all")
  const [filterDifficulty, setFilterDifficulty] = useState<QuestionDifficulty | "all">("all")
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false)
  const [isAddQuestionOpen, setIsAddQuestionOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [deleteConfirmQuestion, setDeleteConfirmQuestion] = useState<Question | null>(null)
  const [deleteConfirmRole, setDeleteConfirmRole] = useState<Role | null>(null)

  // Form states
  const [newRole, setNewRole] = useState({
    name: "",
    level: "",
    department: ""
  })

  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    question: "",
    type: "technical",
    difficulty: "medium",
    expectedAnswer: "",
    timeLimit: 5,
    tags: []
  })

  const departments = ["Backend", "Frontend", "DevOps", "QA", "Data Science", "Mobile", "Full Stack"]
  const levels = ["Junior", "Middle", "Senior", "Lead", "Principal"]

  const getTypeIcon = (type: QuestionType) => {
    switch (type) {
      case "technical": return <Code className="h-4 w-4" />
      case "behavioral": return <Users className="h-4 w-4" />
      case "experience": return <Briefcase className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: QuestionType) => {
    switch (type) {
      case "technical": return "bg-blue-100 text-blue-800"
      case "behavioral": return "bg-green-100 text-green-800"
      case "experience": return "bg-purple-100 text-purple-800"
    }
  }

  const getDifficultyColor = (difficulty: QuestionDifficulty) => {
    switch (difficulty) {
      case "easy": return "bg-green-100 text-green-800"
      case "medium": return "bg-yellow-100 text-yellow-800"
      case "hard": return "bg-red-100 text-red-800"
    }
  }

  const handleAddRole = () => {
    if (newRole.name && newRole.level && newRole.department) {
      const role: Role = {
        id: `role-${Date.now()}`,
        name: newRole.name,
        level: newRole.level,
        department: newRole.department,
        questions: [],
        createdAt: new Date()
      }
      setRoles([...roles, role])
      setSelectedRole(role)
      setNewRole({ name: "", level: "", department: "" })
      setIsAddRoleOpen(false)
    }
  }

  const handleAddQuestion = () => {
    if (selectedRole && newQuestion.question) {
      const question: Question = {
        id: `q-${Date.now()}`,
        question: newQuestion.question,
        type: newQuestion.type as QuestionType,
        difficulty: newQuestion.difficulty as QuestionDifficulty,
        expectedAnswer: newQuestion.expectedAnswer,
        timeLimit: newQuestion.timeLimit,
        tags: newQuestion.tags || [],
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const updatedRoles = roles.map(role => {
        if (role.id === selectedRole.id) {
          return { ...role, questions: [...role.questions, question] }
        }
        return role
      })

      setRoles(updatedRoles)
      setSelectedRole({ ...selectedRole, questions: [...selectedRole.questions, question] })
      setNewQuestion({
        question: "",
        type: "technical",
        difficulty: "medium",
        expectedAnswer: "",
        timeLimit: 5,
        tags: []
      })
      setIsAddQuestionOpen(false)
    }
  }

  const handleUpdateQuestion = () => {
    if (selectedRole && editingQuestion && newQuestion.question) {
      const updatedQuestion: Question = {
        ...editingQuestion,
        question: newQuestion.question,
        type: newQuestion.type as QuestionType,
        difficulty: newQuestion.difficulty as QuestionDifficulty,
        expectedAnswer: newQuestion.expectedAnswer,
        timeLimit: newQuestion.timeLimit,
        tags: newQuestion.tags || [],
        updatedAt: new Date()
      }

      const updatedRoles = roles.map(role => {
        if (role.id === selectedRole.id) {
          return {
            ...role,
            questions: role.questions.map(q => q.id === editingQuestion.id ? updatedQuestion : q)
          }
        }
        return role
      })

      setRoles(updatedRoles)
      setSelectedRole({
        ...selectedRole,
        questions: selectedRole.questions.map(q => q.id === editingQuestion.id ? updatedQuestion : q)
      })
      setEditingQuestion(null)
      setNewQuestion({
        question: "",
        type: "technical",
        difficulty: "medium",
        expectedAnswer: "",
        timeLimit: 5,
        tags: []
      })
    }
  }

  const handleDeleteQuestion = (question: Question) => {
    if (selectedRole) {
      const updatedRoles = roles.map(role => {
        if (role.id === selectedRole.id) {
          return {
            ...role,
            questions: role.questions.filter(q => q.id !== question.id)
          }
        }
        return role
      })

      setRoles(updatedRoles)
      setSelectedRole({
        ...selectedRole,
        questions: selectedRole.questions.filter(q => q.id !== question.id)
      })
      setDeleteConfirmQuestion(null)
    }
  }

  const handleDeleteRole = (role: Role) => {
    const updatedRoles = roles.filter(r => r.id !== role.id)
    setRoles(updatedRoles)
    if (selectedRole?.id === role.id) {
      setSelectedRole(updatedRoles[0] || null)
    }
    setDeleteConfirmRole(null)
  }

  const handleDuplicateQuestion = (question: Question) => {
    if (selectedRole) {
      const duplicatedQuestion: Question = {
        ...question,
        id: `q-${Date.now()}`,
        question: `${question.question} (Copy)`,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const updatedRoles = roles.map(role => {
        if (role.id === selectedRole.id) {
          return { ...role, questions: [...role.questions, duplicatedQuestion] }
        }
        return role
      })

      setRoles(updatedRoles)
      setSelectedRole({ ...selectedRole, questions: [...selectedRole.questions, duplicatedQuestion] })
    }
  }

  const filteredQuestions = selectedRole?.questions.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         q.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesType = filterType === "all" || q.type === filterType
    const matchesDifficulty = filterDifficulty === "all" || q.difficulty === filterDifficulty
    return matchesSearch && matchesType && matchesDifficulty
  }) || []

  return (
    <div className="flex-1 space-y-6 p-4 pt-6 pb-20 md:pb-6 md:p-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Interview Question Bank</h1>
        <p className="text-sm text-muted-foreground">
          Create and manage interview questions for different roles and experience levels
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        {/* Roles Sidebar */}
        <Card className="h-fit">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Roles</CardTitle>
              <Dialog open={isAddRoleOpen} onOpenChange={setIsAddRoleOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Role
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-base font-semibold">Add New Role</DialogTitle>
                    <DialogDescription className="text-xs">
                      Create a new role to organize interview questions
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Role Name</Label>
                      <Input
                        placeholder="e.g., Java Developer"
                        value={newRole.name}
                        onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Level</Label>
                      <Select value={newRole.level} onValueChange={(value) => setNewRole({ ...newRole, level: value })}>
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          {levels.map(level => (
                            <SelectItem key={level} value={level} className="text-sm">{level}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Department</Label>
                      <Select value={newRole.department} onValueChange={(value) => setNewRole({ ...newRole, department: value })}>
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map(dept => (
                            <SelectItem key={dept} value={dept} className="text-sm">{dept}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" size="sm" onClick={() => setIsAddRoleOpen(false)} className="text-sm">Cancel</Button>
                    <Button size="sm" onClick={handleAddRole} className="text-sm">Add Role</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[600px]">
              <div className="space-y-1 p-4">
                {roles.map(role => (
                  <div
                    key={role.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors group ${
                      selectedRole?.id === role.id
                        ? "bg-[#1B4F8C]/10 border border-[#1B4F8C]/20"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => setSelectedRole(role)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">{role.level} {role.name}</h4>
                        <p className="text-xs text-muted-foreground">{role.department}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {role.questions.length} questions
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation()
                          setDeleteConfirmRole(role)
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Questions Section */}
        <div className="space-y-4">
          {selectedRole ? (
            <>
              {/* Role Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{selectedRole.level} {selectedRole.name}</CardTitle>
                      <CardDescription>
                        {selectedRole.department} • {selectedRole.questions.length} questions
                      </CardDescription>
                    </div>
                    <Button onClick={() => setIsAddQuestionOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Question
                    </Button>
                  </div>
                </CardHeader>
              </Card>

              {/* Filters */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search questions or tags..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                    </div>
                    <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="behavioral">Behavioral</SelectItem>
                        <SelectItem value="experience">Experience</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filterDifficulty} onValueChange={(value: any) => setFilterDifficulty(value)}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="All Levels" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Questions List */}
              <div className="space-y-4">
                {filteredQuestions.length > 0 ? (
                  filteredQuestions.map((question, index) => (
                    <Card key={question.id}>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">#{index + 1}</span>
                                <Badge className={getTypeColor(question.type)}>
                                  {getTypeIcon(question.type)}
                                  <span className="ml-1">{question.type}</span>
                                </Badge>
                                <Badge className={getDifficultyColor(question.difficulty)}>
                                  {question.difficulty}
                                </Badge>
                                {question.timeLimit && (
                                  <Badge variant="outline">
                                    {question.timeLimit} min
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm font-medium">{question.question}</p>
                              {question.expectedAnswer && (
                                <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                                  <p className="text-xs text-muted-foreground mb-1">Expected Answer:</p>
                                  <p className="text-xs">{question.expectedAnswer}</p>
                                </div>
                              )}
                              {question.tags.length > 0 && (
                                <div className="flex items-center gap-2 flex-wrap">
                                  {question.tags.map(tag => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-1 ml-4">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDuplicateQuestion(question)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setEditingQuestion(question)
                                  setNewQuestion({
                                    question: question.question,
                                    type: question.type,
                                    difficulty: question.difficulty,
                                    expectedAnswer: question.expectedAnswer,
                                    timeLimit: question.timeLimit,
                                    tags: question.tags
                                  })
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setDeleteConfirmQuestion(question)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="py-12">
                      <div className="text-center space-y-3">
                        <FileQuestion className="h-12 w-12 text-gray-400 mx-auto" />
                        <p className="text-muted-foreground">
                          {searchQuery || filterType !== "all" || filterDifficulty !== "all"
                            ? "No questions match your filters"
                            : "No questions added yet"}
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => setIsAddQuestionOpen(true)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add First Question
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="py-12">
                <div className="text-center space-y-3">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto" />
                  <p className="text-muted-foreground">
                    Select a role to view and manage questions
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Add/Edit Question Dialog */}
      <Dialog open={isAddQuestionOpen || !!editingQuestion} onOpenChange={(open) => {
        if (!open) {
          setIsAddQuestionOpen(false)
          setEditingQuestion(null)
          setNewQuestion({
            question: "",
            type: "technical",
            difficulty: "medium",
            expectedAnswer: "",
            timeLimit: 5,
            tags: []
          })
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">{editingQuestion ? "Edit Question" : "Add New Question"}</DialogTitle>
            <DialogDescription className="text-xs">
              {editingQuestion ? "Update the interview question details" : "Create a new interview question for this role"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-3">
            <div className="space-y-1.5">
              <Label htmlFor="question" className="text-xs font-medium">Question</Label>
              <Textarea
                id="question"
                placeholder="Enter the interview question..."
                value={newQuestion.question}
                onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                rows={3}
                className="resize-none text-sm"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="type" className="text-xs font-medium">Type</Label>
                <Select 
                  value={newQuestion.type} 
                  onValueChange={(value: QuestionType) => setNewQuestion({ ...newQuestion, type: value })}
                >
                  <SelectTrigger id="type" className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical" className="text-sm">Technical</SelectItem>
                    <SelectItem value="behavioral" className="text-sm">Behavioral</SelectItem>
                    <SelectItem value="experience" className="text-sm">Experience</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="difficulty" className="text-xs font-medium">Difficulty</Label>
                <Select 
                  value={newQuestion.difficulty} 
                  onValueChange={(value: QuestionDifficulty) => setNewQuestion({ ...newQuestion, difficulty: value })}
                >
                  <SelectTrigger id="difficulty" className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy" className="text-sm">Easy</SelectItem>
                    <SelectItem value="medium" className="text-sm">Medium</SelectItem>
                    <SelectItem value="hard" className="text-sm">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="timeLimit" className="text-xs font-medium">Time Limit (min)</Label>
                <Input
                  id="timeLimit"
                  type="number"
                  min="1"
                  max="30"
                  value={newQuestion.timeLimit}
                  onChange={(e) => setNewQuestion({ ...newQuestion, timeLimit: parseInt(e.target.value) || 5 })}
                  className="w-full h-8 text-sm"
                />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="expectedAnswer" className="text-xs font-medium">Expected Answer (Optional)</Label>
              <Textarea
                id="expectedAnswer"
                placeholder="Enter the expected answer or key points..."
                value={newQuestion.expectedAnswer}
                onChange={(e) => setNewQuestion({ ...newQuestion, expectedAnswer: e.target.value })}
                rows={3}
                className="resize-none text-sm"
              />
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="tags" className="text-xs font-medium">Tags (comma-separated)</Label>
              <Input
                id="tags"
                placeholder="e.g., java, oop, design-patterns"
                value={newQuestion.tags?.join(", ")}
                onChange={(e) => setNewQuestion({ 
                  ...newQuestion, 
                  tags: e.target.value.split(",").map(tag => tag.trim()).filter(Boolean)
                })}
                className="w-full h-8 text-sm"
              />
            </div>
          </div>
          
          <DialogFooter className="gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setIsAddQuestionOpen(false)
                setEditingQuestion(null)
                setNewQuestion({
                  question: "",
                  type: "technical",
                  difficulty: "medium",
                  expectedAnswer: "",
                  timeLimit: 5,
                  tags: []
                })
              }}
              className="text-sm"
            >
              Cancel
            </Button>
            <Button 
              size="sm"
              onClick={editingQuestion ? handleUpdateQuestion : handleAddQuestion}
              className="bg-[#1B4F8C] hover:bg-[#1B4F8C]/90 text-sm"
            >
              {editingQuestion ? "Update Question" : "Add Question"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Question Confirmation */}
      <AlertDialog open={!!deleteConfirmQuestion} onOpenChange={() => setDeleteConfirmQuestion(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Question</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this question? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteConfirmQuestion && handleDeleteQuestion(deleteConfirmQuestion)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Role Confirmation */}
      <AlertDialog open={!!deleteConfirmRole} onOpenChange={() => setDeleteConfirmRole(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Role</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteConfirmRole?.level} {deleteConfirmRole?.name}"? 
              This will also delete all {deleteConfirmRole?.questions.length} associated questions. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteConfirmRole && handleDeleteRole(deleteConfirmRole)}>
              Delete Role
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}