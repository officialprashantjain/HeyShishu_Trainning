'use client'

/**
 * Card — standard container for the HeyShishu Training design system
 *
 * variant : 'default' | 'hover' | 'flat'
 * padding : 'none' | 'sm' | 'md' | 'lg'
 * className: additional override classes
 */
const paddingClass = {
  none: '',
  sm:   'p-4',
  md:   'p-5',
  lg:   'p-6',
}

export default function Card({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  onClick,
  ...props
}) {
  const base = 'bg-white rounded-2xl border border-neutral-200'
  const shadow = variant === 'flat'
    ? ''
    : variant === 'hover'
    ? 'shadow-lg transition-shadow duration-200 hover:shadow-xl cursor-pointer'
    : 'shadow-lg'

  return (
    <div
      className={`${base} ${shadow} ${paddingClass[padding]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  )
}

// ── Sub-components ──────────────────────────────────────────

Card.Header = function CardHeader({ children, className = '' }) {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      {children}
    </div>
  )
}

Card.Title = function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-base font-semibold text-neutral-800 ${className}`}>
      {children}
    </h3>
  )
}

Card.Body = function CardBody({ children, className = '' }) {
  return (
    <div className={className}>
      {children}
    </div>
  )
}

Card.Footer = function CardFooter({ children, className = '' }) {
  return (
    <div className={`border-t border-neutral-100 mt-4 pt-4 ${className}`}>
      {children}
    </div>
  )
}
