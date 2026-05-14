"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// Native cva implementation
function cva(baseClasses: string, config?: {
  variants?: Record<string, Record<string, string>>;
  defaultVariants?: Record<string, string>;
}) {
  return (props?: Record<string, any>) => {
    let classes = baseClasses;
    
    if (config?.variants && props) {
      for (const [variant, value] of Object.entries(props)) {
        if (config.variants[variant] && config.variants[variant][value]) {
          classes += " " + config.variants[variant][value];
        }
      }
    }
    
    // Apply defaults for missing props
    if (config?.defaultVariants) {
      for (const [variant, defaultValue] of Object.entries(config.defaultVariants)) {
        if (!(variant in (props || {})) && config.variants?.[variant]?.[defaultValue]) {
          classes += " " + config.variants[variant][defaultValue];
        }
      }
    }
    
    return classes;
  };
}

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success: "border-transparent bg-green-100 text-green-800",
        warning: "border-transparent bg-yellow-100 text-yellow-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };