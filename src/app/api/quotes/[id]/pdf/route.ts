import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

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

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return new NextResponse("No user", { status: 500 });
    }

    const pdfDoc = await PDFDocument.create();

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 12;
    const margin = 50;
    const pageWidth = 612; // 8.5 inches
    const pageHeight = 792; // 11 inches
    let page = pdfDoc.addPage([pageWidth, pageHeight]);
    let { height } = page.getSize();
    let yPosition = height - margin;

    const addNewPage = () => {
      page = pdfDoc.addPage([pageWidth, pageHeight]);
      ({ height } = page.getSize());
      yPosition = height - margin;
    };

    let logoImage;
    try {
      if (!user.logoUrl) {
        throw new Error("No user logo");
      }

      const logoResponse = await fetch(user.logoUrl);

      if (
        !logoResponse.ok ||
        !logoResponse.headers.get("content-type")?.includes("image/png")
      ) {
        throw new Error("Invalid PNG image");
      }

      const logoBytes = await logoResponse.arrayBuffer();
      logoImage = await pdfDoc.embedPng(logoBytes);

      const logoDims = logoImage.scale(0.2);

      page.drawImage(logoImage, {
        x: pageWidth - margin - logoDims.width,
        y: pageHeight - margin - logoDims.height,
        width: logoDims.width,
        height: logoDims.height,
      });
    } catch (logoError) {
      console.error("Error fetching or embedding logo:", logoError);
    }

    page.drawText(`Name: ${session.user.name}`, {
      x: margin,
      y: yPosition,
      font,
      size: fontSize,
    });
    yPosition -= 20;
    page.drawText(`Company: ${user.companyName}`, {
      x: margin,
      y: yPosition,
      font,
      size: fontSize,
    });
    yPosition -= 20;
    page.drawText(`Email: ${session.user.email}`, {
      x: margin,
      y: yPosition,
      font,
      size: fontSize,
    });
    yPosition -= 40;

    page.drawText(`Client: ${quote.client?.name}`, {
      x: margin,
      y: yPosition,
      font,
      size: fontSize,
    });
    yPosition -= 20;
    page.drawText(`Email: ${quote.client?.email}`, {
      x: margin,
      y: yPosition,
      font,
      size: fontSize,
    });
    yPosition -= 20;
    page.drawText(`Company: ${quote.client?.company}`, {
      x: margin,
      y: yPosition,
      font,
      size: fontSize,
    });
    yPosition -= 40;

    page.drawText("Items:", { x: margin, y: yPosition, font, size: 14 });
    yPosition -= 20;
    page.drawText("Description", { x: margin, y: yPosition, font, size: 12 });
    page.drawText("Quantity", {
      x: margin + 200,
      y: yPosition,
      font,
      size: 12,
    });
    page.drawText("Rate", { x: margin + 300, y: yPosition, font, size: 12 });
    page.drawText("Total", { x: margin + 400, y: yPosition, font, size: 12 });
    yPosition -= 20;

    quote.items.forEach((item) => {
      if (yPosition < 50) {
        addNewPage();
      }

      page.drawText(item.description, {
        x: margin,
        y: yPosition,
        font,
        size: 12,
      });
      page.drawText(item.quantity.toString(), {
        x: margin + 200,
        y: yPosition,
        font,
        size: 12,
      });
      page.drawText(`$${item.rate}`, {
        x: margin + 300,
        y: yPosition,
        font,
        size: 12,
      });
      page.drawText(`$${(item.quantity * item.rate).toFixed(2)}`, {
        x: margin + 400,
        y: yPosition,
        font,
        size: 12,
      });

      page.drawLine({
        start: { x: margin, y: yPosition - 5 },
        end: { x: pageWidth - margin, y: yPosition - 5 },
        color: rgb(0, 0, 0),
        thickness: 1,
      });

      yPosition -= 40;
    });

    yPosition -= 20;
    page.drawText(`Total: $${quote.total.toFixed(2)}`, {
      x: margin,
      y: yPosition,
      font,
      size: 14,
    });

    const pdfBytes = await pdfDoc.save();

    return new NextResponse(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=quote_${id}.pdf`,
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
