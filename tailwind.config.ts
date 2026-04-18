import type { Config } from "tailwindcss";

/**
 * Backroom Tailwind config.
 *
 * Every colour token maps to a CSS variable defined in app/globals.css.
 * Components must use semantic class names (e.g. bg-base, text-primary) rather
 * than Tailwind's default palette (bg-slate-*, text-gray-*). A CI check in
 * scripts/check-antipatterns.mjs fails the build if raw palette classes appear
 * in app/** or components/**.
 *
 * See docs/DESIGN_SYSTEM.md for the full contract.
 */

const rgb = (cssVar: string) => `rgb(var(${cssVar}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: rgb("--bg-base"),
        elevated: rgb("--bg-elevated"),
        higher: rgb("--bg-higher"),
        highest: rgb("--bg-highest"),

        border: {
          subtle: rgb("--border-subtle"),
          DEFAULT: rgb("--border-default"),
          strong: rgb("--border-strong"),
        },

        text: {
          primary: rgb("--text-primary"),
          secondary: rgb("--text-secondary"),
          tertiary: rgb("--text-tertiary"),
          disabled: rgb("--text-disabled"),
        },

        accent: {
          DEFAULT: rgb("--accent"),
          hover: rgb("--accent-hover"),
          active: rgb("--accent-active"),
          subtle: rgb("--accent-subtle"),
          dim: rgb("--accent-dim"),
        },

        success: {
          DEFAULT: rgb("--success"),
          subtle: rgb("--success-subtle"),
        },
        warning: {
          DEFAULT: rgb("--warning"),
          subtle: rgb("--warning-subtle"),
        },
        danger: {
          DEFAULT: rgb("--danger"),
          subtle: rgb("--danger-subtle"),
        },
        info: {
          DEFAULT: rgb("--info"),
          subtle: rgb("--info-subtle"),
        },

        status: {
          open: rgb("--status-open"),
          active: rgb("--status-active"),
          waiting: rgb("--status-waiting"),
          blocked: rgb("--status-blocked"),
          done: rgb("--status-done"),
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        // Design System §5 — use these semantic tokens, never raw pixel sizes.
        "display-lg": ["48px", { lineHeight: "52px", fontWeight: "600" }],
        "display-md": ["36px", { lineHeight: "40px", fontWeight: "600" }],
        "display-sm": ["28px", { lineHeight: "32px", fontWeight: "600" }],
        "heading-lg": ["22px", { lineHeight: "28px", fontWeight: "600" }],
        "heading-md": ["18px", { lineHeight: "24px", fontWeight: "600" }],
        "heading-sm": ["15px", { lineHeight: "20px", fontWeight: "600" }],
        "body-lg": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "body-md": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "body-sm": ["13px", { lineHeight: "18px", fontWeight: "400" }],
        caption: ["12px", { lineHeight: "16px", fontWeight: "500", letterSpacing: "0.05em" }],
        "mono-md": ["13px", { lineHeight: "20px", fontWeight: "400" }],
        "mono-sm": ["12px", { lineHeight: "16px", fontWeight: "400" }],
      },
      borderRadius: {
        none: "0",
        sm: "4px",
        md: "6px",
        lg: "8px",
        xl: "12px",
        full: "9999px",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
      },
      spacing: {
        // Explicit tokens matching Design System §6. Tailwind defaults still
        // available, but prefer named values where intent is clearer.
        "gutter-mobile": "24px",
        "gutter-tablet": "32px",
        "gutter-desktop": "48px",
        "gutter-wide": "64px",
        "sidebar-open": "240px",
        "sidebar-collapsed": "64px",
      },
      transitionDuration: {
        fast: "100ms",
        DEFAULT: "150ms",
        slow: "250ms",
        page: "300ms",
      },
      transitionTimingFunction: {
        "ease-out-soft": "cubic-bezier(0.16, 1, 0.3, 1)",
        "ease-in-out-std": "cubic-bezier(0.4, 0, 0.2, 1)",
        spring: "cubic-bezier(0.5, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
