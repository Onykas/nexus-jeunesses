'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, User, ArrowRight, Play, Search, Filter } from 'lucide-react';
import AnimatedSection from '@/components/ui/AnimatedSection';
import Link from 'next/link';

const categories = ['Tous', 'Leadership', 'Innovation', 'Culture', 'Diplomatie', 'Sport'];

const articles = [
  { slug: 'eloquentia-20', category: 'Culture', title: 'Eloquentia 2.0 : 12 voix, 12 nations', excerpt: 'Comment NEXUS SPECTACLE transforme la parole en acte politique et la diversité en force collective.', readTime: '5 min', author: 'Équipe NEXUS', date: '28 mai 2026', image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&q=80', featured: true },
  { slug: 'leadership-africain', category: 'Leadership', title: 'La jeunesse africaine redéfinit le leadership mondial', excerpt: 'Analyse des nouvelles formes d\'influence portées par la génération Z africaine en diaspora.', readTime: '7 min', author: 'Dr. Kwame Asante', date: '22 mai 2026', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80', featured: false },
  { slug: 'nexus-tech-fellowship', category: 'Innovation', title: 'Nexus Tech Fellowship : l\'avenir commence ici', excerpt: 'Rencontre avec les 20 jeunes innovateurs africains sélectionnés pour le fellowship NEXUS 2026.', readTime: '6 min', author: 'Sarah Diallo', date: '18 mai 2026', image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80', featured: false },
  { slug: 'diplomatie-jeunesse', category: 'Diplomatie', title: 'Quand la jeunesse prend les rênes de la diplomatie', excerpt: 'Comment les nouvelles générations transforment les relations internationales africaines.', readTime: '8 min', author: 'Hamid El Fassi', date: '14 mai 2026', image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&q=80', featured: false },
  { slug: 'culture-identite', category: 'Culture', title: 'Culture et identité : la renaissance africaine', excerpt: 'Arts, musique, littérature — comment la créativité africaine conquiert le monde.', readTime: '4 min', author: 'Aminata Kouyaté', date: '10 mai 2026', image: 'https://images.unsplash.com/photo-1493863641943-9b68992a8d07?w=600&q=80', featured: false },
  { slug: 'innovation-sociale', category: 'Innovation', title: 'Innovation sociale : les startups qui changent l\'Afrique', excerpt: 'De Lagos à Casablanca, ces entrepreneurs de moins de 30 ans révolutionnent leurs secteurs.', readTime: '6 min', author: 'Jean-Pierre Mukeba', date: '5 mai 2026', image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&q=80', featured: false },
];

const podcasts = [
  { title: 'NEXUS Talks — Episode 1 : La parole libère', duration: '42 min', guest: 'Amara Diallo', thumbnail: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&q=80' },
  { title: 'NEXUS Talks — Episode 2 : Leadership sans frontières', duration: '38 min', guest: 'Dr. Sara Koné', thumbnail: 'https://images.unsplash.com/photo-1521798552185-ee955b1b91e2?w=400&q=80' },
  { title: 'NEXUS Talks — Episode 3 : Tech & Afrique', duration: '55 min', guest: 'Kofi Mensah', thumbnail: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&q=80' },
];

export default function MediaPage() {
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [search, setSearch] = useState('');

  const filtered = articles.filter((a) => {
    const matchesCat = activeCategory === 'Tous' || a.category === activeCategory;
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const featured = filtered.find((a) => a.featured);
  const rest = filtered.filter((a) => !a.featured);

  return (
    <>
      {/* Hero */}
      <section className="relative bg-navy pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/5 rounded-full blur-3xl" />
        </div>
        <div className="container-xl relative text-white text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="font-raleway text-brand-orange font-semibold text-sm uppercase tracking-widest mb-4 block">NEXUS MÉDIA</span>
            <h1 className="font-montserrat font-black text-5xl md:text-6xl mb-4">
              L'univers éditorial<br />de <span className="text-brand-red">NEXUS</span>
            </h1>
            <p className="font-inter text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
              Nous croyons que la voix des jeunes leaders doit être documentée avec la même rigueur
              que celle des grandes institutions mondiales.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Manifeste */}
      <section className="py-16 bg-gray-50 border-b border-gray-100">
        <div className="container-xl">
          <AnimatedSection className="max-w-3xl mx-auto text-center">
            <h2 className="section-title text-2xl mb-4">Notre ligne éditoriale</h2>
            <div className="font-inter text-[#212121]/70 text-base leading-relaxed space-y-4">
              <p>NEXUS MÉDIA est la plateforme éditoriale indépendante qui donne voix aux jeunes leaders africains en Afrique du Nord. Nous documentons, nous analysons, nous amplifions.</p>
              <p>Notre calendrier éditorial suit le cycle de NEXUS SPECTACLE : 30 jours de montée en puissance, du mystère à l'urgence, jusqu'à l'événement et au-delà.</p>
              <p>Chaque article, chaque vidéo, chaque podcast est produit avec la rigueur journalistique des grandes maisons éditoriales. Parce que la jeunesse africaine mérite mieux que le superficiel.</p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Articles */}
      <section className="py-16 bg-white">
        <div className="container-xl">
          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center justify-between mb-10">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full font-raleway font-semibold text-sm transition-all duration-200 ${
                    activeCategory === cat ? 'bg-navy text-white' : 'bg-gray-100 text-[#212121]/60 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#212121]/40" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm font-inter focus:outline-none focus:border-navy"
              />
            </div>
          </div>

          {/* Featured */}
          {featured && (
            <AnimatedSection className="mb-10">
              <Link href={`/media/${featured.slug}`} className="group grid md:grid-cols-2 gap-0 card overflow-hidden">
                <div className="relative h-64 md:h-auto overflow-hidden">
                  <img src={featured.image} alt={featured.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  <span className="absolute top-4 left-4 badge bg-brand-red text-white text-xs">À la une</span>
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <span className="badge bg-brand-red/10 text-brand-red text-xs mb-3">{featured.category}</span>
                  <h3 className="font-montserrat font-bold text-navy text-2xl mb-3 group-hover:text-brand-red transition-colors">{featured.title}</h3>
                  <p className="font-inter text-[#212121]/65 leading-relaxed mb-4">{featured.excerpt}</p>
                  <div className="flex items-center gap-4 text-xs text-[#212121]/50">
                    <span className="flex items-center gap-1"><User size={12} />{featured.author}</span>
                    <span className="flex items-center gap-1"><Clock size={12} />{featured.readTime}</span>
                    <span>{featured.date}</span>
                  </div>
                </div>
              </Link>
            </AnimatedSection>
          )}

          {/* Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map(({ slug, category, title, excerpt, readTime, author, date, image }, i) => (
              <AnimatedSection key={slug} delay={i * 0.08}>
                <Link href={`/media/${slug}`} className="card block overflow-hidden group h-full">
                  <div className="relative h-44 overflow-hidden">
                    <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <span className="absolute top-3 left-3 badge bg-navy text-white text-xs">{category}</span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-montserrat font-bold text-navy text-sm leading-snug mb-2 group-hover:text-brand-red transition-colors">{title}</h3>
                    <p className="font-inter text-[#212121]/60 text-xs leading-relaxed mb-3 line-clamp-2">{excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-[#212121]/40">
                      <span className="flex items-center gap-1"><User size={10} />{author}</span>
                      <span className="flex items-center gap-1"><Clock size={10} />{readTime}</span>
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Podcasts */}
      <section className="py-16 bg-gray-50">
        <div className="container-xl">
          <AnimatedSection className="mb-10">
            <h2 className="section-title text-2xl mb-2">NEXUS Talks — Podcasts</h2>
            <p className="section-subtitle">Conversations profondes avec les acteurs du changement.</p>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6">
            {podcasts.map(({ title, duration, guest, thumbnail }, i) => (
              <AnimatedSection key={title} delay={i * 0.1}>
                <div className="card overflow-hidden group cursor-pointer">
                  <div className="relative h-40 overflow-hidden">
                    <img src={thumbnail} alt={title} className="w-full h-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-navy/50 flex items-center justify-center">
                      <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 group-hover:bg-brand-red/80 transition-colors duration-300">
                        <Play size={20} className="text-white ml-0.5" fill="white" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="font-raleway font-semibold text-navy text-sm mb-1">{title}</div>
                    <div className="flex items-center justify-between text-xs text-[#212121]/50">
                      <span>{guest}</span>
                      <span>{duration}</span>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-navy text-white">
        <div className="container-xl">
          <AnimatedSection className="max-w-xl mx-auto text-center">
            <h2 className="font-montserrat font-bold text-3xl mb-3">Restez informé</h2>
            <p className="font-inter text-white/70 mb-8">Recevez les articles NEXUS MÉDIA et les mises à jour de l'événement directement dans votre boîte email.</p>
            <form
              className="flex gap-3 max-w-sm mx-auto"
              onSubmit={(e) => { e.preventDefault(); }}
            >
              <input type="email" placeholder="votre@email.com" className="flex-1 bg-white/10 border border-white/20 rounded-md px-4 py-3 text-white placeholder-white/40 text-sm focus:outline-none focus:border-brand-red transition-colors" />
              <button type="submit" className="bg-brand-red text-white px-6 py-3 rounded-md font-raleway font-semibold text-sm hover:bg-red-700 transition-colors">S'abonner</button>
            </form>
            <p className="font-inter text-white/30 text-xs mt-3">Pas de spam. Désabonnement en un clic.</p>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
