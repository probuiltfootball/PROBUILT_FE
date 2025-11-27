import { FiFeather, FiLayers, FiShield, FiTrendingUp } from "react-icons/fi";

import { Hero } from "@/components/hero";
import { ThemeToggle } from "@/components/theme-toggle";

const stackHighlights = [
    {
        title: "Next.js App Router",
        description: "Server Components, streaming, and RSC data APIs ready to ship.",
        icon: FiLayers,
    },
    {
        title: "Tailwind CSS 4",
        description:
            "Utility-first styling with modern defaults powered by the new PostCSS pipeline.",
        icon: FiFeather,
    },
    {
        title: "State + Themes",
        description:
            "Redux Toolkit, next-themes, and Framer Motion pre-wired for delightful UX.",
        icon: FiTrendingUp,
    },
    {
        title: "Best Practices",
        description:
            "TypeScript, ESLint + Prettier, and npm scripts to keep builds consistent.",
        icon: FiShield,
    },
];

export default function ThemePage() {
    return (
        <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#e0e7ff,_#f8fafc_55%)] px-4 py-10 text-slate-900 dark:bg-slate-950 dark:text-slate-100 md:px-8">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
                <div className="flex justify-end">
                    <ThemeToggle />
                </div>

                <Hero />

                <section className="grid gap-6 md:grid-cols-2">
                    {stackHighlights.map(({ title, description, icon: Icon }) => (
                        <article key={title} className="card-surface flex flex-col gap-3 p-6">
                            <Icon className="text-2xl text-indigo-500" />
                            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
                                {title}
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-300">{description}</p>
                        </article>
                    ))}
                </section>

                <section className="grid gap-6 md:grid-cols-2">
                    <div className="card-surface flex flex-col justify-between gap-4 p-6">
                        <div>
                            <p className="text-sm uppercase tracking-widest text-slate-500">
                                next-themes
                            </p>
                            <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">
                                Light & Dark ready.
                            </h2>
                            <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
                                Toggle to feel instant theme changes with smooth hydration-safe updates.
                            </p>
                        </div>
                        <ThemeToggle />
                    </div>
                </section>
            </div>
        </main>
    );
}
