import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarDays } from "lucide-react";
import { formatArticleDate, getArticleBySlug, listPublishedArticles } from "@/lib/articles-db";

export const revalidate = 60;

export async function generateStaticParams() {
  const articles = await listPublishedArticles(100);
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt || "Company update from XiaoHongRongPin."
  };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <p className="breadcrumb">News</p>
          <h1>{article.title}</h1>
          <p className="hero-lead">{article.excerpt || "Company update from XiaoHongRongPin."}</p>
          <p className="article-date"><CalendarDays size={18} /> {formatArticleDate(article)}</p>
        </div>
      </section>
      <section className="section section-white">
        <article className="container article-body" dangerouslySetInnerHTML={{ __html: article.content }} />
      </section>
    </main>
  );
}
