import { prisma } from "@/app/lib/prisma";
import type { QuoteItem } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const quote = await prisma.quote.findUnique({
      where: { id },
      include: {
        client: true,
        items: true,
      },
    });

    if (!quote) {
      return new NextResponse("Quote not found", { status: 404 });
    }

    return NextResponse.json(quote);
  } catch (error) {
    console.error("Error fetching quote:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  const { clientId, items, status } = await req.json();

  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existingItems = await prisma.quoteItem.findMany({
      where: { quoteId: id },
      select: { id: true },
    });

    const existingItemIds = existingItems.map((item) => item.id);
    const incomingItemIds = items
      .filter((item: QuoteItem) => item.id)
      .map((item: QuoteItem) => item.id);

    const itemsToDelete = existingItemIds.filter(
      (existingId) => !incomingItemIds.includes(existingId),
    );

    await prisma.quoteItem.deleteMany({
      where: { id: { in: itemsToDelete } },
    });

    for (const item of items) {
      if (item.id) {
        await prisma.quoteItem.update({
          where: { id: item.id },
          data: {
            description: item.description,
            quantity: item.quantity,
            rate: item.rate,
          },
        });
      }
    }

    const newItems = items.filter((item: QuoteItem) => !item.id);
    if (newItems.length > 0) {
      await prisma.quoteItem.createMany({
        data: newItems.map((item: QuoteItem) => ({
          description: item.description,
          quantity: item.quantity,
          rate: item.rate,
          quoteId: id,
        })),
      });
    }

    const allItems = await prisma.quoteItem.findMany({
      where: { quoteId: id },
    });

    const total = allItems.reduce(
      (sum, item) => sum + item.quantity * item.rate,
      0,
    );

    const updatedQuote = await prisma.quote.update({
      where: { id },
      data: {
        clientId,
        total,
        status,
      },
      include: { items: true, client: true },
    });

    revalidatePath("/quote");
    return NextResponse.json(updatedQuote);
  } catch (error) {
    console.error("[PATCH QUOTE ERROR]", error);
    return new NextResponse("Failed to update quote", { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.quoteItem.deleteMany({
      where: { quoteId: id },
    });

    await prisma.quote.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[DELETE QUOTE ERROR]", error);
    return new NextResponse("Failed to delete quote", { status: 500 });
  }
}
