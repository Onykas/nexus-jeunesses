'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Star, Clock, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import AnimatedSection from '@/components/ui/AnimatedSection';
import RegistrationForm from '@/components/forms/RegistrationForm';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import EloquenceCandidatureForm from '@/components/forms/EloquenceCandidatureForm';

const tabs = ['Programme', 'Concours d\'Éloquence', 'Inscription', 'FAQs'];

const faqs = [
  {
    q: 'Quel est le dress code ?',
    a: 'Tenue décontractée (c\'est un spectacle des jeunesses en été).',
  },
  {
    q: 'À quelle heure ouvrent les portes ?',
    a: 'Les portes seront ouvertes dès 14h30.',
  },
  {
    q: 'L\'événement est-il gratuit ?',
    a: 'Oui, l\'entrée est gratuite sur réservation obligatoire.',
  },
  {
    q: 'Où se trouve le Théâtre INSMAC ?',
    a: 'Le Théâtre INSMAC est situé à Rabat, Maroc.',
    link: { label: 'Voir sur Google Maps', href: 'https://maps.google.com/?q=Théâtre+INSMAC+Rabat' },
  },
];

export default function SpectaclePage() {
  const [activeTab, setActiveTab] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCandidature, setShowCandidature] = useState(false);

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-end justify-start overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1920&q=80')` }}
        />
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative container-xl pb-16 pt-32 text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 bg-brand-red/20 border border-brand-red/40 text-white/90 text-xs font-raleway font-semibold px-3 py-1 rounded-full mb-4">
              <Star size={12} fill="currentColor" className="text-brand-orange" /> Entrée gratuite — Réservation obligatoire
            </span>
            <h1 className="font-montserrat font-black text-5xl md:text-6xl lg:text-7xl leading-tight mb-4">
              NEXUS<br />
              <span className="text-brand-red">SPECTACLE</span>
            </h1>
            <p className="font-raleway text-xl text-white/80 mb-6 max-w-xl">
              Les jeunesses au Maroc réunies pour une journée d'éloquence, de culture et d'inspiration.
            </p>
            <div className="flex flex-wrap gap-6 text-white/70 text-sm font-inter">
              <span className="flex items-center gap-2">
                <Calendar size={16} className="text-brand-red" />
                11 Juillet 2026 — 15h00 à 18h00
              </span>
              <span className="flex items-center gap-2">
                <MapPin size={16} className="text-brand-red" />
                Théâtre INSMAC, Rabat
              </span>
              <a
                href="https://maps.google.com/?q=Théâtre+INSMAC+Rabat"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-brand-orange hover:underline text-xs"
              >
                <ExternalLink size={13} /> Voir la localisation
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tabs */}
      <div className="sticky top-16 md:top-20 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="container-xl">
          <div className="flex overflow-x-auto no-scrollbar" role="tablist" aria-label="Sections NEXUS Spectacle">
            {tabs.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                role="tab"
                aria-selected={activeTab === i}
                className={`flex-shrink-0 px-5 py-4 font-raleway font-semibold text-sm transition-all duration-200 border-b-2 ${
                  activeTab === i
                    ? 'text-navy border-brand-red'
                    : 'text-[#212121]/50 border-transparent hover:text-navy hover:border-gray-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="container-xl py-16">
        <AnimatePresence mode="wait">

          {/* TAB 0 — Programme */}
          {activeTab === 0 && (
            <motion.div key="programme" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="max-w-2xl mx-auto">
                <AnimatedSection className="text-center mb-12">
                  <h2 className="section-title text-3xl md:text-4xl mb-3">Programme</h2>
                  <p className="section-subtitle">11 juillet 2026 · Théâtre INSMAC, Rabat</p>
                </AnimatedSection>

                <div className="space-y-3">
                  {/* Entrée */}
                  <AnimatedSection delay={0.05}>
                    <div className="flex gap-4 items-start p-4 rounded-xl border bg-brand-orange/10 border-brand-orange/30">
                      <div className="text-center flex-shrink-0 w-16">
                        <div className="font-montserrat font-bold text-navy text-sm">14h30</div>
                      </div>
                      <div className="text-2xl flex-shrink-0">🚪</div>
                      <div>
                        <div className="font-raleway font-semibold text-navy text-sm">Ouverture des portes</div>
                      </div>
                    </div>
                  </AnimatedSection>

                  {/* Début */}
                  <AnimatedSection delay={0.1}>
                    <div className="flex gap-4 items-start p-4 rounded-xl border bg-brand-red/10 border-brand-red/30 shadow-card">
                      <div className="text-center flex-shrink-0 w-16">
                        <div className="font-montserrat font-bold text-navy text-sm">15h00</div>
                      </div>
                      <div className="text-2xl flex-shrink-0">🎤</div>
                      <div className="flex-1">
                        <div className="font-raleway font-semibold text-navy text-base">Début du programme</div>
                      </div>
                      <span className="ml-auto flex-shrink-0 badge bg-brand-red text-white text-xs">Phare</span>
                    </div>
                  </AnimatedSection>

                  {/* Suite */}
                  <AnimatedSection delay={0.15}>
                    <div className="flex gap-4 items-start p-4 rounded-xl border bg-gray-100 border-gray-200">
                      <div className="text-center flex-shrink-0 w-16">
                        <div className="font-montserrat font-bold text-[#212121]/40 text-sm">—</div>
                      </div>
                      <div className="text-2xl flex-shrink-0">📋</div>
                      <div>
                        <div className="font-raleway font-medium text-[#212121]/60 text-sm italic">
                          Programme complet bientôt disponible
                        </div>
                      </div>
                    </div>
                  </AnimatedSection>
                </div>

                <AnimatedSection delay={0.2} className="mt-10 p-5 bg-navy/4 rounded-xl border border-navy/10 text-center">
                  <Clock size={20} className="text-brand-orange mx-auto mb-2" />
                  <p className="font-raleway font-semibold text-navy text-sm mb-1">Durée totale</p>
                  <p className="font-inter text-[#212121]/60 text-sm">15h00 – 18h00 · 3 heures</p>
                </AnimatedSection>
              </div>
            </motion.div>
          )}

          {/* TAB 1 — Concours d'Éloquence */}
          {activeTab === 1 && (
            <motion.div key="eloquence" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="max-w-3xl mx-auto">
                {/* Intervenants */}
                <AnimatedSection className="mb-14">
                  <h2 className="section-title text-2xl mb-2">Intervenants NEXUS TALK</h2>
                  <p className="section-subtitle mb-6 text-sm">3 speakers inspirants pour 3 sujets qui transforment.</p>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="card p-6 text-center">
                        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3 text-gray-300 text-xs">
                          PHOTO
                        </div>
                        <p className="font-inter text-[#212121]/40 text-sm italic">Bientôt disponible</p>
                      </div>
                    ))}
                  </div>
                </AnimatedSection>

                {/* Candidats au concours */}
                <AnimatedSection className="mb-10">
                  <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                    <div>
                      <h2 className="section-title text-2xl mb-1">Finalistes du concours d'éloquence</h2>
                      <p className="section-subtitle text-sm">Les candidats validés seront affichés ici avec leur score de votes.</p>
                    </div>
                    <button
                      onClick={() => setShowCandidature(true)}
                      className="btn-primary text-sm flex items-center gap-2"
                    >
                      🎤 Candidater au concours d'éloquence
                    </button>
                  </div>

                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-10 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white border border-gray-100 flex items-center justify-center mx-auto mb-4 text-2xl">
                      🏆
                    </div>
                    <p className="font-raleway font-semibold text-navy text-base mb-1">
                      Bientôt disponible
                    </p>
                    <p className="font-inter text-[#212121]/50 text-sm">
                      Les candidats validés apparaîtront ici. Créez un compte NEXUS pour voter.
                    </p>
                  </div>
                </AnimatedSection>

                {/* Système de vote — info */}
                <AnimatedSection>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="card p-5 border-l-4 border-brand-orange">
                      <p className="font-raleway font-bold text-navy text-sm mb-1">Phase 1 — Vote public</p>
                      <p className="font-inter text-[#212121]/60 text-xs leading-relaxed">
                        Avant le 11 juillet. Nécessite un compte NEXUS. Un vote par candidat. Résultats visibles en temps réel.
                      </p>
                    </div>
                    <div className="card p-5 border-l-4 border-brand-red">
                      <p className="font-raleway font-bold text-navy text-sm mb-1">Phase 2 — Vote final (le 11 juillet)</p>
                      <p className="font-inter text-[#212121]/60 text-xs leading-relaxed">
                        Sur place. Public marqué "présent" (40%). Jury avec code secret (60%). Résultats publiés du 3e au 1er.
                      </p>
                    </div>
                  </div>
                </AnimatedSection>
              </div>

              {showCandidature && (
                <EloquenceCandidatureForm onClose={() => setShowCandidature(false)} />
              )}
            </motion.div>
          )}

          {/* TAB 2 — Inscription */}
          {activeTab === 2 && (
            <motion.div key="inscription" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} id="inscription">
              <div className="max-w-2xl mx-auto">
                <AnimatedSection className="text-center mb-10">
                  <span className="badge bg-brand-green/10 text-brand-green text-sm mb-3">Entrée 100% Gratuite</span>
                  <h2 className="section-title text-3xl md:text-4xl mb-3">Réservez votre place</h2>
                  <p className="section-subtitle">Places limitées · Confirmation par email · 11 juillet 2026 · 15h00</p>
                </AnimatedSection>
                <RegistrationForm onSuccess={() => setShowSuccess(true)} />
              </div>
            </motion.div>
          )}

          {/* TAB 3 — FAQs */}
          {activeTab === 3 && (
            <motion.div key="faqs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="max-w-2xl mx-auto">
                <AnimatedSection className="text-center mb-10">
                  <h2 className="section-title text-3xl mb-2">Questions fréquentes</h2>
                  <p className="section-subtitle">Tout ce que vous devez savoir avant le grand jour.</p>
                </AnimatedSection>
                <div className="space-y-2">
                  {faqs.map(({ q, a, link }, i) => (
                    <AnimatedSection key={q} delay={i * 0.05}>
                      <div className="border border-gray-100 rounded-xl overflow-hidden">
                        <button
                          onClick={() => setOpenFaq(openFaq === i ? null : i)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                          aria-expanded={openFaq === i}
                        >
                          <span className="font-raleway font-semibold text-navy text-sm pr-4">{q}</span>
                          {openFaq === i
                            ? <ChevronUp size={16} className="flex-shrink-0 text-brand-red" />
                            : <ChevronDown size={16} className="flex-shrink-0 text-[#212121]/40" />
                          }
                        </button>
                        <AnimatePresence>
                          {openFaq === i && (
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: 'auto' }}
                              exit={{ height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 pb-4 border-t border-gray-50">
                                <p className="font-inter text-[#212121]/70 text-sm leading-relaxed">{a}</p>
                                {link && (
                                  <a
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-brand-red text-xs hover:underline mt-2"
                                  >
                                    <ExternalLink size={12} /> {link.label}
                                  </a>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </AnimatedSection>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {showSuccess && <ConfirmationModal onClose={() => setShowSuccess(false)} />}
    </>
  );
}
