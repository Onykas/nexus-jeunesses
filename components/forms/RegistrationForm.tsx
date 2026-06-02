'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, ChevronLeft, User, Mail, Phone, Globe, Calendar, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/Toaster';

const roleOptions = [
  { value: 'spectateur', label: 'Spectateur', desc: 'Assister à l\'événement en tant que public', icon: '👁️' },
  { value: 'participant', label: 'Participant', desc: 'Participer activement aux activités', icon: '🎯' },
  { value: 'volontaire', label: 'Volontaire', desc: 'Aider à l\'organisation sur place', icon: '🤝' },
  { value: 'partenaire', label: 'Partenaire', desc: 'Soutenir l\'événement en tant que sponsor', icon: '🏢' },
  { value: 'media', label: 'Média', desc: 'Couvrir l\'événement (accréditation requise)', icon: '📷' },
];

const nationalites = [
  'Algérie', 'Angola', 'Bénin', 'Burkina Faso', 'Burundi', 'Cameroun',
  'Cap-Vert', 'Centrafrique', 'Comores', 'Congo', 'DR Congo', 'Côte d\'Ivoire',
  'Djibouti', 'Égypte', 'Érythrée', 'Éthiopie', 'Gabon', 'Gambie',
  'Ghana', 'Guinée', 'Guinée Équatoriale', 'Guinée-Bissau', 'Kenya',
  'Lesotho', 'Libéria', 'Libye', 'Madagascar', 'Malawi', 'Mali',
  'Maroc', 'Mauritanie', 'Maurice', 'Mozambique', 'Namibie', 'Niger',
  'Nigeria', 'Ouganda', 'Rwanda', 'São Tomé-et-Príncipe', 'Sénégal',
  'Seychelles', 'Sierra Leone', 'Somalie', 'Soudan', 'Soudan du Sud',
  'Swaziland', 'Tanzanie', 'Tchad', 'Togo', 'Tunisie', 'Zambie', 'Zimbabwe',
  'Autre',
];

const step1Schema = z.object({ role: z.string().min(1, 'Veuillez choisir un rôle') });

const step2Schema = z.object({
  prenom: z.string().min(2, 'Prénom requis (min. 2 caractères)'),
  nom: z.string().min(2, 'Nom requis (min. 2 caractères)'),
  email: z.string().email('Email invalide'),
  telephone: z.string().min(8, 'Téléphone invalide').regex(/^\+?[0-9\s\-()]+$/, 'Format invalide'),
  nationalite: z.string().min(1, 'Nationalité requise'),
  dateNaissance: z.string().optional(),
});

const step3Schema = z.object({
  motivation: z.string().max(200, 'Maximum 200 caractères').optional(),
  besoinsSpeciaux: z.array(z.string()).optional(),
  consentEmail: z.boolean().optional(),
  consentSMS: z.boolean().optional(),
  consentWhatsapp: z.boolean().optional(),
});

type FormData = z.infer<typeof step1Schema> &
  z.infer<typeof step2Schema> &
  z.infer<typeof step3Schema> & { rgpd: boolean };

export default function RegistrationForm({ onSuccess }: { onSuccess?: () => void }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = 4;

  const step1Form = useForm<z.infer<typeof step1Schema>>({
    resolver: zodResolver(step1Schema),
    defaultValues: { role: formData.role || '' },
  });

  const step2Form = useForm<z.infer<typeof step2Schema>>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      prenom: formData.prenom || '',
      nom: formData.nom || '',
      email: formData.email || '',
      telephone: formData.telephone || '',
      nationalite: formData.nationalite || '',
    },
  });

  const step3Form = useForm<z.infer<typeof step3Schema>>({
    defaultValues: { motivation: formData.motivation || '', besoinsSpeciaux: [] },
  });

  const handleStep1 = step1Form.handleSubmit((data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(2);
  });

  const handleStep2 = step2Form.handleSubmit((data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(3);
  });

  const handleStep3 = step3Form.handleSubmit((data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(4);
  });

  const handleSubmit = async () => {
    if (!(formData as any).rgpd) {
      toast('Veuillez accepter les conditions d\'utilisation.', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/inscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Erreur serveur');
      toast('Inscription confirmée ! Vérifiez votre email.', 'success');
      onSuccess?.();
    } catch (err: any) {
      toast(err.message || 'Une erreur est survenue.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className="flex items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 flex-shrink-0 ${
                  i + 1 < step
                    ? 'bg-brand-green text-white'
                    : i + 1 === step
                    ? 'bg-navy text-white'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {i + 1 < step ? <Check size={14} /> : i + 1}
              </div>
              {i < totalSteps - 1 && (
                <div
                  className={`flex-1 h-1 mx-1 rounded transition-all duration-500 ${i + 1 < step ? 'bg-brand-green' : 'bg-gray-100'}`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-[#212121]/50 font-inter mt-1">
          <span>Rôle</span>
          <span>Infos</span>
          <span>Motivations</span>
          <span>Confirmation</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 1 — Role */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h3 className="font-montserrat font-bold text-navy text-xl mb-2">Je souhaite participer en tant que...</h3>
            <p className="font-inter text-[#212121]/60 text-sm mb-6">Choisissez le rôle qui vous correspond le mieux.</p>
            <form onSubmit={handleStep1} className="space-y-3">
              {roleOptions.map(({ value, label, desc, icon }) => {
                const selected = step1Form.watch('role') === value;
                return (
                  <label
                    key={value}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      selected ? 'border-navy bg-navy/5' : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <input
                      type="radio"
                      value={value}
                      {...step1Form.register('role')}
                      className="sr-only"
                    />
                    <span className="text-2xl">{icon}</span>
                    <div className="flex-1">
                      <div className="font-raleway font-semibold text-navy text-sm">{label}</div>
                      <div className="font-inter text-[#212121]/55 text-xs">{desc}</div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selected ? 'border-navy bg-navy' : 'border-gray-300'}`}>
                      {selected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </label>
                );
              })}
              {step1Form.formState.errors.role && (
                <p className="text-brand-red text-xs font-inter">{step1Form.formState.errors.role.message}</p>
              )}
              <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
                Continuer <ChevronRight size={16} />
              </button>
            </form>
          </motion.div>
        )}

        {/* STEP 2 — Personal info */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h3 className="font-montserrat font-bold text-navy text-xl mb-2">Vos informations personnelles</h3>
            <p className="font-inter text-[#212121]/60 text-sm mb-6">Ces données seront utilisées pour votre confirmation.</p>
            <form onSubmit={handleStep2} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Prénom *</label>
                  <input {...step2Form.register('prenom')} className="input-field" placeholder="Amara" />
                  {step2Form.formState.errors.prenom && <p className="text-brand-red text-xs mt-1">{step2Form.formState.errors.prenom.message}</p>}
                </div>
                <div>
                  <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Nom *</label>
                  <input {...step2Form.register('nom')} className="input-field" placeholder="Kouassi" />
                  {step2Form.formState.errors.nom && <p className="text-brand-red text-xs mt-1">{step2Form.formState.errors.nom.message}</p>}
                </div>
              </div>
              <div>
                <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Email *</label>
                <input {...step2Form.register('email')} type="email" className="input-field" placeholder="votre@email.com" />
                {step2Form.formState.errors.email && <p className="text-brand-red text-xs mt-1">{step2Form.formState.errors.email.message}</p>}
              </div>
              <div>
                <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Téléphone * (format international)</label>
                <input {...step2Form.register('telephone')} type="tel" className="input-field" placeholder="+212 6XX XX XX XX" />
                {step2Form.formState.errors.telephone && <p className="text-brand-red text-xs mt-1">{step2Form.formState.errors.telephone.message}</p>}
              </div>
              <div>
                <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Nationalité *</label>
                <select {...step2Form.register('nationalite')} className="input-field bg-transparent">
                  <option value="">Sélectionnez votre nationalité</option>
                  {nationalites.map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
                {step2Form.formState.errors.nationalite && <p className="text-brand-red text-xs mt-1">{step2Form.formState.errors.nationalite.message}</p>}
              </div>
              <div>
                <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Date de naissance (optionnel)</label>
                <input {...step2Form.register('dateNaissance')} type="date" className="input-field" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setStep(1)} className="btn-secondary flex items-center gap-2 flex-1">
                  <ChevronLeft size={16} /> Retour
                </button>
                <button type="submit" className="btn-primary flex items-center justify-center gap-2 flex-1">
                  Continuer <ChevronRight size={16} />
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* STEP 3 — Motivations */}
        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h3 className="font-montserrat font-bold text-navy text-xl mb-2">Motivations & préférences</h3>
            <p className="font-inter text-[#212121]/60 text-sm mb-6">Aidez-nous à mieux vous accueillir.</p>
            <form onSubmit={handleStep3} className="space-y-5">
              <div>
                <label className="font-inter text-xs text-[#212121]/60 mb-1 block">
                  Pourquoi souhaitez-vous participer ? (optionnel, max 200 caractères)
                </label>
                <textarea
                  {...step3Form.register('motivation')}
                  className="input-field resize-none"
                  rows={3}
                  placeholder="Votre motivation..."
                  maxLength={200}
                />
                <p className="text-xs text-[#212121]/40 text-right mt-1">
                  {step3Form.watch('motivation')?.length || 0}/200
                </p>
              </div>
              <div>
                <label className="font-inter text-xs text-[#212121]/60 mb-2 block">Besoins spéciaux (optionnel)</label>
                {['Accessibilité PMR', 'Régime alimentaire particulier', 'Interprétariat', 'Autre'].map((b) => (
                  <label key={b} className="flex items-center gap-2 py-1 cursor-pointer">
                    <input
                      type="checkbox"
                      value={b}
                      {...step3Form.register('besoinsSpeciaux')}
                      className="w-4 h-4 accent-navy"
                    />
                    <span className="font-inter text-sm text-[#212121]/70">{b}</span>
                  </label>
                ))}
              </div>
              <div>
                <label className="font-inter text-xs text-[#212121]/60 mb-2 block">Rappels (optionnel)</label>
                {[
                  { name: 'consentEmail', label: 'Email (J-30, J-14, J-7, J-3, J-1)' },
                  { name: 'consentSMS', label: 'SMS (J-5, J-0)' },
                  { name: 'consentWhatsapp', label: 'WhatsApp (J-2)' },
                ].map(({ name, label }) => (
                  <label key={name} className="flex items-center gap-2 py-1 cursor-pointer">
                    <input
                      type="checkbox"
                      {...step3Form.register(name as any)}
                      className="w-4 h-4 accent-navy"
                      defaultChecked={name === 'consentEmail'}
                    />
                    <span className="font-inter text-sm text-[#212121]/70">{label}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setStep(2)} className="btn-secondary flex items-center gap-2 flex-1">
                  <ChevronLeft size={16} /> Retour
                </button>
                <button type="submit" className="btn-primary flex items-center justify-center gap-2 flex-1">
                  Continuer <ChevronRight size={16} />
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* STEP 4 — Confirmation */}
        {step === 4 && (
          <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h3 className="font-montserrat font-bold text-navy text-xl mb-2">Confirmation de votre inscription</h3>
            <p className="font-inter text-[#212121]/60 text-sm mb-6">Vérifiez vos informations avant de confirmer.</p>

            <div className="bg-gray-50 rounded-xl p-4 space-y-2 mb-6 text-sm font-inter">
              <div className="flex justify-between">
                <span className="text-[#212121]/50">Rôle</span>
                <span className="font-medium text-navy capitalize">{formData.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#212121]/50">Nom complet</span>
                <span className="font-medium text-navy">{formData.prenom} {formData.nom}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#212121]/50">Email</span>
                <span className="font-medium text-navy">{formData.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#212121]/50">Téléphone</span>
                <span className="font-medium text-navy">{formData.telephone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#212121]/50">Nationalité</span>
                <span className="font-medium text-navy">{formData.nationalite}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between">
                <span className="text-[#212121]/50">Événement</span>
                <span className="font-medium text-navy">NEXUS SPECTACLE · 11 Juil. 2026</span>
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer mb-6">
              <input
                type="checkbox"
                className="w-4 h-4 mt-0.5 accent-navy flex-shrink-0"
                onChange={(e) => setFormData((prev) => ({ ...prev, rgpd: e.target.checked }))}
              />
              <span className="font-inter text-xs text-[#212121]/60 leading-relaxed">
                J'accepte les{' '}
                <a href="/cgv" className="text-brand-red underline" target="_blank">Conditions d'utilisation</a>
                {' '}et la{' '}
                <a href="/politique-confidentialite" className="text-brand-red underline" target="_blank">Politique de confidentialité</a>
                . Je comprends que mes données seront traitées conformément au RGPD.
              </span>
            </label>

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(3)} className="btn-secondary flex items-center gap-2 flex-1">
                <ChevronLeft size={16} /> Retour
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !(formData as any).rgpd}
                className="btn-red flex items-center justify-center gap-2 flex-1 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <><Loader2 size={16} className="animate-spin" /> Envoi...</>
                ) : (
                  <><Check size={16} /> CONFIRMER</>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
