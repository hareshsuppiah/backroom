import { Logomark } from "@/components/brand/logomark";
import { ModeToggle } from "@/components/theme/mode-toggle";

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col bg-base text-primary">
      <header className="flex items-center justify-between border-b border-border-subtle px-gutter-mobile py-4 md:px-gutter-desktop">
        <div className="flex items-center gap-2">
          <Logomark />
          <span className="text-heading-sm tracking-[-0.02em] lowercase">backroom</span>
        </div>
        <ModeToggle />
      </header>

      <main className="flex flex-1 items-center justify-center px-gutter-mobile md:px-gutter-desktop">
        <div className="max-w-[720px] space-y-6 text-center">
          <p className="text-caption uppercase text-tertiary">
            <span className="inline-block h-1.5 w-1.5 translate-y-[-1px] rounded-full bg-accent align-middle" />
            <span className="ml-2 align-middle">Building in public — v0.0.1</span>
          </p>
          <h1 className="text-display-sm md:text-display-md text-primary">
            Backroom — coming soon.
          </h1>
          <p className="text-body-lg text-secondary">
            A lightweight operations platform for performance departments in sport. Track the work,
            measure the turnaround, simulate the load.
          </p>
          <p className="text-body-sm text-tertiary">
            Open source. AGPL-3.0. Self-hostable. No athlete health data, ever.
          </p>
        </div>
      </main>

      <footer className="border-t border-border-subtle px-gutter-mobile py-4 text-body-sm text-tertiary md:px-gutter-desktop">
        <div className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
          <span>
            Built by the people who schedule the testing, not the people who sell the software.
          </span>
          <a
            href="https://github.com/hareshsuppiah/backroom"
            className="text-secondary transition-colors duration-fast hover:text-primary focus-visible:outline-none focus-visible:text-accent"
          >
            github.com/hareshsuppiah/backroom
          </a>
        </div>
      </footer>
    </div>
  );
}
