import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Bar, Pie, Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend)

export default function Dashboard() {
  const [analytics, setAnalytics] = useState(null)
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      axios.get('/api/analytics'),
      axios.get('/api/students'),
    ]).then(([a, s]) => {
      setAnalytics(a.data)
      setStudents(s.data)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!analytics) {
    return <div className="p-8 text-red-500">Failed to load data. Is the backend running?</div>
  }

  const barData = {
    labels: Object.keys(analytics.subject_averages),
    datasets: [{
      label: 'Average Score',
      data: Object.values(analytics.subject_averages),
      backgroundColor: ['#4f46e5', '#0891b2', '#059669'],
    }],
  }

  const pieData = {
    labels: Object.keys(analytics.grade_distribution),
    datasets: [{
      data: Object.values(analytics.grade_distribution),
      backgroundColor: ['#059669', '#0891b2', '#ca8a04', '#ea580c', '#dc2626'],
    }],
  }

  const sorted = [...students].sort((a, b) => b.Average - a.Average)
  const lineData = {
    labels: sorted.map(s => s.Student_Name),
    datasets: [{
      label: 'Average',
      data: sorted.map(s => s.Average),
      borderColor: '#4f46e5',
      backgroundColor: 'rgba(79,70,229,0.1)',
      fill: true,
      tension: 0.3,
    }],
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Analytics Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Students" value={students.length} color="bg-indigo-500" />
        <StatCard label="Avg Attendance" value={`${analytics.attendance.average_attendance.toFixed(1)}%`} color="bg-teal-500" />
        <StatCard label="Min Attendance" value={`${analytics.attendance.min_attendance}%`} color="bg-amber-500" />
        <StatCard label="Max Attendance" value={`${analytics.attendance.max_attendance}%`} color="bg-emerald-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-3 text-gray-700">Subject Averages</h2>
          <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-3 text-gray-700">Grade Distribution</h2>
          <Pie data={pieData} options={{ responsive: true }} />
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-3 text-gray-700">Student Performance Trend</h2>
        <Line data={lineData} options={{
          responsive: true,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true, max: 100 } },
        }} />
      </div>
    </div>
  )
}

function StatCard({ label, value, color }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center gap-4">
      <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center text-white text-lg font-bold`}>
        {typeof value === 'number' ? value : value.charAt(0)}
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  )
}
