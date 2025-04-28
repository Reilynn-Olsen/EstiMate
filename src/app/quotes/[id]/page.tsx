"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import type { Quote } from "@prisma/client";
import type { QuoteItem } from "@prisma/client";
import type { Client } from "@prisma/client";
type QuoteWithClientAndItems = Quote & { client: Client } & {
  items: QuoteItem[];
};

const QuotePage = () => {
  const [quote, setQuote] = useState<QuoteWithClientAndItems | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await fetch(`/api/quotes/${id}`);
        if (response.ok) {
          const data = await response.json();
          setQuote(data);
        } else {
          setError("Quote not found.");
        }
      } catch (error) {
        setError("Error fetching quote.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchQuote();
    }
  }, [id]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/quotes/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        router.push("/quotes");
      } else {
        setError("Failed to delete the quote.");
      }
    } catch (error) {
      setError("Error deleting quote.");
      console.error(error);
    }
  };

  const handleEdit = () => {
    router.push(`/quotes/${id}/edit`);
  };

  const handleViewPDF = () => {
    window.open(`/api/quotes/${id}/pdf`, "_blank");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!quote) {
    return <div>Quote not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Quote</h1>

        <div className="space-y-4">
          <div className="text-gray-700">
            <h2 className="font-semibold">Client</h2>
            <p>{quote.client?.name}</p>
            <p>{quote.client?.email}</p>
            <p>{quote.client?.company}</p>
          </div>

          <div className="text-gray-700">
            <h2 className="font-semibold">Services</h2>
            <ul className="space-y-2">
              {quote.items.map((item: QuoteItem, index: number) => (
                <li key={index} className="flex justify-between">
                  <span>{item.description}</span>
                  <span>
                    {item.quantity} x ${item.rate}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-gray-700">
            <h2 className="font-semibold">Total</h2>
            <p>${quote.total.toFixed(2)}</p>
          </div>

          <div className="text-gray-700">
            <h2 className="font-semibold">Status</h2>
            <span
              className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${statusColors[quote.status]}`}
            >
              {quote.status}
            </span>
          </div>

          <div className="flex space-x-4 mt-6">
            <button
              onClick={handleEdit}
              className="bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700"
            >
              Edit Quote
            </button>

            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-6 py-2 rounded-xl hover:bg-red-700"
            >
              Delete Quote
            </button>

            <button
              onClick={handleViewPDF}
              className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700"
            >
              View PDF
            </button>
          </div>

          <div className="mt-6">
            <button
              onClick={() => router.push("/quotes")}
              className="bg-gray-600 text-white px-6 py-2 rounded-xl hover:bg-gray-700"
            >
              Back to Quotes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const statusColors: Record<string, string> = {
  Draft: "bg-yellow-100 text-yellow-800",
  Sent: "bg-blue-100 text-blue-800",
  Accepted: "bg-green-100 text-green-800",
};

export default QuotePage;
