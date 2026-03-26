import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, country, budget, message, property } = body;

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email, and message are required" },
      { status: 400 }
    );
  }

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (webhookUrl) {
    const embed = {
      title: "🏠 New Inquiry from AkiyaFinder",
      color: 0x22c55e,
      fields: [
        { name: "Name", value: name, inline: true },
        { name: "Email", value: email, inline: true },
        { name: "Country", value: country || "Not specified", inline: true },
        { name: "Budget", value: budget || "Not specified", inline: true },
        ...(property
          ? [{ name: "Property", value: property, inline: false }]
          : []),
        { name: "Message", value: message, inline: false },
      ],
      timestamp: new Date().toISOString(),
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

  return NextResponse.json({ success: true });
}
