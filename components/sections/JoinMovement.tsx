'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Zap, Globe } from 'lucide-react';
import AnimatedSection from '@/components/ui/AnimatedSection';

const reasons = [
  {
    icon: Globe,
    title: 'Diversité réelle',
    desc: '12+ nationalités sur scène et dans la salle — une expérience d\'ouverture unique.',
  },
  {
    icon: Zap,
    title: 'Inspiration profonde',
    desc: 'Eloquentia, TED X, danse culturelle — un programme qui transforme.',
  },
  {
    icon: Users,
    title: 'Réseau stratégique',
    desc: 'Rencontrez les futurs leaders africains et bâtissez des connexions durables.',
  },
];

export default function JoinMovement() {
  return (
    <section className="py-20 bg-navy relative overflow-hidden" aria-label="Rejoindre le mouvement">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-red/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-orange/5 rounded-full blur-3xl" />
      </div>

      <div className="container-xl relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <AnimatedSection direction="left">
            <span className="font-raleway text-brand-red font-semibold text-sm uppercase tracking-widest mb-4 block">
              Rejoignez le mouvement
            </span>
            <h2 className="font-montserrat font-black text-4xl md:text-5xl text-white leading-tight mb-6">
              Une soirée qui restera<br />
              <span className="text-brand-red">dans l'histoire.</span>
            </h2>
            <p className="font-inter text-white/70 text-lg leading-relaxed mb-8">
              NEXUS SPECTACLE n'est pas un simple événement. C'est un acte politique, culturel
              et intellectuel posé par la jeunesse africaine. Soyez là.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/spectacle#inscription"
                className="group flex items-center gap-2 bg-brand-red text-white font-raleway font-bold px-8 py-4 rounded-md hover:bg-red-700 transition-all duration-300 hover:shadow-glow"
              >
                Réserver maintenant — Gratuit
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
            <p className="font-inter text-white/40 text-sm mt-4">
              ⚡ Places limitées · Réservation obligatoire
            </p>
          </AnimatedSection>

          {/* Right */}
          <AnimatedSection direction="right" delay={0.15}>
            <div className="grid gap-4">
              {reasons.map(({ icon: Icon, title, desc }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 + 0.2 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4 glass-card rounded-xl p-5"
                >
                  <div className="w-10 h-10 rounded-lg bg-brand-red/20 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-brand-red" />
                  </div>
                  <div>
                    <h3 className="font-raleway font-semibold text-white mb-1">{title}</h3>
                    <p className="font-inter text-white/60 text-sm leading-relaxed">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
