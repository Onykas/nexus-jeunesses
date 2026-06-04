'use client';

import { motion } from 'framer-motion';
import AnimatedSection from '@/components/ui/AnimatedSection';

export default function MesdamesPage() {
  return (
    <>
      <section className="relative bg-navy pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-red/5 rounded-full blur-3xl" />
        </div>
        <div className="container-xl relative text-white text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="font-raleway text-purple-300 font-semibold text-sm uppercase tracking-widest mb-4 block">
              Nouveau module
            </span>
            <h1 className="font-montserrat font-black text-5xl md:text-6xl mb-4">
              NEXUS <span className="text-purple-400">MESDAMES</span>
            </h1>
            <p className="font-inter text-white/70 text-lg max-w-xl mx-auto leading-relaxed">
              Un espace dédié aux femmes leaders des jeunesses au Maroc.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container-xl">
          <AnimatedSection className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 rounded-2xl bg-purple-50 flex items-center justify-center mx-auto mb-8">
              <span className="text-3xl">👑</span>
            </div>
            <h2 className="font-montserrat font-bold text-navy text-3xl mb-6">
              Bientôt disponible
            </h2>
            <p className="font-inter text-[#212121]/70 text-lg leading-relaxed mb-4">
              NEXUS MESDAMES est un module en cours de développement. Le programme complet
              sera annoncé prochainement.
            </p>
            <p className="font-inter text-[#212121]/50 text-sm">
              Restez à l'écoute — inscrivez-vous à la newsletter pour être informé en avant-première.
            </p>

            <form
              className="flex gap-3 max-w-sm mx-auto mt-8"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="votre@email.com"
                className="flex-1 border border-gray-200 rounded-lg px-4 py-3 text-sm font-inter focus:outline-none focus:border-navy"
              />
              <button type="submit" className="btn-primary text-sm px-5">
                Notifier
              </button>
            </form>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
