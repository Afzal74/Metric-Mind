import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-blue-500/20 bg-blue-900/30 text-blue-300 backdrop-blur-sm",
        secondary: "border-gray-500/20 bg-gray-800/50 text-gray-300 backdrop-blur-sm",
        destructive: "border-red-500/20 bg-red-900/30 text-red-300 backdrop-blur-sm",
        success: "border-green-500/20 bg-green-900/30 text-green-300 backdrop-blur-sm",
        warning: "border-yellow-500/20 bg-yellow-900/30 text-yellow-300 backdrop-blur-sm",
        outline: "border-gray-600 text-gray-300 bg-gray-800/30 backdrop-blur-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }