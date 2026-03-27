/**
 * 提携候補業者への営業メール一括送信スクリプト
 *
 * Usage:
 *   GMAIL_APP_PASSWORD=xxxx npx tsx scripts/send-outreach.ts
 *   GMAIL_APP_PASSWORD=xxxx npx tsx scripts/send-outreach.ts --dry-run  (送信せずプレビュー)
 */

import * as nodemailer from "nodemailer";

const GMAIL_USER = "helongzhi57@gmail.com";
const SENDER_NAME = "鶴 竜治 / AkiyaFinder";

// --- 送信先リスト ---
interface OutreachTarget {
  company: string;
  email: string | null; // nullの場合はContact Formのみ（スキップ）
  contactFormUrl?: string;
  region: string;
  specialty: string;
  rank: "A" | "B" | "C";
}

const TARGETS: OutreachTarget[] = [
  // === Aランク（最優先） ===
  { company: "ResCom Hokkaido", email: "info@rescomhokkaido.com", region: "北海道", specialty: "非居住外国人サポート", rank: "A" },
  { company: "Akiya Heaven", email: "contact@akiyaheaven.jp", region: "全国", specialty: "空き家コンサル", rank: "A" },
  { company: "KORYOYA LLC", email: "info@koryoya.com", region: "関西・北陸", specialty: "古民家・町家", rank: "A" },
  { company: "Sumica Corporation", email: null, contactFormUrl: "https://akiya-sumica.com/contact-us/", region: "全国39都道府県", specialty: "空き家リノベ+賃貸運用", rank: "A" },
  { company: "Yuki Homes", email: "hello@yukihomes.com", region: "北海道", specialty: "海外バイヤー特化", rank: "A" },
  { company: "Nippon Tradings International", email: null, contactFormUrl: "https://nippontradings.com/contact-us/", region: "全国", specialty: "バイヤーズエージェント", rank: "A" },

  // === Bランク ===
  { company: "Nippon Homes", email: "inquiries@nipponhomes.com", region: "全国", specialty: "格安物件リスティング", rank: "B" },
  { company: "Core 8 Properties", email: "info@core8eight.com", region: "関西（神戸・淡路島）", specialty: "古民家", rank: "B" },
  { company: "Japanoramic", email: "contact@japanrepair.com", region: "全国", specialty: "空き家売買+リノベ", rank: "B" },
  { company: "INAKA Life", email: null, contactFormUrl: "https://inakalife.co.jp/en/contact", region: "山梨県北杜市", specialty: "田舎暮らし移住", rank: "B" },
  { company: "Solid Real Estate", email: null, contactFormUrl: "https://www.solidrealestatejapan.com/contact/", region: "北海道・長野・沖縄", specialty: "リゾート物件", rank: "B" },
  { company: "Real Estate Myoko", email: null, region: "新潟県妙高市", specialty: "スキーエリア", rank: "B" },
  { company: "Japan Hana Real Estate", email: null, region: "ニセコ・白馬・富良野", specialty: "スキーリゾート", rank: "B" },

  // === Cランク（競合の可能性あり） ===
  { company: "AkiyaHub", email: null, contactFormUrl: "https://akiyahub.com/jointhecommunity", region: "全国", specialty: "285名エージェントネットワーク", rank: "C" },
  { company: "AkiyaMart", email: null, region: "全国", specialty: "空き家検索プラットフォーム", rank: "C" },
  { company: "AKIYA2.0", email: null, region: "全国", specialty: "古民家再生", rank: "C" },

  // === 既知14社のうちメールがあるもの ===
  // Arrows, Heritage, Hachise, Japan Kominka → Contact Formのみ
  // HakubaLand, Akiya & Inaka, Holiday Niseko → Contact Formのみ
];

// --- メール本文生成 ---
function generateEmail(target: OutreachTarget): { subject: string; text: string } {
  const subject = `外国人バイヤーの無料ご紹介のご提案 — AkiyaFinder（全国901件掲載）`;

  const regionLine = target.region === "全国"
    ? "当サイトでは全国の空き家物件への問い合わせが増えております。"
    : `当サイトでは${target.region}エリアの物件への問い合わせが増えております。`;

  const specialtyLine = target.specialty
    ? `御社の${target.specialty}の実績は、まさに当サイトの外国人ユーザーが求めているサービスです。`
    : "";

  const text = `${target.company} 御中

はじめまして。鶴 竜治と申します。
外国人向け空き家検索サイト「AkiyaFinder」（https://akiya-finder.vercel.app）を運営しております。

当サイトでは全国47都道府県の空き家物件を901件掲載しており、英語・中国語で投資目的の外国人バイヤーが物件を検索できる仕組みを提供しています。

${regionLine}
${specialtyLine}

しかし、英語で検索する外国人バイヤーの多くが、日本の優良な不動産業者にたどり着けていないのが現状です。

■ ご提案内容
・御社のエリアに興味のある外国人バイヤーを直接ご紹介します
・最初の5件は完全無料
・各紹介にトラッキングコード付きで透明に管理
・契約不要、義務なし
・成約した場合のみ紹介料を相談。しなければ御社の負担ゼロ

ご興味がございましたら、お気軽にご返信ください。

鶴 竜治
AkiyaFinder — https://akiya-finder.vercel.app
メール: helongzhi57@gmail.com`;

  return { subject, text };
}

// --- メイン ---
async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const appPassword = process.env.GMAIL_APP_PASSWORD;

  if (!appPassword && !dryRun) {
    console.error("ERROR: GMAIL_APP_PASSWORD 環境変数を設定してください");
    console.error("Usage: GMAIL_APP_PASSWORD=xxxx npx tsx scripts/send-outreach.ts");
    console.error("       npx tsx scripts/send-outreach.ts --dry-run (プレビューのみ)");
    process.exit(1);
  }

  const emailTargets = TARGETS.filter((t) => t.email);
  const formTargets = TARGETS.filter((t) => !t.email && t.contactFormUrl);
  const noContactTargets = TARGETS.filter((t) => !t.email && !t.contactFormUrl);

  console.log("=== AkiyaFinder 営業メール一括送信 ===");
  console.log(`メール送信: ${emailTargets.length}社`);
  console.log(`Contact Form（手動）: ${formTargets.length}社`);
  console.log(`連絡先不明: ${noContactTargets.length}社`);
  console.log(`モード: ${dryRun ? "ドライラン（送信しない）" : "本番送信"}`);
  console.log("");

  // メール送信
  let transporter: nodemailer.Transporter | null = null;
  if (!dryRun && appPassword) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: GMAIL_USER,
        pass: appPassword,
      },
    });
  }

  let sent = 0;
  let failed = 0;

  for (const target of emailTargets) {
    const { subject, text } = generateEmail(target);

    console.log(`--- [${target.rank}] ${target.company} ---`);
    console.log(`To: ${target.email}`);
    console.log(`Subject: ${subject}`);

    if (dryRun) {
      console.log(`本文プレビュー:\n${text.substring(0, 200)}...\n`);
      continue;
    }

    try {
      await transporter!.sendMail({
        from: `"${SENDER_NAME}" <${GMAIL_USER}>`,
        to: target.email!,
        subject,
        text,
      });
      console.log("✅ 送信成功\n");
      sent++;
      // レート制限回避: 5秒待機
      await new Promise((r) => setTimeout(r, 5000));
    } catch (e) {
      console.log(`❌ 送信失敗: ${e}\n`);
      failed++;
    }
  }

  // Contact Form一覧
  if (formTargets.length > 0) {
    console.log("\n=== Contact Form（手動で送信してください） ===");
    for (const t of formTargets) {
      console.log(`[${t.rank}] ${t.company} → ${t.contactFormUrl}`);
    }
  }

  // 連絡先不明
  if (noContactTargets.length > 0) {
    console.log("\n=== 連絡先不明（Webサイトで確認） ===");
    for (const t of noContactTargets) {
      console.log(`[${t.rank}] ${t.company} — ${t.region}`);
    }
  }

  console.log(`\n=== 完了 ===`);
  console.log(`送信成功: ${sent}, 失敗: ${failed}`);
  console.log(`Contact Form: ${formTargets.length}社（手動対応）`);
}

main().catch(console.error);
