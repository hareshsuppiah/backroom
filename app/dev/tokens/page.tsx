import { ModeToggle } from "@/components/theme/mode-toggle";
import { cn } from "@/lib/cn";
import { notFound } from "next/navigation";

/**
 * Visual showcase for the Backroom design tokens. Renders colours, type,
 * radii, shadows, and motion defined in docs/DESIGN_SYSTEM.md so the
 * maintainer can verify the token pipeline before merging Phase 1.
 *
 * Gated. Returns 404 in production unless BACKROOM_SHOW_DEV_TOKENS=true.
 */

const isDev = process.env.NODE_ENV !== "production";
const explicitlyEnabled = process.env.BACKROOM_SHOW_DEV_TOKENS === "true";

export const dynamic = "force-dynamic";

export default function DevTokensPage() {
  if (!isDev && !explicitlyEnabled) {
    notFound();
  }

  return (
    <div className="min-h-dvh bg-base text-primary">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border-subtle bg-base/80 px-gutter-mobile py-4 backdrop-blur-sm md:px-gutter-desktop">
        <div>
          <p className="text-caption uppercase text-tertiary">Dev-only</p>
          <h1 className="text-heading-lg text-primary">Design tokens</h1>
        </div>
        <ModeToggle />
      </header>

      <main className="mx-auto max-w-[1280px] space-y-12 px-gutter-mobile py-10 md:px-gutter-desktop">
        <ColourSection />
        <TypographySection />
        <RadiusSection />
        <ShadowSection />
        <StatusSection />
        <MotionSection />
      </main>
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-heading-md">{title}</h2>
        {subtitle ? <p className="text-body-sm text-secondary">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}

function Swatch({
  name,
  className,
  contrast = "primary",
}: {
  name: string;
  className: string;
  contrast?: "primary" | "accent";
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className={cn("h-16 rounded-lg border border-border-subtle", className)} />
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-mono-sm text-tertiary">{name}</span>
        <span
          className={cn(
            "text-caption uppercase",
            contrast === "accent" ? "text-accent" : "text-secondary",
          )}
        >
          token
        </span>
      </div>
    </div>
  );
}

function ColourSection() {
  return (
    <Section
      title="Colour"
      subtitle="All defined as CSS variables. Components reference semantic names."
    >
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Swatch name="bg-base" className="bg-base" />
        <Swatch name="bg-elevated" className="bg-elevated" />
        <Swatch name="bg-higher" className="bg-higher" />
        <Swatch name="bg-highest" className="bg-highest" />
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <Swatch name="border-subtle" className="bg-border-subtle" />
        <Swatch name="border-default" className="bg-border" />
        <Swatch name="border-strong" className="bg-border-strong" />
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <Swatch name="accent" className="bg-accent" contrast="accent" />
        <Swatch name="accent-hover" className="bg-accent-hover" />
        <Swatch name="accent-active" className="bg-accent-active" />
        <Swatch name="accent-subtle" className="bg-accent-subtle" />
        <Swatch name="accent-dim" className="bg-accent-dim" />
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Swatch name="success" className="bg-success" />
        <Swatch name="warning" className="bg-warning" />
        <Swatch name="danger" className="bg-danger" />
        <Swatch name="info" className="bg-info" />
      </div>
    </Section>
  );
}

function TypographySection() {
  const samples = [
    { token: "display-lg", sample: "Performance operations", cls: "text-display-lg" },
    { token: "display-md", sample: "Nothing on your plate", cls: "text-display-md" },
    { token: "display-sm", sample: "Dashboard", cls: "text-display-sm" },
    { token: "heading-lg", sample: "Section heading", cls: "text-heading-lg" },
    { token: "heading-md", sample: "Card title", cls: "text-heading-md" },
    { token: "heading-sm", sample: "Form label", cls: "text-heading-sm" },
    { token: "body-lg", sample: "Prose reading size for documentation.", cls: "text-body-lg" },
    { token: "body-md", sample: "Default body. 14px / 20 line-height.", cls: "text-body-md" },
    { token: "body-sm", sample: "Secondary UI, metadata.", cls: "text-body-sm text-secondary" },
    { token: "caption", sample: "status chip label", cls: "text-caption uppercase text-tertiary" },
    {
      token: "mono-md",
      sample: "item_42a9 · 2026-04-18T09:12",
      cls: "text-mono-md font-mono text-secondary",
    },
    { token: "mono-sm", sample: "0002 · 4ade80", cls: "text-mono-sm font-mono text-tertiary" },
  ];

  return (
    <Section title="Typography" subtitle="Geist Sans + Geist Mono. Semantic tokens only.">
      <div className="divide-y divide-border-subtle rounded-lg border border-border bg-elevated">
        {samples.map(({ token, sample, cls }) => (
          <div
            key={token}
            className="flex flex-col gap-2 px-4 py-3 md:flex-row md:items-baseline md:justify-between"
          >
            <span className="text-mono-sm text-tertiary md:w-32">{token}</span>
            <span className={cn("flex-1", cls)}>{sample}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}

function RadiusSection() {
  const radii = [
    { token: "radius-sm", cls: "rounded-sm", hint: "4px — inputs, tags, chips" },
    { token: "radius-md", cls: "rounded-md", hint: "6px — buttons" },
    { token: "radius-lg", cls: "rounded-lg", hint: "8px — cards, panels" },
    { token: "radius-xl", cls: "rounded-xl", hint: "12px — modals, popovers" },
    { token: "radius-full", cls: "rounded-full", hint: "avatar, status dot" },
  ];
  return (
    <Section title="Radius" subtitle="Max radius on general UI is 12px (xl). No 16px+ corners.">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {radii.map(({ token, cls, hint }) => (
          <div key={token} className="flex flex-col gap-2">
            <div className={cn("h-16 border border-border bg-elevated", cls)} />
            <span className="text-mono-sm text-tertiary">{token}</span>
            <span className="text-body-sm text-secondary">{hint}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}

function ShadowSection() {
  return (
    <Section title="Shadow" subtitle="Sparingly. sm on popovers, md on modals, lg on toasts only.">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {["sm", "md", "lg"].map((s) => (
          <div
            key={s}
            className={cn(
              "flex h-24 items-center justify-center rounded-lg border border-border bg-elevated",
              s === "sm" ? "shadow-sm" : s === "md" ? "shadow-md" : "shadow-lg",
            )}
          >
            <span className="text-mono-sm text-tertiary">shadow-{s}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}

function StatusSection() {
  const statuses = [
    {
      slug: "open",
      label: "Open",
      cls: "bg-status-open/20 text-status-open border-status-open/40",
    },
    { slug: "active", label: "Active", cls: "bg-accent-subtle text-accent border-accent/40" },
    { slug: "waiting", label: "Waiting", cls: "bg-warning-subtle text-warning border-warning/40" },
    { slug: "blocked", label: "Blocked", cls: "bg-danger-subtle text-danger border-danger/40" },
    { slug: "done", label: "Done", cls: "bg-success-subtle text-success border-success/40" },
  ];
  return (
    <Section title="Status" subtitle="Workflow state colours. Used everywhere a state is shown.">
      <div className="flex flex-wrap gap-2">
        {statuses.map(({ slug, label, cls }) => (
          <span
            key={slug}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 text-caption uppercase",
              cls,
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                slug === "open" && "bg-status-open",
                slug === "active" && "bg-accent",
                slug === "waiting" && "bg-warning",
                slug === "blocked" && "bg-danger",
                slug === "done" && "bg-success",
              )}
            />
            {label}
          </span>
        ))}
      </div>
    </Section>
  );
}

function MotionSection() {
  return (
    <Section
      title="Motion"
      subtitle="Durations: fast 100 · default 150 · slow 250 · page 300. Respects prefers-reduced-motion."
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[
          { d: "fast", cls: "duration-fast" },
          { d: "default", cls: "duration" },
          { d: "slow", cls: "duration-slow" },
          { d: "page", cls: "duration-page" },
        ].map(({ d, cls }) => (
          <div
            key={d}
            className={cn(
              "flex h-20 items-center justify-center rounded-md border border-border bg-elevated transition-colors ease-in-out-std hover:bg-higher",
              cls,
            )}
          >
            <span className="text-mono-sm text-tertiary">duration-{d}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}
