import React from "react";
import clsx from "clsx";

type Props = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string | null;
};

export function Select({ label, error, className, children, ...rest }: Props) {
  return (
    <label className="block">
      {label ? <div className="mb-1 text-sm font-medium text-zinc-900">{label}</div> : null}
      <select
        className={clsx(
          "h-11 w-full rounded-xl border bg-white px-3 text-sm outline-none transition",
          "border-zinc-200 focus:border-black focus:ring-2 focus:ring-black/10",
          error ? "border-red-400 focus:border-red-600 focus:ring-red-500/10" : "",
          className
        )}
        {...rest}
      >
        {children}
      </select>
      {error ? <div className="mt-1 text-xs text-red-600">{error}</div> : null}
    </label>
  );
}