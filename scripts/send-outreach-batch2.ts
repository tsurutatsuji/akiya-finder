/**
 * 営業メール一括送信 — バッチ2（追加34社）
 *
 * Usage:
 *   GMAIL_APP_PASSWORD="xxxx" npx tsx scripts/send-outreach-batch2.ts
 *   GMAIL_APP_PASSWORD="xxxx" npx tsx scripts/send-outreach-batch2.ts --dry-run
 */

import * as nodemailer from "nodemailer";

const GMAIL_USER = "helongzhi57@gmail.com";
const SENDER_NAME = "鶴 竜治 / AkiyaFinder";

interface Target {
  company: string;
  email: string;
  region: string;
  specialty: string;
}

const TARGETS: Target[] = [
  // === 前回リストから判明（22社） ===
  { company: "Arrows International Realty", email: "info@realestate-kyoto.com", region: "京都", specialty: "外国人向け町家仲介15年" },
  { company: "Heritage Homes Japan", email: "info@heritagehomesjapan.com", region: "京都", specialty: "古民家リノベ一貫対応" },
  { company: "Hachise（八清）", email: "global@hachise.jp", region: "京都", specialty: "京都町家専門" },
  { company: "HakubaLand", email: "info@hakubaland.com", region: "白馬（長野）", specialty: "外国人向け土地投資" },
  { company: "Akiya & Inaka", email: "contact@akiyainaka.com", region: "全国", specialty: "田舎の空き家・古民家" },
  { company: "Holiday Niseko", email: "info@holidayniseko.com", region: "ニセコ（北海道）", specialty: "リゾート物件管理" },
  { company: "Nisade Real Estate", email: "info@nisaderealestate.com", region: "ニセコ（北海道）", specialty: "リゾート不動産20年" },
  { company: "Niseko Realty", email: "sales@nisekorealty.com", region: "ニセコ・白馬", specialty: "高級リゾート物件" },
  { company: "Cheap Japan Homes", email: "hello@cheapjapanhomes.com", region: "全国", specialty: "3万ドル以下の格安物件" },
  { company: "AkiyaMart", email: "info@akiya-mart.com", region: "全国", specialty: "空き家検索プラットフォーム" },
  { company: "AKIYA2.0", email: "info@akiya2.com", region: "全国", specialty: "古民家再生・民泊" },
  { company: "Nippon Tradings International", email: "info@nippontradings.com", region: "全国（福岡拠点）", specialty: "バイヤーズエージェント専業" },
  { company: "INAKA Life", email: "contact@inakalife.co.jp", region: "山梨県北杜市", specialty: "田舎暮らし移住サポート" },
  { company: "Solid Real Estate", email: "info@solidrealestatejapan.com", region: "全国（横浜拠点）", specialty: "リゾート・高級物件" },
  { company: "AkiyaHub", email: "support@akiyahub.com", region: "全国", specialty: "285名エージェントネットワーク" },
  { company: "良和ハウス", email: "kikaku@ryowahouse.co.jp", region: "広島", specialty: "中四国最大手不動産" },
  { company: "PLAZA HOMES", email: "info@plazahomes.co.jp", region: "東京", specialty: "外国人向け不動産大手" },
  { company: "Japan Property Central", email: "info@japanpropertycentral.com", region: "東京", specialty: "オフマーケット物件" },
  { company: "Housing Japan", email: "info@housingjapan.com", region: "東京", specialty: "25年以上の実績" },
  { company: "Blackship Realty", email: "info@blackshiprealty.com", region: "東京（広尾）", specialty: "外国人向け高級物件" },
  { company: "Cheap Houses Japan", email: "info@cheaphousesjapan.com", region: "全国", specialty: "格安物件ニュースレター" },
  { company: "Myoko Kogen Realty", email: "info@myokokogenrealty.com", region: "妙高（新潟）", specialty: "スキーリゾート物件" },

  // === 新規発見（12社） ===
  { company: "Old Houses Japan", email: "contact@oldhousesjapan.com", region: "全国", specialty: "空き家・古民家ポータル" },
  { company: "Uchi Japan Real Estate", email: "info@uchijapan.com", region: "全国（リゾート）", specialty: "エージェントマッチング" },
  { company: "Akiya Banks", email: "admin@akiyabanks.com", region: "全国", specialty: "空き家バンク英語ディレクトリ" },
  { company: "Akiya Air", email: "yoshi@akiyaair.com", region: "東京", specialty: "空き家リノベ・管理" },
  { company: "Kominka Collective", email: "contact@kominkacollective.com", region: "愛知", specialty: "古民家移築・保存" },
  { company: "中川住研", email: "info@nakagawa-jyuken.com", region: "京都", specialty: "古民家専門工務店" },
  { company: "E-Housing", email: "info@e-housing.jp", region: "東京", specialty: "外国人向けプロップテック" },
  { company: "Tokyo Best Realtors", email: "agent@tokyobestapartment.com", region: "東京", specialty: "2006年創業、英語対応" },
  { company: "SORA", email: "customer@sora-jp.net", region: "東京", specialty: "外国人向け投資コンサル" },
  { company: "A.I.R. Myoko", email: "hello@airmyoko.com", region: "妙高（新潟）", specialty: "妙高高原の不動産" },
  { company: "Real Estate Japan", email: "contact@realestate.co.jp", region: "全国", specialty: "外国人向け最大級ポータル" },
  { company: "Resort Property Japan", email: "support@resortpropertyjapan.zohodesk.com", region: "妙高（新潟）", specialty: "妙高唯一の認定ブローカー" },
];

function generateEmail(t: Target): { subject: string; text: string } {
  const subject = "外国人バイヤーの無料ご紹介のご提案 — AkiyaFinder（全国901件掲載）";

  const regionLine = t.region === "全国" || t.region.includes("全国")
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
  const dryRun = process.argv.includes("--dry-run");
  const appPassword = process.env.GMAIL_APP_PASSWORD;

  if (!appPassword && !dryRun) {
    console.error("ERROR: GMAIL_APP_PASSWORD を設定してください");
    process.exit(1);
  }

  console.log(`=== バッチ2: ${TARGETS.length}社に送信 ===`);
  console.log(`モード: ${dryRun ? "ドライラン" : "本番送信"}\n`);

  let transporter: nodemailer.Transporter | null = null;
  if (!dryRun && appPassword) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: GMAIL_USER, pass: appPassword },
    });
  }

  let sent = 0, failed = 0;

  for (const t of TARGETS) {
    const { subject, text } = generateEmail(t);
    console.log(`[${sent + failed + 1}/${TARGETS.length}] ${t.company} → ${t.email}`);

    if (dryRun) { sent++; continue; }

    try {
      await transporter!.sendMail({
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

  console.log(`\n=== 完了 ===`);
  console.log(`送信成功: ${sent}, 失敗: ${failed}`);
}

main().catch(console.error);
