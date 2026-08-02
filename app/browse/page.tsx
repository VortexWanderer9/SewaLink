"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WorkerCard from "@/components/WorkerCard";
import { categories, workers } from "@/lib/data";
import { categoryIcons } from "@/components/CategoryCard";

function BrowseContent() {
  const params = useSearchParams();
  const initial = params.get("category") ?? "all";
  const [activeCategory, setActiveCategory] = useState(initial);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"rating" | "price">("rating");

  const filtered = useMemo(() => {
    let list = workers;
    if (activeCategory !== "all") list = list.filter((w) => w.category === activeCategory);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (w) => w.name.toLowerCase().includes(q) || w.location.toLowerCase().includes(q) || w.category.includes(q)
      );
    }
    return [...list].sort((a, b) => (sort === "rating" ? b.rating - a.rating : a.priceFrom - b.priceFrom));
  }, [activeCategory, query, sort]);

  const activeCategoryData = categories.find((c) => c.slug === activeCategory);

  return (
    <div>
      <Header />
      <section className="border-b border-ink-900/8 bg-indigo-950 py-10 text-paper-50">
        <div className="container-page">
          <h1 className="font-display text-2xl font-bold sm:text-3xl">
            {activeCategoryData ? activeCategoryData.name : "Browse verified professionals"}
          </h1>
          <p className="mt-1 text-sm text-paper-100/70">
            {activeCategoryData ? activeCategoryData.blurb : "Every professional below has passed ID and background verification."}
          </p>
          <div className="mt-5 flex items-center gap-2 rounded-full bg-paper-50 px-4 py-3">
            <Search size={16} className="text-ink-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, area, or service..."
              className="w-full bg-transparent text-sm text-ink-900 outline-none placeholder:text-ink-400"
            />
          </div>
        </div>
      </section>

      <section className="container-page py-10">
        <div className="grid gap-8 lg:grid-cols-[220px,1fr]">
          <aside className="space-y-6">
            <div>
              <h2 className="font-display text-sm font-semibold text-ink-900">Category</h2>
              <div className="mt-3 flex flex-wrap gap-2 lg:flex-col">
                <button
                  onClick={() => setActiveCategory("all")}
                  className={`rounded-full px-3 py-1.5 text-left text-xs font-medium transition lg:rounded-lg ${
                    activeCategory === "all" ? "bg-indigo-900 text-paper-50" : "bg-paper-100 text-ink-700 hover:bg-paper-200"
                  }`}
                >
                  All services
                </button>
                {categories.map((c) => {
                  const Icon = categoryIcons[c.slug];
                  return (
                    <button
                      key={c.slug}
                      onClick={() => setActiveCategory(c.slug)}
                      className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-left text-xs font-medium transition lg:rounded-lg ${
                        activeCategory === c.slug ? "bg-indigo-900 text-paper-50" : "bg-paper-100 text-ink-700 hover:bg-paper-200"
                      }`}
                    >
                      <Icon size={13} /> {c.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h2 className="flex items-center gap-1.5 font-display text-sm font-semibold text-ink-900">
                <SlidersHorizontal size={13} /> Sort by
              </h2>
              <div className="mt-3 flex gap-2 lg:flex-col">
                <button
                  onClick={() => setSort("rating")}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition lg:rounded-lg lg:text-left ${
                    sort === "rating" ? "bg-marigold-500 text-indigo-950" : "bg-paper-100 text-ink-700 hover:bg-paper-200"
                  }`}
                >
                  Highest rated
                </button>
                <button
                  onClick={() => setSort("price")}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition lg:rounded-lg lg:text-left ${
                    sort === "price" ? "bg-marigold-500 text-indigo-950" : "bg-paper-100 text-ink-700 hover:bg-paper-200"
                  }`}
                >
                  Lowest price
                </button>
              </div>
            </div>
          </aside>

          <div>
            <p className="mb-4 text-xs text-ink-400">{filtered.length} verified professionals found</p>
            {filtered.length === 0 ? (
              <div className="rounded-xl2 border border-dashed border-ink-900/15 p-12 text-center">
                <p className="font-display text-sm font-semibold text-ink-900">No pros match yet</p>
                <p className="mt-1 text-xs text-ink-400">Try a different category or search term.</p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((w) => (
                  <WorkerCard key={w.id} worker={w} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={null}>
      <BrowseContent />
    </Suspense>
  );
}
