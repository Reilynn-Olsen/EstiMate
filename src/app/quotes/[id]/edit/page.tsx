"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

interface Item {
  id?: string; // Make sure we keep track of ids if editing existing services
  description: string;
  quantity: number;
  rate: number;
}

interface Quote {
  id: string;
  clientId: string;
  status: string;
  items: Item[];
}

interface Client {
  id: string;
  name: string;
}

export default function EditQuotePage() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  useEffect(() => {
    const fetchQuote = async () => {
      const res = await fetch(`/api/quotes/${id}`);
      const data = await res.json();
      if (res.ok) {
        setQuote(data);
      } else {
        console.error("Failed to fetch quote");
      }
      setIsLoading(false);
    };

    const fetchClients = async () => {
      const res = await fetch("/api/clients");
      const data = await res.json();
      if (res.ok) {
        setClients(data.clients);
      } else {
        console.error("Failed to fetch clients");
      }
    };

    fetchQuote();
    fetchClients();
  }, [id]);

  const handleItemChange = (
    index: number,
    field: keyof Item,
    value: string | number,
  ) => {
    if (!quote) return;
    const updatedItems = [...quote.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setQuote({ ...quote, items: updatedItems });
  };

  const addItem = () => {
    if (!quote) return;
    setQuote({
      ...quote,
      items: [...quote.items, { description: "", quantity: 1, rate: 0 }],
    });
  };

  const calculateTotal = () =>
    quote
      ? quote.items
          .reduce((total, item) => total + item.quantity * item.rate, 0)
          .toFixed(2)
      : "0.00";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quote) return;
    setIsSaving(true);

    const res = await fetch(`/api/quotes/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quote),
    });

    if (res.ok) {
      router.push("/quotes");
    } else {
      console.error("Failed to update quote");
    }

    setIsSaving(false);
  };

  if (isLoading) return <div>Loading...</div>;
  if (!quote) return <div>Quote not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Quote</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Client Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700"
              value={quote.clientId}
              onChange={(e) => setQuote({ ...quote, clientId: e.target.value })}
              required
            >
              <option value="">Select Client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700"
              value={quote.status}
              onChange={(e) => setQuote({ ...quote, status: e.target.value })}
              required
            >
              <option value="Draft">Draft</option>
              <option value="Sent">Sent</option>
              <option value="Accepted">Accepted</option>
            </select>
          </div>

          {/* Services Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Services
            </h2>
            {quote.items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 mb-4">
                <input
                  className="col-span-6 border border-gray-300 rounded-lg px-4 py-2 text-gray-700"
                  placeholder="Service description"
                  value={item.description}
                  onChange={(e) =>
                    handleItemChange(index, "description", e.target.value)
                  }
                  required
                />
                <input
                  className="col-span-2 border border-gray-300 rounded-lg px-4 py-2 text-gray-700"
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(
                      index,
                      "quantity",
                      parseInt(e.target.value),
                    )
                  }
                  required
                />
                <input
                  className="col-span-2 border border-gray-300 rounded-lg px-4 py-2 text-gray-700"
                  type="number"
                  placeholder="Rate"
                  value={item.rate}
                  onChange={(e) =>
                    handleItemChange(index, "rate", parseFloat(e.target.value))
                  }
                  required
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addItem}
              className="text-indigo-600 text-sm hover:underline"
            >
              + Add another service
            </button>
          </div>

          {/* Total + Submit */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <p className="text-xl font-semibold text-gray-800">
              Total:{" "}
              <span className="text-indigo-600">${calculateTotal()}</span>
            </p>
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Quote"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
