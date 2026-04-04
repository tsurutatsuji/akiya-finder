import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "@/i18n/navigation";
import { L } from "@/lib/locale-utils";
import ScrollFadeIn from "@/components/ScrollFadeIn";

export default function HowItWorks({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale;

  return (
    <>
      <Header />

      {/* Hero — Concept */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-5xl mx-auto px-8 md:px-16 lg:px-24">
          <ScrollFadeIn>
            <p className="text-sm tracking-[0.3em] uppercase text-gray-400 mb-6">Concept</p>
          </ScrollFadeIn>
          <ScrollFadeIn delay={200}>
            <h1 className="text-2xl md:text-4xl font-light text-gray-900 leading-relaxed mb-10">
              {L(locale,
                "在日本拥有一个家，\n比您想象的更简单。",
                "空き家バンクの情報を、\n世界に届ける。",
                "Buying property in Japan\nis easier than you think."
              )}
            </h1>
          </ScrollFadeIn>
          <ScrollFadeIn delay={400}>
            <div className="text-base md:text-lg text-gray-500 leading-loose whitespace-pre-line max-w-2xl">
              {L(locale,
                "日本不限制外国人购买不动产。\n持旅游签证即可购买，无需永住权。\n\nAKIYA将日本全国的空置房信息翻译为中文，\n帮助您轻松找到理想的房产。",
                "全国の自治体が運営する空き家バンクの物件情報を、\n中国語・英語・日本語の3言語に翻訳して掲載しています。\n\n海外からの移住希望者が、\n母国語で物件情報にアクセスできる環境を提供します。",
                "Japan places no restrictions on foreign property ownership.\nYou can buy on a tourist visa — no residency required.\n\nAkiyaFinder translates thousands of vacant house listings\ninto English, making Japanese property accessible to everyone."
              )}
            </div>
          </ScrollFadeIn>
        </div>
      </section>

      {/* Flow — Steps */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-8 md:px-16 lg:px-24">
          <ScrollFadeIn>
            <p className="text-sm tracking-[0.3em] uppercase text-gray-400 mb-4">Flow</p>
            <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-4">
              {L(locale,
                "购买流程",
                "仕組み",
                "How it works"
              )}
            </h2>
            <p className="text-gray-500 mb-14 max-w-xl">
              {L(locale,
                "只需3步，即可开始您的日本购房之旅。",
                "3つのステップで、海外の方に空き家情報をお届けします。",
                "Three simple steps to start your journey to owning property in Japan."
              )}
            </p>
          </ScrollFadeIn>

          <div className="space-y-12">
            <ScrollFadeIn delay={200}>
              <div className="flex gap-6">
                <div className="text-3xl font-light text-gray-300 shrink-0 w-16">01</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {L(locale,
                      "搜索房源",
                      "自治体の空き家バンク情報を収集",
                      "Search"
                    )}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {L(locale,
                      "在AKIYA上浏览4,335+套房产。按价格、地区、物件类型筛选，所有信息均以中文显示。",
                      "全国の自治体が公開している空き家バンクの物件情報を定期的に収集しています。",
                      "Browse 4,335+ properties on AkiyaFinder. Filter by price, location, and property type. Everything in English."
                    )}
                  </p>
                </div>
              </div>
            </ScrollFadeIn>

            <ScrollFadeIn delay={400}>
              <div className="flex gap-6">
                <div className="text-3xl font-light text-gray-300 shrink-0 w-16">02</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {L(locale,
                      "查看详情",
                      "3言語に翻訳して掲載",
                      "Explore"
                    )}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {L(locale,
                      "查看物件照片、地图、街景视图。了解价格、面积等详细信息。全部中文。",
                      "収集した物件情報を中国語・英語・日本語の3言語に翻訳し、写真・地図・詳細情報とともに掲載しています。",
                      "View photos, maps, street view, pricing, and property details. All translated and ready to explore."
                    )}
                  </p>
                </div>
              </div>
            </ScrollFadeIn>

            <ScrollFadeIn delay={600}>
              <div className="flex gap-6">
                <div className="text-3xl font-light text-gray-300 shrink-0 w-16">03</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {L(locale,
                      "联系不动产公司",
                      "海外の方からの問い合わせを現地の不動産会社にお繋ぎ",
                      "Connect"
                    )}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {L(locale,
                      "找到心仪的房源后，我们为您介绍当地的不动产公司。后续由专业人士全程协助。",
                      "海外からの問い合わせを、物件所在地の不動産会社にお繋ぎします。内見・交渉・契約手続きをサポートします。",
                      "When you find a property you like, we introduce you to a local real estate agent who handles viewings, negotiations, and contracts."
                    )}
                  </p>
                </div>
              </div>
            </ScrollFadeIn>
          </div>
        </div>
      </section>

      {/* Cost — 中国語・英語のみ表示 / 日本語は自治体向けセクション */}
      {locale === "ja" ? (
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-8 md:px-16 lg:px-24">
            <ScrollFadeIn>
              <p className="text-sm tracking-[0.3em] uppercase text-gray-400 mb-4">For Municipalities</p>
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-4">
                自治体の方へ
              </h2>
              <p className="text-gray-500 mb-14 max-w-xl">
                AKIYAへの掲載は完全無料です。海外からの移住希望者に、御自治体の空き家情報をお届けします。
              </p>
            </ScrollFadeIn>

            <div className="space-y-12">
              <ScrollFadeIn delay={200}>
                <div className="flex gap-6">
                  <div className="text-3xl font-light text-gray-300 shrink-0 w-16">01</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">掲載は完全無料</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      御自治体の空き家バンク公開情報を翻訳・掲載します。費用は一切かかりません。
                    </p>
                  </div>
                </div>
              </ScrollFadeIn>

              <ScrollFadeIn delay={400}>
                <div className="flex gap-6">
                  <div className="text-3xl font-light text-gray-300 shrink-0 w-16">02</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">公式情報を翻訳・掲載</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      御自治体が公開されている空き家バンクの情報を、中国語・英語・日本語の3言語に翻訳して掲載します。
                    </p>
                  </div>
                </div>
              </ScrollFadeIn>

              <ScrollFadeIn delay={600}>
                <div className="flex gap-6">
                  <div className="text-3xl font-light text-gray-300 shrink-0 w-16">03</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">問い合わせを窓口にお繋ぎ</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      海外からの問い合わせを、御自治体の担当窓口または現地の不動産会社にお繋ぎします。
                    </p>
                  </div>
                </div>
              </ScrollFadeIn>

              <ScrollFadeIn delay={800}>
                <div className="flex gap-6">
                  <div className="text-3xl font-light text-gray-300 shrink-0 w-16">04</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">リンク掲載のお願い</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      御自治体のWebサイトにAKIYAへのリンクを掲載いただける場合は、お気軽にお知らせください。
                    </p>
                  </div>
                </div>
              </ScrollFadeIn>
            </div>
          </div>
        </section>
      ) : (
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-8 md:px-16 lg:px-24">
            <ScrollFadeIn>
              <p className="text-sm tracking-[0.3em] uppercase text-gray-400 mb-4">Cost</p>
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-14">
                {L(locale,
                  "费用一览",
                  "費用一覧",
                  "Cost breakdown"
                )}
              </h2>
            </ScrollFadeIn>

            <ScrollFadeIn delay={200}>
              <div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 text-gray-400 font-normal">
                        {L(locale, "费用项目", "費用項目", "Item")}
                      </th>
                      <th className="text-left py-3 text-gray-400 font-normal">
                        {L(locale, "金额", "金額", "Amount")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    <tr className="border-b border-gray-100">
                      <td className="py-3">
                        {L(locale, "物件价格", "物件価格", "Property price")}
                      </td>
                      <td className="py-3">
                        {L(locale, "¥0〜", "¥0〜", "¥0+")}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3">
                        {L(locale, "中介费", "仲介手数料", "Agent fee")}
                      </td>
                      <td className="py-3">
                        {L(locale, "约3% + 6万日元", "約3% + ¥60,000", "~3% + ¥60,000")}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3">
                        {L(locale, "登记税", "登録免許税", "Registration tax")}
                      </td>
                      <td className="py-3">
                        {L(locale, "约1-2%", "約1〜2%", "~1-2%")}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3">
                        {L(locale, "固定资产税", "固定資産税", "Annual property tax")}
                      </td>
                      <td className="py-3">
                        {L(locale, "每年1〜5万日元", "年間¥10,000〜¥50,000", "¥10,000–¥50,000/yr")}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </ScrollFadeIn>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-8 md:px-16 lg:px-24">
          <ScrollFadeIn>
            <p className="text-sm tracking-[0.3em] uppercase text-gray-400 mb-4">FAQ</p>
            <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-14">
              {L(locale,
                "常见问题",
                "よくある質問",
                "Frequently asked questions"
              )}
            </h2>
          </ScrollFadeIn>

          <div className="space-y-6">
            {locale === "ja" ? (
              /* 日本語 — 自治体・日本人向けFAQ */
              <>
                <ScrollFadeIn delay={200}>
                  <details className="group">
                    <summary className="cursor-pointer font-semibold text-gray-900 py-3 border-b border-gray-200 group-open:text-accent transition">
                      空き家バンクとは？
                    </summary>
                    <p className="text-gray-500 text-sm leading-relaxed py-4 pl-1">
                      空き家バンクとは、各自治体が運営する空き家の情報提供制度です。
                      空き家の所有者と、移住・定住を希望する方をマッチングすることを目的としています。
                      AKIYAは、この空き家バンクの情報を3言語に翻訳し、海外からもアクセスできるようにしています。
                    </p>
                  </details>
                </ScrollFadeIn>

                <ScrollFadeIn delay={300}>
                  <details className="group">
                    <summary className="cursor-pointer font-semibold text-gray-900 py-3 border-b border-gray-200 group-open:text-accent transition">
                      掲載されている情報は正確ですか？
                    </summary>
                    <p className="text-gray-500 text-sm leading-relaxed py-4 pl-1">
                      各自治体の空き家バンクに掲載されている公開情報を元に、翻訳・掲載しています。
                      物件の最新状況（売約済み・価格変更等）については、各自治体の空き家バンクまたは担当不動産会社にご確認ください。
                    </p>
                  </details>
                </ScrollFadeIn>

                <ScrollFadeIn delay={400}>
                  <details className="group">
                    <summary className="cursor-pointer font-semibold text-gray-900 py-3 border-b border-gray-200 group-open:text-accent transition">
                      費用はかかりますか？
                    </summary>
                    <p className="text-gray-500 text-sm leading-relaxed py-4 pl-1">
                      AKIYAの利用・閲覧は完全無料です。
                      自治体様の掲載も無料です。
                      実際の物件購入時には、仲介手数料・登記費用等が別途発生します。
                    </p>
                  </details>
                </ScrollFadeIn>

                <ScrollFadeIn delay={500}>
                  <details className="group">
                    <summary className="cursor-pointer font-semibold text-gray-900 py-3 border-b border-gray-200 group-open:text-accent transition">
                      自治体として掲載を希望する場合は？
                    </summary>
                    <p className="text-gray-500 text-sm leading-relaxed py-4 pl-1">
                      お問い合わせフォームからご連絡ください。
                      御自治体の空き家バンク情報を翻訳・掲載いたします。
                      また、御自治体のWebサイトにAKIYAへのリンクを掲載いただける場合も、お気軽にご相談ください。
                    </p>
                  </details>
                </ScrollFadeIn>
              </>
            ) : locale === "zh" ? (
              /* 中国語 — 中国人バイヤー向けFAQ */
              <>
                <ScrollFadeIn delay={200}>
                  <details className="group">
                    <summary className="cursor-pointer font-semibold text-gray-900 py-3 border-b border-gray-200 group-open:text-accent transition">
                      外国人真的能在日本买房吗？
                    </summary>
                    <p className="text-gray-500 text-sm leading-relaxed py-4 pl-1">
                      能。日本是世界上少数对外国人购房没有任何限制的国家之一。
                      无需签证、无需居留权、无需日本国籍。与日本人享有完全相同的产权。
                    </p>
                  </details>
                </ScrollFadeIn>

                <ScrollFadeIn delay={300}>
                  <details className="group">
                    <summary className="cursor-pointer font-semibold text-gray-900 py-3 border-b border-gray-200 group-open:text-accent transition">
                      需要签证吗？
                    </summary>
                    <p className="text-gray-500 text-sm leading-relaxed py-4 pl-1">
                      不需要。持旅游签证即可购买不动产。购房本身不会获得居留签证，但拥有房产可以作为申请经营管理签证的参考条件之一。
                    </p>
                  </details>
                </ScrollFadeIn>

                <ScrollFadeIn delay={400}>
                  <details className="group">
                    <summary className="cursor-pointer font-semibold text-gray-900 py-3 border-b border-gray-200 group-open:text-accent transition">
                      不会日语怎么办？
                    </summary>
                    <p className="text-gray-500 text-sm leading-relaxed py-4 pl-1">
                      本站所有物件信息均已翻译为中文。
                      当您需要联系不动产公司时，我们会为您介绍能够对应中文的不动产公司或提供翻译支持。
                    </p>
                  </details>
                </ScrollFadeIn>

                <ScrollFadeIn delay={500}>
                  <details className="group">
                    <summary className="cursor-pointer font-semibold text-gray-900 py-3 border-b border-gray-200 group-open:text-accent transition">
                      有免费的房子吗？
                    </summary>
                    <p className="text-gray-500 text-sm leading-relaxed py-4 pl-1">
                      有。日本部分自治体提供0日元的空置房。
                      这些房屋通常位于人口减少的农村地区，需要一定的翻新费用，但房屋本身确实免费。
                    </p>
                  </details>
                </ScrollFadeIn>

                <ScrollFadeIn delay={600}>
                  <details className="group">
                    <summary className="cursor-pointer font-semibold text-gray-900 py-3 border-b border-gray-200 group-open:text-accent transition">
                      需要去日本吗？
                    </summary>
                    <p className="text-gray-500 text-sm leading-relaxed py-4 pl-1">
                      很多情况下可以通过委托书远程完成购买。
                      但建议至少去一次实地看房，确认房屋和周边环境的实际状况。
                    </p>
                  </details>
                </ScrollFadeIn>
              </>
            ) : (
              /* 英語 — 英語圏バイヤー向けFAQ */
              <>
                <ScrollFadeIn delay={200}>
                  <details className="group">
                    <summary className="cursor-pointer font-semibold text-gray-900 py-3 border-b border-gray-200 group-open:text-accent transition">
                      Can foreigners really buy property in Japan?
                    </summary>
                    <p className="text-gray-500 text-sm leading-relaxed py-4 pl-1">
                      Yes. Japan places no restrictions on foreign property ownership.
                      No visa, no residency, no citizenship required. You have the same property rights as Japanese citizens.
                    </p>
                  </details>
                </ScrollFadeIn>

                <ScrollFadeIn delay={300}>
                  <details className="group">
                    <summary className="cursor-pointer font-semibold text-gray-900 py-3 border-b border-gray-200 group-open:text-accent transition">
                      Do I need a visa to buy?
                    </summary>
                    <p className="text-gray-500 text-sm leading-relaxed py-4 pl-1">
                      No. You can purchase property on a tourist visa. Note that buying property alone does not grant you a residence visa,
                      but property ownership can support a business manager visa application.
                    </p>
                  </details>
                </ScrollFadeIn>

                <ScrollFadeIn delay={400}>
                  <details className="group">
                    <summary className="cursor-pointer font-semibold text-gray-900 py-3 border-b border-gray-200 group-open:text-accent transition">
                      Can I buy without speaking Japanese?
                    </summary>
                    <p className="text-gray-500 text-sm leading-relaxed py-4 pl-1">
                      Yes. All listings on AkiyaFinder are in English. When you're ready to proceed,
                      we connect you with a local real estate agent who can assist with English communication or arrange translation.
                    </p>
                  </details>
                </ScrollFadeIn>

                <ScrollFadeIn delay={500}>
                  <details className="group">
                    <summary className="cursor-pointer font-semibold text-gray-900 py-3 border-b border-gray-200 group-open:text-accent transition">
                      Are there really free houses?
                    </summary>
                    <p className="text-gray-500 text-sm leading-relaxed py-4 pl-1">
                      Yes. Some municipalities offer houses for ¥0. These are typically in rural areas with declining populations
                      and may need renovation, but the house itself is genuinely free.
                    </p>
                  </details>
                </ScrollFadeIn>

                <ScrollFadeIn delay={600}>
                  <details className="group">
                    <summary className="cursor-pointer font-semibold text-gray-900 py-3 border-b border-gray-200 group-open:text-accent transition">
                      Do I need to visit Japan?
                    </summary>
                    <p className="text-gray-500 text-sm leading-relaxed py-4 pl-1">
                      Many purchases can be completed remotely using a power of attorney.
                      However, we recommend visiting at least once to see the property and surrounding area in person.
                    </p>
                  </details>
                </ScrollFadeIn>
              </>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-8 text-center">
          <ScrollFadeIn>
            <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-6">
              {L(locale,
                "开始探索日本的空置房",
                "物件を探してみませんか",
                "Ready to find your property in Japan?"
              )}
            </h2>
            <Link
              href="/properties"
              className="inline-block text-gray-600 hover:text-gray-900 text-sm tracking-[0.2em] uppercase border-b border-gray-400 hover:border-gray-900 pb-1 transition"
            >
              {L(locale, "浏览所有房源 →", "物件一覧を見る →", "Browse all properties →")}
            </Link>
          </ScrollFadeIn>
        </div>
      </section>

      <Footer />
    </>
  );
}
