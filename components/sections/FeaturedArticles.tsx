import Link from 'next/link';
import { ArrowRight, Clock, User } from 'lucide-react';
import AnimatedSection from '@/components/ui/AnimatedSection';

const articles = [
  {
    slug: 'eloquentia-20-12-voix-12-nations',
    category: 'Éloquence',
    title: 'Eloquentia 2.0 : 12 voix, 12 nations, une seule scène',
    excerpt: 'Comment NEXUS SPECTACLE transforme la parole en acte politique et la diversité en force collective.',
    readTime: '5 min',
    author: 'Équipe NEXUS',
    date: '28 mai 2026',
    color: 'bg-brand-red',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&q=80',
  },
  {
    slug: 'jeunesse-africaine-leadership',
    category: 'Leadership',
    title: 'La jeunesse africaine redéfinit le leadership mondial',
    excerpt: 'Analyse des nouvelles formes d\'influence portées par la génération Z africaine en diaspora.',
    readTime: '7 min',
    author: 'Dr. Kwame Asante',
    date: '22 mai 2026',
    color: 'bg-brand-orange',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
  },
  {
    slug: 'nexus-tech-fellowship',
    category: 'Innovation',
    title: 'Nexus Tech Fellowship : l\'avenir commence ici',
    excerpt: 'Rencontre avec les 20 jeunes innovateurs africains sélectionnés pour le fellowship NEXUS 2026.',
    readTime: '6 min',
    author: 'Sarah Diallo',
    date: '18 mai 2026',
    color: 'bg-navy',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80',
  },
];

export default function FeaturedArticles() {
  return (
    <section className="py-20 bg-white" aria-label="Articles récents NEXUS Média">
      <div className="container-xl">
        <AnimatedSection className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <span className="font-raleway text-brand-red font-semibold text-sm uppercase tracking-widest mb-3 block">
              NEXUS MÉDIA
            </span>
            <h2 className="section-title text-4xl">À la une</h2>
          </div>
          <Link
            href="/media"
            className="group flex items-center gap-2 font-raleway font-semibold text-navy hover:text-brand-red transition-colors"
          >
            Tous les articles
            <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-6">
          {articles.map(({ slug, category, title, excerpt, readTime, author, date, color, image }, i) => (
            <AnimatedSection key={slug} delay={i * 0.1}>
              <Link href={`/media/${slug}`} className="card block overflow-hidden group h-full">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <span className={`absolute top-3 left-3 ${color} text-white text-xs font-raleway font-semibold px-2.5 py-1 rounded-md`}>
                    {category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-montserrat font-bold text-navy text-base leading-snug mb-2 group-hover:text-brand-red transition-colors duration-200">
                    {title}
                  </h3>
                  <p className="font-inter text-[#212121]/65 text-sm leading-relaxed mb-4 line-clamp-2">
                    {excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-[#212121]/50">
                    <span className="flex items-center gap-1">
                      <User size={12} />
                      {author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {readTime}
                    </span>
                  </div>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
