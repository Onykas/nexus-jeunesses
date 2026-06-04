'use client';

import { motion } from 'framer-motion';
import AnimatedSection from '@/components/ui/AnimatedSection';

export default function DinerPage() {
  return (
    <>
      <section className="relative bg-navy pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-red/5 rounded-full blur-3xl" />
        </div>
        <div className="container-xl relative text-white text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="font-raleway text-brand-orange font-semibold text-sm uppercase tracking-widest mb-4 block">
              Module
            </span>
            <h1 className="font-montserrat font-black text-5xl md:text-6xl mb-6">
              NEXUS <span className="text-brand-red">DÎNER</span>
            </h1>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container-xl">
          <AnimatedSection className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 rounded-2xl bg-navy/8 flex items-center justify-center mx-auto mb-8">
              <span className="text-3xl">🍽️</span>
            </div>
            <h2 className="font-montserrat font-bold text-navy text-3xl mb-6">
              Le dîner des leaders
            </h2>
            <p className="font-inter text-[#212121]/70 text-lg leading-relaxed mb-4">
              Un dîner réunissant leaders politiques, entrepreneurs et académiques dans un cadre
              diplomatique. NEXUS RAPPORT y sera présenté aux autorités compétentes.
            </p>
            <div className="inline-flex items-center gap-2 bg-brand-orange/10 border border-brand-orange/20 rounded-full px-5 py-2 mt-4">
              <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
              <span className="font-raleway font-semibold text-brand-orange text-sm">
                À venir — 17 octobre 2026
              </span>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
