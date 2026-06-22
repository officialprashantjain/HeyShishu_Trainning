'use client'

import { forwardRef } from 'react'

/**
 * Button — all variants of the HeyShishu Training design system
 *
 * variant : 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
 * size    : 'sm' | 'md' | 'lg'
 * loading : boolean — shows spinner + disables
 * icon    : ReactNode — left-side icon
 * iconRight: ReactNode — right-side icon
 */
const variantClass = {
  primary:   'btn-primary',
  secondary: 'btn-secondary',
  outline:   'btn-outline',
  ghost:     'btn-ghost',
  danger:    'btn-danger',
}

const sizeClass = {
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg',
}

const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    icon,
    iconRight,
    className = '',
    disabled,
    type = 'button',
    ...props
  },
  ref
) {
  const isDisabled = disabled || loading

  const baseClass = "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"

  const sizes = {
    sm: "text-xs px-3 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-base px-6 py-3",
  }

  const variants = {
    primary: "bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white shadow-sm focus:ring-primary-400",
    secondary: "bg-dark-800 hover:bg-dark-700 text-white shadow-sm focus:ring-dark-700",
    outline: "border border-primary-500 text-primary-600 hover:bg-primary-50 focus:ring-primary-400",
    ghost: "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 focus:ring-neutral-300",
    danger: "bg-danger-500 hover:bg-danger-600 text-white shadow-sm focus:ring-danger-500"
  }

  const combinedClass = `${baseClass} ${sizes[size]} ${variants[variant]} ${className}`

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      className={combinedClass}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon && <span className="text-base leading-none">{icon}</span>
      )}
      {children && <span>{children}</span>}
      {!loading && iconRight && (
        <span className="text-base leading-none">{iconRight}</span>
      )}
    </button>
  )
})

export default Button
