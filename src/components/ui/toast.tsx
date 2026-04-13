"use client"

import * as React from "react"
import { AlertCircle, CheckCircle2, Info } from "lucide-react"

import { cn } from "@/lib/utils"

export type ToastVariant = "success" | "error" | "info"

export type Toast = {
  id: string
  title: string
  description?: string
  variant?: ToastVariant
}

type ToastViewportProps = {
  toasts: Toast[]
  onDismiss: (id: string) => void
}

function getToastStyles(variant: ToastVariant) {
  if (variant === "error") {
    return {
      wrapper: "border-red-200 bg-red-50/95 text-red-900",
      icon: <AlertCircle size={16} className="text-red-600" />,
    }
  }

  if (variant === "success") {
    return {
      wrapper: "border-emerald-200 bg-emerald-50/95 text-emerald-900",
      icon: <CheckCircle2 size={16} className="text-emerald-600" />,
    }
  }

  return {
    wrapper: "border-border bg-card/95 text-foreground",
    icon: <Info size={16} className="text-primary" />,
  }
}

export function ToastViewport({ toasts, onDismiss }: ToastViewportProps) {
  return (
    <div
      className="pointer-events-none fixed right-4 top-4 z-50 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2 sm:right-6 sm:top-6"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map((toast) => {
        const variant = toast.variant ?? "info"
        const styles = getToastStyles(variant)

        return (
          <div
            key={toast.id}
            className={cn(
              "pointer-events-auto rounded-2xl border px-4 py-3 shadow-md backdrop-blur transition-all",
              styles.wrapper,
            )}
            role={variant === "error" ? "alert" : "status"}
          >
            <div className="flex items-start gap-2.5">
              <span className="mt-0.5 shrink-0">{styles.icon}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold leading-tight">{toast.title}</p>
                {toast.description ? (
                  <p className="mt-1 text-xs leading-relaxed opacity-90">{toast.description}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => onDismiss(toast.id)}
                className="rounded-md px-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Dismiss notification"
              >
                Dismiss
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function useToasts(durationMs = 3200) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const dismissToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const pushToast = React.useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = crypto.randomUUID()
      setToasts((prev) => [...prev, { ...toast, id }].slice(-3))

      window.setTimeout(() => {
        setToasts((prev) => prev.filter((item) => item.id !== id))
      }, durationMs)

      return id
    },
    [durationMs],
  )

  return {
    toasts,
    pushToast,
    dismissToast,
  }
}
