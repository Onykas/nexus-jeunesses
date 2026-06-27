'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Star, Clock, ChevronDown, ChevronUp, ExternalLink, PlayCircle, X, Loader2 } from 'lucide-react';
import AnimatedSection from '@/components/ui/AnimatedSection';
import RegistrationForm from '@/components/forms/RegistrationForm';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

interface PublicCandidat {
  id: string;
  prenom: string;
  nom: string;
  nationalite: string;
  sujet: string | null;
  ville: string | null;
  cvUrl: string | null;
  videoPublique: boolean;
  _count: { votes: number };
}

const tabs = ['Programme', 'NEXUS TALK', 'Concours d\'Éloquence', 'Inscription', 'FAQs'];

const TAB_INSCRIPTION = 3;

const faqs = [
  { q: 'Quel est le dress code ?', a: 'Tenue décontractée (c\'est un spectacle des jeunesses en été).' },
  { q: 'À quelle heure ouvrent les portes ?', a: 'Les portes seront ouvertes dès 14h00.' },
  { q: 'L\'événement est-il gratuit ?', a: 'Oui, l\'entrée est gratuite sur réservation obligatoire.' },
  {
    q: 'Où se trouve l\'INSMAC ?',
    a: 'L\'INSMAC est situé à Rabat, Maroc.',
    link: { label: 'Voir sur Google Maps', href: 'https://maps.google.com/?q=Théâtre+INSMAC+Rabat' },
  },
];

function initiales(prenom: string, nom: string) {
  return `${prenom[0] ?? ''}${nom[0] ?? ''}`.toUpperCase();
}

function avatarColor(id: string) {
  const colors = ['bg-navy', 'bg-brand-red', 'bg-brand-orange', 'bg-[#2e7d32]', 'bg-[#1565c0]', 'bg-[#6a1b9a]'];
  return colors[id.charCodeAt(0) % colors.length];
}

export default function SpectaclePage() {
  const [activeTab, setActiveTab] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [candidats, setCandidats] = useState<PublicCandidat[]>([]);
  const [candidatsLoading, setCandidatsLoading] = useState(false);
  const [videoPlayer, setVideoPlayer] = useState<{ url: string; name: string } | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab === 'inscription') setActiveTab(TAB_INSCRIPTION);
    else if (tab === 'eloquence' || tab === 'concours') setActiveTab(2);
    else if (tab === 'nexustalk') setActiveTab(1);
  }, []);

  const fetchCandidats = useCallback(async () => {
    setCandidatsLoading(true);
    try {
      const res = await fetch('/api/public/candidats');
      if (res.ok) setCandidats(await res.json());
    } finally {
      setCandidatsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 2) fetchCandidats();
  }, [activeTab, fetchCandidats]);

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-end justify-start overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1920&q=80')` }} />
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative container-xl pb-16 pt-32 text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 bg-brand-red/20 border border-brand-red/40 text-white/90 text-xs font-raleway font-semibold px-3 py-1 rounded-full mb-4">
              <Star size={12} fill="currentColor" className="text-brand-orange" /> Entrée gratuite — Réservation obligatoire
            </span>
            <h1 className="font-montserrat font-black text-5xl md:text-6xl lg:text-7xl leading-tight mb-4">
              NEXUS<br /><span className="text-brand-red">SPECTACLE</span>
            </h1>
            <p className="font-raleway text-xl text-white/80 mb-6 max-w-xl">
              Les jeunesses au Maroc réunies pour une journée d'éloquence, de culture et d'inspiration.
            </p>
            <div className="flex flex-wrap gap-6 text-white/70 text-sm font-inter">
              <span className="flex items-center gap-2"><Calendar size={16} className="text-brand-red" />11 Juillet 2026 — 15h00 à 18h00</span>
              <span className="flex items-center gap-2"><MapPin size={16} className="text-brand-red" />INSMAC, Rabat</span>
              <a href="https://maps.google.com/?q=Théâtre+INSMAC+Rabat" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 text-brand-orange hover:underline text-xs">
                <ExternalLink size={13} /> Voir la localisation
              </a>
            </div>
            <div className="flex flex-wrap gap-3 mt-6">
              <button onClick={() => setActiveTab(TAB_INSCRIPTION)}
                className="bg-brand-red text-white font-raleway font-bold px-6 py-3 rounded-md hover:bg-red-700 transition-colors">
                Réserver ma place — Gratuit
              </button>
              <button onClick={() => setActiveTab(2)}
                className="bg-white/10 border border-white/30 text-white font-raleway font-semibold px-6 py-3 rounded-md hover:bg-white/20 transition-colors">
                🎤 Candidater au concours
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tabs */}
      <div className="sticky top-16 md:top-20 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="container-xl">
          <div className="flex overflow-x-auto no-scrollbar" role="tablist">
            {tabs.map((tab, i) => (
              <button key={tab} onClick={() => setActiveTab(i)} role="tab" aria-selected={activeTab === i}
                className={`flex-shrink-0 px-5 py-4 font-raleway font-semibold text-sm transition-all duration-200 border-b-2 ${
                  activeTab === i ? 'text-navy border-brand-red' : 'text-[#212121]/50 border-transparent hover:text-navy hover:border-gray-200'
                }`}>
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
                  <p className="section-subtitle">11 juillet 2026 · INSMAC, Rabat</p>
                </AnimatedSection>
                <div className="space-y-2">
                  {[
                    { time: '14h00', dur: null, icon: '🚪', title: 'Ouverture des portes', sub: null, details: [], badge: null, color: 'bg-brand-orange/8 border-brand-orange/20' },
                    { time: '14h30', dur: null, icon: '👑', title: 'Accueil VIP', sub: 'Protocole et placement', details: [], badge: 'VIP', color: 'bg-yellow-50 border-yellow-200/60' },
                    { time: '15h00', dur: '20 min', icon: '🎤', title: 'Hymnes nationaux & Discours', sub: 'Ouverture officielle', details: ["Président de l'Université Mohammed V · allocution à la jeunesse", 'Ambassadeur de la R.D. Congo au Maroc', "Mme El Mansouri Ihssane · Conseillère du Président de l'UM5", 'Jonathan YOAMBALE LOOLA · Manager NEXUS Jeunesses'], badge: 'Phare', color: 'bg-brand-red/8 border-brand-red/20 shadow-card' },
                    { time: '15h20', dur: '05 min', icon: '🎬', title: 'Vidéo officielle NEXUS', sub: 'Présentation du programme · Lever de rideau', details: [], badge: null, color: 'bg-navy/4 border-navy/10' },
                    { time: '15h30', dur: '15 min', icon: '💃', title: 'Moïse quitte sa terre natale', sub: 'Acte I · Le Départ', details: ['Une dernière danse, un dernier pas de sa culture sur la rumba.'], badge: null, color: 'bg-purple-50/60 border-purple-200/40' },
                    { time: '15h45', dur: '35 min', icon: '🗣️', title: 'NEXUS TALK · les maîtres initient Moïse', sub: 'Acte II · Initiation & Union', details: ["Talk 1 · « Utiliser l'IA pour augmenter l'intelligence collective de la jeunesse au Maroc » (15 min)", "Talk 2 · « Économie de la connaissance : vendre ses connaissances à l'ère de l'IA » (15 min)"], badge: 'Talk', color: 'bg-brand-orange/8 border-brand-orange/20' },
                    { time: '16h20', dur: '20 min', icon: '🌟', title: 'Moïse connaît le NEXUS', sub: 'Le Cœur · La Pièce NEXUS', details: ["La rencontre des jeunesses d'où jaillit la valeur. Le climax émotionnel."], badge: null, color: 'bg-brand-red/6 border-brand-red/15' },
                    { time: '16h40', dur: '18 min', icon: '🎤', title: "NEXUS D'ÉLOQUENCE", sub: 'Moïse rencontre ses pairs', details: ['Six candidats, trois minutes chacun.'], badge: 'Phare', color: 'bg-brand-red/10 border-brand-red/30 shadow-card' },
                    { time: '17h00', dur: '10 min', icon: '🗳️', title: 'Vote du public en ligne & jury', sub: 'Délibération · Le public juge et vote en direct', details: [], badge: null, color: 'bg-navy/4 border-navy/10' },
                    { time: '17h10', dur: '20 min', icon: '🗣️', title: 'NEXUS TALK · le dernier maître', sub: 'Acte III · Le Retour', details: ["« Économie de la connaissance : exporter son savoir vers son pays. »"], badge: 'Talk', color: 'bg-brand-orange/8 border-brand-orange/20' },
                    { time: '17h30', dur: '10 min', icon: '🏆', title: 'Remise des trophées & proclamation du lauréat', sub: 'Consécration', details: [], badge: null, color: 'bg-yellow-50/80 border-yellow-200/60' },
                    { time: '17h40', dur: null, icon: '🎭', title: 'Le quatrième mur tombe', sub: "L'Appel & Mot de fin", details: [], badge: null, color: 'bg-navy/6 border-navy/15' },
                  ].map(({ time, dur, icon, title, sub, details, badge, color }, i) => (
                    <AnimatedSection key={time} delay={i * 0.03}>
                      <div className={`flex gap-3 items-start p-4 rounded-xl border ${color}`}>
                        <div className="flex-shrink-0 w-14 text-center">
                          <div className="font-montserrat font-bold text-navy text-xs">{time}</div>
                          {dur && <div className="font-inter text-[#212121]/40 text-[10px]">{dur}</div>}
                        </div>
                        <div className="text-xl flex-shrink-0">{icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="font-raleway font-semibold text-navy text-sm">{title}</div>
                          {sub && <div className="font-inter text-[#212121]/50 text-xs mt-0.5 italic">{sub}</div>}
                          {details.length > 0 && (
                            <div className="mt-1.5 space-y-0.5">
                              {details.map((d) => (
                                <div key={d} className="text-xs font-inter text-[#212121]/60 flex gap-1.5">
                                  <span className="text-brand-red flex-shrink-0">—</span>{d}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        {badge && <span className={`ml-auto flex-shrink-0 badge text-xs ${badge === 'VIP' ? 'bg-yellow-100 text-yellow-700' : badge === 'Talk' ? 'bg-brand-orange text-white' : 'bg-brand-red text-white'}`}>{badge}</span>}
                      </div>
                    </AnimatedSection>
                  ))}
                </div>
                <AnimatedSection delay={0.4} className="mt-10 p-5 bg-navy/4 rounded-xl border border-navy/10 text-center">
                  <Clock size={20} className="text-brand-orange mx-auto mb-2" />
                  <p className="font-raleway font-semibold text-navy text-sm mb-1">Durée totale</p>
                  <p className="font-inter text-[#212121]/60 text-sm">15h00 – 18h00 · 3 heures</p>
                </AnimatedSection>
              </div>
            </motion.div>
          )}

          {/* TAB 1 — NEXUS TALK */}
          {activeTab === 1 && (
            <motion.div key="nexustalk" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="max-w-3xl mx-auto">
                <AnimatedSection className="text-center mb-10">
                  <h2 className="section-title text-3xl md:text-4xl mb-3">NEXUS TALK</h2>
                  <p className="section-subtitle">3 speakers inspirants pour 3 sujets qui transforment.</p>
                </AnimatedSection>
                <div className="grid md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="card p-6 text-center">
                      <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3 text-gray-300 text-xs">PHOTO</div>
                      <p className="font-inter text-[#212121]/40 text-sm italic">Bientôt disponible</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2 — Concours d'Éloquence */}
          {activeTab === 2 && (
            <motion.div key="eloquence" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="max-w-3xl mx-auto">
                <AnimatedSection className="text-center mb-10">
                  <h2 className="section-title text-3xl md:text-4xl mb-3">Concours d'Éloquence</h2>
                  <p className="section-subtitle">14 sujets · Une scène · Faites entendre votre voix.</p>
                </AnimatedSection>

                {/* Candidats validés */}
                <AnimatedSection>
                  <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                    <div>
                      <h3 className="font-montserrat font-bold text-navy text-2xl mb-1">
                        Candidats
                        {candidats.length > 0 && (
                          <span className="ml-2 text-base font-inter font-normal text-[#212121]/40">({candidats.length})</span>
                        )}
                      </h3>
                      <p className="font-inter text-[#212121]/50 text-sm">Les candidats validés par l'équipe NEXUS.</p>
                    </div>
                    <button
                      onClick={() => setActiveTab(TAB_INSCRIPTION)}
                      className="btn-primary text-sm flex items-center gap-2"
                    >
                      🎤 Je candidate
                    </button>
                  </div>

                  {candidatsLoading && (
                    <div className="flex items-center justify-center py-16 gap-3 text-[#212121]/40">
                      <Loader2 size={20} className="animate-spin" />
                      <span className="font-inter text-sm">Chargement…</span>
                    </div>
                  )}

                  {!candidatsLoading && candidats.length === 0 && (
                    <div className="rounded-xl border border-gray-100 bg-gray-50 p-12 text-center">
                      <div className="w-16 h-16 rounded-2xl bg-white border border-gray-100 flex items-center justify-center mx-auto mb-4 text-2xl">🏆</div>
                      <p className="font-raleway font-semibold text-navy text-base mb-1">Candidatures en cours d'examen</p>
                      <p className="font-inter text-[#212121]/50 text-sm max-w-xs mx-auto">
                        Les candidats validés par l'équipe NEXUS apparaîtront ici bientôt.
                      </p>
                    </div>
                  )}

                  {!candidatsLoading && candidats.length > 0 && (
                    <div className="grid md:grid-cols-2 gap-4">
                      {candidats.map((c) => (
                        <div key={c.id} className="card p-5 flex flex-col gap-4">
                          {/* En-tête candidat */}
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-montserrat font-bold text-sm flex-shrink-0 ${avatarColor(c.id)}`}>
                              {initiales(c.prenom, c.nom)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-raleway font-bold text-navy text-sm">{c.prenom} {c.nom}</p>
                              <p className="font-inter text-[#212121]/55 text-xs">{c.nationalite}{c.ville ? ` · ${c.ville}` : ''}</p>
                            </div>
                            <span className="badge bg-brand-green/10 text-brand-green text-xs flex-shrink-0">✓ Validé</span>
                          </div>

                          {/* Sujet */}
                          {c.sujet && (
                            <div className="bg-navy/4 rounded-lg px-3 py-2">
                              <p className="font-inter text-xs text-[#212121]/50 mb-0.5">Sujet choisi</p>
                              <p className="font-raleway font-semibold text-navy text-xs leading-snug">🎤 {c.sujet}</p>
                            </div>
                          )}

                          {/* Vidéo */}
                          {c.cvUrl && c.videoPublique && (
                            <button
                              onClick={() => setVideoPlayer({ url: c.cvUrl!, name: `${c.prenom} ${c.nom}` })}
                              className="w-full flex items-center gap-2 bg-navy/6 hover:bg-navy/10 transition-colors rounded-lg px-3 py-2.5 text-left group"
                            >
                              <div className="w-8 h-8 rounded-full bg-brand-red/10 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-red/20 transition-colors">
                                <PlayCircle size={16} className="text-brand-red" />
                              </div>
                              <span className="font-raleway font-semibold text-navy text-xs">Voir la vidéo de candidature</span>
                            </button>
                          )}

                        </div>
                      ))}
                    </div>
                  )}
                </AnimatedSection>
              </div>
            </motion.div>
          )}

          {/* TAB 3 — Inscription */}
          {activeTab === TAB_INSCRIPTION && (
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

          {/* TAB 4 — FAQs */}
          {activeTab === 4 && (
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
                        <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                          aria-expanded={openFaq === i}>
                          <span className="font-raleway font-semibold text-navy text-sm pr-4">{q}</span>
                          {openFaq === i ? <ChevronUp size={16} className="flex-shrink-0 text-brand-red" /> : <ChevronDown size={16} className="flex-shrink-0 text-[#212121]/40" />}
                        </button>
                        <AnimatePresence>
                          {openFaq === i && (
                            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                              <div className="px-4 pb-4 border-t border-gray-50">
                                <p className="font-inter text-[#212121]/70 text-sm leading-relaxed">{a}</p>
                                {link && (
                                  <a href={link.href} target="_blank" rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-brand-red text-xs hover:underline mt-2">
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

      {videoPlayer && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
          onClick={() => setVideoPlayer(null)}
        >
          <div
            className="bg-black rounded-2xl overflow-hidden shadow-2xl w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 bg-[#111]">
              <p className="font-raleway font-semibold text-white text-sm truncate">{videoPlayer.name}</p>
              <button
                onClick={() => setVideoPlayer(null)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <video src={videoPlayer.url} controls autoPlay className="w-full max-h-[70vh] bg-black" />
          </div>
        </div>
      )}
    </>
  );
}
