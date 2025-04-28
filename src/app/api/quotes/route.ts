import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth/options";
import type { QuoteItem } from "@prisma/client";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const quotes = await prisma.quote.findMany({
      where: { userId: session.user.id },
      include: {
        client: true,
        items: true,
      },
    });

    return NextResponse.json(quotes);
  } catch (error) {
    console.error("Error fetching quotes:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { clientId, items, total } = body;

    const quote = await prisma.quote.create({
      data: {
        userId: session.user.id,
        clientId,
        total: parseFloat(total),
        status: "Draft",
        items: {
          create: items.map((item: QuoteItem) => ({
            description: item.description,
            quantity: item.quantity,
            rate: item.rate,
          })),
        },
      },
    });

    return NextResponse.json(quote, { status: 201 });
  } catch (error) {
    console.error("Error creating quote:", error);
    return NextResponse.json(
      { error: "Failed to create quote" },
      { status: 500 },
    );
  }
}
