import { DataEntryForm } from '../components/DataEntryForm'

export function ExternalFormPage() {
  return (
    <div className="w-full max-w-md space-y-6">
      <p className="text-slate-400 text-sm text-center">
        Fill in the details below. Your submission will be saved for the office to view.
      </p>
      <DataEntryForm />
    </div>
  )
}
