import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "@/i18n/navigation";
import { L } from "@/lib/locale-utils";

export default function AboutPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale;

  return (
    <>
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-primary mb-6">
          {L(locale, "关于 AkiyaFinder", "AkiyaFinderについて", "About AkiyaFinder")}
        </h1>

        <div className="prose prose-gray max-w-none">
          <p className="text-lg text-gray-600 mb-8">
            {L(
              locale,
              "AkiyaFinder是一个将日本全国空き家バンク的房源信息翻译为中文、英文、日文的网站。希望移住日本、在日本定居的海外人士，可以在这里无语言障碍地查阅房源信息。",
              "AkiyaFinderは、日本全国の空き家バンク物件を中国語・英語・日本語に翻訳して紹介するサイトです。移住・定住を希望される海外の方が、言語の壁を感じずに物件情報にアクセスできる環境を提供します。",
              "AkiyaFinder is a website that translates akiya bank property listings from across Japan into Chinese, English, and Japanese. We help people from overseas who wish to relocate to Japan access property information without language barriers."
            )}
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gray-50 rounded-xl p-6">
              <span className="text-3xl block mb-2">🏠</span>
              <p className="font-bold text-primary text-2xl">4,335+</p>
              <p className="text-gray-500 text-sm">
                {L(locale, "覆盖47个都道府县的房源", "47都道府県の掲載物件", "Properties listed across 47 prefectures")}
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <span className="text-3xl block mb-2">🌏</span>
              <p className="font-bold text-primary text-2xl">3</p>
              <p className="text-gray-500 text-sm">
                {L(locale, "种语言（中文、英文、日文）", "言語対応（中国語・英語・日本語）", "Languages (Chinese, English, Japanese)")}
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <span className="text-3xl block mb-2">🤝</span>
              <p className="font-bold text-primary text-2xl">
                {L(locale, "免费", "無料", "Free")}
              </p>
              <p className="text-gray-500 text-sm">
                {L(locale, "不动产公司介绍——无需任何费用", "不動産会社のご紹介——費用はかかりません", "Real estate agent referral — no cost to you")}
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-primary mb-4">
            {L(locale, "为什么创建这个平台", "なぜ作ったのか", "Why We Built This")}
          </h2>
          <p className="text-gray-600 mb-4">
            {L(
              locale,
              "日本有超过900万套空置住宅，而且每年都在增加。很多物件价格极低——有些甚至免费。但存在巨大的信息壁垒：几乎所有空き家バンク的信息都只有日语，分散在1,700多个市町村网站上，格式也不统一。",
              "日本には900万戸以上の空き家があり、毎年増加しています。多くの物件は驚くほど安く、無料のものもあります。しかし、大きな情報格差があります。ほぼ全ての空き家バンク情報は日本語のみで、1,700以上の自治体サイトに分散し、フォーマットも統一されていません。",
              "Japan has over 9 million vacant homes, and that number is growing every year. Many of these properties are available for incredibly low prices — some even for free. But there's a massive information gap: almost all akiya bank listings are in Japanese only, scattered across 1,700+ municipal websites with no standardized format."
            )}
          </p>
          <p className="text-gray-600 mb-8">
            {L(
              locale,
              "我们通过自动收集、翻译空き家信息来弥补这一空白——让海外人士可以轻松了解日本各地的物件情况，为移住定居提供第一步的信息支持。",
              "私たちはこのギャップを埋めるため、空き家情報を自動収集・翻訳し、海外の方が日本各地の物件情報を簡単に理解できるようにしています。移住・定住の第一歩となる情報をお届けします。",
              "We bridge that gap by automatically collecting and translating akiya listings — making it easy for people overseas to explore property information across Japan as the first step toward relocation."
            )}
          </p>

          <h2 className="text-2xl font-bold text-primary mb-4">
            {L(locale, "运作方式", "仕組み", "How It Works")}
          </h2>
          <ol className="space-y-4 mb-8">
            <li className="flex gap-3">
              <span className="bg-accent/10 text-accent font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">1</span>
              <div>
                <p className="font-semibold text-primary">
                  {L(locale, "浏览与筛选", "検索・絞り込み", "Browse & Filter")}
                </p>
                <p className="text-gray-500 text-sm">
                  {L(
                    locale,
                    "在物件地图上搜索4,335+套房产。按价格、地区、车站距离筛选。",
                    "物件マップで4,335件以上の物件を検索。価格・地域・駅距離で絞り込みできます。",
                    "Search 4,335+ properties on our property map. Filter by price, location, and station access."
                  )}
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="bg-accent/10 text-accent font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">2</span>
              <div>
                <p className="font-semibold text-primary">
                  {L(locale, "联系不动产公司", "不動産会社をご紹介", "Get Connected")}
                </p>
                <p className="text-gray-500 text-sm">
                  {L(
                    locale,
                    "提交咨询，我们将在2个工作日内为您介绍当地的不动产公司。",
                    "問い合わせを送信すると、2営業日以内に現地の不動産会社をご紹介します。",
                    "Submit an inquiry and we'll connect you with a local real estate agent — within 2 business days."
                  )}
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="bg-accent/10 text-accent font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">3</span>
              <div>
                <p className="font-semibold text-primary">
                  {L(locale, "安心购买", "安心して購入", "Buy with Confidence")}
                </p>
                <p className="text-gray-500 text-sm">
                  {L(
                    locale,
                    "不动产公司全程处理——看房、议价、合同、登记。很多购买可以远程完成。",
                    "不動産会社が全て対応——内覧・交渉・契約・登記。多くの購入は遠隔で完結できます。",
                    "The agent handles everything — property visits, negotiation, contracts, and registration. Many purchases can be completed remotely."
                  )}
                </p>
              </div>
            </li>
          </ol>

          <h2 className="text-2xl font-bold text-primary mb-4">
            {L(locale, "我们的承诺", "私たちの約束", "Our Commitment")}
          </h2>
          <ul className="space-y-2 text-gray-600 mb-8">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span><strong>{L(locale, "完全免费", "完全無料", "Completely free")}</strong> — {L(locale, "不动产公司的介绍不收取任何费用", "不動産会社のご紹介に費用は一切かかりません", "We never charge for agent referrals")}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span><strong>{L(locale, "正规不动产公司", "正規の不動産会社", "Licensed agents only")}</strong> — {L(locale, "我们推荐的每一家不动产公司都持有日本宅建業免許", "ご紹介する不動産会社は全て、日本の宅建業免許を保有しています", "Every agent we recommend holds a valid Japanese real estate license")}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span><strong>{L(locale, "无压力", "プレッシャーなし", "No pressure")}</strong> — {L(locale, "随意浏览，准备好再咨询。无任何义务", "自由に閲覧し、準備ができたらお問い合わせください。義務はありません", "Browse freely, inquire when ready. No obligations")}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span><strong>{L(locale, "定期更新", "定期更新", "Updated regularly")}</strong> — {L(locale, "我们定期从日本各地的空き家バンク更新房源信息", "日本全国の空き家バンクから定期的に情報を更新しています", "We refresh listings from akiya banks across Japan")}</span>
            </li>
          </ul>

          <div className="bg-accent/5 border border-accent/20 rounded-lg p-6 text-center">
            <h3 className="font-semibold text-primary mb-2">
              {L(locale, "准备探索了吗？", "物件を探してみませんか？", "Ready to explore?")}
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              {L(
                locale,
                "在地图上浏览4,335+套房产。",
                "地図で4,335件以上の物件をご覧ください。",
                "Start browsing 4,335+ properties on our map."
              )}
            </p>
            <div className="flex gap-3 justify-center">
              <Link
                href="/map"
                className="bg-accent text-white px-6 py-2.5 rounded-lg font-medium hover:bg-red-600 transition"
              >
                {L(locale, "查看物件地图", "物件を探す", "Browse Properties")}
              </Link>
              <Link
                href="/contact"
                className="bg-white border border-gray-200 text-primary px-6 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                {L(locale, "免费咨询", "無料で相談する", "Get Started — Free")}
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
