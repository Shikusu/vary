import Link from "next/link";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center  p-24">
      <h1 className="text-8xl mb-10 font-bold">Efa nanao vary ve?</h1>
      <Link
        href="/ol-ato-antrano"
        className="btn rounded-full p-3 border-2 mt-10 text-2xl font-semibold text-blue-500 hover:bg-blue-400"
      >
        Jereo ato
      </Link>
    </main>
  );
}
