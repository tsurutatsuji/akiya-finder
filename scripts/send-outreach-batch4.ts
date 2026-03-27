/**
 * 営業メール一括送信 — バッチ4（追加20社）
 * Usage: GMAIL_APP_PASSWORD="xxxx" npx tsx scripts/send-outreach-batch4.ts
 */

import * as nodemailer from "nodemailer";

const GMAIL_USER = "helongzhi57@gmail.com";
const SENDER_NAME = "鶴 竜治 / AkiyaFinder";

interface Target { company: string; email: string; region: string; specialty: string; }

const TARGETS: Target[] = [
  { company: "Interlink K.K.", email: "info@interlinknagoya.com", region: "名古屋（愛知）", specialty: "バイリンガルコンサル・外国人向け売買" },
  { company: "wagaya Japan", email: "info@wagaya-japan.com", region: "東京", specialty: "外国人向け不動産ポータル最大手" },
  { company: "J&F PLAZA", email: "info@jafplaza.com", region: "東京（渋谷）", specialty: "外国人向け不動産25年の実績" },
  { company: "Maido Real Estate", email: "alan@real-estate-osaka.com", region: "大阪", specialty: "英仏日対応・Airbnb支援" },
  { company: "Maeda Real Estate", email: "contact@maedarealestate.com", region: "神戸・大阪・京都", specialty: "50年以上の外国人サポート実績" },
  { company: "Tokyo Apartment Inc.", email: "info@t-c-t.co.jp", region: "東京（銀座）", specialty: "外国人向け売買・リノベ・管理" },
  { company: "なごみ不動産", email: "info@nagomi-fudousan.jp", region: "奈良・和歌山・京都南部", specialty: "古民家購入・買取・リノベ専門" },
  { company: "Modern Living Tokyo", email: "info@modernliving.tokyo", region: "東京（文京区）", specialty: "外国人向け不動産" },
  { company: "Rent Life", email: "e-yokohama@r-life.co.jp", region: "横浜（神奈川）", specialty: "外国人居住者向け" },
  { company: "H2 Christie's International RE", email: "sales@h2realestate.jp", region: "ニセコ・富良野・東京", specialty: "高級リゾート物件" },
  { company: "Nikota Realty", email: "enquiry@nikotarealty.com", region: "東京・ニセコ・白馬", specialty: "投資コンサル" },
  { company: "STARTS Corporation", email: "kaigai@starts.co.jp", region: "東京・全国", specialty: "大手・海外投資家向け" },
  { company: "オザワホーム", email: "info.ozawahome@gmail.com", region: "山梨県北杜市", specialty: "英語対応・空き家バンク物件取扱" },
  { company: "NPO法人 空き家活用プロジェクト", email: "info@akiya.or.jp", region: "東京（関東中心）", specialty: "空き家マッチング・セミナー" },
  { company: "NPO法人 空家・空地管理センター", email: "contact@akiya-akichi.or.jp", region: "全国", specialty: "空き家ワンストップ相談窓口" },
  { company: "家いちば", email: "fujiki@ieichiba.com", region: "全国", specialty: "空き家掲示板プラットフォーム" },
  { company: "GTN (Global Trust Networks)", email: "gtnhomes@gtn.co.jp", region: "東京（池袋）", specialty: "7言語対応・外国人向け大手" },
  { company: "IPA（国際不動産エージェント）", email: "suzuki@ipag.jp", region: "東京（千代田区）", specialty: "海外不動産コンサル" },
  { company: "ICHII CORPORATION", email: "seya@ichii-re.co.jp", region: "東京（新宿）", specialty: "12,265室管理・外国人対応大手" },
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

  console.log(`=== バッチ4: ${TARGETS.length}社に送信 ===\n`);
  const transporter = nodemailer.createTransport({
    service: "gmail", auth: { user: GMAIL_USER, pass: appPassword },
  });

  let sent = 0, failed = 0;
  for (const t of TARGETS) {
    const { subject, text } = generateEmail(t);
    console.log(`[${sent + failed + 1}/${TARGETS.length}] ${t.company} → ${t.email}`);
    try {
      await transporter.sendMail({ from: `"${SENDER_NAME}" <${GMAIL_USER}>`, to: t.email, subject, text });
      console.log("  ✅ 送信成功"); sent++;
      await new Promise((r) => setTimeout(r, 5000));
    } catch (e: any) {
      console.log(`  ❌ 失敗: ${e.message?.substring(0, 80)}`); failed++;
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
  console.log(`\n=== 完了 === 成功: ${sent}, 失敗: ${failed}`);
}
main().catch(console.error);
