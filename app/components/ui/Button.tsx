import * as React from "react";
import { cn } from "@/lib/cn";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost" | "gradient";
  size?: "sm" | "md" | "lg";
};

const base =
  "inline-flex items-center justify-center rounded-[999px] font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50";

const sizes = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-12 px-8 text-base",
};

const variants = {
  primary: "bg-primary text-white shadow-soft hover:opacity-95",
  outline:
    "border border-border bg-background text-foreground hover:bg-muted hover:text-foreground",
  ghost: "text-foreground hover:bg-muted",
  gradient:
    "text-white bg-gradient-to-r from-primary to-accent shadow-soft hover:opacity-95",
};

export const Button = React.forwardRef<HTMLButtonElement, Props>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(base, sizes[size], variants[variant], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
