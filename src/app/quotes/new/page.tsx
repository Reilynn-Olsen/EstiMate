"use client";
import { useState } from "react";

export default function NewQuote() {
  const [clientName, setClientName] = useState("");
  const [items, setItems] = useState([
    { description: "", quantity: 1, rate: 0 },
  ]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving quote:", { clientName, items });
    // Post to API route later
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">New Quote</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Client Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client Name
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              required
            />
          </div>

          {/* Line Items */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Services
            </h2>
            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 mb-4">
                <input
                  className="col-span-6 border border-gray-300 rounded-lg px-4 py-2"
                  placeholder="Service description"
                  value={item.description}
                  onChange={(e) =>
                    handleItemChange(index, "description", e.target.value)
                  }
                  required
                />
                <input
                  className="col-span-2 border border-gray-300 rounded-lg px-4 py-2"
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
                  className="col-span-2 border border-gray-300 rounded-lg px-4 py-2"
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
            >
              Save Quote
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
