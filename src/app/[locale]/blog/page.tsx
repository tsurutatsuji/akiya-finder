import { Link } from "@/i18n/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAllPosts } from "@/lib/blog";
import { L } from "@/lib/locale-utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Blog — AkiyaFinder",
  description:
    "Guides, tips, and insights for buying akiya (vacant houses) in Japan as a foreigner.",
};

export default function BlogPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { lang?: string };
}) {
  const locale = params.locale;
  const allPosts = getAllPosts();
  const langFilter = searchParams.lang;
  const posts = langFilter
    ? allPosts.filter((p) => p.lang === langFilter)
    : allPosts;

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-primary mb-2">
          {L(locale, "博客", "ブログ", "Blog")}
        </h1>
        <p className="text-gray-500 mb-6">
          {L(
            locale,
            "在日本购买房产的指南与见解。",
            "日本で不動産を購入するためのガイドと情報。",
            "Guides and insights for buying property in Japan."
          )}
        </p>

        <div className="flex gap-2 mb-10">
          <Link
            href="/blog"
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
              !langFilter
                ? "bg-accent text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {L(locale, "全部", "すべて", "All")}
          </Link>
          <Link
            href="/blog?lang=en"
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
              langFilter === "en"
                ? "bg-accent text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            English
          </Link>
          <Link
            href="/blog?lang=zh"
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
              langFilter === "zh"
                ? "bg-accent text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            中文
          </Link>
        </div>

        {posts.length === 0 ? (
          <p className="text-gray-400">{L(locale, "即将推出...", "近日公開...", "Coming soon...")}</p>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <article key={post.slug} className="border-b border-gray-100 pb-8">
                <div className="flex items-center gap-3 mb-2">
                  <time className="text-sm text-gray-400">{post.date}</time>
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                    {post.lang === "zh" ? "中文" : "EN"}
                  </span>
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="text-xl font-semibold text-primary hover:text-accent transition mb-1">
                    {post.title}
                  </h2>
                </Link>
                <p className="text-gray-500 text-sm">{post.description}</p>
              </article>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
