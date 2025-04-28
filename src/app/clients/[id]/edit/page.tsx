"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

type formDataType = {
  name: string;
  email: string;
  company: string;
  phone: string;
  notes: string;
};

type formDataKey = keyof formDataType;

export default function EditClientPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [formData, setFormData] = useState<formDataType>({
    name: "",
    email: "",
    company: "",
    phone: "",
    notes: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClient() {
      try {
        const res = await fetch(`/api/clients/${id}`);
        const client = await res.json();
        setFormData({
          name: client.name || "",
          email: client.email || "",
          company: client.company || "",
          phone: client.phone || "",
          notes: client.notes || "",
        });
      } catch (error) {
        console.error("Failed to load client", error);
      } finally {
        setLoading(false);
      }
    }

    fetchClient();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`/api/clients/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      router.push(`/clients/${id}`);
    } catch (error) {
      console.error("Failed to update client", error);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  const formMapKeys: formDataKey[] = ["name", "email", "company", "phone"];

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Client</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {formMapKeys.map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                {field}
              </label>
              <input
                type="text"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="w-full border border-gray-300 text-gray-700 rounded-lg px-4 py-2"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 text-gray-700 rounded-lg px-4 py-2"
            />
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              className="bg-gray-300 text-gray-800 px-6 py-2 rounded-xl hover:bg-gray-400 transition"
              onClick={() => router.back()}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
