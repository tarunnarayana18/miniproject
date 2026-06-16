import React from 'react'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import TopPerformers from './pages/TopPerformers'
import PredictGrade from './pages/PredictGrade'

const linkClass = ({ isActive }) =>
  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-500'}`

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-indigo-600 shadow-lg">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <NavLink to="/" className="text-white font-bold text-lg">Student Dashboard</NavLink>
            <div className="flex gap-2">
              <NavLink to="/" end className={linkClass}>Dashboard</NavLink>
              <NavLink to="/students" className={linkClass}>Students</NavLink>
              <NavLink to="/top-performers" className={linkClass}>Top Performers</NavLink>
              <NavLink to="/predict" className={linkClass}>Predict Grade</NavLink>
            </div>
          </div>
        </nav>
        <main className="max-w-6xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/top-performers" element={<TopPerformers />} />
            <Route path="/predict" element={<PredictGrade />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
