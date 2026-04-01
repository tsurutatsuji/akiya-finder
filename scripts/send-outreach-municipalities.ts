/**
 * 自治体への空き家バンク掲載許可メール送信
 * 「物件を英語で発信させてください + 写真の使用許可」
 *
 * Usage: GMAIL_APP_PASSWORD="xxxx" npx tsx scripts/send-outreach-municipalities.ts
 */
import * as nodemailer from "nodemailer";

const GMAIL_USER = "helongzhi57@gmail.com";
const SENDER_NAME = "鶴 竜治 / AkiyaFinder";

interface Municipality {
  name: string;
  email: string;
  prefecture: string;
  department: string;
  propertyCount?: number;
}

const TARGETS: Municipality[] = [
  // 長野県
  { name: "飯綱町", email: "jinko@town.iizuna.nagano.jp", prefecture: "長野県", department: "企画課 人口増推進室", propertyCount: 10 },
  { name: "栄村", email: "sakae@vill.sakae.nagano.jp", prefecture: "長野県", department: "総務課" },
  { name: "小谷村", email: "kankou@vill.otari.nagano.jp", prefecture: "長野県", department: "観光地域振興課 集落支援係" },
  { name: "高山村", email: "soumu@vill.takayama.nagano.jp", prefecture: "長野県", department: "総務課" },
  { name: "中野市", email: "kikaku@city.nakano.nagano.jp", prefecture: "長野県", department: "企画財政課" },
  { name: "白馬村", email: "soumu@vill.hakuba.nagano.jp", prefecture: "長野県", department: "総務課" },
  { name: "長野市", email: "akiya@city.nagano.nagano.jp", prefecture: "長野県", department: "移住推進課" },

  // 山梨県
  { name: "甲府市", email: "akiya@city.kofu.yamanashi.jp", prefecture: "山梨県", department: "空き家対策課", propertyCount: 14 },
  { name: "韮崎市", email: "digital@city.nirasaki.yamanashi.jp", prefecture: "山梨県", department: "デジタル戦略課" },
  { name: "笛吹市", email: "kikaku@city.fuefuki.yamanashi.jp", prefecture: "山梨県", department: "企画課" },
  { name: "富士吉田市", email: "chiiki@city.fujiyoshida.yamanashi.jp", prefecture: "山梨県", department: "地域振興・移住定住課" },
  { name: "山中湖村", email: "seisaku@vill.yamanakako.yamanashi.jp", prefecture: "山梨県", department: "総合政策課" },
  { name: "富士河口湖町", email: "seisaku@town.fujikawaguchiko.yamanashi.jp", prefecture: "山梨県", department: "政策企画課" },
  { name: "北杜市", email: "furusato@city.hokuto.yamanashi.jp", prefecture: "山梨県", department: "ふるさと納税課" },

  // 沖縄県
  { name: "沖縄市", email: "sumai@city.okinawa.okinawa.jp", prefecture: "沖縄県", department: "住まい建築課" },
  { name: "石垣市", email: "kikaku@city.ishigaki.okinawa.jp", prefecture: "沖縄県", department: "企画政策課" },
  { name: "那覇市", email: "machidukuri@city.naha.okinawa.jp", prefecture: "沖縄県", department: "まちなみ共創部" },
  { name: "国頭村", email: "kikaku@vill.kunigami.okinawa.jp", prefecture: "沖縄県", department: "企画政策課" },
];

function generateEmail(m: Municipality): { subject: string; text: string } {
  const subject = `空き家バンク物件の英語サイト掲載に関するご相談 — AkiyaFinder`;

  const text = `${m.name}役場 ${m.department} 御中

はじめまして。鶴 竜治と申します。
外国人向け空き家検索サイト「AkiyaFinder」（https://akiya-finder.vercel.app）を運営しております。

当サイトでは、日本各地の空き家バンク物件の情報を英語・中国語に翻訳し、海外の方々に日本の空き家の魅力を発信しております。現在、全国47都道府県の物件を掲載しており、海外からのアクセスが増えてきております。

つきまして、${m.prefecture}${m.name}の空き家バンクの物件情報について、以下のご相談をさせていただきたく、ご連絡いたしました。

■ ご相談内容
1. 空き家バンクに掲載されている物件情報を、当サイト上で英語・中国語に翻訳して掲載させていただけないでしょうか
2. 物件の写真についても、掲載許可をいただけないでしょうか
3. 海外から問い合わせがあった場合、${m.name}の空き家バンクの窓口にお繋ぎする形を取りたいと考えております

■ 目的
外国人の方が${m.name}の空き家に興味を持ち、移住や物件購入を検討する際の情報アクセスを改善することです。空き家の利活用促進に少しでもお役に立てればと考えております。

■ 当サイトについて
・URL: https://akiya-finder.vercel.app
・掲載物件数: 全国901件（今後拡大予定）
・対応言語: 英語・中国語
・物件の投資指標（㎡単価、推定リノベ費用等）を自動計算して表示
・完全無料で運営しております

ご多忙のところ恐縮ですが、ご検討いただけますと幸いです。
ご不明な点がございましたら、お気軽にお問い合わせください。

鶴 竜治
AkiyaFinder
メール: helongzhi57@gmail.com
URL: https://akiya-finder.vercel.app`;

  return { subject, text };
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const appPassword = process.env.GMAIL_APP_PASSWORD;
  if (!appPassword && !dryRun) { console.error("GMAIL_APP_PASSWORD required"); process.exit(1); }

  console.log(`=== 自治体への掲載許可メール: ${TARGETS.length}自治体 ===`);
  console.log(`モード: ${dryRun ? "ドライラン" : "本番送信"}\n`);

  let transporter: nodemailer.Transporter | null = null;
  if (!dryRun && appPassword) {
    transporter = nodemailer.createTransport({
      service: "gmail", auth: { user: GMAIL_USER, pass: appPassword },
    });
  }

  let sent = 0, failed = 0;
  for (const m of TARGETS) {
    const { subject, text } = generateEmail(m);
    console.log(`[${sent + failed + 1}/${TARGETS.length}] ${m.prefecture}${m.name} → ${m.email}`);

    if (dryRun) {
      console.log(`  件名: ${subject}`);
      sent++;
      continue;
    }

    try {
      await transporter!.sendMail({
        from: `"${SENDER_NAME}" <${GMAIL_USER}>`,
        to: m.email,
        subject,
        text,
      });
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
