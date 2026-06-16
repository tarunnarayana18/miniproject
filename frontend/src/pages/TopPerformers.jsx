import React, { useEffect, useState } from 'react'
import axios from 'axios'

const rankColors = ['bg-yellow-400', 'bg-gray-300', 'bg-amber-600']

export default function TopPerformers() {
  const [performers, setPerformers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/top-performers?n=10')
      .then(r => setPerformers(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Top Performers</h1>
      <div className="space-y-3">
        {performers.map((s, i) => (
          <div key={s.Student_ID} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${rankColors[i] || 'bg-indigo-400'}`}>
              {i + 1}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800">{s.Student_Name}</p>
              <p className="text-sm text-gray-500">Avg: {s.Average?.toFixed(1)} | Total: {s.Total} | Grade: {s.Grade}</p>
            </div>
            <div className="flex gap-3 text-sm">
              <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded">M: {s.Math}</span>
              <span className="px-2 py-1 bg-teal-50 text-teal-700 rounded">S: {s.Science}</span>
              <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded">E: {s.English}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
