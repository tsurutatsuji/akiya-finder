/**
 * 自治体への空き家バンク掲載許可メール — バッチ2（57自治体）
 * Usage: GMAIL_APP_PASSWORD="xxxx" npx tsx scripts/send-outreach-municipalities2.ts
 */
import * as nodemailer from "nodemailer";

const GMAIL_USER = "helongzhi57@gmail.com";
const SENDER_NAME = "鶴 竜治 / AkiyaFinder";

interface M { name: string; email: string; pref: string; dept: string; }

const TARGETS: M[] = [
  // 確認済み（28自治体）
  { name: "別府市", email: "beppu-akiya.bank@city.beppu.lg.jp", pref: "大分県", dept: "都市計画課 空き家担当" },
  { name: "由布市", email: "seisaku@city.yufu.lg.jp", pref: "大分県", dept: "総合政策課" },
  { name: "妙高市", email: "chiikikyosei@city.myoko.niigata.jp", pref: "新潟県", dept: "地域共生課 移住支援グループ" },
  { name: "福知山市", email: "machi@city.fukuchiyama.lg.jp", pref: "京都府", dept: "まちづくり推進課" },
  { name: "南丹市", email: "teiju@city.nantan.kyoto.jp", pref: "京都府", dept: "定住促進サポートセンター" },
  { name: "仙北市", email: "machi@city.semboku.akita.jp", pref: "秋田県", dept: "企画部まちづくり課" },
  { name: "函館市", email: "akiya@city.hakodate.hokkaido.jp", pref: "北海道", dept: "都市整備課 空家対策担当" },
  { name: "蘭越町", email: "ijyu@town.rankoshi.hokkaido.jp", pref: "北海道", dept: "総務課まちづくり推進係" },
  { name: "下田市", email: "sangyou@city.shimoda.lg.jp", pref: "静岡県", dept: "産業振興課" },
  { name: "小豆島町", email: "sumai@town.shodoshima.lg.jp", pref: "香川県", dept: "住まい政策課" },
  { name: "土庄町", email: "kikakuzaisei@town.tonosho.lg.jp", pref: "香川県", dept: "企画財政課" },
  { name: "珠洲市", email: "iju@city.suzu.lg.jp", pref: "石川県", dept: "企画財政課 移住定住推進係" },
  { name: "大野市", email: "chiiki@city.fukui-ono.lg.jp", pref: "福井県", dept: "地域文化課" },
  { name: "萩市", email: "teijyu@city.hagi.lg.jp", pref: "山口県", dept: "移住定住推進課" },
  { name: "周南市", email: "jutaku@city.shunan.lg.jp", pref: "山口県", dept: "住宅課 空家対策室" },
  { name: "長門市", email: "nagato-teiju@city.nagato.lg.jp", pref: "山口県", dept: "企画政策課" },
  { name: "鶴岡市", email: "tokei@city.tsuruoka.yamagata.jp", pref: "山形県", dept: "都市計画課" },
  { name: "倉吉市", email: "iju@city.kurayoshi.lg.jp", pref: "鳥取県", dept: "移住定住担当" },
  { name: "安曇野市", email: "iju-teiju@city.azumino.nagano.jp", pref: "長野県", dept: "移住定住推進課" },
  { name: "大町市", email: "teijuu@city.omachi.nagano.jp", pref: "長野県", dept: "まちづくり産業課" },
  { name: "木曽町", email: "kisoijyu@town.kiso.lg.jp", pref: "長野県", dept: "町民課" },
  { name: "上越市", email: "kenjuu@city.joetsu.lg.jp", pref: "新潟県", dept: "建住課" },
  { name: "阿蘇市", email: "aso-iju@city.aso.lg.jp", pref: "熊本県", dept: "まちづくり課" },
  { name: "田辺市", email: "tanabe.eigyou@city.tanabe.lg.jp", pref: "和歌山県", dept: "たなべ営業室" },
  { name: "奥州市", email: "akiyataisaku@city.oshu.iwate.jp", pref: "岩手県", dept: "空き家対策課" },
  { name: "筑西市", email: "akiya@city.chikusei.lg.jp", pref: "茨城県", dept: "空き家対策課" },
  { name: "飛騨市", email: "kenchiku@city.hida.lg.jp", pref: "岐阜県", dept: "建築住宅課" },
  { name: "長浜市", email: "nagahama@iju-nagahama.jp", pref: "滋賀県", dept: "移住定住促進協議会" },
  // 推測（29自治体）
  { name: "倶知安町", email: "jyuutaku@town.kutchan.lg.jp", pref: "北海道", dept: "建設課 住宅係" },
  { name: "ニセコ町", email: "kikaku@town.niseko.lg.jp", pref: "北海道", dept: "企画環境課" },
  { name: "共和町", email: "kikaku@town.kyowa.hokkaido.jp", pref: "北海道", dept: "企画課" },
  { name: "京丹波町", email: "kikaku@town.kyotamba.kyoto.jp", pref: "京都府", dept: "企画情報課" },
  { name: "綾部市", email: "teiju@city.ayabe.lg.jp", pref: "京都府", dept: "定住・地域政策課" },
  { name: "竹田市", email: "kikaku@city.taketa.oita.jp", pref: "大分県", dept: "総合政策課" },
  { name: "豊後大野市", email: "machizukuri@city.bungoono.lg.jp", pref: "大分県", dept: "まちづくり推進課" },
  { name: "尾道市", email: "machizukuri@city.onomichi.hiroshima.jp", pref: "広島県", dept: "まちづくり推進課" },
  { name: "三原市", email: "chiikikikaku@city.mihara.hiroshima.jp", pref: "広島県", dept: "地域企画課" },
  { name: "呉市", email: "jutaku@city.kure.lg.jp", pref: "広島県", dept: "住宅政策課" },
  { name: "十日町市", email: "kikaku@city.tokamachi.lg.jp", pref: "新潟県", dept: "企画政策課" },
  { name: "湯沢町", email: "kikaku@town.yuzawa.lg.jp", pref: "新潟県", dept: "企画観光課" },
  { name: "伊豆市", email: "chiikizukuri@city.izu.shizuoka.jp", pref: "静岡県", dept: "地域づくり課" },
  { name: "熱海市", email: "machizukuri@city.atami.lg.jp", pref: "静岡県", dept: "まちづくり課" },
  { name: "直島町", email: "machizukuri@town.naoshima.lg.jp", pref: "香川県", dept: "まちづくり観光課" },
  { name: "四万十市", email: "kikaku@city.shimanto.lg.jp", pref: "高知県", dept: "企画広報課" },
  { name: "土佐市", email: "kikaku@city.tosa.lg.jp", pref: "高知県", dept: "企画財政課" },
  { name: "大仙市", email: "iju@city.daisen.lg.jp", pref: "秋田県", dept: "移住定住促進課" },
  { name: "備前市", email: "toshikeikaku@city.bizen.okayama.jp", pref: "岡山県", dept: "都市計画課" },
  { name: "真庭市", email: "machizukuri@city.maniwa.lg.jp", pref: "岡山県", dept: "まちづくり推進課" },
  { name: "七尾市", email: "sangyo@city.nanao.lg.jp", pref: "石川県", dept: "産業振興課" },
  { name: "霧島市", email: "chiiki@city-kirishima.jp", pref: "鹿児島県", dept: "地域政策課" },
  { name: "高山市", email: "brand@city.takayama.lg.jp", pref: "岐阜県", dept: "ブランド戦略課" },
  { name: "佐渡市", email: "iju@city.sado.niigata.jp", pref: "新潟県", dept: "移住交流推進課" },
  { name: "松本市", email: "jutaku@city.matsumoto.lg.jp", pref: "長野県", dept: "建設部住宅課" },
  { name: "糸魚川市", email: "kikaku@city.itoigawa.lg.jp", pref: "新潟県", dept: "企画定住課" },
  { name: "登米市", email: "tome-life@city.tome.miyagi.jp", pref: "宮城県", dept: "移住定住担当" },
  { name: "小樽市", email: "akiya@city.otaru.lg.jp", pref: "北海道", dept: "建築指導課 空き家対策" },
  { name: "西条市", email: "akiya@saijo-sics.co.jp", pref: "愛媛県", dept: "西条産業情報支援センター" },
];

function generateEmail(m: M): { subject: string; text: string } {
  const subject = "空き家バンク物件の英語サイト掲載に関するご相談 — AkiyaFinder";
  const text = `${m.name}役場 ${m.dept} 御中

はじめまして。鶴 竜治と申します。
外国人向け空き家検索サイト「AkiyaFinder」（https://akiya-finder.vercel.app）を運営しております。

当サイトでは、日本各地の空き家バンク物件の情報を英語・中国語に翻訳し、海外の方々に日本の空き家の魅力を発信しております。現在、全国47都道府県の物件を掲載しており、海外からのアクセスが増えてきております。

つきまして、${m.pref}${m.name}の空き家バンクの物件情報について、以下のご相談をさせていただきたく、ご連絡いたしました。

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
・完全無料で運営しております

ご多忙のところ恐縮ですが、ご検討いただけますと幸いです。

鶴 竜治
AkiyaFinder
メール: helongzhi57@gmail.com`;

  return { subject, text };
}

async function main() {
  const appPassword = process.env.GMAIL_APP_PASSWORD;
  if (!appPassword) { console.error("GMAIL_APP_PASSWORD required"); process.exit(1); }

  console.log("=== 自治体バッチ2: " + TARGETS.length + "自治体 ===\\n");
  const transporter = nodemailer.createTransport({
    service: "gmail", auth: { user: GMAIL_USER, pass: appPassword },
  });

  let sent = 0, failed = 0;
  for (const m of TARGETS) {
    const { subject, text } = generateEmail(m);
    console.log("[" + (sent + failed + 1) + "/" + TARGETS.length + "] " + m.pref + m.name + " → " + m.email);
    try {
      await transporter.sendMail({ from: '"' + SENDER_NAME + '" <' + GMAIL_USER + '>', to: m.email, subject, text });
      console.log("  ✅ 送信成功"); sent++;
      await new Promise(r => setTimeout(r, 5000));
    } catch (e: any) {
      console.log("  ❌ 失敗: " + (e.message || "").substring(0, 80)); failed++;
      await new Promise(r => setTimeout(r, 3000));
    }
  }
  console.log("\\n=== 完了 === 成功: " + sent + ", 失敗: " + failed);
}
main().catch(console.error);
