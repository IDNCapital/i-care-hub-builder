import { Link } from "react-router-dom";

export interface ArticleCardData {
  slug: string;
  titre: string;
  chapo: string;
  published_at: string | null;
}

export function formatDatePublication(value: string | null): string | null {
  if (!value) return null;
  const d = new Date(value);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export function ArticleCard({ article }: { article: ArticleCardData }) {
  const date = formatDatePublication(article.published_at);

  return (
    <article className="bg-cream rounded-2xl p-6 md:p-8 h-full flex flex-col">
      {date && (
        <p className="font-sans text-[12px] text-[#6B6B6B] mb-3">{date}</p>
      )}
      <h3 className="font-heading font-normal text-xl md:text-2xl text-anthracite leading-snug mb-3 text-balance">
        <Link
          to={`/patients/articles/${article.slug}`}
          className="hover:text-sage transition-colors"
        >
          {article.titre}
        </Link>
      </h3>
      <p className="font-sans text-[15px] text-[#6B6B6B] leading-relaxed">{article.chapo}</p>
    </article>
  );
}