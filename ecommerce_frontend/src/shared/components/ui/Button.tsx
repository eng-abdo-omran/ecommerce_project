import React from "react";
import clsx from "clsx";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
};

const base =
  "inline-flex items-center justify-center rounded-xl font-medium transition " +
  "focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";

const variants: Record<NonNullable<Props["variant"]>, string> = {
  primary: "bg-black text-white hover:bg-zinc-800 focus:ring-black",
  secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 focus:ring-zinc-400",
  ghost: "bg-transparent text-zinc-900 hover:bg-zinc-100 focus:ring-zinc-300",
  danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
};

const sizes: Record<NonNullable<Props["size"]>, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  isLoading,
  children,
  ...rest
}: Props) {
  return (
    <button
      className={clsx(base, variants[variant], sizes[size], className)}
      {...rest}
      disabled={rest.disabled || isLoading}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          <span>جاري...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}