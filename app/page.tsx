// app/page.tsx  (or wherever your Home component lives)

import Link from "next/link";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-12 md:px-12 lg:px-24">
      <h1 className="text-5xl font-bold text-center mb-8 md:text-6xl lg:text-7xl xl:text-8xl tracking-tight">
        Efa nanao vary ve?
      </h1>

      <Link
        href="/ol-ato-antrano"
        className="
          inline-flex items-center justify-center
          px-8 py-4 text-lg md:text-xl lg:text-2xl
          font-semibold text-white bg-blue-600
          rounded-full shadow-md
          hover:bg-blue-700 hover:shadow-lg
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          transition-all duration-200
          active:scale-95
        "
      >
        Jereo ato
      </Link>
    </main>
  );
}
