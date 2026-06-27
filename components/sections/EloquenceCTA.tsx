'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Mic } from 'lucide-react';
import AnimatedSection from '@/components/ui/AnimatedSection';

export default function EloquenceCTA() {
  return (
    <section className="py-20 relative overflow-hidden bg-[#0A1E3C]" aria-label="Candidater au concours d'éloquence">
      {/* Décoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-brand-red/8 rounded-full blur-3xl" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/6 rounded-full blur-3xl" />
      </div>

      <div className="container-xl relative">
        <div className="max-w-3xl mx-auto text-center">
          <AnimatedSection>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-red/20 border border-brand-red/30 mb-6">
              <Mic size={28} className="text-brand-red" />
            </div>
            <h2 className="font-montserrat font-black text-4xl md:text-5xl text-white leading-tight mb-4">
              Candidatez au{' '}
              <span className="text-brand-red">Concours d'Éloquence</span>
            </h2>
            <p className="font-raleway text-white/70 text-lg mb-3 leading-relaxed">
              14 sujets. Une scène. Faites entendre votre voix.
            </p>
            <p className="font-inter text-white/50 text-sm mb-10 max-w-xl mx-auto leading-relaxed">
              Choisissez un sujet parmi 14 thématiques — diversité, progrès, liberté, culture — et défendez vos idées devant le jury et le public le 11 juillet à Rabat.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/spectacle?tab=inscription"
                  className="group inline-flex items-center gap-2 bg-brand-red text-white font-raleway font-bold px-8 py-4 rounded-md hover:bg-red-700 transition-all duration-300 hover:shadow-glow text-base"
                >
                  🎤 Je candidate maintenant
                  <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </motion.div>
              <Link
                href="/spectacle?tab=eloquence"
                className="font-raleway font-semibold text-white/60 hover:text-white transition-colors text-sm underline underline-offset-4"
              >
                Voir les 14 sujets
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
