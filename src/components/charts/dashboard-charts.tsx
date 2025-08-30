"use client"

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts"

// Application trends data (last 6 months)
const applicationTrendsData = [
  { month: "Jun", applications: 65, hired: 8 },
  { month: "Jul", applications: 85, hired: 12 },
  { month: "Aug", applications: 120, hired: 18 },
  { month: "Sep", applications: 95, hired: 15 },
  { month: "Oct", applications: 110, hired: 20 },
  { month: "Nov", applications: 140, hired: 25 },
]

// Department distribution data
const departmentData = [
  { name: "Engineering", value: 8, color: "#1B4F8C" },
  { name: "Sales", value: 5, color: "#2563EB" },
  { name: "Marketing", value: 4, color: "#4F46E5" },
  { name: "HR", value: 3, color: "#6366F1" },
  { name: "Finance", value: 2, color: "#818CF8" },
  { name: "Operations", value: 2, color: "#A5B4FC" },
]

// Time to hire metrics data
const timeToHireData = [
  { position: "Engineering", days: 28 },
  { position: "Sales", days: 21 },
  { position: "Marketing", days: 24 },
  { position: "HR", days: 18 },
  { position: "Finance", days: 30 },
]

export function ApplicationTrendsChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={applicationTrendsData}>
        <defs>
          <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2563EB" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#2563EB" stopOpacity={0.1}/>
          </linearGradient>
          <linearGradient id="colorHired" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis 
          dataKey="month" 
          className="text-xs"
          tick={{ fill: '#6B7280' }}
        />
        <YAxis 
          className="text-xs"
          tick={{ fill: '#6B7280' }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'white',
            border: '1px solid #E5E7EB',
            borderRadius: '6px'
          }}
        />
        <Legend />
        <Area
          type="monotone"
          dataKey="applications"
          stroke="#2563EB"
          fillOpacity={1}
          fill="url(#colorApplications)"
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="hired"
          stroke="#10B981"
          fillOpacity={1}
          fill="url(#colorHired)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function DepartmentDistributionChart() {
  const RADIAN = Math.PI / 180
  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={departmentData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {departmentData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend 
          verticalAlign="bottom" 
          height={36}
          formatter={(value: string, entry: any) => (
            <span style={{ color: entry.color }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

export function TimeToHireChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={timeToHireData} layout="horizontal">
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis 
          type="number"
          tick={{ fill: '#6B7280', fontSize: 12 }}
        />
        <YAxis 
          dataKey="position" 
          type="category"
          tick={{ fill: '#6B7280', fontSize: 12 }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'white',
            border: '1px solid #E5E7EB',
            borderRadius: '6px'
          }}
        />
        <Bar 
          dataKey="days" 
          fill="#1B4F8C"
          radius={[0, 4, 4, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function HiringFunnelChart() {
  const data = [
    { stage: "Applied", count: 573 },
    { stage: "Screened", count: 320 },
    { stage: "Interviewed", count: 125 },
    { stage: "Offered", count: 48 },
    { stage: "Hired", count: 38 },
  ]

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis 
          dataKey="stage"
          tick={{ fill: '#6B7280', fontSize: 12 }}
        />
        <YAxis 
          tick={{ fill: '#6B7280', fontSize: 12 }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'white',
            border: '1px solid #E5E7EB',
            borderRadius: '6px'
          }}
        />
        <Bar 
          dataKey="count" 
          fill="#2563EB"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}