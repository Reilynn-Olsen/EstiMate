"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    name: "",
    email: "",
    companyName: "",
    logoUrl: "",
    defaultCurrency: "usd",
  });
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchSettings = async () => {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      } else {
        console.error("Failed to fetch settings");
      }
    };

    fetchSettings();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const res = await fetch("/api/settings", {
      method: "PATCH",
      body: JSON.stringify(settings),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.error("Failed to update settings");
    }

    setIsSaving(false);
  };

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
                name="name"
                value={settings.name}
                onChange={handleInputChange}
                className="w-full border border-gray-300 text-gray-700 rounded-lg px-4 py-2 mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={settings.email}
                onChange={handleInputChange}
                className="w-full border border-gray-300 text-gray-700 rounded-lg px-4 py-2 mt-1"
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
                name="companyName"
                value={settings.companyName}
                onChange={handleInputChange}
                className="w-full border border-gray-300 text-gray-700 rounded-lg px-4 py-2 mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Logo URL
              </label>
              <input
                type="text"
                name="logoUrl"
                value={settings.logoUrl}
                onChange={handleInputChange}
                className="w-full border border-gray-300 text-gray-700 rounded-lg px-4 py-2 mt-1"
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
              <select
                name="defaultCurrency"
                value={settings.defaultCurrency}
                onChange={handleSelectChange}
                className="w-full border border-gray-300 text-gray-700 rounded-lg px-4 py-2 mt-1"
              >
                <option value="usd">USD ($)</option>
                <option value="eur">EUR (€)</option>
                <option value="gbp">GBP (£)</option>
              </select>
            </div>
          </div>
        </section>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-gray-200 text-gray-800 px-6 py-2 rounded-xl hover:bg-gray-300 transition"
          >
            &larr; Back
          </button>
          <button
            onClick={handleSubmit}
            className="bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 transition"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
