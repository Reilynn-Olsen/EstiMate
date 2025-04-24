import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Head>
        <title>EstiMate - Smart Quote Generator</title>
        <meta
          name="description"
          content="Create professional quotes in minutes with EstiMate."
        />
      </Head>

      <main className="min-h-screen bg-gray-50 flex flex-col justify-between">
        <header className="w-full px-6 py-4 flex justify-between items-center bg-white shadow">
          <h1 className="text-2xl font-bold text-indigo-600">EstiMate</h1>
          <nav>
            <Link
              href="/login"
              className="text-indigo-600 hover:underline font-medium"
            >
              Login
            </Link>
          </nav>
        </header>

        <section className="flex flex-col md:flex-row items-center justify-center px-8 py-24 gap-12">
          <div className="max-w-xl">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              Generate beautiful, client-ready quotes
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              EstiMate helps freelancers and small businesses craft professional
              proposals in just a few clicks. Save time, look polished, and
              close deals faster.
            </p>
            <Link href="/dashboard">
              <button className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all">
                Get Started
              </button>
            </Link>
          </div>
          <div className="w-full max-w-md">
            <Image
              width={500}
              height={1000}
              src="/images/quote-preview.png"
              alt="Quote preview"
              className="rounded-2xl shadow-xl"
            />
          </div>
        </section>

        <footer className="text-center py-6 text-gray-500 text-sm">
          © {new Date().getFullYear()} EstiMate. All rights reserved.
        </footer>
      </main>
    </>
  );
}
