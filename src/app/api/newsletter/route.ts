import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  // Buttondown API (free tier, up to 1000 subscribers)
  const apiKey = process.env.BUTTONDOWN_API_KEY;

  if (apiKey) {
    try {
      const res = await fetch("https://api.buttondown.com/v1/subscribers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${apiKey}`,
        },
        body: JSON.stringify({ email, type: "regular" }),
      });

      if (!res.ok && res.status !== 409) {
        // 409 = already subscribed, that's fine
        console.error("Buttondown error:", await res.text());
      }
    } catch (e) {
      console.error("Buttondown failed:", e);
    }
  }

  // Also notify via Discord
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `📬 New newsletter subscriber: ${email}`,
        }),
      });
    } catch (e) {
      console.error("Discord webhook failed:", e);
    }
  }

  return NextResponse.json({ success: true });
}
