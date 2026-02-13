import { useState } from 'react'
import { appendToSheet } from '../services/sheetsService'

const defaultFields = [
  { key: 'Name', label: 'Name', type: 'text' },
  { key: 'Designation', label: 'Designation', type: 'text' },
  { key: 'Agency', label: 'Agency', type: 'text' },
  { key: 'Address', label: 'Address', type: 'textarea' },
  { key: 'Purpose', label: 'Purpose', type: 'textarea' },
  { key: 'Date of Arrival', label: 'Date of Arrival', type: 'date' },
  { key: 'Time of Arrival', label: 'Time of Arrival', type: 'time' },
  { key: 'Date of Departure', label: 'Date of Departure', type: 'date' },
  { key: 'Time of Departure', label: 'Time of Departure', type: 'time' },
  { key: 'Date Issued', label: 'Date Issued', type: 'date' },
]

export function DataEntryForm() {
  const [values, setValues] = useState(
    Object.fromEntries(defaultFields.map((f) => [f.key, '']))
  )
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }))
    setStatus(null)
  }

  const getEmptyFields = () =>
    defaultFields.filter((f) => !String(values[f.key] ?? '').trim()).map((f) => f.label)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus(null)

    const emptyLabels = getEmptyFields()
    if (emptyLabels.length > 0) {
      setStatus({
        type: 'error',
        message: `Please fill in all required fields. Missing: ${emptyLabels.join(', ')}.`,
      })
      return
    }

    setLoading(true)
    const result = await appendToSheet(values)
    setLoading(false)
    if (result.ok) {
      setStatus({
        type: 'success',
        message: 'Successfully submitted'
      })
      setValues(Object.fromEntries(defaultFields.map((f) => [f.key, ''])))
    } else {
      setStatus({ type: 'error', message: result.message || 'Failed to submit.' })
    }
  }

  const emptyLabels = getEmptyFields()
  const showValidation = status?.type === 'error' && emptyLabels.length > 0
  const isEmpty = (key) => showValidation && !String(values[key] ?? '').trim()

  return (
    <div className="bg-slate-800 rounded-lg p-4 sm:p-6 max-w-md w-full">
      <p className="text-slate-300 text-sm sm:text-base mb-4">
        This is to certify that the following appeared before this Office to transact business:
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-3">
        {defaultFields.map(({ key, label, type }) => (
          <div key={key}>
            <label className="block text-sm sm:text-base text-slate-400 mb-2">
              {label} <span className="text-red-400">*</span>
            </label>
            {type === 'textarea' ? (
              <textarea
                value={values[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                rows={3}
                required
                className={`w-full px-4 py-3 sm:px-3 sm:py-2 text-base sm:text-sm rounded-lg bg-slate-700 border text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-colors ${
                  isEmpty(key) ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-600'
                }`}
              />
            ) : (
              <input
                type={type}
                value={values[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                required
                className={`w-full px-4 py-3 sm:px-3 sm:py-2 text-base sm:text-sm rounded-lg bg-slate-700 border text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  isEmpty(key) ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-600'
                }`}
              />
            )}
          </div>
        ))}
        {status?.type === 'error' && (
          <div className="rounded-lg bg-red-500/15 border border-red-500/50 px-4 py-3 sm:px-3 sm:py-2">
            <p className="text-red-400 text-sm sm:text-base font-medium">{status.message}</p>
          </div>
        )}
        {status?.type === 'success' && (
          <p className="text-green-400 text-sm sm:text-base text-center py-2">{status.message}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 sm:px-4 sm:py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium text-base sm:text-sm transition-colors touch-manipulation"
        >
          {loading ? 'Submitting…' : 'Submit'}
        </button>
      </form>
    </div>
  )
}
