'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Utensils, Users, Globe, Shield, ChevronDown, ChevronUp, Loader2, Check } from 'lucide-react';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { toast } from '@/components/ui/Toaster';

const schema = z.object({
  nom: z.string().min(2, 'Nom complet requis'),
  titre: z.string().min(2, 'Titre professionnel requis'),
  secteur: z.string().min(1, 'Secteur requis'),
  organisation: z.string().min(2, 'Organisation requise'),
  email: z.string().email('Email invalide'),
  telephone: z.string().min(8, 'Téléphone invalide'),
  motivation: z.string().min(50, 'Minimum 50 caractères').max(500, 'Maximum 500 caractères'),
  rgpd: z.literal(true, { errorMap: () => ({ message: 'Requis' }) }),
});

type FormData = z.infer<typeof schema>;

const secteurs = ['Politique & Gouvernance', 'Finance & Économie', 'Technologie & Innovation', 'Culture & Arts', 'Diplomatie & Relations Internationales', 'Enseignement & Recherche', 'Entrepreneuriat', 'Médias & Communication', 'Santé & Humanitaire', 'Autre'];

const protocole = [
  { icon: Shield, title: 'Candidatures sélectionnées', desc: 'Chaque candidature est examinée par le comité de sélection NEXUS. Les places sont attribuées sur dossier.' },
  { icon: Globe, title: 'Registre diplomatique', desc: 'Le dîner se déroule dans un cadre formel. Tenue de soirée exigée. Protocole diplomatique appliqué.' },
  { icon: Users, title: 'Cercle restreint', desc: 'Nombre de couverts limité à 60 personnes. Leaders politiques, entrepreneurs et académiques.' },
  { icon: Utensils, title: 'Format exclusif', desc: 'Dîner de gala, discours d\'honneur, networking stratégique en table ronde. Lieu TBD.' },
];

const faqs = [
  { q: 'Qui peut candidater au NEXUS DÎNER ?', a: 'Le NEXUS DÎNER est réservé aux leaders confirmés : décideurs politiques, entrepreneurs à impact, académiciens de rang, diplomates et figures culturelles. Les candidatures sont examinées sur la base du profil et de la motivation.' },
  { q: 'Comment fonctionne la sélection ?', a: 'Le comité de sélection NEXUS examine chaque candidature sous 48h. Les critères incluent : niveau de leadership, pertinence du profil avec la vision NEXUS, et complémentarité avec les autres invités.' },
  { q: 'Quel est le dresscode ?', a: 'Tenue de soirée obligatoire. Costume-cravate pour les hommes, robe de soirée ou tailleur élégant pour les femmes. Le protocole diplomatique est strictement appliqué.' },
  { q: 'Où se déroulera le dîner ?', a: 'Le lieu sera communiqué aux candidats sélectionnés. Un espace diplomatique de prestige à Rabat est en cours de finalisation.' },
  { q: 'Y a-t-il des frais de participation ?', a: 'Les détails financiers sont communiqués après sélection et varient selon le type de participation (invité officiel, partenaire, sponsor de table).' },
];

export default function DinerPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, type: 'diner' }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
      toast('Candidature reçue. Réponse sous 48h.', 'success');
    } catch {
      toast('Erreur lors de l\'envoi. Réessayez.', 'error');
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1E3C] via-[#0A1E3C]/70 to-[#0A1E3C]/30" />
        <div className="relative container-xl pb-16 pt-32 text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 text-xs font-raleway font-semibold px-3 py-1.5 rounded-full mb-5">
              🍽️ Sur invitation — Places très limitées
            </span>
            <h1 className="font-montserrat font-black text-6xl md:text-7xl lg:text-8xl leading-tight mb-4">
              LE DÎNER<br />
              <span className="text-brand-red">DES LEADERS</span>
            </h1>
            <p className="font-raleway text-xl text-white/75 max-w-xl leading-relaxed mb-6">
              Une soirée de réseautage stratégique pour définir l'avenir de la jeunesse
              africaine. Bâtir des ponts là où d'autres élèvent des murs.
            </p>
            <a href="#candidature" className="inline-flex items-center gap-2 btn-red">
              Soumettre ma candidature
            </a>
          </motion.div>
        </div>
      </section>

      {/* Le protocole NEXUS */}
      <section className="py-20 bg-white">
        <div className="container-xl">
          <AnimatedSection className="text-center mb-14">
            <span className="font-raleway text-brand-red font-semibold text-sm uppercase tracking-widest mb-3 block">Format exclusif</span>
            <h2 className="section-title text-3xl md:text-4xl mb-3">Le Protocole NEXUS</h2>
            <p className="section-subtitle max-w-xl mx-auto">Un dîner pensé pour créer des connexions qui durent. Pas un simple repas — un acte diplomatique.</p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {protocole.map(({ icon: Icon, title, desc }, i) => (
              <AnimatedSection key={title} delay={i * 0.1}>
                <div className="card p-6 text-center h-full">
                  <div className="w-12 h-12 bg-navy/8 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon size={22} className="text-navy" />
                  </div>
                  <h3 className="font-raleway font-semibold text-navy text-sm mb-2">{title}</h3>
                  <p className="font-inter text-[#212121]/60 text-xs leading-relaxed">{desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Elite Net + Gastronomie split */}
          <div className="grid md:grid-cols-2 gap-6 mt-10">
            <AnimatedSection delay={0.1}>
              <div className="bg-navy rounded-2xl p-8 text-white">
                <h3 className="font-montserrat font-bold text-lg mb-3">Elite Net</h3>
                <p className="font-inter text-white/70 text-sm leading-relaxed mb-4">
                  Le NEXUS DÎNER est bien plus qu'une soirée. C'est un carrefour stratégique où
                  décideurs et visionnaires créent des synergies durables.
                </p>
                <ul className="space-y-2">
                  {['Réseau diplomatique élargi', 'Opportunités de partenariat', 'Visibilité institutionnelle', 'Accès aux leaders NEXUS'].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-white/70 text-xs font-inter">
                      <Check size={12} className="text-brand-green flex-shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <div className="bg-gray-50 rounded-2xl p-8">
                <h3 className="font-montserrat font-bold text-navy text-lg mb-3">Gastronomie</h3>
                <p className="font-inter text-[#212121]/70 text-sm leading-relaxed mb-4">
                  Un menu soigneusement élaboré mêlant gastronomie marocaine et internationale.
                  Une expérience culinaire à la hauteur du standing de l'événement.
                </p>
                <ul className="space-y-2">
                  {['Menu de gala 4 services', 'Cuisine fusion afro-méditerranéenne', 'Vins & boissons sélectionnés', 'Options véganes & halal disponibles'].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-[#212121]/60 text-xs font-inter">
                      <Check size={12} className="text-brand-orange flex-shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Candidature */}
      <section id="candidature" className="py-20 bg-gray-50 scroll-mt-20">
        <div className="container-xl">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <AnimatedSection direction="left">
              <span className="font-raleway text-brand-red font-semibold text-sm uppercase tracking-widest mb-3 block">Candidature</span>
              <h2 className="section-title text-3xl mb-4">Registre de candidature</h2>
              <p className="section-subtitle leading-relaxed mb-6">
                Soumettez votre candidature pour rejoindre le cercle des leaders NEXUS.
                Chaque dossier est examiné par notre comité de sélection sous 48h.
              </p>
              <div className="bg-white rounded-xl p-5 border border-gray-100">
                <p className="font-raleway font-semibold text-navy text-sm mb-2">Critères de sélection</p>
                <ul className="space-y-1.5">
                  {['Profil de leadership avéré', 'Engagement pour la jeunesse africaine', 'Représentativité sectorielle', 'Complémentarité avec les invités'].map((c) => (
                    <li key={c} className="flex items-center gap-2 font-inter text-[#212121]/65 text-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-red flex-shrink-0" /> {c}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Accréditations */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                {[
                  { label: 'Accréditations Presse', desc: 'Journalistes & médias accrédités' },
                  { label: 'Partenaires Institutionnels', desc: 'Ambassades & organisations' },
                ].map(({ label, desc }) => (
                  <div key={label} className="bg-navy text-white rounded-xl p-4">
                    <div className="font-raleway font-semibold text-xs mb-1">{label}</div>
                    <div className="font-inter text-white/60 text-xs">{desc}</div>
                    <a href="mailto:protocole@nexusjeunesses.org" className="inline-block mt-2 text-brand-orange text-xs hover:underline">Contacter →</a>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            {/* Form */}
            <AnimatedSection direction="right" delay={0.15}>
              {submitted ? (
                <div className="card p-10 text-center">
                  <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check size={32} className="text-brand-green" />
                  </div>
                  <h3 className="font-montserrat font-bold text-navy text-xl mb-2">Candidature reçue</h3>
                  <p className="font-inter text-[#212121]/65 text-sm">
                    Merci. Notre comité de sélection examinera votre dossier et vous répondra
                    par email dans les <strong>48 heures</strong>.
                  </p>
                </div>
              ) : (
                <div className="card p-8">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Nom complet *</label>
                        <input {...register('nom')} className="input-field" placeholder="Prénom Nom" />
                        {errors.nom && <p className="text-brand-red text-xs mt-1">{errors.nom.message}</p>}
                      </div>
                      <div>
                        <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Titre *</label>
                        <input {...register('titre')} className="input-field" placeholder="PDG, Ministre, Professeur…" />
                        {errors.titre && <p className="text-brand-red text-xs mt-1">{errors.titre.message}</p>}
                      </div>
                      <div>
                        <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Secteur *</label>
                        <select {...register('secteur')} className="input-field bg-transparent">
                          <option value="">Choisir…</option>
                          {secteurs.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                        {errors.secteur && <p className="text-brand-red text-xs mt-1">{errors.secteur.message}</p>}
                      </div>
                      <div className="col-span-2">
                        <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Organisation *</label>
                        <input {...register('organisation')} className="input-field" placeholder="Nom de votre organisation" />
                        {errors.organisation && <p className="text-brand-red text-xs mt-1">{errors.organisation.message}</p>}
                      </div>
                      <div>
                        <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Email *</label>
                        <input {...register('email')} type="email" className="input-field" placeholder="votre@email.com" />
                        {errors.email && <p className="text-brand-red text-xs mt-1">{errors.email.message}</p>}
                      </div>
                      <div>
                        <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Téléphone *</label>
                        <input {...register('telephone')} type="tel" className="input-field" placeholder="+212 6XX…" />
                        {errors.telephone && <p className="text-brand-red text-xs mt-1">{errors.telephone.message}</p>}
                      </div>
                      <div className="col-span-2">
                        <label className="font-inter text-xs text-[#212121]/60 mb-1 block">
                          Pourquoi souhaitez-vous participer ? * (50–500 caractères)
                        </label>
                        <textarea {...register('motivation')} className="input-field resize-none" rows={4} placeholder="Votre motivation et votre apport au cercle de leadership NEXUS…" />
                        <p className="text-xs text-[#212121]/40 text-right mt-1">{watch('motivation')?.length || 0}/500</p>
                        {errors.motivation && <p className="text-brand-red text-xs mt-1">{errors.motivation.message}</p>}
                      </div>
                    </div>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" {...register('rgpd')} className="w-4 h-4 mt-0.5 accent-navy flex-shrink-0" />
                      <span className="font-inter text-xs text-[#212121]/60 leading-relaxed">
                        J'accepte que mes données soient traitées pour l'examen de ma candidature, conformément au RGPD.
                      </span>
                    </label>
                    {errors.rgpd && <p className="text-brand-red text-xs">{errors.rgpd.message}</p>}

                    <button type="submit" disabled={isSubmitting} className="btn-primary w-full flex items-center justify-center gap-2">
                      {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Envoi en cours…</> : 'Soumettre ma candidature'}
                    </button>
                  </form>
                </div>
              )}
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 bg-white">
        <div className="container-xl max-w-2xl mx-auto">
          <AnimatedSection className="text-center mb-10">
            <h2 className="section-title text-2xl mb-2">Questions sur le Dîner</h2>
          </AnimatedSection>
          <div className="space-y-2">
            {faqs.map(({ q, a }, i) => (
              <AnimatedSection key={q} delay={i * 0.05}>
                <div className="border border-gray-100 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-raleway font-semibold text-navy text-sm pr-4">{q}</span>
                    {openFaq === i ? <ChevronUp size={16} className="text-brand-red flex-shrink-0" /> : <ChevronDown size={16} className="text-[#212121]/40 flex-shrink-0" />}
                  </button>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="overflow-hidden">
                      <p className="px-4 pb-4 font-inter text-[#212121]/65 text-sm leading-relaxed border-t border-gray-50">{a}</p>
                    </motion.div>
                  )}
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
