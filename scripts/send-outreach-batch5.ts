/**
 * 営業メール一括送信 — バッチ5（追加27社）
 * Usage: GMAIL_APP_PASSWORD="xxxx" npx tsx scripts/send-outreach-batch5.ts
 */
import * as nodemailer from "nodemailer";

const GMAIL_USER = "helongzhi57@gmail.com";
const SENDER_NAME = "鶴 竜治 / AkiyaFinder";

interface Target { company: string; email: string; region: string; specialty: string; }

const TARGETS: Target[] = [
  { company: "Akiya Rebirth", email: "info@akiyarebirth.com", region: "大阪・関西", specialty: "空き家再生・外国人対応" },
  { company: "Resort Innovation", email: "info@resortinnovation.com", region: "軽井沢（長野）", specialty: "リゾート物件" },
  { company: "Resort Innovation（営業）", email: "sales@resortinnovation.com", region: "軽井沢（長野）", specialty: "リゾート物件営業" },
  { company: "Japan Hana Real Estate", email: "info@japan-hana.com", region: "東京・大阪・香港", specialty: "外国人投資家向け" },
  { company: "Hana Management", email: "info@hana-management.com", region: "東京・大阪", specialty: "外国人向け物件管理" },
  { company: "RISE Corp.", email: "info@rise-corp.tokyo", region: "東京（麻布十番）", specialty: "外国人駐在員向け" },
  { company: "AXM (Axios Management)", email: "contact@axm.co.jp", region: "東京（品川）", specialty: "外国人向け物件管理" },
  { company: "SEIKA Housing", email: "seika@sumainoseika.com", region: "名古屋・東京・横浜", specialty: "外国人向け多言語対応" },
  { company: "信州田舎暮らし", email: "info@s-inaka.co.jp", region: "長野", specialty: "田舎暮らし物件・古民家" },
  { company: "株式会社もがな", email: "info@mgn-nagano.com", region: "長野", specialty: "田舎暮らし応援・古民家" },
  { company: "ふるさと情報館", email: "info@furusato-net.co.jp", region: "全国", specialty: "田舎暮らし36年の老舗" },
  { company: "田舎暮らし情報館", email: "talkto@hudousan.jp", region: "岐阜（全国対応）", specialty: "古民家・田舎物件情報20年" },
  { company: "Kyoto Real Estate", email: "info@kyoto-realestate.com", region: "京都", specialty: "町家・古民家・英語対応" },
  { company: "My Housing（仲介）", email: "agent1@my-housing.jp", region: "沖縄", specialty: "英語対応・物件仲介" },
  { company: "My Housing（売買）", email: "myhousingsales@gmail.com", region: "沖縄", specialty: "売買部門" },
  { company: "My Housing（管理）", email: "propertymanagement@my-housing.jp", region: "沖縄", specialty: "物件管理" },
  { company: "SAKI Corporation", email: "housing@saki-corp.jp", region: "沖縄", specialty: "外国人向け住宅" },
  { company: "Ace Family Housing", email: "acefamilyhousing@gmail.com", region: "沖縄", specialty: "英語対応" },
  { company: "Hakuba Real Estate", email: "sales@hakubarealestate.com", region: "白馬（長野）", specialty: "スキーリゾート物件" },
  { company: "Mominoki Real Estate", email: "realestate@mominokihotel.com", region: "白馬（長野）", specialty: "49年の実績" },
  { company: "RE/MAX Aki Shimizu", email: "aki@topagent-tokyo.com", region: "東京（六本木）", specialty: "英語対応エージェント" },
  { company: "RE/MAX Yuri Taniguchi", email: "yuri@topagent-tokyo.com", region: "東京（六本木）", specialty: "英語対応エージェント" },
  { company: "高知県不動産鑑定士協会", email: "kantei-kochi@ca.pikara.ne.jp", region: "高知（四国）", specialty: "不動産鑑定・地方物件" },
  { company: "YES Hokkaido Real Estate", email: "sales@yeshokkaido.com", region: "北海道（ニセコ・富良野）", specialty: "リゾート物件・英語対応" },
  { company: "TAFT Co., Ltd.", email: "eigyo@taft.co.jp", region: "札幌（北海道）", specialty: "外国人向け・英語対応" },
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

  console.log(`=== バッチ5: ${TARGETS.length}社に送信 ===\n`);
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
