import * as React from 'react'
import { cn } from '@/lib/utils'

export function Progress({ value, className, ...props }) {
  return (
    <div
      className={cn('relative h-4 w-full overflow-hidden rounded-full bg-gray-200', className)}
      {...props}
    >
      <div
        className="h-full bg-blue-600 transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  )
}
