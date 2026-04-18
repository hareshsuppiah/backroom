"use client";

import { cn } from "@/lib/cn";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

/**
 * Three-state mode toggle: System / Light / Dark.
 *
 * Rendered as a segmented control. Persists via next-themes (localStorage for
 * now; will migrate to profiles.theme_preference in Phase 3).
 */
export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid hydration mismatch; render a stable skeleton pre-mount.
  const active = mounted ? (theme ?? "system") : "system";

  const options = [
    { value: "system", label: "System", Icon: Monitor },
    { value: "light", label: "Light", Icon: Sun },
    { value: "dark", label: "Dark", Icon: Moon },
  ] as const;

  return (
    <div
      role="radiogroup"
      aria-label="Colour mode"
      className="inline-flex items-center rounded-md border border-border bg-elevated p-0.5"
    >
      {options.map(({ value, label, Icon }) => {
        const selected = active === value;
        return (
          <button
            key={value}
            type="button"
            // biome-ignore lint/a11y/useSemanticElements: segmented-control buttons keep native button keyboard behaviour; role=radio exposes the group semantics.
            role="radio"
            aria-checked={selected}
            aria-label={label}
            onClick={() => setTheme(value)}
            className={cn(
              "inline-flex h-7 w-7 items-center justify-center rounded-sm transition-colors duration-fast",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-elevated",
              selected ? "bg-highest text-primary" : "text-tertiary hover:text-secondary",
            )}
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
        );
      })}
    </div>
  );
}
