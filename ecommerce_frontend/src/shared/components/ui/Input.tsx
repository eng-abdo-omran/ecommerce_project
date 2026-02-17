import React from "react";
import clsx from "clsx";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string | null;
  hint?: string;
};

export function Input({ label, error, hint, className, ...rest }: Props) {
  return (
    <label className="block">
      {label ? <div className="mb-1 text-sm font-medium text-zinc-900">{label}</div> : null}
      <input
        className={clsx(
          "h-11 w-full rounded-xl border bg-white px-3 text-sm outline-none transition",
          "border-zinc-200 focus:border-black focus:ring-2 focus:ring-black/10",
          error ? "border-red-400 focus:border-red-600 focus:ring-red-500/10" : "",
          className
        )}
        {...rest}
      />
      {hint ? <div className="mt-1 text-xs text-zinc-500">{hint}</div> : null}
      {error ? <div className="mt-1 text-xs text-red-600">{error}</div> : null}
    </label>
  );
}