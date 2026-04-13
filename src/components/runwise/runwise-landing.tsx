"use client"

import Link from "next/link"
import { useState } from "react"
import {
  ArrowRight,
  CalendarRange,
  CloudSun,
  Compass,
  Gauge,
  Menu,
  Sparkles,
  Target,
  Timer,
  X,
} from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const LANDING_LINKS = {
  demo: "/demo",
  github: "https://github.com/vankhgo/RunWise",
} as const

const NAV_ITEMS = [
  { label: "Problem", href: "#problem" },
  { label: "Features", href: "#features" },
  { label: "Tech Stack", href: "#tech-stack" },
  { label: "Impact", href: "#impact" },
] as const

const FEATURE_CARDS = [
  {
    title: "Planner Inputs That Matter",
    body: "Set distance, available time, intensity, and goal in seconds without navigating complex setup screens.",
    icon: Target,
  },
  {
    title: "Weather-Aware Recommendations",
    body: "Runwise adjusts recommendations with weather context so today’s plan stays realistic and usable.",
    icon: CloudSun,
  },
  {
    title: "Recommendation-First UX",
    body: "The app focuses on one core decision: what run to do today. No dashboard clutter and no overthinking.",
    icon: Compass,
  },
  {
    title: "Saved Plans",
    body: "Save practical recommendations and quickly reuse them when your schedule looks similar.",
    icon: CalendarRange,
  },
  {
    title: "Recent History",
    body: "Review recent planning decisions to keep your running routine consistent across the week.",
    icon: Timer,
  },
  {
    title: "Rule-Based and Explainable",
    body: "Recommendations are deterministic and transparent, so users can trust the logic behind each suggestion.",
    icon: Gauge,
  },
] as const

const STACK_ITEMS = [
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "shadcn/ui-style components",
  "React Hook Form",
  "Zod",
  "Framer Motion",
  "Supabase",
  "Open-Meteo",
] as const

export function RunwiseLanding() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/80 via-white to-lime-50/60 text-slate-900">
      <header
        data-testid="navbar"
        className="sticky top-0 z-40 border-b border-emerald-100/70 bg-white/80 backdrop-blur"
      >
        <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="#hero" className="inline-flex items-center gap-2" aria-label="Runwise home">
            <span className="rounded-xl bg-emerald-600 p-1.5 text-white shadow-sm">
              <Sparkles size={14} />
            </span>
            <span className="text-base font-semibold tracking-tight">Runwise</span>
          </Link>

          <ul className="hidden items-center gap-7 md:flex">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm font-medium text-slate-600 transition-colors hover:text-emerald-700"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-2 md:flex">
            <Link
              href={LANDING_LINKS.demo}
              data-testid="hero-cta-demo"
              className={cn(buttonVariants({ size: "lg" }), "h-10 rounded-xl px-4")}
            >
              Go to Demo
            </Link>
            <Link
              href={LANDING_LINKS.github}
              target="_blank"
              rel="noreferrer"
              data-testid="hero-cta-github"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-10 rounded-xl border-emerald-200 px-4",
              )}
            >
              View GitHub
            </Link>
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-100 text-slate-700 md:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>

        {mobileOpen ? (
          <div id="mobile-nav" className="border-t border-emerald-100 bg-white/95 px-4 py-4 md:hidden">
            <ul className="space-y-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-emerald-50"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 grid gap-2">
              <Link
                href={LANDING_LINKS.demo}
                className={cn(buttonVariants({ size: "lg" }), "h-11 rounded-xl")}
                onClick={() => setMobileOpen(false)}
              >
                Go to Demo
              </Link>
              <Link
                href={LANDING_LINKS.github}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-11 rounded-xl border-emerald-200",
                )}
              >
                View GitHub
              </Link>
            </div>
          </div>
        ) : null}
      </header>

      <main>
        <section
          id="hero"
          data-testid="hero"
          className="mx-auto grid w-full max-w-6xl gap-10 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pb-20 lg:pt-20"
        >
          <div className="space-y-6">
            <p className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-100/80 px-3 py-1 text-xs font-semibold text-emerald-700">
              <Sparkles size={13} /> Recommendation-first running planner
            </p>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Plan Today&apos;s Run With Clarity, Not Guesswork.
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Runwise helps runners decide what to run today using distance, time, intensity,
              goal, and weather context. It is a lightweight planning tool designed for useful,
              everyday decisions.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href={LANDING_LINKS.demo}
                data-testid="hero-cta-demo"
                className={cn(buttonVariants({ size: "lg" }), "h-12 rounded-xl px-5 text-sm")}
              >
                Go to Demo <ArrowRight size={16} />
              </Link>
              <Link
                href={LANDING_LINKS.github}
                target="_blank"
                rel="noreferrer"
                data-testid="hero-cta-github"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-12 rounded-xl border-emerald-200 px-5 text-sm hover:bg-emerald-50",
                )}
              >
                View GitHub
              </Link>
            </div>

            <div className="grid max-w-xl gap-3 pt-2 sm:grid-cols-3">
              <div className="rounded-2xl border border-emerald-100 bg-white/90 p-3 shadow-sm">
                <p className="text-xs text-slate-500">Decision time</p>
                <p className="mt-1 text-sm font-semibold">Under 1 minute</p>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-white/90 p-3 shadow-sm">
                <p className="text-xs text-slate-500">Recommendation mode</p>
                <p className="mt-1 text-sm font-semibold">Rule-based</p>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-white/90 p-3 shadow-sm">
                <p className="text-xs text-slate-500">Weather context</p>
                <p className="mt-1 text-sm font-semibold">Built-in</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-6 top-8 h-32 w-32 rounded-full bg-lime-300/40 blur-2xl" />
            <div className="absolute -right-6 bottom-8 h-36 w-36 rounded-full bg-emerald-300/45 blur-2xl" />

            <div className="relative overflow-hidden rounded-3xl border border-emerald-300/30 bg-slate-900 p-6 text-slate-100 shadow-2xl sm:p-7">
              <div className="mb-5 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-300">
                  Runwise Preview
                </p>
                <span className="rounded-full border border-emerald-400/40 bg-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-200">
                  Live Recommendation
                </span>
              </div>

              <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <h3 className="text-xl font-semibold">Heat-Aware Short Run</h3>
                <p className="text-sm leading-relaxed text-slate-300">
                  Based on your 40-minute window and consistency goal, Runwise suggests a shorter,
                  controlled run today to keep effort practical in current conditions.
                </p>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="rounded-xl bg-white/10 p-2">
                    <p className="text-slate-300">Distance</p>
                    <p className="mt-1 font-semibold text-white">5.0 km</p>
                  </div>
                  <div className="rounded-xl bg-white/10 p-2">
                    <p className="text-slate-300">Duration</p>
                    <p className="mt-1 font-semibold text-white">38 min</p>
                  </div>
                  <div className="rounded-xl bg-white/10 p-2">
                    <p className="text-slate-300">Effort</p>
                    <p className="mt-1 font-semibold text-white">Moderate</p>
                  </div>
                </div>

                <div className="rounded-xl border border-emerald-300/20 bg-emerald-400/10 p-3 text-xs text-emerald-100">
                  Weather note: Warm conditions detected. Keep hydration high and hold an even
                  pace for better consistency.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="problem"
          data-testid="problem"
          className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8"
        >
          <div className="rounded-3xl border border-emerald-100 bg-white/90 p-7 shadow-sm sm:p-9">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">The Problem Runwise Solves</h2>
            <p className="mt-3 max-w-3xl text-slate-600">
              Most runners do not struggle with tracking tools. They struggle with deciding what to
              do today. Runwise removes planning friction by turning scattered constraints into one
              clear recommendation.
            </p>

            <div className="mt-7 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
                <p className="font-semibold">Too many decisions before running</p>
                <p className="mt-2 text-sm text-slate-600">
                  Distance, intensity, available time, and weather often conflict and slow users down.
                </p>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
                <p className="font-semibold">Generic plans ignore context</p>
                <p className="mt-2 text-sm text-slate-600">
                  Static plans can feel unrealistic when conditions change or time is tight.
                </p>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
                <p className="font-semibold">Heavy fitness apps add complexity</p>
                <p className="mt-2 text-sm text-slate-600">
                  Many tools prioritize tracking depth over quick, practical planning.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="features"
          data-testid="features"
          className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8"
        >
          <div className="mb-8">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Features</h2>
            <p className="mt-3 max-w-3xl text-slate-600">
              A focused feature set for one goal: help users choose a run quickly and confidently.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {FEATURE_CARDS.map((feature) => {
              const Icon = feature.icon

              return (
                <article
                  key={feature.title}
                  className="rounded-2xl border border-emerald-100 bg-white/95 p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span className="inline-flex rounded-xl bg-emerald-100 p-2 text-emerald-700">
                    <Icon size={16} />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold tracking-tight">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{feature.body}</p>
                </article>
              )
            })}
          </div>
        </section>

        <section
          id="tech-stack"
          data-testid="tech-stack"
          className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8"
        >
          <div className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/70 p-7 shadow-sm sm:p-9">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Tech Stack</h2>
            <p className="mt-3 max-w-3xl text-slate-600">
              Built with a practical modern stack optimized for fast iteration and clear product UX.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {STACK_ITEMS.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section
          id="impact"
          data-testid="impact"
          className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8"
        >
          <div className="mb-8">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">How Runwise Helps</h2>
            <p className="mt-3 max-w-3xl text-slate-600">
              Runwise is intentionally lightweight, so users can build consistency without turning
              planning into another complex task.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-slate-500">Faster planning</p>
              <p className="mt-2 text-2xl font-semibold">1 decision flow</p>
              <p className="mt-2 text-sm text-slate-600">From inputs to clear recommendation in one screen.</p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-slate-500">Practical advice</p>
              <p className="mt-2 text-2xl font-semibold">Weather-aware</p>
              <p className="mt-2 text-sm text-slate-600">Adjusts effort framing to current conditions.</p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-slate-500">Repeatability</p>
              <p className="mt-2 text-2xl font-semibold">Saved plans</p>
              <p className="mt-2 text-sm text-slate-600">Reuse what works and stay consistent week to week.</p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-slate-500">Clarity</p>
              <p className="mt-2 text-2xl font-semibold">No dashboard noise</p>
              <p className="mt-2 text-sm text-slate-600">Focused product scope keeps the experience simple.</p>
            </div>
          </div>
        </section>

        <section
          data-testid="final-cta"
          className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pb-20"
        >
          <div className="rounded-3xl border border-emerald-300/40 bg-gradient-to-br from-emerald-700 via-emerald-600 to-lime-500 p-8 text-white shadow-xl sm:p-10">
            <h2 className="text-3xl font-semibold tracking-tight">Ready to Try Runwise?</h2>
            <p className="mt-3 max-w-2xl text-emerald-50/95">
              Explore the live MVP and review the codebase. Runwise is built to demonstrate product
              thinking, focused scope, and execution quality.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={LANDING_LINKS.demo}
                className={cn(
                  buttonVariants({ variant: "secondary", size: "lg" }),
                  "h-12 rounded-xl bg-white px-5 text-slate-900 hover:bg-emerald-50",
                )}
              >
                Go to Demo
              </Link>
              <Link
                href={LANDING_LINKS.github}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-12 rounded-xl border-white/70 bg-transparent px-5 text-white hover:bg-white/10",
                )}
              >
                View GitHub
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer data-testid="footer" className="border-t border-emerald-100 bg-white/75">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
            <p className="text-lg font-semibold tracking-tight">Runwise</p>
            <p className="mt-2 max-w-sm text-sm text-slate-600">
              Lightweight running planner for better daily decisions.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">Quick Links</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition-colors hover:text-emerald-700">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">External</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>
                <Link href={LANDING_LINKS.demo} className="transition-colors hover:text-emerald-700">
                  Demo App
                </Link>
              </li>
              <li>
                <Link
                  href={LANDING_LINKS.github}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-emerald-700"
                >
                  GitHub Repository
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-emerald-100 py-4 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Runwise. Built as a portfolio-ready product case study.
        </div>
      </footer>
    </div>
  )
}

export { LANDING_LINKS }
