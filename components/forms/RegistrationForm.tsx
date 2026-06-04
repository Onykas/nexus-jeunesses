'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, ChevronLeft, Loader2, Upload } from 'lucide-react';
import { toast } from '@/components/ui/Toaster';
import { countries } from '@/lib/countries';

const roleOptions = [
  { value: 'spectateur', label: 'Spectateur', desc: 'Assister à l\'événement en tant que public', icon: '👁️' },
  { value: 'volontaire', label: 'Volontaire', desc: 'Rejoindre l\'équipe organisatrice sur place', icon: '🤝' },
  { value: 'partenaire', label: 'Partenaire', desc: 'Soutenir l\'événement en tant que partenaire', icon: '🏢' },
  { value: 'media', label: 'Média', desc: 'Couvrir l\'événement (accréditation requise)', icon: '📷' },
];

const step1Schema = z.object({ role: z.string().min(1, 'Veuillez choisir un rôle') });

const step2Schema = z.object({
  prenom: z.string().min(2, 'Prénom requis (min. 2 caractères)'),
  nom: z.string().min(2, 'Nom requis (min. 2 caractères)'),
  email: z.string().email('Email invalide'),
  telephone: z.string().min(8, 'Téléphone invalide').regex(/^\+?[0-9\s\-()]+$/, 'Format invalide'),
  nationalite: z.string().min(1, 'Nationalité requise'),
  dateNaissance: z.string().min(1, 'Date de naissance requise'),
});

const step3BaseSchema = z.object({
  motivation: z.string().max(500, 'Maximum 500 caractères').optional(),
  organisation: z.string().optional(),
  secteur: z.string().optional(),
  nomMedia: z.string().optional(),
  typeMedia: z.string().optional(),
  lienPublication: z.string().optional(),
  consentEmail: z.boolean().optional(),
  consentSMS: z.boolean().optional(),
  consentWhatsapp: z.boolean().optional(),
});

type FormData = z.infer<typeof step1Schema> &
  z.infer<typeof step2Schema> &
  z.infer<typeof step3BaseSchema> & { rgpd: boolean };

const secteurs = [
  'Culture & Arts', 'Diplomatie', 'Éducation & Recherche', 'Entrepreneuriat',
  'Finance & Économie', 'Humanitaire', 'Médias & Communication', 'Politique & Gouvernance',
  'Santé', 'Technologie & Innovation', 'Autre',
];

const typesMedia = ['Presse écrite', 'Télévision', 'Radio', 'Web / Numérique', 'Podcast', 'Autre'];

export default function RegistrationForm({ onSuccess }: { onSuccess?: () => void }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [volunteerPlaces] = useState(12);

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
      dateNaissance: formData.dateNaissance || '',
    },
  });

  const step3Form = useForm<z.infer<typeof step3BaseSchema>>({
    defaultValues: { motivation: formData.motivation || '' },
  });

  const currentRole = formData.role || step1Form.watch('role');

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
    if (formData.role === 'volontaire' && !cvFile) {
      toast('Veuillez uploader votre CV (PDF).', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      const body = new FormData();
      Object.entries(formData).forEach(([k, v]) => {
        if (v !== undefined && v !== null) body.append(k, String(v));
      });
      if (cvFile) body.append('cv', cvFile);

      const res = await fetch('/api/inscriptions', {
        method: 'POST',
        body,
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
                <div className={`flex-1 h-1 mx-1 rounded transition-all duration-500 ${i + 1 < step ? 'bg-brand-green' : 'bg-gray-100'}`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-[#212121]/50 font-inter mt-1">
          <span>Rôle</span>
          <span>Infos</span>
          <span>Détails</span>
          <span>Confirmation</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 1 — Role */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h3 className="font-montserrat font-bold text-navy text-xl mb-2">Je souhaite participer en tant que…</h3>
            <p className="font-inter text-[#212121]/60 text-sm mb-6">Choisissez le rôle qui vous correspond.</p>
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
                    <input type="radio" value={value} {...step1Form.register('role')} className="sr-only" />
                    <span className="text-2xl">{icon}</span>
                    <div className="flex-1">
                      <div className="font-raleway font-semibold text-navy text-sm">{label}</div>
                      <div className="font-inter text-[#212121]/55 text-xs">{desc}</div>
                      {value === 'volontaire' && (
                        <div className="font-inter text-brand-orange text-xs mt-0.5">
                          {volunteerPlaces} place{volunteerPlaces !== 1 ? 's' : ''} restante{volunteerPlaces !== 1 ? 's' : ''} dans l'équipe
                        </div>
                      )}
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
            <form onSubmit={handleStep2} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Prénom *</label>
                  <input {...step2Form.register('prenom')} className="input-field" placeholder="Prénom" />
                  {step2Form.formState.errors.prenom && <p className="text-brand-red text-xs mt-1">{step2Form.formState.errors.prenom.message}</p>}
                </div>
                <div>
                  <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Nom *</label>
                  <input {...step2Form.register('nom')} className="input-field" placeholder="Nom" />
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
                  {countries.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                {step2Form.formState.errors.nationalite && <p className="text-brand-red text-xs mt-1">{step2Form.formState.errors.nationalite.message}</p>}
              </div>
              <div>
                <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Date de naissance *</label>
                <input {...step2Form.register('dateNaissance')} type="date" className="input-field" />
                {step2Form.formState.errors.dateNaissance && <p className="text-brand-red text-xs mt-1">{step2Form.formState.errors.dateNaissance.message}</p>}
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

        {/* STEP 3 — Role-specific details */}
        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h3 className="font-montserrat font-bold text-navy text-xl mb-2">
              {currentRole === 'spectateur' && 'Rappels & préférences'}
              {currentRole === 'volontaire' && 'Rejoindre l\'équipe'}
              {currentRole === 'partenaire' && 'Votre organisation'}
              {currentRole === 'media' && 'Accréditation média'}
            </h3>
            <p className="font-inter text-[#212121]/60 text-sm mb-6">
              {currentRole === 'spectateur' && 'Quelques préférences pour votre venue.'}
              {currentRole === 'volontaire' && 'Partagez votre motivation et uploadez votre CV.'}
              {currentRole === 'partenaire' && 'Renseignez votre organisation pour l\'accréditation partenaire.'}
              {currentRole === 'media' && 'Renseignez vos informations de couverture média.'}
            </p>

            <form onSubmit={handleStep3} className="space-y-4">
              {/* Volontaire */}
              {currentRole === 'volontaire' && (
                <>
                  <div>
                    <label className="font-inter text-xs text-[#212121]/60 mb-1 block">
                      Motivation * (max 500 caractères)
                    </label>
                    <textarea
                      {...step3Form.register('motivation')}
                      className="input-field resize-none"
                      rows={4}
                      placeholder="Pourquoi souhaitez-vous rejoindre l'équipe organisatrice NEXUS ?"
                      maxLength={500}
                    />
                    <p className="text-xs text-[#212121]/40 text-right mt-1">
                      {step3Form.watch('motivation')?.length || 0}/500
                    </p>
                  </div>
                  <div>
                    <label className="font-inter text-xs text-[#212121]/60 mb-1 block">CV (PDF) *</label>
                    <label className="flex items-center gap-3 p-3 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-navy/40 transition-colors">
                      <Upload size={18} className="text-[#212121]/40 flex-shrink-0" />
                      <span className="font-inter text-sm text-[#212121]/60 truncate">
                        {cvFile ? cvFile.name : 'Uploader votre CV (PDF)'}
                      </span>
                      <input
                        type="file"
                        accept=".pdf"
                        className="sr-only"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) setCvFile(f);
                        }}
                      />
                    </label>
                    <p className="font-inter text-[#212121]/40 text-xs mt-1">
                      Après soumission : Merci, l'équipe reviendra vers vous.
                    </p>
                  </div>
                </>
              )}

              {/* Partenaire */}
              {currentRole === 'partenaire' && (
                <>
                  <div>
                    <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Nom de l'organisation *</label>
                    <input {...step3Form.register('organisation')} className="input-field" placeholder="Votre organisation" />
                  </div>
                  <div>
                    <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Secteur *</label>
                    <select {...step3Form.register('secteur')} className="input-field bg-transparent">
                      <option value="">Choisir un secteur</option>
                      {secteurs.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Message (optionnel)</label>
                    <textarea {...step3Form.register('motivation')} className="input-field resize-none" rows={3} placeholder="Votre message ou intentions de partenariat" />
                  </div>
                </>
              )}

              {/* Média */}
              {currentRole === 'media' && (
                <>
                  <div>
                    <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Nom du média *</label>
                    <input {...step3Form.register('nomMedia')} className="input-field" placeholder="Nom de votre média" />
                  </div>
                  <div>
                    <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Type de média *</label>
                    <select {...step3Form.register('typeMedia')} className="input-field bg-transparent">
                      <option value="">Choisir le type</option>
                      {typesMedia.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Lien vers une publication récente</label>
                    <input {...step3Form.register('lienPublication')} type="url" className="input-field" placeholder="https://..." />
                  </div>
                </>
              )}

              {/* Rappels pour tous */}
              <div>
                <label className="font-inter text-xs text-[#212121]/60 mb-2 block">Rappels (optionnel)</label>
                {[
                  { name: 'consentEmail' as const, label: 'Email (J-7, J-1)' },
                  { name: 'consentSMS' as const, label: 'SMS (J-1)' },
                  { name: 'consentWhatsapp' as const, label: 'WhatsApp (J-2)' },
                ].map(({ name, label }) => (
                  <label key={name} className="flex items-center gap-2 py-1 cursor-pointer">
                    <input type="checkbox" {...step3Form.register(name)} className="w-4 h-4 accent-navy" />
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
              {[
                ['Rôle', formData.role],
                ['Nom complet', `${formData.prenom} ${formData.nom}`],
                ['Email', formData.email],
                ['Téléphone', formData.telephone],
                ['Nationalité', formData.nationalite],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-[#212121]/50">{label}</span>
                  <span className="font-medium text-navy capitalize">{value}</span>
                </div>
              ))}
              <div className="border-t border-gray-200 pt-2 flex justify-between">
                <span className="text-[#212121]/50">Événement</span>
                <span className="font-medium text-navy">NEXUS SPECTACLE · 11 Juil. 2026 · 15h00</span>
              </div>
            </div>

            {formData.role === 'volontaire' && cvFile && (
              <div className="flex items-center gap-2 bg-brand-green/8 border border-brand-green/20 rounded-lg p-3 mb-4">
                <Check size={14} className="text-brand-green flex-shrink-0" />
                <span className="font-inter text-xs text-brand-green">CV joint : {cvFile.name}</span>
              </div>
            )}

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
                <a href="/politique-confidentialite" className="text-brand-red underline" target="_blank">Politique de confidentialité</a>.
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
                {isSubmitting
                  ? <><Loader2 size={16} className="animate-spin" /> Envoi…</>
                  : <><Check size={16} /> CONFIRMER</>}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
