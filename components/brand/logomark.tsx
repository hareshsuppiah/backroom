import { cn } from "@/lib/cn";

/**
 * Backroom symbolmark. 4×4 grid with the top-right cell filled in volt.
 * References a minimal sport-science test scoresheet. Placeholder until a
 * final logo is commissioned (per DESIGN_SYSTEM.md §14).
 */
const ACCENT_ROW = 0;
const ACCENT_COL = 3;
const GRID_CELLS = Array.from({ length: 16 }, (_, i) => {
  const col = i % 4;
  const row = Math.floor(i / 4);
  return { key: `${row}-${col}`, col, row, isAccent: row === ACCENT_ROW && col === ACCENT_COL };
});

export function Logomark({
  size = 20,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      role="img"
      aria-label="Backroom"
      className={cn("shrink-0", className)}
    >
      <title>Backroom</title>
      {GRID_CELLS.map(({ key, col, row, isAccent }) => (
        <rect
          key={key}
          x={col * 4 + 0.25}
          y={row * 4 + 0.25}
          width={3.5}
          height={3.5}
          rx={0.75}
          fill={isAccent ? "rgb(var(--accent))" : "transparent"}
          stroke="rgb(var(--border-strong))"
          strokeWidth={0.5}
        />
      ))}
    </svg>
  );
}
