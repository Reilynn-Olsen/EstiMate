"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.ok) {
      router.push("/dashboard");
    } else {
      setError("Invalid email or password");
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 text-center">
            Welcome back to <span className="text-indigo-600">EstiMate</span>
          </h1>
          <p className="mt-2 text-sm text-gray-500 text-center">
            Sign in to continue managing your quotes
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border text-gray-700 border-gray-300 rounded-lg mt-1"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-1 text-gray-700"
              />
            </div>
          </div>

          <p className="text-sm text-red-600 mt-2">{error}</p>

          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center text-gray-700">
              <input type="checkbox" className="mr-2" />
              Remember me
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Don’t have an account?
          <a href="/register" className="text-indigo-600 hover:underline">
            Create one
          </a>
        </p>
      </div>
    </div>
  );
}
