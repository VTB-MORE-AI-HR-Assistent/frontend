import { DashboardNav } from "@/components/layout/dashboard-nav"
import { DashboardHeader } from "@/components/layout/dashboard-header"

export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex-1 flex">
        <DashboardNav />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}