'use client';

import { motion } from 'framer-motion';
import AnimatedSection from '@/components/ui/AnimatedSection';

export default function MediaPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-end justify-start overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/images/hero.jpeg')` }}
        />
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative container-xl pb-16 pt-32 text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="font-raleway text-brand-orange font-semibold text-sm uppercase tracking-widest mb-4 block">
              NEXUS MÉDIA
            </span>
            <h1 className="font-montserrat font-black text-5xl md:text-6xl lg:text-7xl leading-tight mb-4">
              L'univers éditorial<br />de <span className="text-brand-red">NEXUS</span>
            </h1>
            <p className="font-raleway text-xl text-white/80 max-w-xl">
              Ce qui n'est pas documenté finit par disparaître.
            </p>
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

      {/* Articles — section vide, gérée depuis l'admin */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="container-xl">
          <AnimatedSection className="text-center mb-10">
            <h2 className="section-title text-2xl mb-2">Articles</h2>
          </AnimatedSection>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <span className="text-2xl">📰</span>
            </div>
            <p className="font-inter text-[#212121]/50 text-sm">
              Bientôt disponible
            </p>
          </div>
        </div>
      </section>

      {/* Vidéos — section vide, gérée depuis l'admin */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="container-xl">
          <AnimatedSection className="text-center mb-10">
            <h2 className="section-title text-2xl mb-2">Vidéos & Podcasts</h2>
          </AnimatedSection>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <span className="text-2xl">🎙️</span>
            </div>
            <p className="font-inter text-[#212121]/50 text-sm">
              Bientôt disponible
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
