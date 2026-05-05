import { cn } from "@/lib/utils"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost"
  size?: "sm" | "default" | "lg"
}

export function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
        {
          "bg-primary-600 text-white hover:bg-primary-700": variant === "default",
          "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50": variant === "outline",
          "text-gray-700 hover:bg-gray-100": variant === "ghost",
        },
        {
          "h-8 px-3 text-sm": size === "sm",
          "h-10 px-4": size === "default",
          "h-12 px-6 text-lg": size === "lg",
        },
        className
      )}
      {...props}
    />
  )
}