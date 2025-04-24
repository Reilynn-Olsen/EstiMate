import Link from "next/link";

const mockQuotes = [
  {
    id: 101,
    client: "Jane Doe",
    total: 1200,
    status: "Draft",
    date: "2025-04-24",
  },
  {
    id: 102,
    client: "John Smith",
    total: 750,
    status: "Sent",
    date: "2025-04-23",
  },
  {
    id: 103,
    client: "Acme Corp",
    total: 3400,
    status: "Accepted",
    date: "2025-04-21",
  },
];

const statusColors: Record<string, string> = {
  Draft: "bg-yellow-100 text-yellow-800",
  Sent: "bg-blue-100 text-blue-800",
  Accepted: "bg-green-100 text-green-800",
};

export default function QuotesPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Quotes</h1>
          <Link href="/quotes/new">
            <button className="bg-indigo-600 text-white px-5 py-2 rounded-xl hover:bg-indigo-700">
              + New Quote
            </button>
          </Link>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search quotes by client or ID..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>

        <div className="bg-white shadow rounded-xl overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Quote #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockQuotes.map((quote) => (
                <tr key={quote.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    #{quote.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {quote.client}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {quote.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    ${quote.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${statusColors[quote.status]}`}
                    >
                      {quote.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/quotes/${quote.id}`}
                      className="text-indigo-600 hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
