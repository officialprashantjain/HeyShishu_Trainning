'use client'

export default function PageIndicator({ title, description }) {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        {description && <p className="text-primary-100">{description}</p>}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-primary-100 p-4 rounded-xl border border-primary-200">
          <div className="text-primary-700 font-semibold">Primary</div>
          <div className="text-primary-600">#4F46E5</div>
        </div>
        <div className="bg-secondary-100 p-4 rounded-xl border border-secondary-200">
          <div className="text-secondary-700 font-semibold">Secondary</div>
          <div className="text-secondary-600">#06B6D4</div>
        </div>
        <div className="bg-success-50 p-4 rounded-xl border border-green-200">
          <div className="text-success-600 font-semibold">Success</div>
          <div className="text-success-500">#10B981</div>
        </div>
        <div className="bg-danger-50 p-4 rounded-xl border border-red-200">
          <div className="text-danger-600 font-semibold">Danger</div>
          <div className="text-danger-500">#EF4444</div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-3">
        <button className="btn-primary">Primary Button</button>
        <button className="btn-secondary">Secondary Button</button>
        <button className="btn-outline">Outline Button</button>
      </div>
    </div>
  )
}
