import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-normal text-center leading-tight text-sm font-bold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 uppercase tracking-[0.07em] font-sans box-border max-w-full",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground rounded-lg hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90",
        outline: "border border-foreground bg-transparent text-foreground rounded-lg hover:bg-foreground/5",
        secondary: "bg-secondary text-secondary-foreground rounded-lg hover:bg-muted",
        ghost: "hover:bg-muted hover:text-foreground rounded-lg",
        link: "text-foreground underline-offset-4 hover:underline",
        hero: "bg-primary text-primary-foreground hover:bg-primary/90 text-sm px-4 sm:px-8 py-4 rounded-lg",
        "hero-outline": "border border-foreground bg-transparent text-foreground hover:bg-foreground/5 text-sm px-4 sm:px-8 py-4 rounded-lg",
        accent: "bg-foreground text-background rounded-lg hover:bg-foreground/90",
        soft: "bg-muted text-foreground rounded-lg hover:bg-muted/80",
      },
      size: {
        default: "h-11 px-6 py-3.5",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-14 rounded-lg px-10 text-sm",
        xl: "h-16 rounded-lg px-12 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
