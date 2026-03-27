import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data", "inquiries.json");

interface Inquiry {
  refCode: string;
  name: string;
  email: string;
  status: string;
  buyerFeedback: string | null;
  [key: string]: unknown;
}

async function loadInquiries(): Promise<Inquiry[]> {
  try {
    const data = await fs.readFile(DATA_PATH, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveInquiries(inquiries: Inquiry[]) {
  await fs.writeFile(DATA_PATH, JSON.stringify(inquiries, null, 2));
}

// POST — バイヤーからのステータス回答
export async function POST(req: NextRequest) {
  const { refCode, status, comment } = await req.json();

  if (!refCode || !status) {
    return NextResponse.json(
      { error: "refCode and status are required" },
      { status: 400 }
    );
  }

  const inquiries = await loadInquiries();
  const inquiry = inquiries.find((i) => i.refCode === refCode);

  if (!inquiry) {
    // refCodeが見つからなくても受け付ける（手動追加のケースもある）
    inquiries.push({
      refCode,
      name: "Unknown",
      email: "Unknown",
      status,
      buyerFeedback: comment || null,
      updatedAt: new Date().toISOString(),
    } as Inquiry);
  } else {
    inquiry.status = status;
    inquiry.buyerFeedback = comment || null;
    (inquiry as Record<string, unknown>).updatedAt = new Date().toISOString();
  }

  await saveInquiries(inquiries);

  // Discord通知
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (webhookUrl) {
    const statusEmoji: Record<string, string> = {
      "still-looking": "🔍",
      "in-progress": "📝",
      purchased: "🎉",
      "gave-up": "👋",
    };

    const embed = {
      title: `${statusEmoji[status] || "📋"} Buyer Feedback — ${refCode}`,
      color: status === "purchased" ? 0x22c55e : 0xf59e0b,
      fields: [
        { name: "Ref Code", value: `\`${refCode}\``, inline: true },
        { name: "Status", value: status, inline: true },
        ...(inquiry?.name ? [{ name: "Buyer", value: inquiry.name, inline: true }] : []),
        ...(comment ? [{ name: "Comment", value: comment, inline: false }] : []),
      ],
      timestamp: new Date().toISOString(),
    };

    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ embeds: [embed] }),
      });
    } catch {
      // silent
    }
  }

  return NextResponse.json({ success: true });
}

// GET — 全inquiriesのステータスサマリー（管理用）
export async function GET() {
  const inquiries = await loadInquiries();

  const summary = {
    total: inquiries.length,
    new: inquiries.filter((i) => i.status === "new").length,
    stillLooking: inquiries.filter((i) => i.status === "still-looking").length,
    inProgress: inquiries.filter((i) => i.status === "in-progress").length,
    purchased: inquiries.filter((i) => i.status === "purchased").length,
    gaveUp: inquiries.filter((i) => i.status === "gave-up").length,
  };

  return NextResponse.json({ summary, inquiries });
}
