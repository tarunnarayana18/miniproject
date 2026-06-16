import React, { useEffect, useState } from 'react'
import axios from 'axios'

const gradeColors = { A: 'bg-emerald-100 text-emerald-800', B: 'bg-cyan-100 text-cyan-800', C: 'bg-yellow-100 text-yellow-800', D: 'bg-orange-100 text-orange-800', F: 'bg-red-100 text-red-800' }

export default function Students() {
  const [students, setStudents] = useState([])
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState('Student_ID')
  const [sortDir, setSortDir] = useState('asc')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/students')
      .then(r => setStudents(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = students
    .filter(s => s.Student_Name?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const va = a[sortKey], vb = b[sortKey]
      if (typeof va === 'number') return sortDir === 'asc' ? va - vb : vb - va
      return sortDir === 'asc' ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va))
    })

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const SortIcon = ({ k }) => sortKey === k ? (sortDir === 'asc' ? ' \u25B2' : ' \u25BC') : ''

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Students</h1>
      <input
        type="text"
        placeholder="Search by name..."
        className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              {['Student_ID', 'Student_Name', 'Math', 'Science', 'English', 'Attendance', 'Total', 'Average', 'Grade', 'Pass'].map(col => (
                <th key={col} className="px-4 py-3 cursor-pointer hover:text-indigo-600 select-none" onClick={() => toggleSort(col)}>
                  {col.replace('_', ' ')}{SortIcon({ k: col })}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(s => (
              <tr key={s.Student_ID} className="hover:bg-gray-50">
                <td className="px-4 py-2">{s.Student_ID}</td>
                <td className="px-4 py-2 font-medium">{s.Student_Name}</td>
                <td className="px-4 py-2">{s.Math}</td>
                <td className="px-4 py-2">{s.Science}</td>
                <td className="px-4 py-2">{s.English}</td>
                <td className="px-4 py-2">{s.Attendance}%</td>
                <td className="px-4 py-2">{s.Total}</td>
                <td className="px-4 py-2">{s.Average?.toFixed(1)}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${gradeColors[s.Grade] || ''}`}>{s.Grade}</span>
                </td>
                <td className="px-4 py-2">{s.Pass ? '✓' : '✗'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="p-4 text-gray-400 text-center">No students found.</p>}
      </div>
      <p className="text-sm text-gray-400">{filtered.length} of {students.length} students</p>
    </div>
  )
}
