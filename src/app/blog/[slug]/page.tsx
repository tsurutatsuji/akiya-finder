import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) return { title: "Not Found" };
  return {
    title: `${post.title} — AkiyaFinder`,
    description: post.description,
  };
}

function renderMarkdown(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold text-primary mt-8 mb-3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-primary mt-10 mb-4">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-primary mt-10 mb-4">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-accent hover:underline" target="_blank" rel="noopener">$1</a>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-gray-600">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 list-decimal text-gray-600">$2</li>')
    .replace(/^(?!<[hl]|<li)(.+)$/gm, '<p class="text-gray-600 leading-relaxed mb-4">$1</p>')
    .replace(/(<li.*<\/li>\n?)+/g, '<ul class="mb-4 space-y-1">$&</ul>');
}

export default function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <>
      <Header />
      <article className="max-w-3xl mx-auto px-4 py-16">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <time className="text-sm text-gray-400">{post.date}</time>
            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
              {post.lang === "zh" ? "中文" : "EN"}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-primary mb-3">{post.title}</h1>
          <p className="text-gray-500">{post.description}</p>
        </div>

        <div
          className="prose prose-gray max-w-none"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
        />

        <div className="mt-12 p-6 bg-accent/5 border border-accent/20 rounded-lg text-center">
          <h3 className="font-semibold text-primary mb-2">
            Ready to find your akiya?
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            Browse our curated listings or get in touch for a free consultation.
          </p>
          <a
            href="/contact"
            className="inline-block bg-accent text-white px-6 py-2.5 rounded-lg font-medium hover:bg-red-600 transition"
          >
            Get Started — Free
          </a>
        </div>
      </article>
      <Footer />
    </>
  );
}
