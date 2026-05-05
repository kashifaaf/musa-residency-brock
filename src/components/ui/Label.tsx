import { cn } from "@/lib/utils"
import { LabelHTMLAttributes, forwardRef } from "react"

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <label
        className={cn(
          "text-sm font-medium text-gray-700",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Label.displayName = "Label"