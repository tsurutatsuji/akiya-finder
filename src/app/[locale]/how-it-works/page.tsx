import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "@/i18n/navigation";
import { L } from "@/lib/locale-utils";

export default function HowItWorks({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale;

  const steps = [
    {
      step: "1",
      title: L(locale, "在日本空房网上寻找房产", "AKIYAで物件を探す", "Find a Property on AkiyaFinder"),
      desc: L(
        locale,
        "浏览我们精选的房源，全部翻译为中文。按价格、地区、物件类型筛选。",
        "翻訳済みの物件一覧をご覧ください。価格、地域、物件タイプで絞り込みできます。",
        "Browse our curated listings, all translated into English. Filter by price, location, and property type."
      ),
    },
    {
      step: "2",
      title: L(locale, "提交咨询", "問い合わせを送る", "Submit an Inquiry"),
      desc: L(
        locale,
        "点击任何房产上的\"咨询\"按钮。告诉我们您的情况和需求。免费、无义务。",
        "物件の「問い合わせ」ボタンをクリック。ご希望の条件をお伝えください。無料・義務なし。",
        "Click 'Inquire' on any property. Tell us about yourself and what you're looking for. It's free and no obligation."
      ),
    },
    {
      step: "3",
      title: L(locale, "对接当地不动产公司", "現地の不動産会社をご紹介", "Get Connected to a Local Agent"),
      desc: L(
        locale,
        "我们将为您介绍当地的不动产公司。后续由不动产公司全程协助。",
        "現地の不動産会社をご紹介します。以降は不動産会社がサポートします。",
        "We'll connect you with a local real estate agent in that area. They'll handle everything from here."
      ),
    },
    {
      step: "4",
      title: L(locale, "看房与尽职调查", "内覧・物件調査", "Property Viewing & Due Diligence"),
      desc: L(
        locale,
        "不动产公司安排看房（现场或远程视频）。他们会确认物件状况、法律状态及潜在问题。",
        "不動産会社が内覧を手配（現地またはオンライン）。物件の状態・法的ステータス・問題点を確認します。",
        "Your agent arranges a viewing (in-person or virtual). They'll check the property condition, legal status, and any issues."
      ),
    },
    {
      step: "5",
      title: L(locale, "出价与签约", "価格交渉・契約", "Make an Offer & Sign Contract"),
      desc: L(
        locale,
        "不动产公司代您议价并处理所有日语文件。您将收到关键文件的中文/英文翻译。",
        "不動産会社が価格交渉と日本語の書類手続きを代行。重要書類の翻訳を提供します。",
        "Your agent negotiates the price and handles all paperwork in Japanese. You'll receive English translations of key documents."
      ),
    },
    {
      step: "6",
      title: L(locale, "付款与登记", "支払い・登記", "Payment & Registration"),
      desc: L(
        locale,
        "支付购买金额（银行转账）。不动产公司将房产登记在您名下。恭喜！您在日本拥有了一套房子！",
        "購入金額をお支払い（銀行振込）。不動産会社があなたの名義で登記します。これで日本にあなたの家ができました！",
        "Pay the purchase price (bank transfer). The agent registers the property in your name. You now own a house in Japan!"
      ),
    },
  ];

  const faqs = [
    {
      q: L(locale, "购买需要去日本吗？", "日本に行く必要がありますか？", "Do I need to visit Japan to buy?"),
      a: L(
        locale,
        "不一定。很多购买可以通过委托书远程完成。但建议亲自看房确认物件状况。",
        "必ずしも必要ではありません。委任状で遠隔購入が可能です。ただし、物件の状態を直接確認するため訪問をお勧めします。",
        "Not necessarily. Many purchases can be completed remotely with a power of attorney. However, visiting is recommended to see the property condition firsthand."
      ),
    },
    {
      q: L(locale, "外国人可以贷款吗？", "外国人はローンを組めますか？", "Can I get a mortgage as a foreigner?"),
      a: L(
        locale,
        "一般来说，非居民外国人无法获得日本房贷。大多数空き家购买为全款交易，考虑到低价格（很多物件$0~$30,000），全款购买是可行的。",
        "一般的に、非居住外国人は日本の住宅ローンを利用できません。空き家の購入は現金取引が多く、価格が低い（多くは0円〜500万円程度）ため現金購入が現実的です。",
        "Generally, non-resident foreigners cannot get Japanese mortgages. Most akiya purchases are cash transactions, which is feasible given the low prices ($0–$30,000 for many properties)."
      ),
    },
    {
      q: L(locale, "有隐藏费用吗？", "隠れた費用はありますか？", "Are there hidden costs?"),
      a: L(
        locale,
        "主要额外费用包括：经纪人费用（~3%）、登记税（~1-2%）、以及翻新费用（如需要）。农村物件的年度固定资产税很低（通常不到$300/年）。",
        "主な追加費用は、仲介手数料（約3%）、登録免許税（約1〜2%）、必要に応じたリフォーム費用です。地方物件の固定資産税は非常に低く、年間5万円以下のことが多いです。",
        "The main additional costs are agent fees (~3%), registration taxes (~1-2%), and renovation costs if needed. Annual property tax is very low for rural properties (often under $300/year)."
      ),
    },
    {
      q: L(locale, "为什么日本的房子这么便宜？", "なぜ日本の家はこんなに安いのですか？", "Why are houses so cheap in Japan?"),
      a: L(
        locale,
        "日本人口在减少，集中到城市。农村地区住房过剩、无需求。日本的房屋还会贬值（不同于西方国家），所以旧房子价值趋近于零。",
        "日本は人口が減少し、都市に集中しています。地方は住宅が過剰で需要がありません。また日本の家屋は減価償却されるため、古い家は価値がゼロに近づきます。",
        "Japan's population is shrinking and concentrating in cities. Rural areas have surplus housing with no demand. Japanese houses also depreciate (unlike Western countries), so older houses approach zero value."
      ),
    },
    {
      q: L(locale, "日本空房网是不动产中介吗？", "AKIYAは不動産会社ですか？", "Is AkiyaFinder a real estate agency?"),
      a: L(
        locale,
        "不是。我们是一个信息服务平台，翻译整理日本的房产信息。当您准备购买时，我们将为您介绍日本的不动产公司。",
        "いいえ。私たちは日本の物件情報を翻訳・整理する情報サービスです。購入の準備ができた際に、現地の不動産会社をご紹介します。",
        "No. We are an information service that curates and translates Japanese property listings. When you're ready to buy, we connect you with licensed Japanese real estate agents."
      ),
    },
  ];

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-primary text-center mb-4">
          {L(locale, "如何在日本购买房产", "日本で家を買う方法", "How to Buy a House in Japan")}
        </h1>
        <p className="text-gray-500 text-center max-w-2xl mx-auto mb-16">
          {L(
            locale,
            "外国人在日本购房比你想象的要简单。以下是你需要知道的一切。",
            "外国人が日本で家を購入するのは、思っているより簡単です。必要な情報をすべてお伝えします。",
            "Buying property in Japan as a foreigner is simpler than you think. Here's everything you need to know."
          )}
        </p>

        {/* Can foreigners buy? */}
        <div className="bg-white rounded-xl border border-gray-100 p-8 mb-8">
          <h2 className="text-2xl font-bold text-primary mb-4">
            {L(locale, "🌍 外国人可以在日本买房吗？", "🌍 外国人は日本で家を買えますか？", "🌍 Can Foreigners Buy Property in Japan?")}
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            <strong>{L(locale, "可以！", "はい、買えます！", "Yes!")}</strong>{" "}
            {L(
              locale,
              "日本是世界上少数对外国人购房没有任何限制的国家之一。",
              "日本は世界でも数少ない、外国人の不動産所有に制限のない国です。",
              "Japan is one of the few countries in the world with zero restrictions on foreign property ownership."
            )}
          </p>
          <ul className="space-y-2 text-gray-600">
            <li>✅ {L(locale, "无需签证或居留权", "ビザ・在留資格不要", "No visa or residency required")}</li>
            <li>✅ {L(locale, "无需国籍", "国籍不要", "No citizenship required")}</li>
            <li>✅ {L(locale, "无需特别许可", "特別な許可不要", "No special permits needed")}</li>
            <li>✅ {L(locale, "与日本公民享有同等产权", "日本人と同等の所有権", "Same property rights as Japanese citizens")}</li>
            <li>✅ {L(locale, "可从海外远程购买", "海外から訪日せずに購入可能", "You can buy from overseas without visiting Japan")}</li>
          </ul>
        </div>

        {/* What is Akiya */}
        <div className="bg-white rounded-xl border border-gray-100 p-8 mb-8">
          <h2 className="text-2xl font-bold text-primary mb-4">
            {L(locale, "🏚️ 什么是空き家？", "🏚️ 空き家とは？", "🏚️ What is an Akiya?")}
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            {L(
              locale,
              "空き家（あきや）在日语中意为\"空房子\"。由于日本人口老龄化和城市化，全国有超过900万套空置住宅。",
              "空き家（あきや）とは、使用されていない住宅のことです。日本の高齢化と都市集中により、全国に900万戸以上の空き家があります。",
              "Akiya (空き家) literally means \"empty house\" in Japanese. Due to Japan's aging population and urban migration, there are over 9 million vacant houses across the country."
            )}
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            {L(
              locale,
              "许多地方政府通过空き家バンク（空き家银行）项目免费或以极低价格提供这些房屋，有时还提供100万日元以上的翻新补贴。",
              "多くの自治体が空き家バンクを通じて、これらの住宅を無料または格安で提供しており、100万円以上のリフォーム補助金が出ることもあります。",
              "Many local governments offer these houses for free or at very low prices through Akiya Bank (空き家バンク) programs, sometimes with renovation subsidies of ¥1,000,000+ (~$6,600+)."
            )}
          </p>
          <p className="text-gray-600 leading-relaxed">
            {L(
              locale,
              "问题是？几乎所有空き家信息都只有日语。这就是AkiyaFinder存在的意义。",
              "問題は？ほとんどの空き家情報が日本語のみということです。AkiyaFinderはこの問題を解決します。",
              "The problem? Almost all akiya information is in Japanese only. That's where AkiyaFinder comes in."
            )}
          </p>
        </div>

        {/* Steps */}
        <div className="bg-white rounded-xl border border-gray-100 p-8 mb-8">
          <h2 className="text-2xl font-bold text-primary mb-6">
            {L(locale, "📋 购买流程（分步指南）", "📋 購入の流れ（ステップバイステップ）", "📋 The Buying Process (Step by Step)")}
          </h2>
          <div className="space-y-6">
            {steps.map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-accent font-bold">{item.step}</span>
                </div>
                <div>
                  <h3 className="font-bold text-primary">{item.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Costs */}
        <div className="bg-white rounded-xl border border-gray-100 p-8 mb-8">
          <h2 className="text-2xl font-bold text-primary mb-4">
            {L(locale, "💴 典型费用", "💴 主な費用", "💴 Typical Costs")}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 text-gray-500">{L(locale, "费用项目", "費用項目", "Cost")}</th>
                  <th className="text-left py-2 text-gray-500">{L(locale, "金额", "金額", "Amount")}</th>
                  <th className="text-left py-2 text-gray-500">{L(locale, "备注", "備考", "Notes")}</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr className="border-b">
                  <td className="py-2 font-medium">{L(locale, "房产价格", "物件価格", "Property Price")}</td>
                  <td>¥0 – ¥10,000,000+</td>
                  <td>{L(locale, "很多空き家免费或价格极低", "多くの空き家は無料または格安", "Many akiya are free or very affordable")}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">{L(locale, "仲介手数料", "仲介手数料", "Agent Fee")}</td>
                  <td>{L(locale, "约3% + ¥60,000", "約3% + ¥60,000", "~3% + ¥60,000")}</td>
                  <td>{L(locale, "标准不动产佣金", "標準的な不動産手数料", "Standard real estate commission")}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">{L(locale, "登记税", "登録免許税", "Registration Tax")}</td>
                  <td>{L(locale, "约1-2%", "約1〜2%", "~1-2%")}</td>
                  <td>{L(locale, "产权登记", "不動産登記", "Property registration")}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">{L(locale, "印花税", "印紙税", "Stamp Duty")}</td>
                  <td>¥1,000 – ¥10,000</td>
                  <td>{L(locale, "合同文件", "契約書類", "On contract documents")}</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">{L(locale, "年度固定资产税", "固定資産税（年間）", "Annual Property Tax")}</td>
                  <td>¥10,000 – ¥50,000/{L(locale, "年", "年", "yr")}</td>
                  <td>{L(locale, "农村物件非常低", "地方物件は非常に低い", "Very low for rural properties")}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-xl border border-gray-100 p-8 mb-8">
          <h2 className="text-2xl font-bold text-primary mb-6">
            {L(locale, "❓ 常见问题", "❓ よくある質問", "❓ Frequently Asked Questions")}
          </h2>
          <div className="space-y-4">
            {faqs.map((item) => (
              <details key={item.q} className="group">
                <summary className="cursor-pointer font-semibold text-primary py-2 group-open:text-accent transition">
                  {item.q}
                </summary>
                <p className="text-gray-600 text-sm pb-2 pl-4">{item.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-8">
          <Link
            href="/properties"
            className="inline-block bg-accent text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-600 transition text-lg"
          >
            {L(locale, "立即浏览房产", "物件を見る", "Browse Properties Now")}
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
