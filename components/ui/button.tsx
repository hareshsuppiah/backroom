import { cn } from "@/lib/cn";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

/**
 * Three variants only (primary | secondary | ghost) per DESIGN_SYSTEM.md §11.
 * Three sizes only (sm | md | lg).
 */
const buttonVariants = cva(
  cn(
    "inline-flex items-center justify-center gap-1.5 whitespace-nowrap",
    "font-medium transition-colors duration-fast",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base",
    "disabled:pointer-events-none disabled:opacity-50",
  ),
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-[rgb(var(--bg-base))] hover:bg-accent-hover active:bg-accent-active",
        secondary:
          "border border-border bg-elevated text-primary hover:bg-higher active:bg-highest",
        ghost: "text-secondary hover:bg-elevated hover:text-primary",
      },
      size: {
        sm: "h-6 rounded-sm px-2.5 text-body-sm",
        md: "h-8 rounded-md px-3 text-body-md",
        lg: "h-10 rounded-md px-4 text-body-md",
      },
    },
    defaultVariants: {
      variant: "secondary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
