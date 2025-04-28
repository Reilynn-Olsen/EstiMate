import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

interface ClientPageProps {
  params: { id: string };
}

export default async function ClientPage({ params }: ClientPageProps) {
  // this gives a warning that await has no effect, it does. It suppresses
  // errors from nextjs.
  const { id } = await params;
  const client = await prisma.client.findUnique({
    where: { id },
  });

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Client not found</h1>
      </div>
    );
  }

  const handleDelete = async () => {
    "use server";
    await prisma.client.delete({
      where: { id },
    });
    revalidatePath("/clients");
    redirect("/clients");
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow space-y-8">
        <div>
          <Link
            href="/clients"
            className="text-indigo-600 hover:underline text-sm"
          >
            ← Back to Clients
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-800">{client.name}</h1>

        <div className="space-y-4">
          <div>
            <span className="font-semibold text-gray-700">Email: </span>
            <span className="text-gray-900">{client.email}</span>
          </div>

          {client.company && (
            <div>
              <span className="font-semibold text-gray-700">Company: </span>
              <span className="text-gray-900">{client.company}</span>
            </div>
          )}

          {client.phone && (
            <div>
              <span className="font-semibold text-gray-700">Phone: </span>
              <span className="text-gray-900">{client.phone}</span>
            </div>
          )}

          {client.notes && (
            <div>
              <span className="font-semibold text-gray-700">Notes: </span>
              <p className="text-gray-900 mt-1">{client.notes}</p>
            </div>
          )}
        </div>

        <div className="flex space-x-4 pt-6">
          <Link href={`/clients/${client.id}/edit`}>
            <button className="bg-yellow-500 text-white px-4 py-2 rounded-xl hover:bg-yellow-600">
              Edit Client
            </button>
          </Link>

          <form action={handleDelete}>
            <button
              type="submit"
              className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700"
            >
              Delete Client
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
