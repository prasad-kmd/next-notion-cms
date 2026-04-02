"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface DialogProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function Dialog({ children, open: controlledOpen, onOpenChange }: DialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
  const open = controlledOpen ?? uncontrolledOpen
  const setOpen = onOpenChange ?? setUncontrolledOpen

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  )
}

const DialogContext = React.createContext<{
  open: boolean
  setOpen: (open: boolean) => void
} | null>(null)

const useDialog = () => {
  const context = React.useContext(DialogContext)
  if (!context) throw new Error("useDialog must be used within Dialog")
  return context
}

export function DialogTrigger({ children }: { children: React.ReactElement<any> }) {
  const { setOpen } = useDialog()
  return React.cloneElement(children, {
    onClick: (e: React.MouseEvent) => {
      if (children.props.onClick) {
        children.props.onClick(e)
      }
      setOpen(true)
    },
  })
}

export function DialogContent({ children, className }: { children: React.ReactNode, className?: string }) {
  const { open, setOpen } = useDialog()

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className={cn(
                "relative w-full max-w-lg bg-card border border-border p-6 rounded-2xl shadow-2xl",
                className
              )}
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
              {children}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export function DialogHeader({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}>{children}</div>
}

export function DialogTitle({ children, className }: { children: React.ReactNode, className?: string }) {
  return <h2 className={cn("text-lg font-semibold leading-none tracking-tight", className)}>{children}</h2>
}

export function DialogDescription({ children, className }: { children: React.ReactNode, className?: string }) {
  return <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>
}
