import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const data = await req.json();

    const updatedClient = await prisma.client.update({
      where: { id: params.id },
      data: {
        name: data.name,
        email: data.email,
        company: data.company,
        phone: data.phone,
        notes: data.notes,
      },
    });

    return NextResponse.json(updatedClient);
  } catch (error) {
    console.error("[PATCH CLIENT ERROR]", error);
    return new NextResponse("Failed to update client", { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await prisma.client.delete({
      where: { id: params.id },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[DELETE CLIENT ERROR]", error);
    return new NextResponse("Failed to delete client", { status: 500 });
  }
}

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  try {
    const client = await prisma.client.findUnique({
      where: { id },
    });

    if (!client) {
      return NextResponse.json(
        { message: "Client not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(client);
  } catch (error) {
    console.error("Error fetching client:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
