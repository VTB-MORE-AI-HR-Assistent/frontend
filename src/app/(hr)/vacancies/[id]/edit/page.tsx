"use client"

import React from "react"
import { useParams } from "next/navigation"
import VacancyForm from "@/components/vacancies/vacancy-form"

// Mock data - in real app, fetch based on id
const mockVacancy = {
  id: "1",
  title: "Senior Frontend Developer",
  department: "IT",
  location: "Moscow",
  type: "Full-time",
  experience: "5+ years",
  salaryMin: "250000",
  salaryMax: "350000",
  currency: "RUB",
  status: "active",
  priority: "high",
  deadline: "2024-02-15",
  startDate: "2024-03-01",
  description: `We are looking for an experienced Frontend Developer to join our innovative team at VTB Bank. You will be responsible for developing and maintaining high-quality web applications that serve millions of users.

As a Senior Frontend Developer, you will work closely with our product and design teams to deliver exceptional user experiences. You'll have the opportunity to work with modern technologies and contribute to the digital transformation of one of Russia's leading banks.`,
  responsibilities: [
    "Develop and maintain responsive web applications using React and TypeScript",
    "Collaborate with UX/UI designers to implement pixel-perfect designs",
    "Optimize applications for maximum speed and scalability",
    "Participate in code reviews and maintain high code quality standards",
    "Mentor junior developers and contribute to team knowledge sharing",
    "Work with backend developers to integrate APIs",
    "Implement automated testing and continuous integration",
    "Stay up-to-date with emerging technologies and industry trends"
  ],
  requirements: [
    "5+ years of experience in frontend development",
    "Expert knowledge of React, TypeScript, and modern JavaScript",
    "Strong understanding of responsive design and cross-browser compatibility",
    "Experience with state management libraries (Redux, MobX, or Context API)",
    "Proficiency with version control systems (Git)",
    "Experience with testing frameworks (Jest, React Testing Library)",
    "Strong problem-solving skills and attention to detail",
    "Excellent communication skills in Russian and English"
  ],
  benefits: [
    "Competitive salary and performance bonuses",
    "Health insurance for you and your family",
    "Professional development budget",
    "Flexible working hours and remote work options",
    "Modern office in the heart of Moscow",
    "Gym membership and wellness programs",
    "Team building events and corporate activities",
    "Relocation assistance if needed"
  ],
  hiringManagerId: "1",
  recruiterId: "2"
}

export default function EditVacancyPage() {
  const params = useParams()
  
  return <VacancyForm mode="edit" initialData={mockVacancy} />
}