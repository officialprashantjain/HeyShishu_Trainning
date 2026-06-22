'use client'

import { forwardRef, useState } from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'

/**
 * Input — styled text/email/password input
 *
 * label       : string — shown above input
 * error       : string — shown below in red
 * hint        : string — shown below in grey
 * icon        : ReactNode — left icon
 * iconRight   : ReactNode — right icon
 * type        : standard html input types
 */
const Input = forwardRef(function Input(
  {
    label,
    error,
    hint,
    icon,
    iconRight,
    type = 'text',
    className = '',
    id,
    required,
    ...props
  },
  ref
) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType  = isPassword ? (showPassword ? 'text' : 'password') : type
  const inputId    = id || label?.toLowerCase().replace(/\s+/g, '_')

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-neutral-700 mb-1.5">
          {label}
          {required && <span className="text-danger-500 ml-0.5">*</span>}
        </label>
      )}

      <div className="relative">
        {/* Left icon */}
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-base pointer-events-none">
            {icon}
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          type={inputType}
          className={`
            w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 transition-all duration-150 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 disabled:bg-neutral-50 disabled:text-neutral-400 disabled:cursor-not-allowed
            ${icon ? 'pl-10' : ''}
            ${(iconRight || isPassword) ? 'pr-10' : ''}
            ${error ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500/20' : ''}
            ${className}
          `}
          {...props}
        />

        {/* Right icon / password toggle */}
        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400
                       hover:text-neutral-600 transition-colors focus:outline-none"
            tabIndex={-1}
          >
            {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
          </button>
        ) : iconRight ? (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
            {iconRight}
          </span>
        ) : null}
      </div>

      {/* Messages */}
      {error && (
        <p className="mt-1.5 text-xs text-danger-600">{error}</p>
      )}
      {!error && hint && (
        <p className="mt-1.5 text-xs text-neutral-400">{hint}</p>
      )}
    </div>
  )
})

export default Input
