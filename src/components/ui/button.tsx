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

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    if (asChild && React.isValidElement(children)) {
      const buttonClass = cn(buttonVariants({ variant, size }), className);
      
      // Type the children props safely
      const childProps = children.props as any;
      const existingClassName = childProps?.className || '';
      
      const mergedProps = {
        ...props,
        className: cn(buttonClass, existingClassName),
      };
      
      return React.cloneElement(children, mergedProps);
    }
    
    return (
      <button
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };