import { ButtonHTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline"
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-none px-4 py-2 text-sm font-mono transition-colors",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00ff00]/50",
          "disabled:pointer-events-none disabled:opacity-50",
          variant === "default" && "bg-[#00ff00] text-black font-medium hover:bg-[#00ff00]/90",
          variant === "outline" && "border border-[#00ff00]/20 text-[#00ff00] hover:bg-[#00ff00]/10",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }