import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { L } from "@/lib/locale-utils";
import ScrollFadeIn from "@/components/ScrollFadeIn";

export default function NewsPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale;

  const news = [
    {
      date: "2026.04.03",
      category: L(locale, "公告", "お知らせ", "News"),
      title: L(locale,
        "网站正式上线",
        "サイトを公開しました",
        "Website officially launched"
      ),
    },
    {
      date: "2026.04.03",
      category: L(locale, "公告", "お知らせ", "News"),
      title: L(locale,
        "已收录全国47个都道府县共4,335套房源",
        "全国47都道府県 4,335件の物件を掲載しました",
        "4,335 properties listed across all 47 prefectures"
      ),
    },
    {
      date: "2026.04.03",
      category: L(locale, "公告", "お知らせ", "News"),
      title: L(locale,
        "支持中文、英文、日文三种语言",
        "11言語に対応しました",
        "Now available in Chinese, English, and Japanese"
      ),
    },
  ];

  return (
    <>
      <Header />

      <section className="py-24 md:py-32 bg-white min-h-[60vh]">
        <div className="max-w-5xl mx-auto px-8 md:px-16 lg:px-24">
          <ScrollFadeIn>
            <p className="text-sm tracking-[0.3em] uppercase text-gray-400 mb-6">News</p>
            <h1 className="text-2xl md:text-4xl font-light text-gray-900 mb-14">
              {L(locale, "公告", "お知らせ", "News")}
            </h1>
          </ScrollFadeIn>

          <div className="space-y-0">
            {news.map((item, i) => (
              <ScrollFadeIn key={i} delay={i * 100}>
                <div className="py-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
                  <span className="text-sm text-gray-400 shrink-0 w-28">{item.date}</span>
                  <span className="text-xs tracking-[0.1em] uppercase text-accent border border-accent/20 px-2 py-0.5 rounded shrink-0 w-fit">
                    {item.category}
                  </span>
                  <span className="text-gray-800 text-sm md:text-base">
                    {item.title}
                  </span>
                </div>
              </ScrollFadeIn>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
