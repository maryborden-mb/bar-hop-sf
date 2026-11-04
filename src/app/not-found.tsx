import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page">
      <h1>Not found</h1>
      <p className="muted">We couldn&apos;t find that page or bar.</p>
      <p>
        <Link href="/journal">Back to my journal</Link>
      </p>
    </main>
  );
}
