import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const VISITORS_PATH = path.join(process.cwd(), "data", "visitors.json");
const TIMEOUT_MS = 60_000; // 60秒以内のハートビートをアクティブとみなす

interface VisitorEntry {
  id: string;
  lastSeen: number;
  page?: string;
}

async function loadVisitors(): Promise<VisitorEntry[]> {
  try {
    const data = await fs.readFile(VISITORS_PATH, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveVisitors(visitors: VisitorEntry[]) {
  const dir = path.dirname(VISITORS_PATH);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(VISITORS_PATH, JSON.stringify(visitors));
}

function cleanExpired(visitors: VisitorEntry[]): VisitorEntry[] {
  const cutoff = Date.now() - TIMEOUT_MS;
  return visitors.filter((v) => v.lastSeen > cutoff);
}

// POST — ハートビート（クライアントが30秒ごとに送信）
export async function POST(req: NextRequest) {
  const { visitorId, page } = await req.json().catch(() => ({} as Record<string, string>));

  if (!visitorId) {
    return NextResponse.json({ error: "visitorId required" }, { status: 400 });
  }

  let visitors = await loadVisitors();
  visitors = cleanExpired(visitors);

  const existing = visitors.find((v) => v.id === visitorId);
  if (existing) {
    existing.lastSeen = Date.now();
    existing.page = page;
  } else {
    visitors.push({ id: visitorId, lastSeen: Date.now(), page });
  }

  await saveVisitors(visitors);

  return NextResponse.json({ count: visitors.length });
}

// GET — 現在のアクティブ閲覧者数を取得
export async function GET() {
  let visitors = await loadVisitors();
  visitors = cleanExpired(visitors);
  // 期限切れを掃除して保存
  await saveVisitors(visitors);

  return NextResponse.json({ count: visitors.length });
}
