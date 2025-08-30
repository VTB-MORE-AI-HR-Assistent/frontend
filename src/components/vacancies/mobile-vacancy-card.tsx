"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  MapPin, 
  Users, 
  Clock, 
  DollarSign, 
  Calendar,
  MoreVertical,
  Edit,
  Copy,
  Archive,
  Trash
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SwipeableCard } from "@/components/ui/swipeable-card"
import Link from "next/link"

interface MobileVacancyCardProps {
  vacancy: {
    id: string
    title: string
    department: string
    location: string
    type: string
    experience: string
    salary: string
    status: "active" | "draft" | "closed"
    candidates: number
    posted: string
    deadline: string
  }
}

export function MobileVacancyCard({ vacancy }: MobileVacancyCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700"
      case "draft":
        return "bg-gray-100 text-gray-700"
      case "closed":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <SwipeableCard
      leftAction={{
        label: "Edit",
        icon: <Edit className="h-4 w-4" />,
        onClick: () => console.log("Edit", vacancy.id),
        className: "bg-blue-50 hover:bg-blue-100"
      }}
      rightAction={{
        label: "Archive",
        icon: <Archive className="h-4 w-4" />,
        onClick: () => console.log("Archive", vacancy.id),
        className: "bg-gray-50 hover:bg-gray-100"
      }}
      className="mb-3"
    >
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <Link href={`/vacancies/${vacancy.id}`}>
                <h3 className="font-semibold text-base hover:text-blue-600 transition-colors">
                  {vacancy.title}
                </h3>
              </Link>
              <p className="text-sm text-muted-foreground">{vacancy.department}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/vacancies/${vacancy.id}`}>
                    View Details
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/vacancies/${vacancy.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Archive className="mr-2 h-4 w-4" />
                  Archive
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Status and Type */}
          <div className="flex gap-2 mb-3">
            <Badge className={getStatusColor(vacancy.status)}>
              {vacancy.status}
            </Badge>
            <Badge variant="outline">{vacancy.type}</Badge>
            <Badge variant="secondary">{vacancy.experience}</Badge>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{vacancy.location}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <DollarSign className="h-3 w-3" />
              <span>{vacancy.salary}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="h-3 w-3" />
              <span>{vacancy.candidates} candidates</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{vacancy.deadline}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center mt-3 pt-3 border-t">
            <span className="text-xs text-muted-foreground">
              Posted {vacancy.posted}
            </span>
            <Button size="sm" variant="outline" asChild>
              <Link href={`/vacancies/${vacancy.id}`}>
                View Details
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </SwipeableCard>
  )
}