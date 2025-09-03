"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Plus, Search, Filter, Edit2, Trash2, BookOpen, Code, Database, Network, Server, Cloud, Globe, HardDrive, MessageSquare, Cpu, ChevronRight, FolderPlus } from "lucide-react"

type QuestionDifficulty = "easy" | "medium" | "hard"

interface Question {
  id: string
  category: string
  difficulty: QuestionDifficulty
  question: string
  answer: string
  tags: string[]
  estimatedTime: number // in minutes
  isTemplate: boolean // true for pre-populated, false for user-created
}

interface Category {
  id: string
  name: string
  icon?: React.ReactNode
  isCustom: boolean
}

// Default categories
const defaultCategories: Category[] = [
  { id: "java", name: "Java", icon: <Code className="h-4 w-4" />, isCustom: false },
  { id: "javascript", name: "JavaScript", icon: <Code className="h-4 w-4" />, isCustom: false },
  { id: "python", name: "Python", icon: <Code className="h-4 w-4" />, isCustom: false },
  { id: "golang", name: "Golang", icon: <Code className="h-4 w-4" />, isCustom: false },
  { id: "database", name: "Database", icon: <Database className="h-4 w-4" />, isCustom: false },
  { id: "algorithms", name: "Algorithms", icon: <Cpu className="h-4 w-4" />, isCustom: false },
  { id: "kafka", name: "Kafka", icon: <MessageSquare className="h-4 w-4" />, isCustom: false },
  { id: "rabbitmq", name: "RabbitMQ", icon: <MessageSquare className="h-4 w-4" />, isCustom: false },
  { id: "redis", name: "Redis", icon: <Server className="h-4 w-4" />, isCustom: false },
  { id: "network", name: "Network", icon: <Network className="h-4 w-4" />, isCustom: false },
  { id: "cloud", name: "Cloud", icon: <Cloud className="h-4 w-4" />, isCustom: false },
  { id: "docker", name: "Docker", icon: <Server className="h-4 w-4" />, isCustom: false },
  { id: "kubernetes", name: "Kubernetes", icon: <Server className="h-4 w-4" />, isCustom: false },
  { id: "system-design", name: "System Design", icon: <Globe className="h-4 w-4" />, isCustom: false },
  { id: "security", name: "Security", icon: <HardDrive className="h-4 w-4" />, isCustom: false },
  { id: "git", name: "Git", icon: <Code className="h-4 w-4" />, isCustom: false },
]

// Pre-populated template questions
const templateQuestions: Question[] = [
  // Java Questions
  {
    id: "java-1",
    category: "java",
    difficulty: "easy",
    question: "What is the difference between JDK, JRE, and JVM?",
    answer: "JVM (Java Virtual Machine) executes bytecode. JRE (Java Runtime Environment) includes JVM + libraries needed to run Java applications. JDK (Java Development Kit) includes JRE + development tools (compiler, debugger).",
    tags: ["basics", "architecture"],
    estimatedTime: 2,
    isTemplate: true,
  },
  {
    id: "java-2",
    category: "java",
    difficulty: "medium",
    question: "Explain the difference between ArrayList and LinkedList. When would you use each?",
    answer: "ArrayList: Dynamic array, O(1) random access, O(n) insertion/deletion in middle, better for frequent access. LinkedList: Doubly-linked nodes, O(n) access, O(1) insertion/deletion with iterator, better for frequent modifications.",
    tags: ["collections", "data-structures"],
    estimatedTime: 3,
    isTemplate: true,
  },
  {
    id: "java-3",
    category: "java",
    difficulty: "hard",
    question: "Explain Java Memory Model and how garbage collection works.",
    answer: "JVM memory divided into: Heap (objects), Stack (method calls, local variables), Method Area (class metadata). GC algorithms: Serial, Parallel, G1GC, ZGC. Generational collection: Young (Eden, Survivors), Old generation. GC removes unreachable objects.",
    tags: ["memory", "performance"],
    estimatedTime: 5,
    isTemplate: true,
  },
  {
    id: "java-4",
    category: "java",
    difficulty: "medium",
    question: "What is the difference between abstract class and interface in Java 8+?",
    answer: "Abstract class: single inheritance, can have constructors, instance variables, concrete methods. Interface (Java 8+): multiple inheritance, default/static methods allowed, only public static final variables, no constructors.",
    tags: ["oop", "design"],
    estimatedTime: 3,
    isTemplate: true,
  },
  {
    id: "java-5",
    category: "java",
    difficulty: "easy",
    question: "What are the main principles of OOP?",
    answer: "Encapsulation (data hiding), Inheritance (reuse through hierarchy), Polymorphism (multiple forms - overloading/overriding), Abstraction (hiding implementation details).",
    tags: ["oop", "basics"],
    estimatedTime: 2,
    isTemplate: true,
  },

  // Database Questions
  {
    id: "db-1",
    category: "database",
    difficulty: "easy",
    question: "What is the difference between SQL and NoSQL databases?",
    answer: "SQL: Relational, ACID compliant, structured schema, vertical scaling, complex queries. NoSQL: Non-relational, BASE properties, flexible schema, horizontal scaling, better for unstructured data.",
    tags: ["basics", "comparison"],
    estimatedTime: 2,
    isTemplate: true,
  },
  {
    id: "db-2",
    category: "database",
    difficulty: "medium",
    question: "Explain database indexing and its types.",
    answer: "Indexing improves query performance by creating data structures for faster lookups. Types: B-tree (range queries), Hash (equality), Bitmap (low cardinality), Clustered (physical order), Non-clustered (separate structure).",
    tags: ["performance", "indexing"],
    estimatedTime: 3,
    isTemplate: true,
  },
  {
    id: "db-3",
    category: "database",
    difficulty: "hard",
    question: "How would you optimize a slow query joining 5 large tables?",
    answer: "1. Analyze execution plan 2. Add appropriate indexes on join/where columns 3. Update statistics 4. Consider denormalization 5. Use query hints 6. Partition tables 7. Materialized views 8. Review join order 9. Consider breaking into smaller queries",
    tags: ["optimization", "performance"],
    estimatedTime: 5,
    isTemplate: true,
  },
  {
    id: "db-4",
    category: "database",
    difficulty: "medium",
    question: "Explain ACID properties with examples.",
    answer: "Atomicity: All or nothing transactions. Consistency: Data integrity maintained. Isolation: Concurrent transactions don't interfere. Durability: Committed changes persist. Example: Bank transfer must complete fully or rollback.",
    tags: ["transactions", "acid"],
    estimatedTime: 3,
    isTemplate: true,
  },
  {
    id: "db-5",
    category: "database",
    difficulty: "easy",
    question: "What are the different types of SQL JOINs?",
    answer: "INNER JOIN: Matching records from both tables. LEFT JOIN: All from left + matching from right. RIGHT JOIN: All from right + matching from left. FULL OUTER JOIN: All records from both. CROSS JOIN: Cartesian product.",
    tags: ["sql", "basics"],
    estimatedTime: 2,
    isTemplate: true,
  },

  // Algorithms Questions
  {
    id: "algo-1",
    category: "algorithms",
    difficulty: "easy",
    question: "Explain time complexity and Big O notation.",
    answer: "Time complexity measures algorithm efficiency as input grows. Big O describes worst-case scenario. Common: O(1) constant, O(log n) logarithmic, O(n) linear, O(n log n) linearithmic, O(n²) quadratic, O(2^n) exponential.",
    tags: ["complexity", "basics"],
    estimatedTime: 2,
    isTemplate: true,
  },
  {
    id: "algo-2",
    category: "algorithms",
    difficulty: "medium",
    question: "Implement and explain binary search.",
    answer: "Binary search finds element in sorted array by repeatedly dividing search interval in half. Compare target with middle element, eliminate half. Time: O(log n), Space: O(1) iterative, O(log n) recursive.",
    tags: ["search", "divide-conquer"],
    estimatedTime: 3,
    isTemplate: true,
  },
  {
    id: "algo-3",
    category: "algorithms",
    difficulty: "hard",
    question: "Explain dynamic programming with an example problem.",
    answer: "DP solves complex problems by breaking into overlapping subproblems, storing results. Example: Fibonacci with memoization. Key: optimal substructure, overlapping subproblems. Approaches: top-down (memoization), bottom-up (tabulation).",
    tags: ["dp", "optimization"],
    estimatedTime: 5,
    isTemplate: true,
  },
  {
    id: "algo-4",
    category: "algorithms",
    difficulty: "medium",
    question: "Compare DFS and BFS traversal algorithms.",
    answer: "DFS: Uses stack (recursion), goes deep first, memory O(h), finds path existence. BFS: Uses queue, explores level by level, memory O(w), finds shortest path in unweighted graph. Both O(V+E) time.",
    tags: ["graphs", "traversal"],
    estimatedTime: 3,
    isTemplate: true,
  },
  {
    id: "algo-5",
    category: "algorithms",
    difficulty: "easy",
    question: "What is a hash table and how does it work?",
    answer: "Hash table stores key-value pairs using hash function to compute index. Provides O(1) average insert/delete/search. Handles collisions via chaining (linked lists) or open addressing (probing).",
    tags: ["data-structures", "hashing"],
    estimatedTime: 2,
    isTemplate: true,
  },

  // Kafka Questions
  {
    id: "kafka-1",
    category: "kafka",
    difficulty: "easy",
    question: "What is Apache Kafka and its main use cases?",
    answer: "Kafka is distributed streaming platform for high-throughput, fault-tolerant messaging. Use cases: Real-time analytics, log aggregation, event sourcing, stream processing, messaging system replacement, activity tracking.",
    tags: ["basics", "messaging"],
    estimatedTime: 2,
    isTemplate: true,
  },
  {
    id: "kafka-2",
    category: "kafka",
    difficulty: "medium",
    question: "Explain Kafka architecture: brokers, topics, partitions, and replicas.",
    answer: "Brokers: Kafka servers storing data. Topics: Logical channels for messages. Partitions: Topic splits for parallelism, ordered within partition. Replicas: Copies for fault tolerance, one leader handles reads/writes, followers sync.",
    tags: ["architecture", "distributed"],
    estimatedTime: 3,
    isTemplate: true,
  },
  {
    id: "kafka-3",
    category: "kafka",
    difficulty: "hard",
    question: "How does Kafka ensure message ordering and exactly-once delivery?",
    answer: "Ordering: Within partition using offset, key-based partitioning for related messages. Exactly-once: Idempotent producers (de-duplication), transactional writes, consumer read_committed isolation level. Requires Kafka 0.11+.",
    tags: ["guarantees", "advanced"],
    estimatedTime: 5,
    isTemplate: true,
  },
  {
    id: "kafka-4",
    category: "kafka",
    difficulty: "medium",
    question: "What is consumer group and how does rebalancing work?",
    answer: "Consumer group: Set of consumers sharing topic consumption. Each partition assigned to one consumer. Rebalancing: Redistribution when consumer joins/leaves. Coordinator manages, uses heartbeats, can cause temporary pause.",
    tags: ["consumers", "coordination"],
    estimatedTime: 3,
    isTemplate: true,
  },
  {
    id: "kafka-5",
    category: "kafka",
    difficulty: "easy",
    question: "What is the difference between Kafka and traditional message queues?",
    answer: "Kafka: Pull-based, persistent storage, replay capability, high throughput, partitioned. Traditional MQ: Push-based, message removed after consumption, lower throughput, typically not partitioned.",
    tags: ["comparison", "basics"],
    estimatedTime: 2,
    isTemplate: true,
  },

  // RabbitMQ Questions
  {
    id: "rabbit-1",
    category: "rabbitmq",
    difficulty: "easy",
    question: "What is RabbitMQ and how does it differ from Kafka?",
    answer: "RabbitMQ: Message broker with smart broker/dumb consumer, message routing, multiple protocols (AMQP). Focuses on reliability, complex routing. Kafka: Distributed log, dumb broker/smart consumer, higher throughput, stream processing.",
    tags: ["basics", "comparison"],
    estimatedTime: 2,
    isTemplate: true,
  },
  {
    id: "rabbit-2",
    category: "rabbitmq",
    difficulty: "medium",
    question: "Explain RabbitMQ exchange types.",
    answer: "Direct: Route by exact routing key match. Topic: Pattern matching with wildcards (*,#). Fanout: Broadcast to all bound queues. Headers: Route by message headers. Default: Direct exchange with queue name as routing key.",
    tags: ["routing", "exchanges"],
    estimatedTime: 3,
    isTemplate: true,
  },
  {
    id: "rabbit-3",
    category: "rabbitmq",
    difficulty: "hard",
    question: "How to implement priority queues and ensure message reliability in RabbitMQ?",
    answer: "Priority: x-max-priority queue argument, message priority property. Reliability: Publisher confirms, consumer acknowledgments, persistent messages, queue durability, HA queues/quorum queues, dead letter exchanges for failed messages.",
    tags: ["reliability", "advanced"],
    estimatedTime: 5,
    isTemplate: true,
  },

  // System Design Questions
  {
    id: "design-1",
    category: "system-design",
    difficulty: "medium",
    question: "How would you design a URL shortener service like bit.ly?",
    answer: "Requirements: Shorten URLs, redirect, analytics. Design: API Gateway, App servers, Cache (Redis), DB (URL mappings), CDN. Key generation: Counter, hash, or pre-generated. Scale: Sharding by URL key, read replicas, caching.",
    tags: ["web", "scalability"],
    estimatedTime: 5,
    isTemplate: true,
  },
  {
    id: "design-2",
    category: "system-design",
    difficulty: "hard",
    question: "Design a distributed cache system.",
    answer: "Components: Consistent hashing for distribution, replication for availability, LRU/LFU eviction, client libraries. Features: TTL, cache warming, invalidation strategies, monitoring. Consider: CAP theorem trade-offs, hot keys, cache stampede.",
    tags: ["distributed", "caching"],
    estimatedTime: 7,
    isTemplate: true,
  },
  {
    id: "design-3",
    category: "system-design",
    difficulty: "medium",
    question: "What are microservices and their pros/cons?",
    answer: "Small, independent services communicating via APIs. Pros: Independent deployment, technology diversity, fault isolation, scalability. Cons: Network complexity, data consistency, debugging difficulty, operational overhead.",
    tags: ["architecture", "microservices"],
    estimatedTime: 3,
    isTemplate: true,
  },

  // Docker Questions
  {
    id: "docker-1",
    category: "docker",
    difficulty: "easy",
    question: "What is Docker and how does containerization differ from virtualization?",
    answer: "Docker: Platform for containerization. Containers share host OS kernel, lightweight, fast startup, less overhead. VMs: Full OS, hardware virtualization, more isolation, more resources. Containers ideal for microservices.",
    tags: ["basics", "containers"],
    estimatedTime: 2,
    isTemplate: true,
  },
  {
    id: "docker-2",
    category: "docker",
    difficulty: "medium",
    question: "Explain Dockerfile best practices and multi-stage builds.",
    answer: "Best practices: Minimal base images, combine RUN commands, layer caching, .dockerignore, non-root user. Multi-stage: Separate build/runtime, smaller final image, build dependencies don't ship to production.",
    tags: ["dockerfile", "optimization"],
    estimatedTime: 3,
    isTemplate: true,
  },

  // Kubernetes Questions
  {
    id: "k8s-1",
    category: "kubernetes",
    difficulty: "medium",
    question: "Explain Kubernetes architecture and core components.",
    answer: "Control Plane: API Server, etcd, Scheduler, Controller Manager. Nodes: kubelet, kube-proxy, container runtime. Objects: Pods (smallest unit), Services (networking), Deployments (desired state), ConfigMaps/Secrets (configuration).",
    tags: ["architecture", "orchestration"],
    estimatedTime: 4,
    isTemplate: true,
  },
  {
    id: "k8s-2",
    category: "kubernetes",
    difficulty: "hard",
    question: "How does Kubernetes handle scaling, rolling updates, and rollbacks?",
    answer: "Scaling: HPA (CPU/memory), VPA (right-sizing), Cluster Autoscaler. Rolling updates: Progressive replacement, readiness probes, maxSurge/maxUnavailable. Rollbacks: Revision history, kubectl rollout undo, automated on failures.",
    tags: ["deployment", "scaling"],
    estimatedTime: 5,
    isTemplate: true,
  },

  // Security Questions
  {
    id: "security-1",
    category: "security",
    difficulty: "medium",
    question: "What are common web application vulnerabilities (OWASP Top 10)?",
    answer: "Injection (SQL/NoSQL), Broken Authentication, Sensitive Data Exposure, XXE, Broken Access Control, Security Misconfiguration, XSS, Insecure Deserialization, Components with Vulnerabilities, Insufficient Logging.",
    tags: ["web", "owasp"],
    estimatedTime: 4,
    isTemplate: true,
  },
  {
    id: "security-2",
    category: "security",
    difficulty: "easy",
    question: "Explain the difference between authentication and authorization.",
    answer: "Authentication: Verifying identity (who you are) via passwords, tokens, biometrics. Authorization: Determining access rights (what you can do) based on roles, permissions. Authentication happens first, then authorization.",
    tags: ["basics", "access-control"],
    estimatedTime: 2,
    isTemplate: true,
  },

  // Git Questions
  {
    id: "git-1",
    category: "git",
    difficulty: "easy",
    question: "What is the difference between git merge and git rebase?",
    answer: "Merge: Creates merge commit, preserves branch history, non-destructive. Rebase: Moves commits to new base, linear history, rewrites commit history. Use rebase for feature branches, merge for shared branches.",
    tags: ["branching", "basics"],
    estimatedTime: 2,
    isTemplate: true,
  },
  {
    id: "git-2",
    category: "git",
    difficulty: "medium",
    question: "How do you resolve merge conflicts and what causes them?",
    answer: "Conflicts occur when same lines modified in different branches. Resolution: 1. Identify conflicts (<<<===>>>) 2. Edit files to resolve 3. Stage resolved files 4. Complete merge. Tools: git mergetool, IDEs.",
    tags: ["conflicts", "collaboration"],
    estimatedTime: 3,
    isTemplate: true,
  },
]

export default function QuestionsBank() {
  const [categories, setCategories] = useState<Category[]>(defaultCategories)
  const [questions, setQuestions] = useState<Question[]>(templateQuestions)
  const [selectedCategory, setSelectedCategory] = useState<string>("java")
  const [selectedDifficulty, setSelectedDifficulty] = useState<QuestionDifficulty | "all">("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")

  // Form states for new question
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    category: "java",
    difficulty: "medium",
    question: "",
    answer: "",
    tags: [],
    estimatedTime: 3,
    isTemplate: false,
  })

  const filteredQuestions = questions.filter(q => {
    const categoryMatch = q.category === selectedCategory
    const difficultyMatch = selectedDifficulty === "all" || q.difficulty === selectedDifficulty
    const searchMatch = searchTerm === "" || 
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    return categoryMatch && difficultyMatch && searchMatch
  })

  const categoryStats = questions.reduce((acc, q) => {
    if (!acc[q.category]) {
      acc[q.category] = { easy: 0, medium: 0, hard: 0, total: 0, templates: 0, custom: 0 }
    }
    acc[q.category][q.difficulty]++
    acc[q.category].total++
    if (q.isTemplate) {
      acc[q.category].templates++
    } else {
      acc[q.category].custom++
    }
    return acc
  }, {} as Record<string, { easy: number; medium: number; hard: number; total: number; templates: number; custom: number }>)

  const handleAddQuestion = () => {
    if (newQuestion.question && newQuestion.answer) {
      const question: Question = {
        id: `custom-${Date.now()}`,
        category: newQuestion.category || selectedCategory,
        difficulty: newQuestion.difficulty as QuestionDifficulty,
        question: newQuestion.question,
        answer: newQuestion.answer,
        tags: newQuestion.tags || [],
        estimatedTime: newQuestion.estimatedTime || 3,
        isTemplate: false,
      }
      setQuestions([...questions, question])
      setIsAddDialogOpen(false)
      setNewQuestion({
        category: selectedCategory,
        difficulty: "medium",
        question: "",
        answer: "",
        tags: [],
        estimatedTime: 3,
        isTemplate: false,
      })
    }
  }

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory: Category = {
        id: newCategoryName.toLowerCase().replace(/\s+/g, '-'),
        name: newCategoryName,
        icon: <BookOpen className="h-4 w-4" />,
        isCustom: true,
      }
      setCategories([...categories, newCategory])
      setIsAddCategoryDialogOpen(false)
      setNewCategoryName("")
      setSelectedCategory(newCategory.id)
    }
  }

  const handleDeleteCategory = (categoryId: string) => {
    // Only allow deletion of custom categories
    const category = categories.find(c => c.id === categoryId)
    if (category?.isCustom) {
      setCategories(categories.filter(c => c.id !== categoryId))
      // Remove all questions from this category
      setQuestions(questions.filter(q => q.category !== categoryId))
      // Select first category
      if (selectedCategory === categoryId && categories.length > 1) {
        setSelectedCategory(categories[0].id)
      }
    }
  }

  const handleDeleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id))
  }

  const getCategoryById = (id: string) => {
    return categories.find(c => c.id === id) || { id, name: id, icon: <BookOpen className="h-4 w-4" />, isCustom: false }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Questions Bank</h1>
          <p className="text-muted-foreground mt-2">
            Pre-configured question templates by category and difficulty
          </p>
        </div>
        <div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-[#1B4F8C] to-[#2563EB]">
                <Plus className="mr-2 h-4 w-4" />
                Add Custom Question
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Custom Question</DialogTitle>
                <DialogDescription>
                  Add a new question to the {getCategoryById(selectedCategory).name} category
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Category</Label>
                    <Select
                      value={newQuestion.category || selectedCategory}
                      onValueChange={(value) => setNewQuestion({ ...newQuestion, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            <div className="flex items-center gap-2">
                              {category.icon}
                              <span>{category.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Difficulty</Label>
                    <Select
                      value={newQuestion.difficulty}
                      onValueChange={(value) => setNewQuestion({ ...newQuestion, difficulty: value as QuestionDifficulty })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Question</Label>
                  <Textarea
                    placeholder="Enter the question..."
                    value={newQuestion.question}
                    onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Expected Answer</Label>
                  <Textarea
                    placeholder="Enter the expected answer or key points..."
                    value={newQuestion.answer}
                    onChange={(e) => setNewQuestion({ ...newQuestion, answer: e.target.value })}
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Tags (comma-separated)</Label>
                    <Input
                      placeholder="e.g., collections, algorithms"
                      value={newQuestion.tags?.join(", ")}
                      onChange={(e) => setNewQuestion({ 
                        ...newQuestion, 
                        tags: e.target.value.split(",").map(t => t.trim()).filter(t => t)
                      })}
                    />
                  </div>
                  <div>
                    <Label>Estimated Time (minutes)</Label>
                    <Input
                      type="number"
                      min="1"
                      value={newQuestion.estimatedTime}
                      onChange={(e) => setNewQuestion({ ...newQuestion, estimatedTime: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
                <Button onClick={handleAddQuestion} className="w-full">
                  Add Custom Question
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Left Sidebar - Categories */}
        <div className="w-80 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg">Categories</CardTitle>
              <Dialog open={isAddCategoryDialogOpen} onOpenChange={setIsAddCategoryDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <FolderPlus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                    <DialogDescription>
                      Create a new category for organizing interview questions
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label>Category Name</Label>
                      <Input
                        placeholder="e.g., Spring Framework, React, AWS"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                      />
                    </div>
                    <Button onClick={handleAddCategory} className="w-full">
                      Create Category
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-280px)]">
                <div className="p-4 space-y-2">
                  {categories.map((category) => {
                    const stats = categoryStats[category.id] || { easy: 0, medium: 0, hard: 0, total: 0, templates: 0, custom: 0 }
                    
                    return (
                      <div
                        key={category.id}
                        className={cn(
                          "p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md relative group",
                          selectedCategory === category.id
                            ? "bg-blue-50 border-blue-400 text-blue-900"
                            : "bg-white border-gray-200 hover:border-gray-300"
                        )}
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        {category.isCustom && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteCategory(category.id)
                            }}
                          >
                            <Trash2 className="h-3 w-3 text-red-600" />
                          </Button>
                        )}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {category.icon}
                            <span className="font-medium">
                              {category.name}
                            </span>
                          </div>
                          <Badge variant="secondary" className="ml-auto">
                            {stats.total}
                          </Badge>
                        </div>
                        <div className="flex gap-2 text-xs">
                          <span className="text-green-600">E: {stats.easy}</span>
                          <span className="text-yellow-600">M: {stats.medium}</span>
                          <span className="text-red-600">H: {stats.hard}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {stats.templates > 0 && `${stats.templates} templates`}
                          {stats.custom > 0 && (stats.templates > 0 ? `, ${stats.custom} custom` : `${stats.custom} custom`)}
                          {stats.total === 0 && "No questions yet"}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Right Content - Questions */}
        <div className="flex-1 space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Questions for {getCategoryById(selectedCategory).name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search questions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={selectedDifficulty} onValueChange={(value) => setSelectedDifficulty(value as QuestionDifficulty | "all")}>
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
          <ScrollArea className="h-[calc(100vh-320px)]">
            <div className="space-y-4 pr-4">
              {filteredQuestions.map((question) => (
                <Card key={question.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <Badge 
                            className={
                              question.difficulty === "easy" ? "bg-green-100 text-green-800" :
                              question.difficulty === "medium" ? "bg-yellow-100 text-yellow-800" :
                              "bg-red-100 text-red-800"
                            }
                          >
                            {question.difficulty}
                          </Badge>
                          <Badge variant="outline">
                            {question.estimatedTime} min
                          </Badge>
                          {question.isTemplate && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                              Template
                            </Badge>
                          )}
                          {!question.isTemplate && (
                            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                              Custom
                            </Badge>
                          )}
                          {question.tags.map((tag) => (
                            <Badge key={tag} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <h3 className="text-lg font-semibold">{question.question}</h3>
                      </div>
                      {!question.isTemplate && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-red-600"
                            onClick={() => handleDeleteQuestion(question.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700 whitespace-pre-line">{question.answer}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {filteredQuestions.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-muted-foreground">No questions found for this category.</p>
                    <Button
                      className="mt-4"
                      onClick={() => {
                        setNewQuestion({ ...newQuestion, category: selectedCategory })
                        setIsAddDialogOpen(true)
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add First Question
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}