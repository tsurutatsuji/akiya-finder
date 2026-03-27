import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import {
  findMatchingAgents,
  generateReferralEmail,
} from "@/lib/partner-agents";

function generateRefCode(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `AKF-${date}-${rand}`;
}

async function sendEmail(to: string, subject: string, html: string) {
  // Buttondown APIをメール送信に転用、または将来Resend/SendGrid等に差し替え
  // 今は環境変数 SMTP_* があればnodemailer的に送る
  // なければDiscord通知でフォールバック
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "AkiyaFinder <referrals@akiyafinder.com>",
          to,
          subject,
          html,
        }),
      });
      return true;
    } catch (e) {
      console.error("Resend email failed:", e);
      return false;
    }
  }
  return false;
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

  // マッチする提携業者を探す
  const matchedAgents = findMatchingAgents(undefined, message);

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
    matchedAgents: matchedAgents.map((a) => a.id),
    agentNotified: false,
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

  // 提携業者に紹介メールを送信
  for (const agent of matchedAgents) {
    const { subject, html } = generateReferralEmail({
      agentName: agent.name,
      buyerName: name,
      buyerEmail: email,
      buyerCountry: country || "",
      budget: budget || "",
      message,
      property: property || "",
      refCode,
    });

    const sent = await sendEmail(agent.email, subject, html);
    if (sent) {
      inquiry.agentNotified = true;
    }
  }

  // Discord notification（自分用）
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (webhookUrl) {
    const agentInfo =
      matchedAgents.length > 0
        ? `✅ Auto-referred to: ${matchedAgents.map((a) => a.name).join(", ")}`
        : "⚠️ No matching agent — manual referral needed";

    const embed = {
      title: `🏠 New Inquiry — ${refCode}`,
      color: matchedAgents.length > 0 ? 0x22c55e : 0xf59e0b,
      fields: [
        { name: "Ref Code", value: `\`${refCode}\``, inline: true },
        { name: "Name", value: name, inline: true },
        { name: "Email", value: email, inline: true },
        { name: "Country", value: country || "Not specified", inline: true },
        { name: "Budget", value: budget || "Not specified", inline: true },
        { name: "Agent Status", value: agentInfo, inline: false },
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

  return NextResponse.json({
    success: true,
    refCode,
    agentMatched: matchedAgents.length > 0,
  });
}
