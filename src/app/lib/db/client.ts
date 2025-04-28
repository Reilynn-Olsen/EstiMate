import { prisma } from "../prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getClientsForUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return [];
  }

  return prisma.client.findMany({
    where: {
      userId: session.user.id,
    },
  });
}
