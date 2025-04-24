export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow space-y-10">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Account Info
          </h2>
          <div className="grid gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Alex Johnson"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                placeholder="alex@example.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1"
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Company Info
          </h2>
          <div className="grid gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Company Name
              </label>
              <input
                type="text"
                placeholder="YourCo, LLC"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Logo URL
              </label>
              <input
                type="text"
                placeholder="https://yourco.com/logo.png"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1"
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Preferences
          </h2>
          <div className="grid gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Default Currency
              </label>
              <select className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1">
                <option value="usd">USD ($)</option>
                <option value="eur">EUR (€)</option>
                <option value="gbp">GBP (£)</option>
              </select>
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 transition">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
