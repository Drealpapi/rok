import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--accent] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 select-none",
  {
    variants: {
      variant: {
        default:     "bg-[--accent] text-white btn-3d hover:bg-[--accent-hover] active:scale-[0.98]",
        secondary:   "bg-[--surface-subtle] text-[--text-primary] border border-[--surface-border] hover:bg-[--surface-hover] active:scale-[0.98]",
        outline:     "border border-[--surface-border] bg-transparent text-[--text-primary] hover:bg-[--surface-subtle] active:scale-[0.98]",
        ghost:       "text-[--text-secondary] hover:bg-[--surface-subtle] hover:text-[--text-primary]",
        destructive: "bg-[--status-error] text-white btn-3d hover:opacity-90 active:scale-[0.98]",
        dark:        "bg-[--surface-elevated] text-[--text-primary] border border-[--surface-border] hover:bg-[--surface-hover] active:scale-[0.98]",
      },
      size: {
        sm:      "h-7 px-3 text-xs rounded-md",
        default: "h-9 px-4",
        lg:      "h-10 px-6",
        icon:    "h-8 w-8",
        "icon-sm": "h-7 w-7",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const cls = cn(buttonVariants({ variant, size, className }));
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(
        children as React.ReactElement<Record<string, unknown>>,
        { ...props, className: cn(cls, (children.props as Record<string, unknown>).className as string) }
      );
    }
    return <button ref={ref} className={cls} {...props}>{children}</button>;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
