import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getQuotes() {
  try {
    const quotes = await prisma.quote.findMany({
      include: {
        client: true,
      },
    });

    return quotes.map((quote) => ({
      id: quote.id,
      clientName: quote.client?.name || "Unknown Client",
      date: quote.createdAt,
      total: quote.total,
      status: quote.status,
    }));
  } catch (error) {
    console.error("Error fetching quotes:", error);
    return [];
  } finally {
    await prisma.$disconnect();
  }
}
