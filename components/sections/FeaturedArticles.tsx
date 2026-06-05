import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/db';
import AnimatedSection from '@/components/ui/AnimatedSection';

export default async function FeaturedArticles() {
  let articles: {
    id: string; titre: string; slug: string; categorie: string;
    contenu: string; auteur: string; imageUrl: string | null; publishedAt: Date | null;
  }[] = [];

  try {
    articles = await prisma.article.findMany({
      where: { publie: true },
      orderBy: { publishedAt: 'desc' },
      take: 3,
    });
  } catch { /* DB non disponible — on affiche le placeholder */ }

  return (
    <section className="py-20 bg-white" aria-label="Articles récents NEXUS Média">
      <div className="container-xl">
        <AnimatedSection className="text-center mb-12">
          <span className="font-raleway text-brand-red font-semibold text-sm uppercase tracking-widest mb-3 block">
            NEXUS MÉDIA
          </span>
          <h2 className="section-title text-4xl">À la une</h2>
        </AnimatedSection>

        {articles.length === 0 ? (
          <AnimatedSection>
            <div className="max-w-md mx-auto border border-gray-200 rounded-2xl p-10 text-center bg-gray-50">
              <p className="font-inter text-[#212121]/55 text-base">
                Le premier article sera publié prochainement.
              </p>
            </div>
          </AnimatedSection>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, i) => (
              <AnimatedSection key={article.id} delay={i * 0.1}>
                <article className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                  {article.imageUrl ? (
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={article.imageUrl}
                        alt={article.titre}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-navy/5 to-brand-red/10 flex items-center justify-center">
                      <span className="text-4xl">📰</span>
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <span className="inline-block font-raleway text-brand-orange text-xs font-semibold uppercase tracking-widest mb-3">
                      {article.categorie}
                    </span>
                    <h3 className="font-montserrat font-bold text-lg text-[#212121] mb-3 line-clamp-2 leading-snug">
                      {article.titre}
                    </h3>
                    <p className="font-inter text-[#212121]/60 text-sm leading-relaxed line-clamp-3 flex-1">
                      {article.contenu.replace(/<[^>]*>/g, '').slice(0, 150)}…
                    </p>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <span className="font-inter text-xs text-[#212121]/40">{article.auteur}</span>
                      {article.publishedAt && (
                        <span className="font-inter text-xs text-[#212121]/40">
                          {new Date(article.publishedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              </AnimatedSection>
            ))}
          </div>
        )}

        {articles.length > 0 && (
          <AnimatedSection className="text-center mt-10">
            <Link
              href="/media"
              className="inline-flex items-center gap-2 font-raleway font-semibold text-brand-red hover:text-brand-red/80 transition text-sm"
            >
              Voir tous les articles →
            </Link>
          </AnimatedSection>
        )}
      </div>
    </section>
  );
}
