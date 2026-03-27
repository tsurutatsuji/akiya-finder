/**
 * 営業メール一括送信 — バッチ3（追加分）
 * Usage: GMAIL_APP_PASSWORD="xxxx" npx tsx scripts/send-outreach-batch3.ts
 */

import * as nodemailer from "nodemailer";

const GMAIL_USER = "helongzhi57@gmail.com";
const SENDER_NAME = "鶴 竜治 / AkiyaFinder";

interface Target { company: string; email: string; region: string; specialty: string; }

const TARGETS: Target[] = [
  // PLAZA HOMESリストからメールが判明した会社
  { company: "Noka Real Estate", email: "global@noka.co.jp", region: "金沢（石川）", specialty: "外国人向け賃貸・売買" },
  { company: "Dana Estate", email: "dana.e@nike.eonet.ne.jp", region: "堺（大阪）", specialty: "不動産仲介" },
  { company: "Univ Life Takatsuki", email: "takatsuki@univlife.co.jp", region: "高槻（大阪）", specialty: "外国人対応" },
  { company: "Seaside Real Estate", email: "onitsuka@seaside.ne.jp", region: "福岡", specialty: "英語対応不動産" },
  { company: "Tedako", email: "info@tedako.org", region: "沖縄", specialty: "外国人対応" },
  { company: "MARE (南青山不動産)", email: "mare-overseassales@ma-r.co.jp", region: "東京・全国", specialty: "海外向け売買" },
  { company: "MIタウン企画部", email: "info-mi@iwaki-mitown.jp", region: "高知", specialty: "古民家再生・販売" },

  // 追加で見つけた会社
  { company: "Mitsui Fudosan Realty (Global)", email: "global@mf-realty.jp", region: "東京", specialty: "大手・外国人向け" },
  { company: "Grand Design", email: "info@grand-d.co.jp", region: "札幌（北海道）", specialty: "英語対応" },
  { company: "EPM Fudosan", email: "info@epm-estate.com", region: "千葉", specialty: "英語対応" },
  { company: "Rise Property", email: "info@riseproperty.jp", region: "名古屋（愛知）", specialty: "投資物件・英語対応" },
  { company: "Aonissin", email: "info@aonissin.com", region: "新宿（東京）", specialty: "外国人向け" },
  { company: "Nihon Jutaku", email: "info@nihon-jutaku.co.jp", region: "大阪", specialty: "外国人対応" },
  { company: "Oki Corp", email: "info@oki-corp.net", region: "沖縄", specialty: "英語対応" },

  // 古民家・田舎系
  { company: "全国古家再生推進協議会", email: "info@zenko-kyo.or.jp", region: "全国", specialty: "古家再生ネットワーク" },
  { company: "民家再生協会かごしま", email: "info@minkago.com", region: "鹿児島", specialty: "古民家リフォーム・空き家対策" },
];

function generateEmail(t: Target): { subject: string; text: string } {
  const subject = "外国人バイヤーの無料ご紹介のご提案 — AkiyaFinder（全国901件掲載）";
  const regionLine = t.region.includes("全国")
    ? "当サイトでは全国の空き家物件への問い合わせが増えております。"
    : `当サイトでは${t.region}エリアの物件への問い合わせが増えております。`;

  const text = `${t.company} 御中

はじめまして。鶴 竜治と申します。
外国人向け空き家検索サイト「AkiyaFinder」（https://akiya-finder.vercel.app）を運営しております。

当サイトでは全国47都道府県の空き家物件を901件掲載しており、英語・中国語で投資目的の外国人バイヤーが物件を検索できる仕組みを提供しています。

${regionLine}
御社の${t.specialty}の実績は、まさに当サイトの外国人ユーザーが求めているサービスです。

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

async function main() {
  const appPassword = process.env.GMAIL_APP_PASSWORD;
  if (!appPassword) { console.error("GMAIL_APP_PASSWORD required"); process.exit(1); }

  console.log(`=== バッチ3: ${TARGETS.length}社に送信 ===\n`);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: GMAIL_USER, pass: appPassword },
  });

  let sent = 0, failed = 0;
  for (const t of TARGETS) {
    const { subject, text } = generateEmail(t);
    console.log(`[${sent + failed + 1}/${TARGETS.length}] ${t.company} → ${t.email}`);
    try {
      await transporter.sendMail({
        from: `"${SENDER_NAME}" <${GMAIL_USER}>`,
        to: t.email,
        subject,
        text,
      });
      console.log("  ✅ 送信成功");
      sent++;
      await new Promise((r) => setTimeout(r, 5000));
    } catch (e: any) {
      console.log(`  ❌ 失敗: ${e.message?.substring(0, 80)}`);
      failed++;
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
  console.log(`\n=== 完了 === 成功: ${sent}, 失敗: ${failed}`);
}
main().catch(console.error);
