import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatArticleDate, listPublishedArticles } from "@/lib/articles-db";

export const metadata: Metadata = {
  title: "News",
  description: "Company updates and project notes from XiaoHongRongPin."
};

export const revalidate = 60;

export default async function NewsPage() {
  const articles = await listPublishedArticles();

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <p className="breadcrumb">News</p>
          <h1>Company updates</h1>
          <p className="hero-lead">Published updates, project notes, and manufacturing news will appear here after release from the admin dashboard.</p>
        </div>
      </section>
      <section className="section section-light">
        <div className="container">
          {articles.length ? (
            <div className="feature-grid">
              {articles.map((article) => (
                <Link className="feature-card" href={`/news/${article.slug}`} key={article.id}>
                  <p className="eyebrow">{formatArticleDate(article)}</p>
                  <h3>{article.title}</h3>
                  <p>{article.excerpt || "Read the full company update."}</p>
                  <span className="link-arrow">Open article <ArrowUpRight size={16} /></span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="page-card">
              <h3>No published news yet</h3>
              <p>News will be listed here automatically after the team publishes articles in the admin dashboard.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
