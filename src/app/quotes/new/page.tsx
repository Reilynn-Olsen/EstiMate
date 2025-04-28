"use client";
import { useState, useEffect } from "react";
import { redirect } from "next/navigation";

export default function NewQuote() {
  const [clients, setClients] = useState<{ id: string; name: string }[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [items, setItems] = useState([
    { description: "", quantity: 1, rate: 0 },
  ]);

  useEffect(() => {
    const fetchClients = async () => {
      const res = await fetch("/api/clients");
      const data = await res.json();
      setClients(data.clients);
    };

    fetchClients();
  }, []);

  const handleItemChange = (
    index: number,
    field: string,
    value: string | number,
  ) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const addItem = () =>
    setItems([...items, { description: "", quantity: 1, rate: 0 }]);

  const calculateTotal = () =>
    items
      .reduce((total, item) => total + item.quantity * item.rate, 0)
      .toFixed(2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId) {
      alert("Please select a client.");
      return;
    }

    const quoteData = {
      clientId: selectedClientId,
      items: items,
      total: calculateTotal(),
    };

    const res = await fetch("/api/quotes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quoteData),
    });

    if (res.ok) {
      redirect("/quotes");
    } else {
      alert("Failed to save quote");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">New Quote</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700"
              value={selectedClientId ?? ""}
              onChange={(e) => setSelectedClientId(e.target.value)}
              required
            >
              <option value="">Select a client</option>
              {clients.map((client, index) => (
                <option key={index} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Services
            </h2>
            {items.map((item, index) => (
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

          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <p className="text-xl font-semibold text-gray-800">
              Total:{" "}
              <span className="text-indigo-600">${calculateTotal()}</span>
            </p>
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
            >
              Save Quote
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
