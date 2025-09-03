"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Badge } from "@/components/ui/badge"
import { Plus, Settings, Trash2, Code, Database, Server, Network, Cloud, BookOpen, Briefcase, Edit2, CheckCircle } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

type QuestionTopic = "java" | "javascript" | "python" | "golang" | "database" | "postgres" | "mongodb" | "kafka" | "redis" | "computer-science" | "algorithms" | "data-structures" | "network" | "cloud" | "aws" | "docker" | "kubernetes" | "system-design" | "security" | "git"

interface TopicConfiguration {
  topic: QuestionTopic
  enabled: boolean
  easy: number
  medium: number
  hard: number
}

interface RoleConfiguration {
  id: string
  name: string
  description: string
  level: "junior" | "middle" | "senior" | "lead"
  interviewDuration: number
  topics: TopicConfiguration[]
}

const topicIcons: Record<QuestionTopic, React.ReactNode> = {
  java: <Code className="h-4 w-4" />,
  javascript: <Code className="h-4 w-4" />,
  python: <Code className="h-4 w-4" />,
  golang: <Code className="h-4 w-4" />,
  database: <Database className="h-4 w-4" />,
  postgres: <Database className="h-4 w-4" />,
  mongodb: <Database className="h-4 w-4" />,
  kafka: <Server className="h-4 w-4" />,
  redis: <Server className="h-4 w-4" />,
  "computer-science": <BookOpen className="h-4 w-4" />,
  algorithms: <BookOpen className="h-4 w-4" />,
  "data-structures": <BookOpen className="h-4 w-4" />,
  network: <Network className="h-4 w-4" />,
  cloud: <Cloud className="h-4 w-4" />,
  aws: <Cloud className="h-4 w-4" />,
  docker: <Server className="h-4 w-4" />,
  kubernetes: <Server className="h-4 w-4" />,
  "system-design": <BookOpen className="h-4 w-4" />,
  security: <Server className="h-4 w-4" />,
  git: <Code className="h-4 w-4" />,
}

const allTopics: QuestionTopic[] = [
  "java", "javascript", "python", "golang", "database", "postgres", "mongodb", 
  "kafka", "redis", "computer-science", "algorithms", "data-structures", 
  "network", "cloud", "aws", "docker", "kubernetes", "system-design", "security", "git"
]

export default function InterviewConfig() {
  const [roles, setRoles] = useState<RoleConfiguration[]>([
    {
      id: "1",
      name: "Java Backend Developer",
      description: "Backend developer with Java and Spring expertise",
      level: "middle",
      interviewDuration: 60,
      topics: [
        { topic: "java", enabled: true, easy: 40, medium: 40, hard: 20 },
        { topic: "database", enabled: true, easy: 50, medium: 35, hard: 15 },
        { topic: "kafka", enabled: true, easy: 60, medium: 30, hard: 10 },
        { topic: "algorithms", enabled: true, easy: 30, medium: 50, hard: 20 },
      ],
    },
    {
      id: "2", 
      name: "Senior Full Stack Developer",
      description: "Full stack developer with React and Node.js",
      level: "senior",
      interviewDuration: 90,
      topics: [
        { topic: "javascript", enabled: true, easy: 20, medium: 50, hard: 30 },
        { topic: "database", enabled: true, easy: 30, medium: 50, hard: 20 },
        { topic: "system-design", enabled: true, easy: 20, medium: 40, hard: 40 },
        { topic: "docker", enabled: true, easy: 40, medium: 40, hard: 20 },
      ],
    },
  ])

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<RoleConfiguration | null>(null)
  
  // Form state for new/edit role
  const [formData, setFormData] = useState<Partial<RoleConfiguration>>({
    name: "",
    description: "",
    level: "middle",
    interviewDuration: 60,
    topics: [],
  })
  const [showTopicSelector, setShowTopicSelector] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState<QuestionTopic | "">("")


  const handleUpdateTopicDifficulty = (topicIndex: number, difficulty: "easy" | "medium" | "hard", value: number) => {
    const updatedTopics = [...(formData.topics || [])]
    const topic = updatedTopics[topicIndex]
    
    // Simply update the specific difficulty without auto-redistribution
    topic[difficulty] = value
    
    setFormData({ ...formData, topics: updatedTopics })
  }

  const handleRemoveTopic = (index: number) => {
    const updatedTopics = [...(formData.topics || [])]
    updatedTopics.splice(index, 1)
    setFormData({ ...formData, topics: updatedTopics })
  }

  const handleAddTopic = () => {
    if (selectedTopic && !formData.topics?.some(t => t.topic === selectedTopic)) {
      const newTopic: TopicConfiguration = {
        topic: selectedTopic as QuestionTopic,
        enabled: true,
        easy: 40,
        medium: 40,
        hard: 20,
      }
      setFormData({ ...formData, topics: [...(formData.topics || []), newTopic] })
      setSelectedTopic("")
      setShowTopicSelector(false)
    }
  }

  const handleSaveRole = () => {
    if (formData.name && formData.topics && formData.topics.length > 0) {
      if (editingRole) {
        setRoles(roles.map(r => r.id === editingRole.id ? { ...editingRole, ...formData } : r))
        setEditingRole(null)
      } else {
        const newRole: RoleConfiguration = {
          id: Date.now().toString(),
          name: formData.name,
          description: formData.description || "",
          level: formData.level || "middle",
          interviewDuration: formData.interviewDuration || 60,
          topics: formData.topics,
        }
        setRoles([...roles, newRole])
      }
      setIsAddDialogOpen(false)
      setFormData({
        name: "",
        description: "",
        level: "middle",
        interviewDuration: 60,
        topics: [],
      })
      setShowTopicSelector(false)
      setSelectedTopic("")
      setEditingRole(null)
    }
  }

  const handleEditRole = (role: RoleConfiguration) => {
    setEditingRole(role)
    setFormData(role)
    setIsAddDialogOpen(true)
  }


  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Position Configuration</h1>
          <p className="text-muted-foreground mt-2">
            Configure interview settings for different positions
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open)
          if (open && !editingRole) {
            // Reset form when opening for new role
            setFormData({
              name: "",
              description: "",
              level: "middle",
              interviewDuration: 60,
              topics: [],
            })
            setShowTopicSelector(false)
            setSelectedTopic("")
          }
        }}>
          <DialogTrigger asChild>
            <Button 
              className="bg-gradient-to-r from-[#1B4F8C] to-[#2563EB]"
              onClick={() => {
                setEditingRole(null)
                setFormData({
                  name: "",
                  description: "",
                  level: "middle",
                  interviewDuration: 60,
                  topics: [],
                })
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Role Configuration
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingRole ? "Edit" : "Add"} Role Configuration</DialogTitle>
              <DialogDescription>
                Configure interview settings and question topics for this role
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 mt-4">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <Label>Role Name</Label>
                  <Input
                    placeholder="e.g., Senior Java Developer"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Input
                    placeholder="Brief description of the role"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Level</Label>
                    <Select
                      value={formData.level}
                      onValueChange={(value) => setFormData({ ...formData, level: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="junior">Junior</SelectItem>
                        <SelectItem value="middle">Middle</SelectItem>
                        <SelectItem value="senior">Senior</SelectItem>
                        <SelectItem value="lead">Lead</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Interview Duration (minutes)</Label>
                    <Input
                      type="number"
                      min="30"
                      max="180"
                      value={formData.interviewDuration}
                      onChange={(e) => setFormData({ ...formData, interviewDuration: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
              </div>

              {/* Topic Configuration */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <Label className="block">Question Topics Configuration</Label>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setShowTopicSelector(!showTopicSelector)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Topic
                  </Button>
                </div>

                {/* Topic Selector */}
                {showTopicSelector && (
                  <Card className="mb-3">
                    <CardContent className="p-3">
                      <div className="flex gap-2">
                        <Select
                          value={selectedTopic}
                          onValueChange={(value) => setSelectedTopic(value as QuestionTopic)}
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Select a topic to add" />
                          </SelectTrigger>
                          <SelectContent>
                            {allTopics
                              .filter(topic => !formData.topics?.some(t => t.topic === topic))
                              .map(topic => (
                                <SelectItem key={topic} value={topic}>
                                  <span className="capitalize">{topic.replace("-", " ")}</span>
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <Button
                          type="button"
                          size="sm"
                          onClick={handleAddTopic}
                          disabled={!selectedTopic}
                        >
                          Add
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setShowTopicSelector(false)
                            setSelectedTopic("")
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Topics List */}
                <div className="space-y-3">
                  {formData.topics?.map((topic, index) => (
                    <Card key={topic.topic}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {topicIcons[topic.topic]}
                            <span className="font-medium capitalize">{topic.topic.replace("-", " ")}</span>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveTopic(index)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <Label className="text-xs">Easy ({topic.easy}%)</Label>
                              <Slider
                                value={[topic.easy]}
                                onValueChange={([value]) => handleUpdateTopicDifficulty(index, "easy", value)}
                                max={100}
                                min={0}
                                step={5}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Medium ({topic.medium}%)</Label>
                              <Slider
                                value={[topic.medium]}
                                onValueChange={([value]) => handleUpdateTopicDifficulty(index, "medium", value)}
                                max={100}
                                min={0}
                                step={5}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Hard ({topic.hard}%)</Label>
                              <Slider
                                value={[topic.hard]}
                                onValueChange={([value]) => handleUpdateTopicDifficulty(index, "hard", value)}
                                max={100}
                                min={0}
                                step={5}
                                className="mt-1"
                              />
                            </div>
                          </div>
                          <div className={cn(
                            "text-xs p-2 rounded",
                            topic.easy + topic.medium + topic.hard === 100 
                              ? "bg-green-50 text-green-700" 
                              : "bg-yellow-50 text-yellow-700"
                          )}>
                            Total: {topic.easy + topic.medium + topic.hard}%
                            {topic.easy + topic.medium + topic.hard !== 100 && 
                              " (Should be 100%)"
                            }
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {formData.topics?.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No topics configured yet. Add topics to define the interview structure.
                    </div>
                  )}
                </div>
              </div>

              <Button onClick={handleSaveRole} className="w-full">
                {editingRole ? "Update" : "Create"} Configuration
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Roles Grid */}
      <div className="grid gap-6">
        {roles.map((role) => (
          <Card key={role.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{role.name}</CardTitle>
                  <CardDescription className="mt-1">{role.description}</CardDescription>
                  <div className="flex gap-2 mt-3">
                    <Badge variant="secondary" className="capitalize">
                      {role.level}
                    </Badge>
                    <Badge variant="outline">
                      {role.interviewDuration} min
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => handleEditRole(role)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-600"
                    onClick={() => setRoles(roles.filter(r => r.id !== role.id))}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Topics */}
              <div>
                <h4 className="text-sm font-medium mb-3">Question Topics</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {role.topics.map((topic) => (
                    <div key={topic.topic} className="border rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        {topicIcons[topic.topic]}
                        <span className="text-sm font-medium capitalize">
                          {topic.topic.replace("-", " ")}
                        </span>
                      </div>
                      <div className="text-xs space-y-1">
                        <div className="flex gap-1">
                          <span className="text-green-600">E:{topic.easy}%</span>
                          <span className="text-yellow-600">M:{topic.medium}%</span>
                          <span className="text-red-600">H:{topic.hard}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {roles.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No role configurations yet.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Create your first role configuration to get started.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}