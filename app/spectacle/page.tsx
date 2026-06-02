'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Star, Clock, ChevronDown, ChevronUp, Users, Zap, Globe, Award } from 'lucide-react';
import AnimatedSection from '@/components/ui/AnimatedSection';
import RegistrationForm from '@/components/forms/RegistrationForm';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

const tabs = ['Programme', 'Artistes & Speakers', 'Inscription', 'FAQs'];

const programme = [
  { time: '18h00', end: '18h30', label: 'Accueil & cocktail de bienvenue', icon: '🥂', color: 'bg-brand-orange/10 border-brand-orange/30' },
  { time: '18h30', end: '19h00', label: 'Performance de danse culturelle', icon: '💃', desc: 'Artistes de 5 nationalités · Costumes traditionnels contemporains', color: 'bg-brand-red/10 border-brand-red/30' },
  { time: '19h00', end: '20h15', label: 'ELOQUENTIA 2.0 — Compétition d\'éloquence', icon: '🎤', desc: '12 finalistes · 12 nationalités · Jury international · Grand prix à la clé', color: 'bg-navy/10 border-navy/30', highlight: true },
  { time: '20h15', end: '20h30', label: 'Break & interactions networking', icon: '☕', color: 'bg-gray-100 border-gray-200' },
  { time: '20h30', end: '22h00', label: '3 × Interventions TED X-style', icon: '💡', desc: 'Speakers confirmés en cours · Thèmes : Leadership, Innovation, Diplomatie', color: 'bg-brand-green/10 border-brand-green/30' },
];

const finalistes = [
  { nom: 'Amara Diallo', nationalite: 'Sénégal', sujet: 'L\'éducation comme arme politique' },
  { nom: 'Yves Mabunda', nationalite: 'DR Congo', sujet: 'La jeunesse face aux systèmes' },
  { nom: 'Fatima Ez-Zahrae', nationalite: 'Maroc', sujet: 'L\'éloquence comme diplomatie' },
  { nom: 'Kofi Mensah', nationalite: 'Ghana', sujet: 'Entrepreneuriat & dignité' },
  { nom: 'Aicha Traoré', nationalite: 'Mali', sujet: 'Femme, leadership et Afrique' },
  { nom: 'Samuel Osei', nationalite: 'Nigeria', sujet: 'Tech et souveraineté africaine' },
  { nom: 'Blessing Nkosi', nationalite: 'Afrique du Sud', sujet: 'Réconcilier passé et futur' },
  { nom: 'Mariam Touré', nationalite: 'Guinée', sujet: 'La langue comme identité' },
  { nom: 'Jean-Pierre Mukeba', nationalite: 'Congo', sujet: 'Migrations et appartenances' },
  { nom: 'Nadia Benali', nationalite: 'Algérie', sujet: 'Penser l\'Afrique du Nord' },
  { nom: 'Ibrahim Coulibaly', nationalite: 'Côte d\'Ivoire', sujet: 'Confiance et ambition' },
  { nom: 'Sana Kone', nationalite: 'Burkina Faso', sujet: 'Résilience post-crise' },
];

const speakers = [
  { nom: 'Dr. Kwame Asante', titre: 'Professeur, Université de Dakar', sujet: 'Leadership transformationnel africain', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80' },
  { nom: 'Sara Diallo', titre: 'Entrepreneur tech, Lagos', sujet: 'Innovation & disruption', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80' },
  { nom: 'Hamid El Fassi', titre: 'Diplomate & consultant', sujet: 'La jeunesse dans les institutions', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80' },
];

const faqs = [
  { q: 'Où se déroule l\'événement ?', a: 'NEXUS SPECTACLE se tient au Théâtre Mohamed Bahnini, avenue Mohammed V, Rabat. Accès en tram (ligne 1), bus, taxi ou parking souterrain disponible à 200m.' },
  { q: 'L\'entrée est-elle vraiment gratuite ?', a: 'Oui, l\'entrée est entièrement gratuite. Cependant, la réservation est OBLIGATOIRE. Les places sont limitées et attribuées par ordre d\'inscription.' },
  { q: 'Quel est le dresscode ?', a: 'Tenue élégante recommandée. L\'événement se déroule dans un théâtre — veillez à une présentation soignée. Pas de tenue de sport ou très décontractée.' },
  { q: 'À quelle heure ouvrent les portes ?', a: 'L\'accueil commence à 17h45. Nous recommandons d\'arriver avant 18h00 pour profiter du cocktail de bienvenue et du networking d\'avant-show.' },
  { q: 'L\'événement sera-t-il filmé/diffusé en ligne ?', a: 'Un mini-documentaire sera produit dans les 72h après l\'événement. Des extraits seront diffusés sur les réseaux sociaux. Pas de diffusion live confirmée à ce stade.' },
  { q: 'Comment annuler ma réservation ?', a: 'Envoyez un email à contact@nexusjeunesses.org avec votre numéro de confirmation. Les annulations libèrent les places pour la liste d\'attente.' },
  { q: 'Y a-t-il une liste d\'attente ?', a: 'Oui. Si les places sont complètes au moment de votre inscription, vous serez automatiquement ajouté à la liste d\'attente. Vous serez notifié si une place se libère.' },
  { q: 'L\'événement est-il accessible aux PMR ?', a: 'Oui, le Théâtre Mohamed Bahnini est accessible aux personnes à mobilité réduite. Précisez vos besoins lors de l\'inscription.' },
];

const whyAttend = [
  { icon: Globe, title: 'Diversité authentique', desc: '12+ nationalités réunies sur une même scène. Une expérience rare et précieuse.' },
  { icon: Zap, title: 'Contenu de haut niveau', desc: 'Eloquentia, TED X, danse — un programme pensé pour transformer votre vision.' },
  { icon: Users, title: 'Réseau stratégique', desc: 'Rencontrez les futurs leaders africains et construisez des connexions durables.' },
  { icon: Award, title: 'Moment historique', desc: 'Être présent au premier NEXUS SPECTACLE, c\'est appartenir à une histoire.' },
];

export default function SpectaclePage() {
  const [activeTab, setActiveTab] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [filterNationalite, setFilterNationalite] = useState('');

  const filteredFinalistes = filterNationalite
    ? finalistes.filter((f) => f.nationalite.toLowerCase().includes(filterNationalite.toLowerCase()))
    : finalistes;

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
              L'élite de la jeunesse de demain réunie pour une nuit d'éloquence, de culture et d'inspiration.
            </p>
            <div className="flex flex-wrap gap-6 text-white/70 text-sm font-inter">
              <span className="flex items-center gap-2"><Calendar size={16} className="text-brand-red" /> 11 Juillet 2026 — 18h00</span>
              <span className="flex items-center gap-2"><MapPin size={16} className="text-brand-red" /> Théâtre Mohamed Bahnini, Rabat</span>
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
              <div className="max-w-3xl mx-auto">
                <AnimatedSection className="text-center mb-12">
                  <h2 className="section-title text-3xl md:text-4xl mb-3">Programme de la soirée</h2>
                  <p className="section-subtitle">11 juillet 2026 · Théâtre Mohamed Bahnini, Rabat</p>
                </AnimatedSection>
                <div className="relative">
                  <div className="absolute left-[52px] top-0 bottom-0 w-px bg-gray-100" />
                  <div className="space-y-4">
                    {programme.map(({ time, end, label, icon, desc, color, highlight }, i) => (
                      <AnimatedSection key={time} delay={i * 0.1}>
                        <div className={`flex gap-4 items-start p-4 rounded-xl border ${color} ${highlight ? 'shadow-card' : ''}`}>
                          <div className="text-center flex-shrink-0 w-16">
                            <div className="font-montserrat font-bold text-navy text-sm">{time}</div>
                            <div className="text-[#212121]/40 text-xs">{end}</div>
                          </div>
                          <div className="text-2xl flex-shrink-0">{icon}</div>
                          <div>
                            <div className={`font-raleway font-semibold text-navy ${highlight ? 'text-base' : 'text-sm'}`}>{label}</div>
                            {desc && <p className="font-inter text-[#212121]/60 text-xs mt-1">{desc}</p>}
                          </div>
                          {highlight && <span className="ml-auto flex-shrink-0 badge bg-navy text-white text-xs">⭐ Phare</span>}
                        </div>
                      </AnimatedSection>
                    ))}
                  </div>
                </div>

                {/* Why attend */}
                <div className="mt-16 grid sm:grid-cols-2 gap-4">
                  {whyAttend.map(({ icon: Icon, title, desc }, i) => (
                    <AnimatedSection key={title} delay={i * 0.1}>
                      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                        <div className="w-10 h-10 rounded-lg bg-navy/10 flex items-center justify-center flex-shrink-0">
                          <Icon size={18} className="text-navy" />
                        </div>
                        <div>
                          <div className="font-raleway font-semibold text-navy text-sm mb-1">{title}</div>
                          <p className="font-inter text-[#212121]/60 text-xs leading-relaxed">{desc}</p>
                        </div>
                      </div>
                    </AnimatedSection>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 1 — Artistes & Speakers */}
          {activeTab === 1 && (
            <motion.div key="speakers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Speakers TED X */}
              <AnimatedSection className="mb-12">
                <h2 className="section-title text-2xl mb-2">Intervenants TED X-style</h2>
                <p className="section-subtitle mb-8">3 speakers inspirants pour 3 sujets qui transforment.</p>
                <div className="grid md:grid-cols-3 gap-6">
                  {speakers.map(({ nom, titre, sujet, image }) => (
                    <div key={nom} className="card overflow-hidden group">
                      <div className="relative h-48 overflow-hidden">
                        <img src={image} alt={nom} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="font-montserrat font-bold text-white text-sm">{nom}</div>
                          <div className="font-inter text-white/70 text-xs">{titre}</div>
                        </div>
                      </div>
                      <div className="p-4">
                        <span className="badge bg-navy/10 text-navy text-xs">💡 {sujet}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </AnimatedSection>

              {/* Finalistes Eloquentia */}
              <AnimatedSection>
                <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                  <div>
                    <h2 className="section-title text-2xl mb-1">Finalistes Eloquentia 2.0</h2>
                    <p className="section-subtitle text-sm">12 voix, 12 nationalités, une seule scène.</p>
                  </div>
                  <input
                    type="text"
                    placeholder="Filtrer par nationalité..."
                    value={filterNationalite}
                    onChange={(e) => setFilterNationalite(e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm font-inter focus:outline-none focus:border-navy"
                  />
                </div>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredFinalistes.map(({ nom, nationalite, sujet }, i) => (
                    <AnimatedSection key={nom} delay={i * 0.05}>
                      <div className="card p-4 flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-navy to-brand-red flex items-center justify-center text-white font-montserrat font-bold text-sm flex-shrink-0">
                          {nom.charAt(0)}
                        </div>
                        <div>
                          <div className="font-raleway font-semibold text-navy text-sm">{nom}</div>
                          <div className="font-inter text-[#212121]/50 text-xs mb-1">{nationalite}</div>
                          <div className="font-inter text-[#212121]/70 text-xs italic">"{sujet}"</div>
                        </div>
                      </div>
                    </AnimatedSection>
                  ))}
                </div>
              </AnimatedSection>
            </motion.div>
          )}

          {/* TAB 2 — Inscription */}
          {activeTab === 2 && (
            <motion.div key="inscription" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} id="inscription">
              <div className="max-w-2xl mx-auto">
                <AnimatedSection className="text-center mb-10">
                  <span className="badge bg-brand-green/10 text-brand-green text-sm mb-3">Entrée 100% Gratuite</span>
                  <h2 className="section-title text-3xl md:text-4xl mb-3">Réservez votre place</h2>
                  <p className="section-subtitle">Places limitées · Confirmation par email garantie · Rappels automatiques inclus</p>
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
                  <p className="section-subtitle">Tout ce que vous devez savoir avant le grand soir.</p>
                </AnimatedSection>
                <div className="space-y-2">
                  {faqs.map(({ q, a }, i) => (
                    <AnimatedSection key={q} delay={i * 0.05}>
                      <div className="border border-gray-100 rounded-xl overflow-hidden">
                        <button
                          onClick={() => setOpenFaq(openFaq === i ? null : i)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                          aria-expanded={openFaq === i}
                        >
                          <span className="font-raleway font-semibold text-navy text-sm pr-4">{q}</span>
                          {openFaq === i ? <ChevronUp size={16} className="flex-shrink-0 text-brand-red" /> : <ChevronDown size={16} className="flex-shrink-0 text-[#212121]/40" />}
                        </button>
                        <AnimatePresence>
                          {openFaq === i && (
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: 'auto' }}
                              exit={{ height: 0 }}
                              className="overflow-hidden"
                            >
                              <p className="px-4 pb-4 font-inter text-[#212121]/70 text-sm leading-relaxed border-t border-gray-50">{a}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </AnimatedSection>
                  ))}
                </div>
                {/* Question form */}
                <AnimatedSection delay={0.4} className="mt-10 bg-gray-50 rounded-2xl p-6">
                  <h3 className="font-raleway font-semibold text-navy mb-4">Une autre question ?</h3>
                  <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                    <input type="email" placeholder="Votre email" className="input-field" />
                    <textarea placeholder="Votre question..." className="input-field resize-none" rows={3} />
                    <button type="submit" className="btn-primary text-sm">Envoyer</button>
                  </form>
                </AnimatedSection>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showSuccess && <ConfirmationModal onClose={() => setShowSuccess(false)} />}
    </>
  );
}
