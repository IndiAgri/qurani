import React from "react";
import { cn } from "@/lib/utils";

export function IndonesiaFlag({ className = "size-6" }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-full overflow-hidden border border-gray-200/90 shadow-2xs aspect-square",
        className
      )}
      aria-label="Bendera Indonesia"
    >
      <svg viewBox="0 0 32 32" className="size-full block" fill="none">
        <rect width="32" height="16" fill="#e11d48" />
        <rect y="16" width="32" height="16" fill="#ffffff" />
      </svg>
    </span>
  );
}

export function UsaFlag({ className = "size-6" }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-full overflow-hidden border border-gray-200/90 shadow-2xs aspect-square",
        className
      )}
      aria-label="United States Flag"
    >
      <svg viewBox="0 0 32 32" className="size-full block" fill="none">
        {/* Red base */}
        <rect width="32" height="32" fill="#e11d48" />
        {/* White stripes */}
        <path
          d="M0 4.92h32M0 9.84h32M0 14.76h32M0 19.68h32M0 24.6h32M0 29.52h32"
          stroke="#ffffff"
          strokeWidth="2.46"
        />
        {/* Blue canton */}
        <rect width="15" height="17" fill="#1e3a8a" />
        {/* Simple star pattern */}
        <g fill="#ffffff">
          <circle cx="3.5" cy="3.5" r="0.9" />
          <circle cx="7.5" cy="3.5" r="0.9" />
          <circle cx="11.5" cy="3.5" r="0.9" />
          <circle cx="5.5" cy="6.8" r="0.9" />
          <circle cx="9.5" cy="6.8" r="0.9" />
          <circle cx="3.5" cy="10.1" r="0.9" />
          <circle cx="7.5" cy="10.1" r="0.9" />
          <circle cx="11.5" cy="10.1" r="0.9" />
          <circle cx="5.5" cy="13.4" r="0.9" />
          <circle cx="9.5" cy="13.4" r="0.9" />
        </g>
      </svg>
    </span>
  );
}

export function CountryFlag({
  code,
  className = "size-5",
}: {
  code: string;
  className?: string;
}) {
  if (code.toLowerCase() === "id") {
    return <IndonesiaFlag className={className} />;
  }
  return <UsaFlag className={className} />;
}
