import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Loading() {
  return (
    <div>
      <Header />
      <section className="container-page flex min-h-[50vh] flex-col items-center justify-center gap-5 py-20">
        <div className="h-11 w-11 animate-spin rounded-full border-2 border-indigo-900/20 border-t-indigo-900" />
        <p className="font-mono text-xs text-ink-400">Loading…</p>
      </section>
      <Footer />
    </div>
  );
}
