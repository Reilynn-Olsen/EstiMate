import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth/options";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userSettings = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!userSettings) {
      return new NextResponse("Settings not found", { status: 404 });
    }

    return NextResponse.json(userSettings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const { name, email, companyName, logoUrl, defaultCurrency } =
    await req.json();

  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updatedSettings = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        email,
        companyName,
        logoUrl,
        defaultCurrency,
      },
    });

    return NextResponse.json(updatedSettings);
  } catch (error) {
    console.error("Error updating settings:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
