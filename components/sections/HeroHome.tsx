'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, MapPin, Ticket } from 'lucide-react';

export default function HeroHome() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label="Section héro principale"
    >
      {/* Background — groupe de jeunes de différentes nationalités */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920&q=80')`,
        }}
        role="img"
        aria-label="Groupe de jeunes du monde réunis"
      />
      <div className="absolute inset-0 hero-overlay" />

      {/* Geometric accents */}
      <div className="absolute top-32 right-16 w-48 h-48 bg-brand-red/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-32 left-16 w-64 h-64 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative container-xl pt-24 pb-16 text-center text-white">
        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-montserrat font-black text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[1.05] mb-6 max-w-5xl mx-auto"
        >
          La jeunesse ne subit plus.{' '}
          <span className="text-brand-red">Elle éclaire.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="font-raleway text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          NEXUS DES JEUNESSES est le premier et seul programme d'une année qui
          réunit la jeunesse du monde présenté au Maroc.
        </motion.p>

        {/* Event info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-10 text-white/70"
        >
          <span className="flex items-center gap-2">
            <Calendar size={16} className="text-brand-red" />
            <span className="font-inter text-sm">11 juillet 2026</span>
          </span>
          <span className="w-px h-4 bg-white/30" />
          <span className="flex items-center gap-2">
            <MapPin size={16} className="text-brand-red" />
            <span className="font-inter text-sm">Théâtre INSMAC, Rabat</span>
          </span>
          <span className="w-px h-4 bg-white/30 hidden sm:block" />
          <span className="flex items-center gap-2">
            <Ticket size={16} className="text-brand-orange" />
            <span className="font-inter text-sm">Entrée sur réservation</span>
          </span>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href="/spectacle#inscription"
            className="group flex items-center gap-2 bg-brand-red text-white font-raleway font-bold px-8 py-4 rounded-md hover:bg-red-700 transition-all duration-300 hover:shadow-glow text-base"
          >
            Réserver ma place
            <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            href="/spectacle"
            className="flex items-center gap-2 border-2 border-white/40 text-white font-raleway font-semibold px-8 py-4 rounded-md hover:border-white hover:bg-white/10 transition-all duration-300 text-base"
          >
            Découvrir le programme
          </Link>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              className="w-1.5 h-1.5 bg-white/60 rounded-full"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
