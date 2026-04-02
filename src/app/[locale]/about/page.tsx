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
              "AkiyaFinder 帮助海外买家发现和投资日本的空置房产。我们将空き家バンク的房源翻译为中文和英文，添加投资指标，并为您对接当地持牌经纪人。",
              "AkiyaFinder は海外バイヤーが日本の空き家を発見・投資するためのプラットフォームです。空き家バンクの物件情報を英語・中国語に翻訳し、投資指標を付加し、現地の認可不動産業者をご紹介します。",
              "AkiyaFinder helps international buyers discover and invest in Japan's vacant properties. We translate akiya bank listings into English and Chinese, add investment metrics, and connect you with licensed local agents."
            )}
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gray-50 rounded-xl p-6">
              <span className="text-3xl block mb-2">🏠</span>
              <p className="font-bold text-primary text-2xl">901+</p>
              <p className="text-gray-500 text-sm">
                {L(locale, "覆盖47个都道府县的房源", "47都道府県の掲載物件", "Properties listed across 47 prefectures")}
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <span className="text-3xl block mb-2">🌏</span>
              <p className="font-bold text-primary text-2xl">3</p>
              <p className="text-gray-500 text-sm">
                {L(locale, "种语言（中文、英文、日文）", "言語対応（英語・中国語・日本語）", "Languages (English, Chinese, Japanese)")}
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <span className="text-3xl block mb-2">🤝</span>
              <p className="font-bold text-primary text-2xl">
                {L(locale, "免费", "無料", "Free")}
              </p>
              <p className="text-gray-500 text-sm">
                {L(locale, "经纪人匹配——买家零费用", "エージェント紹介——購入者負担ゼロ", "Agent matching — no cost to buyers")}
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
              "我们通过自动收集、翻译和丰富空き家信息来填补这一空白——添加每平米价格、车站距离、建筑状况、民泊潜力等投资相关数据——让海外买家能够做出明智的决定。",
              "私たちはこのギャップを埋めるため、空き家情報を自動収集・翻訳し、㎡単価・駅距離・建物状態・民泊ポテンシャルなどの投資関連データを付加しています。海外バイヤーが情報に基づいた判断ができるようにします。",
              "We bridge that gap by automatically collecting, translating, and enriching akiya listings with investment-relevant data — price per square meter, station access, building condition, Airbnb potential — so international buyers can make informed decisions."
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
                    "在投资地图上搜索901+套房产。按价格、地区、车站距离和投资类别筛选。",
                    "投資マップで901件以上の物件を検索。価格・地域・駅距離・投資カテゴリで絞り込み。",
                    "Search 901+ properties on our investment map. Filter by price, location, station access, and investment category."
                  )}
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="bg-accent/10 text-accent font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">2</span>
              <div>
                <p className="font-semibold text-primary">
                  {L(locale, "匹配经纪人", "エージェントとマッチング", "Get Matched")}
                </p>
                <p className="text-gray-500 text-sm">
                  {L(
                    locale,
                    "提交咨询，我们将在2个工作日内为您对接一位持牌、会说英文的日本不动产经纪人。",
                    "問い合わせを送信すると、2営業日以内に英語対応可能な認可不動産業者をご紹介します。",
                    "Submit an inquiry and we'll connect you with a licensed Japanese real estate agent who speaks English — within 2 business days."
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
                    "经纪人全权处理——看房、议价、合同、登记。很多购买可以远程完成。",
                    "エージェントが全て対応——内覧・交渉・契約・登記。多くの購入は遠隔で完結できます。",
                    "Your agent handles everything — property visits, negotiation, contracts, and registration. Many purchases can be completed remotely."
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
              <span><strong>{L(locale, "买家免费", "購入者無料", "Free for buyers")}</strong> — {L(locale, "我们不向买家收取任何经纪人介绍费", "エージェント紹介に購入者負担はありません", "We never charge buyers for agent introductions")}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span><strong>{L(locale, "仅推荐持牌经纪人", "認可業者のみ", "Licensed agents only")}</strong> — {L(locale, "我们推荐的每一位经纪人都持有日本不动产经营许可（宅建業免許）", "ご紹介するエージェントは全員、日本の宅建業免許を保有しています", "Every agent we recommend holds a valid Japanese real estate license (宅建業免許)")}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span><strong>{L(locale, "无压力", "プレッシャーなし", "No pressure")}</strong> — {L(locale, "随意浏览，准备好再咨询。无任何义务", "自由に閲覧し、準備ができたらお問い合わせください。義務はありません", "Browse freely, inquire when ready. No obligations")}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span><strong>{L(locale, "定期更新", "定期更新", "Updated regularly")}</strong> — {L(locale, "我们定期从日本各地的空き家バンク更新房源", "日本全国の空き家バンクから定期的に情報を更新しています", "We refresh listings from akiya banks across Japan")}</span>
            </li>
          </ul>

          <div className="bg-accent/5 border border-accent/20 rounded-lg p-6 text-center">
            <h3 className="font-semibold text-primary mb-2">
              {L(locale, "准备探索了吗？", "探してみますか？", "Ready to explore?")}
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              {L(
                locale,
                "在投资地图上浏览901+套房产。",
                "投資マップで901件以上の物件をご覧ください。",
                "Start browsing 901+ properties on our investment map."
              )}
            </p>
            <div className="flex gap-3 justify-center">
              <Link
                href="/map"
                className="bg-accent text-white px-6 py-2.5 rounded-lg font-medium hover:bg-red-600 transition"
              >
                {L(locale, "打开投资地图", "投資マップを開く", "Open Investment Map")}
              </Link>
              <Link
                href="/contact"
                className="bg-white border border-gray-200 text-primary px-6 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                {L(locale, "免费开始", "無料で始める", "Get Started — Free")}
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
