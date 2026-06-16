import React, { useState } from 'react'
import axios from 'axios'

export default function PredictGrade() {
  const [form, setForm] = useState({ Math: '', Science: '', English: '', Attendance: '' })
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setResult(null)
    const payload = {}
    for (const [k, v] of Object.entries(form)) {
      const n = parseFloat(v)
      if (isNaN(n) || n < 0 || n > 100) {
        setError(`${k} must be a number between 0 and 100`)
        return
      }
      payload[k] = n
    }
    setLoading(true)
    try {
      const res = await axios.post('/api/prediction', payload)
      setResult(res.data.predicted_grade)
    } catch (err) {
      setError(err.response?.data?.error || 'Prediction failed. Ensure backend model is trained.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Grade Prediction</h1>
      <p className="text-gray-500 text-sm">Enter student scores to predict their grade using a trained ML model.</p>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        {['Math', 'Science', 'English', 'Attendance'].map(field => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{field} Score</label>
            <input
              type="number"
              name={field}
              min="0"
              max="100"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={form[field]}
              onChange={handleChange}
              placeholder="0-100"
            />
          </div>
        ))}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-medium"
        >
          {loading ? 'Predicting...' : 'Predict Grade'}
        </button>
      </form>
      {result && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
          <p className="text-sm text-emerald-600">Predicted Grade</p>
          <p className="text-4xl font-bold text-emerald-700">{result}</p>
        </div>
      )}
    </div>
  )
}
