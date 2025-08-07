"use client"
import * as React from "react"
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        // Helper function to safely convert to a renderable string
        const toSafeString = (value: unknown): string => {
          if (value == null) return ''
          if (typeof value === 'string') return value
          if (typeof value === 'number') return value.toString()
          if (typeof value === 'bigint') return value.toString()
          if (typeof value === 'boolean') return value.toString()
          // For React elements, we'll handle them differently
          if (React.isValidElement(value)) return '[React Element]'
          // For any other type, convert to string
          return String(value)
        }

        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{toSafeString(title)}</ToastTitle>}
              {description && (
                <ToastDescription>{toSafeString(description)}</ToastDescription>
              )}
            </div>
            {action ? (
              <>{action}</>
            ) : null}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}