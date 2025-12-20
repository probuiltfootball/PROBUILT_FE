import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type ButtonVariant = "primary" | "secondary" | "tag";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  className,
  disabled,
  ...props
}) => {
  const baseStyles =
    "font-semibold rounded-3xl border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors";
  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      "bg-(--accent) text-(--primary) border-(--primary) hover:bg-(--hover) focus:bg-(--active) disabled:bg-(--disabled)",
    secondary:
      "bg-transparent text-(--borders-forms) border(--borders-forms) hover:bg-(--borders-forms) hover:text-(--primary)",
    tag: "bg-[#FFD100] text-(--primary) border-(--primary) hover:bg-(--hover) focus:bg-(--active) disabled:bg-(--disabled)",
  };
  const sizeStyles: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-sm ",
    md: "px-4 py-2 text-base w-[137px]",
    lg: "px-5 py-3 text-lg w-[250px]",
  };
  return (
    <button
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="loader mr-2"></span>}
      {children}
    </button>
  );
};
