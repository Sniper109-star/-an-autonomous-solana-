const features = [
  {
    title: "Thumb-friendly navigation",
    description:
      "Primary actions stay within reach on small screens with sticky controls and generous touch targets.",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
        <path
          d="M7 11.5a5.5 5.5 0 1 1 10 0v2.25a2.25 2.25 0 0 1-2.25 2.25h-5.5A2.25 2.25 0 0 1 7 13.75v-2.25Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 16v2.25M9.75 20.5h4.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "Readable mobile layout",
    description:
      "Dense information is split into cards, short sections, and responsive spacing for one-handed scanning.",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
        <path
          d="M7 3.75h10a2 2 0 0 1 2 2v12.5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5.75a2 2 0 0 1 2-2Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M12 18.25h.01M8.25 8h7.5M8.25 11.5h7.5M8.25 15h4.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "Portable environment",
    description:
      "Bun, Node, lockfile, and example environment files keep setup repeatable across machines.",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
        <path
          d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-9Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="m8 9 4 3 4-3M8 14h8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

const metrics = [
  {
    label: "Mobile-first",
    value: "100%",
  },
  {
    label: "Setup files",
    value: "6",
  },
  {
    label: "React runtime",
    value: "19",
  },
];

const setupSteps = [
  "Install dependencies with bun install",
  "Copy .env.example to .env.local",
  "Run bun dev for local preview",
  "Run bun run build before release",
];

export default function Home() {
  return (
    <div className="relative min-h-dvh">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <a href="#" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/20">
              M
            </span>
            <span className="hidden text-sm sm:inline">Mobile Starter</span>
          </a>
          <div className="flex items-center gap-2">
            <a
              href="#features"
              className="rounded-full px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white"
            >
              Features
            </a>
            <a
              href="#setup"
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-50"
            >
              Setup
            </a>
          </div>
        </nav>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col px-4 pb-28 pt-8 sm:px-6 sm:pb-16 sm:pt-12 lg:px-8">
        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-soft backdrop-blur sm:p-8 lg:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
            <div className="flex-1">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100">
                Mobile UI + UX
              </p>
              <h1 className="max-w-2xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                A starter that feels native on every phone.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
                Clean spacing, large tap targets, readable cards, sticky actions, and responsive
                layout patterns are built in from the first screen.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#features"
                  className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-400/20 transition hover:-translate-y-0.5 hover:bg-cyan-300 active:translate-y-0"
                >
                  Explore patterns
                </a>
                <a
                  href="#setup"
                  className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/10 active:translate-y-0"
                >
                  View setup
                </a>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-4 shadow-soft sm:max-w-sm">
              <div className="rounded-[1.35rem] border border-white/10 bg-slate-900 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      UX Score
                    </p>
                    <p className="mt-1 text-3xl font-black text-white">A+</p>
                  </div>
                  <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-300">
                    Ready
                  </span>
                </div>
                <div className="space-y-3">
                  {metrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="rounded-2xl border border-white/10 bg-white/[0.04] p-3"
                    >
                      <p className="text-2xl font-black text-white">{metric.value}</p>
                      <p className="mt-1 text-xs font-medium text-slate-400">{metric.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mt-8 sm:mt-12">
          <div className="mb-5 flex flex-col gap-2 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">
                Mobile UX
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
                Built around how people use phones.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-slate-400 sm:text-base">
              The interface prioritizes clarity, speed, and comfortable one-handed interaction.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5 shadow-lg shadow-slate-950/20 backdrop-blur transition hover:-translate-y-1 hover:border-cyan-300/30"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-300/15 text-cyan-200">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="setup" className="mt-8 rounded-[2rem] border border-white/10 bg-slate-950/60 p-5 shadow-soft backdrop-blur sm:mt-12 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-300">
                Portable setup
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
                Dependency and environment files included.
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-300 sm:text-base">
                Use the same runtime, package manager, lockfile, and local environment conventions on
                every machine.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
              <ol className="space-y-3">
                {setupSteps.map((step, index) => (
                  <li key={step} className="flex gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-400/15 text-xs font-black text-indigo-200">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium leading-6 text-slate-200">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-slate-950/85 p-3 backdrop-blur-xl sm:hidden">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-2">
          <a
            href="#features"
            className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-bold text-white"
          >
            Features
          </a>
          <a
            href="#setup"
            className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-cyan-400 px-4 text-sm font-bold text-slate-950"
          >
            Setup
          </a>
        </div>
      </div>

      <footer className="border-t border-white/10 px-4 py-8 text-center text-sm text-slate-500 sm:px-6 lg:px-8">
        <p>
          © {new Date().getFullYear()} Mobile-first Next.js starter. Built for fast, accessible
          mobile experiences.
        </p>
      </footer>
    </div>
  );
}
