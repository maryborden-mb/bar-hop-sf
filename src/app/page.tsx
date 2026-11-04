import Link from "next/link";

export default function Home() {
  return (
    <main className="page hero">
      <p className="eyebrow">San Francisco · est. 2026</p>
      <h1>Remember every bar worth remembering.</h1>
      <p className="lead">
        Bar Hop SF is your private journal for the city&apos;s bars: where
        you&apos;ve been, how it felt, and where you&apos;d go back.
      </p>
      <div className="actions">
        <Link href="/signup" className="button">
          Start your journal
        </Link>
        <Link href="/login" className="button ghost">
          Log in
        </Link>
      </div>
    </main>
  );
}
