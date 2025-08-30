import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'

// Chart loading placeholder
const ChartSkeleton = () => (
  <div className="w-full h-[300px] p-4">
    <Skeleton className="w-full h-full" />
  </div>
)

// Lazy load heavy chart components
export const ApplicationTrendsChart = dynamic(
  () => import('@/components/charts/dashboard-charts').then(mod => ({ default: mod.ApplicationTrendsChart })),
  { 
    loading: () => <ChartSkeleton />,
    ssr: false 
  }
)

export const DepartmentDistributionChart = dynamic(
  () => import('@/components/charts/dashboard-charts').then(mod => ({ default: mod.DepartmentDistributionChart })),
  { 
    loading: () => <ChartSkeleton />,
    ssr: false 
  }
)

export const TimeToHireChart = dynamic(
  () => import('@/components/charts/dashboard-charts').then(mod => ({ default: mod.TimeToHireChart })),
  { 
    loading: () => <ChartSkeleton />,
    ssr: false 
  }
)

export const HiringFunnelChart = dynamic(
  () => import('@/components/charts/dashboard-charts').then(mod => ({ default: mod.HiringFunnelChart })),
  { 
    loading: () => <ChartSkeleton />,
    ssr: false 
  }
)