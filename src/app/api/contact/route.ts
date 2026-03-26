import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

function generateRefCode(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `AKF-${date}-${rand}`;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, country, budget, message, property } = body;

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email, and message are required" },
      { status: 400 }
    );
  }

  const refCode = generateRefCode();
  const timestamp = new Date().toISOString();

  // Save inquiry data
  const inquiry = {
    refCode,
    name,
    email,
    country: country || "",
    budget: budget || "",
    message,
    property: property || "",
    timestamp,
    status: "new",
    followUp1Sent: false,
    followUp2Sent: false,
    buyerFeedback: null,
  };

  // Save to JSON file (data/inquiries.json)
  try {
    const dataDir = path.join(process.cwd(), "data");
    const filePath = path.join(dataDir, "inquiries.json");
    await fs.mkdir(dataDir, { recursive: true });

    let inquiries: typeof inquiry[] = [];
    try {
      const existing = await fs.readFile(filePath, "utf-8");
      inquiries = JSON.parse(existing);
    } catch {
      // File doesn't exist yet
    }
    inquiries.push(inquiry);
    await fs.writeFile(filePath, JSON.stringify(inquiries, null, 2));
  } catch (e) {
    console.error("Failed to save inquiry:", e);
  }

  // Discord notification
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (webhookUrl) {
    const embed = {
      title: `🏠 New Inquiry — ${refCode}`,
      color: 0x22c55e,
      fields: [
        { name: "Ref Code", value: `\`${refCode}\``, inline: true },
        { name: "Name", value: name, inline: true },
        { name: "Email", value: email, inline: true },
        { name: "Country", value: country || "Not specified", inline: true },
        { name: "Budget", value: budget || "Not specified", inline: true },
        ...(property
          ? [{ name: "Property", value: property, inline: false }]
          : []),
        { name: "Message", value: message, inline: false },
      ],
      timestamp,
    };

    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ embeds: [embed] }),
      });
    } catch (e) {
      console.error("Discord webhook failed:", e);
    }
  }

  return NextResponse.json({ success: true, refCode });
}
