import React from "react";
import Text from "./headers/Text";

type SpinnerProps = {
  size?: number;
  stroke?: number;
  showLabel?: boolean;
  color?: string;
  label?: string;
  className?: string;
};

export default function Spinner({
  size = 20,
  stroke = 3,
  color = "text-black",
  showLabel = false,
  label = "Загрузка…",
  className = "",
}: SpinnerProps) {
  // Радиус с учетом толщины, чтобы не «обрезать» stroke
  const r = 12 - stroke / 2;

  return (
    <span
      role="status"
      aria-live="polite"
      className={`inline-flex items-center gap-2 ${className}`}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        className="animate-spin shrink-0"
        aria-hidden="true"
      >
        {/* Трек */}
        <circle
          cx="12"
          cy="12"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.25"
          strokeWidth={stroke}
        />
        {/* Дуга (активная часть) */}
        <path
          d={`M12 ${12 - r} a ${r} ${r} 0 0 1 ${r} ${r}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
      </svg>

      {/* Текст для скринридеров */}
      <span className="sr-only">{label}</span>

      {/* Опциональная видимая подпись */}
      {showLabel && (
        <Text variant="Small" className={`text-sm ${color}`}>
          {label}
        </Text>
      )}
    </span>
  );
}
