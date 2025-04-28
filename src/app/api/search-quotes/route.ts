import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";

  try {
    const quotes = await prisma.quote.findMany({
      where: {
        OR: [
          {
            id: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            client: {
              name: {
                contains: query,
                mode: "insensitive",
              },
            },
          },
        ],
      },
      include: {
        client: true,
      },
    });

    return NextResponse.json(quotes);
  } catch (error) {
    console.error("Error fetching quotes:", error);
    return NextResponse.json(
      { error: "Failed to fetch quotes" },
      { status: 500 },
    );
  }
}
