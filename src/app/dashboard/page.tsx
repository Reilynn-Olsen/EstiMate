"use client";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";

type quoteData = {
  id: string;
  total: number;
  client: { name: string };
};

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [quotes, setQuotes] = useState<quoteData[]>([]);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const response = await fetch("/api/quotes");
        if (!response.ok) {
          throw new Error("Failed to fetch quotes");
        }
        const data = await response.json();
        setQuotes(data);
      } catch (error) {
        console.error("Error fetching quotes:", error);
      }
    };

    fetchQuotes();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = async () => {
    const res = await fetch(`/api/search-quotes?query=${searchTerm}`);
    const data: quoteData[] = await res.json();

    setQuotes(data);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-white shadow-lg px-6 py-8 hidden md:flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-indigo-600">EstiMate</h2>
        <nav className="flex flex-col gap-4 text-gray-700">
          <Link href="/dashboard" className="hover:text-indigo-600">
            🏠 Dashboard
          </Link>
          <Link href="/quotes" className="hover:text-indigo-600">
            🧾 My Quotes
          </Link>
          <Link href="/clients" className="hover:text-indigo-600">
            👥 Clients
          </Link>
          <Link href="/settings" className="hover:text-indigo-600">
            ⚙️ Settings
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-6">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">Dashboard</h1>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-sm text-gray-500 hover:text-red-500"
          >
            Logout
          </button>
        </header>

        <div className="mb-6 flex items-center gap-4">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search quotes..."
            className="px-4 py-2 border text-gray-700 rounded-lg w-64"
          />
          <button
            onClick={handleSearchSubmit}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Search
          </button>
        </div>

        {quotes.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-gray-300 rounded-xl bg-white shadow">
            <p className="text-gray-500 text-lg mb-4">
              You don’t have any quotes yet.
            </p>
            <Link href="/quotes/new">
              <button className="px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition">
                Create Your First Quote
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quotes.map((quote, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  Quote #{index + 1}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  Client: {quote.client.name}
                </p>
                <p className="text-sm text-gray-500">Total: ${quote.total}</p>
                <Link
                  href={`/quotes/${quote.id}`}
                  className="text-indigo-600 text-sm mt-2 inline-block hover:underline"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
