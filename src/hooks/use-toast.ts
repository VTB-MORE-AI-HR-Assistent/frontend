import { useState, useCallback } from "react"

export interface Toast {
  id: string
  title: string
  description?: string
  variant?: "default" | "destructive"
}

interface ToastState {
  toasts: Toast[]
}

let toastCount = 0

export function useToast() {
  const [state, setState] = useState<ToastState>({ toasts: [] })

  const toast = useCallback(
    ({ title, description, variant = "default" }: Omit<Toast, "id">) => {
      const id = (++toastCount).toString()
      const newToast: Toast = { id, title, description, variant }

      setState((prev) => ({
        toasts: [...prev.toasts, newToast]
      }))

      // Show browser notification or console log for now
      if (variant === "destructive") {
        console.error(`❌ ${title}: ${description}`)
        if (typeof window !== "undefined") {
          alert(`Error: ${title}\n${description || ""}`)
        }
      } else {
        console.log(`✅ ${title}: ${description}`)
        if (typeof window !== "undefined") {
          alert(`${title}\n${description || ""}`)
        }
      }

      // Auto remove after 5 seconds
      setTimeout(() => {
        setState((prev) => ({
          toasts: prev.toasts.filter((t) => t.id !== id)
        }))
      }, 5000)

      return { id }
    },
    []
  )

  const dismiss = useCallback((toastId: string) => {
    setState((prev) => ({
      toasts: prev.toasts.filter((t) => t.id !== toastId)
    }))
  }, [])

  return {
    toast,
    dismiss,
    toasts: state.toasts
  }
}
