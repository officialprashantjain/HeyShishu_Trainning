'use client'

/**
 * Badge — status / label chip
 *
 * variant : 'green'|'yellow'|'red'|'blue'|'gray'|'dark'
 * dot     : boolean — show a coloured dot before text
 */

const variantClass = {
  green:  'badge-green',
  yellow: 'badge-yellow',
  red:    'badge-red',
  blue:   'badge-blue',
  gray:   'badge-gray',
  dark:   'badge-dark',
}

const dotColor = {
  green:  'bg-success-500',
  yellow: 'bg-warning-500',
  red:    'bg-danger-500',
  blue:   'bg-info-500',
  gray:   'bg-neutral-400',
  dark:   'bg-neutral-300',
}

// Map application status → badge variant
export const statusVariant = {
  pending_payment:      'yellow',
  payment_done:         'blue',
  training_in_progress: 'blue',
  training_completed:   'green',
  under_review:         'yellow',
  review_done:          'yellow',
  approved:             'green',
  rejected:             'red',
  credentials_sent:     'dark',
}

// Human-readable labels for application status
export const statusLabel = {
  pending_payment:      'Pending Payment',
  payment_done:         'Payment Done',
  training_in_progress: 'In Training',
  training_completed:   'Training Complete',
  under_review:         'Under Review',
  review_done:          'Review Done',
  approved:             'Approved',
  rejected:             'Rejected',
  credentials_sent:     'Credentials Sent',
}

export default function Badge({
  children,
  variant = 'gray',
  dot = false,
  className = '',
  ...props
}) {
  const baseClass = "inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full"

  const colorVariants = {
    green: "bg-success-50 text-success-600",
    yellow: "bg-warning-50 text-warning-600",
    red: "bg-danger-50 text-danger-600",
    blue: "bg-info-50 text-info-600",
    gray: "bg-neutral-100 text-neutral-600",
    dark: "bg-dark-800 text-white"
  }

  return (
    <span
      className={`${baseClass} ${colorVariants[variant] || colorVariants.gray} ${className}`}
      {...props}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor[variant] || 'bg-neutral-400'}`} />
      )}
      {children}
    </span>
  )
}
