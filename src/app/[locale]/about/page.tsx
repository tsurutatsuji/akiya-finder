import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "@/i18n/navigation";
import { L } from "@/lib/locale-utils";
import ScrollFadeIn from "@/components/ScrollFadeIn";

export default function AboutPage({
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
                "跨越语言的壁垒，\n为每一栋空置房注入新的生命。",
                "言語の壁を超え、\nすべての空き家に、新しい命を。",
                "Beyond the language barrier,\nbringing new life to every vacant house."
              )}
            </h1>
          </ScrollFadeIn>
          <ScrollFadeIn delay={400}>
            <div className="text-base md:text-lg text-gray-500 leading-loose whitespace-pre-line max-w-2xl">
              {L(locale,
                "AKIYA（日本空房网）は、日本全国の空き家バンク物件を\n11种语言に翻訳し、\n世界中の方に日本の空き家情報を届けるサイトです。\n\n私たちは、移住・定住を希望される方が\n母国語で安心して物件情報にアクセスできる\n環境を提供いたします。",
                "AKIYAは、日本全国の空き家バンク物件を\n11言語に翻訳し、\n世界中の方に日本の空き家情報を届けるサイトです。\n\n私たちは、移住・定住を希望される方が\n母国語で安心して物件情報にアクセスできる\n環境を提供いたします。",
                "AKIYA (AkiyaFinder) translates vacant house listings\nfrom Japan's akiya banks into Chinese, English, and Japanese,\nmaking property information accessible to people worldwide.\n\nWe provide an environment where those hoping to relocate\ncan confidently explore listings in their own language."
              )}
            </div>
          </ScrollFadeIn>
        </div>
      </section>

      {/* Service — 3 Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-8 md:px-16 lg:px-24">
          <ScrollFadeIn>
            <p className="text-sm tracking-[0.3em] uppercase text-gray-400 mb-4">Service</p>
            <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-4">
              {L(locale,
                "日本空房网能为您做的",
                "AKIYAだからできること",
                "What AkiyaFinder offers"
              )}
            </h2>
            <p className="text-gray-500 mb-14 max-w-xl">
              {L(locale,
                "消除信息壁垒，让每个人都能找到日本的理想之家。",
                "情報格差をなくし、誰もが日本の理想の家を見つけられるように。",
                "Removing information barriers so everyone can find their ideal home in Japan."
              )}
            </p>
          </ScrollFadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollFadeIn delay={200}>
              <div className="bg-white p-8 rounded-2xl border border-gray-100">
                <p className="text-4xl font-light text-accent mb-4">01</p>
                <h3 className="font-semibold text-gray-900 mb-3">
                  {L(locale, "11种语言，全部房源", "11言語で、すべての物件を", "Every listing, in 11 languages")}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {L(locale,
                    "11种语言完全对应。物件详情、照片、地图信息——全部可用母语查看。",
                    "11言語に完全対応。物件の詳細、写真、地図情報まで、すべて母国語でご確認いただけます。",
                    "Full support for Chinese, English, and Japanese. Property details, photos, and maps — all in your language."
                  )}
                </p>
              </div>
            </ScrollFadeIn>

            <ScrollFadeIn delay={400}>
              <div className="bg-white p-8 rounded-2xl border border-gray-100">
                <p className="text-4xl font-light text-accent mb-4">02</p>
                <h3 className="font-semibold text-gray-900 mb-3">
                  {L(locale, "自治体官方数据", "自治体の公式情報を、そのまま", "Official municipal data")}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {L(locale,
                    "翻译并展示日本全国自治体运营的空置房银行公开信息。来自可靠来源的准确数据。",
                    "全国の自治体が運営する空き家バンクの公開情報を翻訳・掲載。信頼できる情報源からの正確なデータです。",
                    "We translate and present public listings from municipal akiya banks across Japan. Accurate data from trusted sources."
                  )}
                </p>
              </div>
            </ScrollFadeIn>

            <ScrollFadeIn delay={600}>
              <div className="bg-white p-8 rounded-2xl border border-gray-100">
                <p className="text-4xl font-light text-accent mb-4">03</p>
                <h3 className="font-semibold text-gray-900 mb-3">
                  {L(locale, "全国47都道府县", "全国47都道府県", "47 prefectures, nationwide")}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {L(locale,
                    "从北海道到冲绳，覆盖日本全国4,375+套空置房信息。每日更新，为您提供最新房源。",
                    "北海道から沖縄まで、4,375件以上の空き家情報を網羅。定期的に更新し、最新の物件情報をお届けします。",
                    "From Hokkaido to Okinawa, covering 4,375+ vacant houses across all of Japan. Updated regularly with the latest listings."
                  )}
                </p>
              </div>
            </ScrollFadeIn>
          </div>
        </div>
      </section>

      {/* Company */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-8 md:px-16 lg:px-24">
          <ScrollFadeIn>
            <p className="text-sm tracking-[0.3em] uppercase text-gray-400 mb-4">Company</p>
            <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-10">
              {L(locale, "运营信息", "運営情報", "About the operator")}
            </h2>
          </ScrollFadeIn>

          <ScrollFadeIn delay={200}>
            <div>
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-gray-50">
                    <td className="py-3 text-gray-400 w-32">{L(locale, "站点名称", "サイト名", "Site name")}</td>
                    <td className="py-3 text-gray-800">{L(locale, "日本空房网（AKIYA）", "AKIYA", "AkiyaFinder")}</td>
                  </tr>
                  <tr className="border-b border-gray-50">
                    <td className="py-3 text-gray-400">{L(locale, "运营者", "運営者", "Operator")}</td>
                    <td className="py-3 text-gray-800">{L(locale, "鹤 竜治（Tatsuji Tsuru）", "鶴 竜治（つる たつじ）", "Tatsuji Tsuru")}</td>
                  </tr>
                  <tr className="border-b border-gray-50">
                    <td className="py-3 text-gray-400">{L(locale, "联系方式", "連絡先", "Contact")}</td>
                    <td className="py-3 text-gray-800">helongzhi57@gmail.com</td>
                  </tr>
                  <tr className="border-b border-gray-50">
                    <td className="py-3 text-gray-400">URL</td>
                    <td className="py-3 text-gray-800">https://akiyafinder.homes</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-gray-400">{L(locale, "对应语言", "対応言語", "Languages")}</td>
                    <td className="py-3 text-gray-800">{L(locale, "11种语言", "11言語", "11 Languages")}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </ScrollFadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-8 text-center">
          <ScrollFadeIn>
            <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-6">
              {L(locale, "开始探索日本的空置房", "日本の空き家を探してみませんか", "Ready to explore Japan's vacant houses?")}
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
