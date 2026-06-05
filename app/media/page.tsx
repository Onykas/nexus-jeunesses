'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import AnimatedSection from '@/components/ui/AnimatedSection';

interface Article {
  id: string; titre: string; slug: string; categorie: string;
  contenu: string; auteur: string; imageUrl: string | null; publishedAt: string | null;
}
interface Video {
  id: string; titre: string; url: string; description: string | null; categorie: string; createdAt: string;
}

function youtubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

export default function MediaPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/articles').then(r => r.json()).catch(() => []),
      fetch('/api/videos').then(r => r.json()).catch(() => []),
    ]).then(([arts, vids]) => {
      setArticles(Array.isArray(arts) ? arts : []);
      setVideos(Array.isArray(vids) ? vids : []);
      setLoading(false);
    });
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="relative bg-navy pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/5 rounded-full blur-3xl" />
        </div>
        <div className="container-xl relative text-white text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="font-raleway text-brand-orange font-semibold text-sm uppercase tracking-widest mb-4 block">
              NEXUS MÉDIA
            </span>
            <h1 className="font-montserrat font-black text-5xl md:text-6xl mb-4">
              L'univers éditorial<br />de <span className="text-brand-red">NEXUS</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Manifeste */}
      <section className="py-20 bg-white">
        <div className="container-xl">
          <AnimatedSection className="max-w-3xl mx-auto text-center">
            <div className="font-inter text-[#212121]/70 text-lg leading-relaxed space-y-6">
              <p>
                Nous croyons que la voix des jeunes leaders doit être documentée avec rigueur
                et excellence. Parce que ce qui n'est pas documenté finit par disparaître.
              </p>
              <p>
                NEXUS Média donne la voix aux jeunes leaders résidents au Maroc afin de positionner
                le Maroc comme un carrefour des jeunes leaders.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Articles */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="container-xl">
          <AnimatedSection className="text-center mb-10">
            <h2 className="section-title text-2xl mb-2">Articles</h2>
          </AnimatedSection>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-2 border-brand-red border-t-transparent rounded-full animate-spin" />
            </div>
          ) : articles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                <span className="text-2xl">📰</span>
              </div>
              <p className="font-inter text-[#212121]/50 text-sm">Bientôt disponible</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article, i) => (
                <AnimatedSection key={article.id} delay={i * 0.08}>
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
        </div>
      </section>

      {/* Vidéos */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="container-xl">
          <AnimatedSection className="text-center mb-10">
            <h2 className="section-title text-2xl mb-2">Vidéos & Podcasts</h2>
          </AnimatedSection>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-2 border-brand-red border-t-transparent rounded-full animate-spin" />
            </div>
          ) : videos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                <span className="text-2xl">🎙️</span>
              </div>
              <p className="font-inter text-[#212121]/50 text-sm">Bientôt disponible</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {videos.map((video, i) => {
                const ytId = youtubeId(video.url);
                return (
                  <AnimatedSection key={video.id} delay={i * 0.08}>
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="relative h-48 bg-gray-100 overflow-hidden">
                        {ytId ? (
                          <>
                            <Image
                              src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
                              alt={video.titre}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-14 h-14 bg-brand-red rounded-full flex items-center justify-center shadow-lg">
                                <span className="text-white text-xl ml-1">▶</span>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="h-full flex items-center justify-center">
                            <span className="text-4xl">🎙️</span>
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <span className="font-raleway text-brand-orange text-xs font-semibold uppercase tracking-widest mb-2 block">
                          {video.categorie}
                        </span>
                        <h3 className="font-montserrat font-bold text-base text-[#212121] line-clamp-2 mb-2">
                          {video.titre}
                        </h3>
                        {video.description && (
                          <p className="font-inter text-[#212121]/50 text-sm line-clamp-2">{video.description}</p>
                        )}
                      </div>
                    </a>
                  </AnimatedSection>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
