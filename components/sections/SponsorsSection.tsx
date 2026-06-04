'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, Loader2, Check } from 'lucide-react';
import AnimatedSection from '@/components/ui/AnimatedSection';

const institutionnels = [
  { nom: 'Université Mohammed V', mention: null, logo: '/images/universite-mohammed-v.png' },
  { nom: 'Pôle Vie Étudiante', mention: 'Université Mohammed V de Rabat', logo: '/images/pole-vie-etudiante.png' },
  { nom: 'Agence Marocaine de Coopération Internationale (AMCI)', mention: null, logo: '/images/amci.png' },
  { nom: 'Ambassade de la République Démocratique du Congo', mention: null, logo: '/images/ambassade-rdc.png' },
];

const organisateurs = [
  { nom: 'UESCOM', desc: 'Union des Étudiants et Stagiaires Congolais au Maroc', logo: '/images/uescom.png' },
  { nom: 'Speak To Lead', desc: "Étudiants Ambassadeurs de l'Université Mohammed V", logo: '/images/speak-to-lead.png' },
  { nom: 'CESAM', desc: 'Confédération des Étudiants, Élèves et Stagiaires Africains Étrangers au Maroc', logo: '/images/cesam.png' },
];

function PartnerModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ nomComplet: '', organisation: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/partenariat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setDone(true);
    } catch {
      setError("Erreur lors de l'envoi. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label="Fermer"
        >
          <X size={16} />
        </button>

        {done ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={28} className="text-brand-green" />
            </div>
            <h3 className="font-montserrat font-bold text-navy text-lg mb-2">Demande envoyée !</h3>
            <p className="font-inter text-[#212121]/60 text-sm">
              Votre demande de partenariat a bien été reçue. Notre équipe vous contactera très prochainement.
            </p>
            <button onClick={onClose} className="btn-primary mt-6 text-sm">Fermer</button>
          </div>
        ) : (
          <>
            <h3 className="font-montserrat font-bold text-navy text-xl mb-1">Devenir partenaire</h3>
            <p className="font-inter text-[#212121]/55 text-sm mb-6">
              Rejoignez NEXUS JEUNESSES et soutenez les jeunesses au Maroc.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Nom complet *</label>
                <input
                  type="text"
                  required
                  value={form.nomComplet}
                  onChange={(e) => setForm((p) => ({ ...p, nomComplet: e.target.value }))}
                  className="input-field"
                  placeholder="Prénom Nom"
                />
              </div>
              <div>
                <label className="font-inter text-xs text-[#212121]/60 mb-1 block">{"Nom de l'organisation *"}</label>
                <input
                  type="text"
                  required
                  value={form.organisation}
                  onChange={(e) => setForm((p) => ({ ...p, organisation: e.target.value }))}
                  className="input-field"
                  placeholder="Votre organisation"
                />
              </div>
              <div>
                <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Email *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  className="input-field"
                  placeholder="votre@email.com"
                />
              </div>
              <div>
                <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Message *</label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                  className="input-field resize-none"
                  placeholder="Décrivez votre intérêt pour un partenariat avec NEXUS JEUNESSES..."
                />
              </div>
              {error && <p className="text-brand-red text-xs">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {loading ? <><Loader2 size={16} className="animate-spin" /> Envoi...</> : 'Envoyer ma demande'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function SponsorsSection() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {showModal && <PartnerModal onClose={() => setShowModal(false)} />}

      {/* Soutien Institutionnel */}
      <section className="py-16 bg-white border-t border-gray-100" aria-label="Soutien institutionnel">
        <div className="container-xl">
          <AnimatedSection className="text-center mb-10">
            <span className="font-raleway text-brand-red font-semibold text-sm uppercase tracking-widest mb-2 block">
              Soutien Institutionnel
            </span>
            <h2 className="section-title text-2xl md:text-3xl">
              Ils soutiennent NEXUS JEUNESSES
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {institutionnels.map(({ nom, mention, logo }) => (
              <AnimatedSection key={nom}>
                <div className="card p-5 text-center h-full flex flex-col items-center justify-center gap-3">
                  <div className="relative w-20 h-16">
                    <Image
                      src={logo}
                      alt={nom}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <p className="font-raleway font-semibold text-navy text-sm leading-snug">{nom}</p>
                    {mention && (
                      <p className="font-inter text-[#212121]/50 text-xs mt-1 italic">{mention}</p>
                    )}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Associations / Fondations membres */}
      <section className="py-16 bg-gray-50 border-t border-gray-100" aria-label="Associations membres">
        <div className="container-xl">
          <AnimatedSection className="text-center max-w-2xl mx-auto">
            <h2 className="font-montserrat font-black text-navy text-2xl md:text-3xl uppercase tracking-wide mb-5">
              Associations &amp; Fondations membres de NEXUS
            </h2>
            <p className="font-raleway font-semibold text-[#212121]/80 text-base md:text-lg mb-5 leading-relaxed">
              Elles croient en la force de l&apos;union des jeunesses au Maroc.
            </p>
            <p className="font-inter text-[#212121]/60 text-sm md:text-base leading-relaxed">
              Ces organisations partagent une conviction commune : que le changement naît du rassemblement.
              En rejoignant l&apos;écosystème NEXUS, elles affirment leur engagement pour une jeunesse mondiale
              plus unie, plus visible et plus influente au Maroc et au-delà.
            </p>
          </AnimatedSection>
          {/* Espace réservé — logos gérés depuis l'espace admin */}
          <div className="mt-12 min-h-[80px]" />
        </div>
      </section>

      {/* Partenaires Officiels */}
      <section className="py-16 bg-white border-t border-gray-100" aria-label="Partenaires officiels">
        <div className="container-xl">
          <AnimatedSection className="text-center">
            <span className="font-raleway text-[#212121]/50 text-sm uppercase tracking-widest font-semibold block mb-4">
              Partenaires Officiels
            </span>
            <p className="font-inter text-[#212121]/55 text-sm mb-6 max-w-md mx-auto">
              Vous souhaitez associer votre image à NEXUS JEUNESSES et soutenir les jeunesses au Maroc ?
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary text-sm"
            >
              Devenir partenaire →
            </button>
          </AnimatedSection>
        </div>
      </section>

      {/* Les Organisateurs */}
      <section className="py-16 bg-gray-50 border-t border-gray-100" aria-label="Les organisateurs">
        <div className="container-xl">
          <AnimatedSection className="text-center mb-10">
            <span className="font-raleway text-brand-red font-semibold text-sm uppercase tracking-widest mb-2 block">
              Les Organisateurs
            </span>
            <h2 className="section-title text-2xl md:text-3xl">
              Portés par trois organisations
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {organisateurs.map(({ nom, desc, logo }) => (
              <AnimatedSection key={nom}>
                <div className="card p-6 text-center h-full flex flex-col items-center gap-4">
                  <div className="relative w-20 h-16">
                    <Image
                      src={logo}
                      alt={nom}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <p className="font-montserrat font-bold text-navy text-base">{nom}</p>
                    <p className="font-inter text-[#212121]/55 text-xs mt-1 leading-relaxed">{desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
