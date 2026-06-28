'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, ChevronLeft, Loader2, Upload, X, Lock, UserCircle2 } from 'lucide-react';
import { toast } from '@/components/ui/Toaster';
import { countries } from '@/lib/countries';

const SUJETS = [
  'Les réseaux sociaux rapprochent-ils réellement les peuples ?',
  'La liberté d\'expression doit-elle avoir des limites ?',
  'L\'Afrique doit-elle suivre son propre modèle de développement ?',
  'Les réseaux sociaux donnent-ils une voix à tous ou créent-ils de nouvelles formes de silence ?',
  'L\'échec est-il une étape indispensable vers la réussite ?',
  'Si les jeunes dirigeaient le monde que changerait-il ?',
  'Sommes-nous véritablement libre de nos choix ?',
  'Le progrès rend-il l\'humanité meilleure ?',
  'Faut-il protéger les cultures locales face à la mondialisation ?',
  'Les mots ont le pouvoir de guérir et de détruire.',
  'La parole est le miroir de la pensée.',
  'Celui qui ouvre une école ferme une prison.',
  'Une génération instruite vaut plus qu\'une génération assistée.',
  'Une culture ne s\'enrichit qu\'au contact d\'une autre.',
];

const roleOptions = [
  {
    value: 'participant',
    label: 'Participant',
    desc: 'Assister au NEXUS SPECTACLE en tant que public',
    icon: '👁️',
  },
  {
    value: 'candidat',
    label: 'Candidat au Concours d\'Éloquence',
    desc: 'S\'inscrire pour participer au concours et monter sur scène',
    icon: '🎤',
  },
];

const accountSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Minimum 8 caractères'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

const infoSchema = z.object({
  prenom: z.string().min(2, 'Prénom requis (min. 2 caractères)'),
  nom: z.string().min(2, 'Nom requis (min. 2 caractères)'),
  telephone: z.string().min(8, 'Téléphone invalide').regex(/^\+?[0-9\s\-()]+$/, 'Format invalide'),
  nationalite: z.string().min(1, 'Nationalité requise'),
  dateNaissance: z.string().min(1, 'Date de naissance requise'),
});

const candidatSchema = z.object({
  ville: z.string().min(1, 'Ville requise'),
  profession: z.string().min(1, 'Profession requise'),
  sujet: z.string().min(1, 'Veuillez choisir un sujet'),
  motivation: z.string().max(500, 'Maximum 500 caractères').optional(),
});

type AccountData = z.infer<typeof accountSchema>;
type InfoData = z.infer<typeof infoSchema>;
type CandidatData = z.infer<typeof candidatSchema>;

export default function RegistrationForm({ onSuccess }: { onSuccess?: () => void }) {
  const [step, setStep] = useState(0);
  const [role, setRole] = useState<'participant' | 'candidat' | ''>('');
  const [accountData, setAccountData] = useState<{ email: string; password: string } | null>(null);
  const [infoData, setInfoData] = useState<Partial<InfoData>>({});
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rgpd, setRgpd] = useState(false);

  // participant: steps 0→1→2→3(confirmation) = 4 steps
  // candidat:   steps 0→1→2→3(concours)→4(confirmation) = 5 steps
  const totalSteps = role === 'candidat' ? 5 : 4;

  const accountForm = useForm<AccountData>({
    resolver: zodResolver(accountSchema),
  });

  const infoForm = useForm<InfoData>({
    resolver: zodResolver(infoSchema),
    defaultValues: infoData,
  });

  const candidatForm = useForm<CandidatData>({
    resolver: zodResolver(candidatSchema),
  });

  /* ── STEP 0 : compte ── */
  const handleStep0 = accountForm.handleSubmit((data) => {
    setAccountData({ email: data.email, password: data.password });
    infoForm.setValue('prenom', infoData.prenom ?? '');
    setStep(1);
  });

  /* ── STEP 1 : rôle ── */
  const handleStep1 = () => {
    if (!role) { toast('Veuillez choisir un rôle.', 'error'); return; }
    setStep(2);
  };

  /* ── STEP 2 : infos ── */
  const handleStep2 = infoForm.handleSubmit((data) => {
    setInfoData(data);
    setStep(3);
  });

  /* ── STEP 3 : candidature ── */
  const handleStep3Candidat = candidatForm.handleSubmit(() => {
    setStep(4);
  });

  /* ── Soumission finale ── */
  const finalSubmit = async () => {
    if (!rgpd) { toast('Veuillez accepter les conditions.', 'error'); return; }
    setIsSubmitting(true);
    try {
      // 1. Créer le compte NEXUS (ou se connecter si déjà existant)
      if (accountData) {
        await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prenom: infoData.prenom,
            nom: infoData.nom,
            email: accountData.email,
            password: accountData.password,
            nationalite: infoData.nationalite,
            dateNaissance: infoData.dateNaissance,
          }),
        });
        // Connecter l'utilisateur dans tous les cas (nouveau compte ou existant)
        await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: accountData.email, password: accountData.password }),
        });
      }

      // 2. Soumettre l'inscription ou la candidature
      if (role === 'participant') {
        const body = new FormData();
        body.append('role', 'spectateur');
        body.append('rgpd', 'true');
        body.append('email', accountData?.email ?? '');
        Object.entries(infoData).forEach(([k, v]) => v != null && body.append(k, String(v)));
        const res = await fetch('/api/inscriptions', { method: 'POST', body });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json.error || `Erreur ${res.status}`);
      } else {
        const cd = candidatForm.getValues();
        const body = new FormData();
        body.append('email', accountData?.email ?? '');
        Object.entries(infoData).forEach(([k, v]) => v != null && body.append(k, String(v)));
        body.append('ville', cd.ville);
        body.append('profession', cd.profession);
        body.append('sujet', cd.sujet);
        if (cd.motivation) body.append('motivation', cd.motivation);
        if (videoFile) body.append('video', videoFile);
        const res = await fetch('/api/candidature-eloquence', { method: 'POST', body });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json.error || `Erreur ${res.status}`);
      }

      toast(
        role === 'candidat'
          ? 'Candidature envoyée ! Vérifiez votre email.'
          : 'Inscription confirmée ! Vérifiez votre email.',
        'success'
      );
      onSuccess?.();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Une erreur est survenue.';
      toast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepLabels = role === 'candidat'
    ? ['Compte', 'Rôle', 'Infos', 'Concours', 'Confirmation']
    : ['Compte', 'Rôle', 'Infos', 'Confirmation'];

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className="flex items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 flex-shrink-0 ${
                i < step ? 'bg-brand-green text-white' : i === step ? 'bg-navy text-white' : 'bg-gray-100 text-gray-400'
              }`}>
                {i < step ? <Check size={14} /> : i + 1}
              </div>
              {i < totalSteps - 1 && (
                <div className={`flex-1 h-1 mx-1 rounded transition-all duration-500 ${i < step ? 'bg-brand-green' : 'bg-gray-100'}`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-[#212121]/50 font-inter mt-1">
          {stepLabels.map((l) => <span key={l}>{l}</span>)}
        </div>
      </div>

      <AnimatePresence mode="wait">

        {/* ── STEP 0 — Compte NEXUS ── */}
        {step === 0 && (
          <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="flex items-center gap-2 mb-2">
              <UserCircle2 size={20} className="text-brand-red" />
              <h3 className="font-montserrat font-bold text-navy text-xl">Créer votre compte NEXUS</h3>
            </div>
            <p className="font-inter text-[#212121]/60 text-sm mb-6">
              Votre compte vous permettra de vous connecter et de voter pour les candidats.
            </p>
            <form onSubmit={handleStep0} className="space-y-4">
              <div>
                <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Email *</label>
                <input
                  {...accountForm.register('email')}
                  type="email"
                  className="input-field"
                  placeholder="votre@email.com"
                  autoComplete="email"
                />
                {accountForm.formState.errors.email && (
                  <p className="text-brand-red text-xs mt-1">{accountForm.formState.errors.email.message}</p>
                )}
              </div>
              <div>
                <label className="font-inter text-xs text-[#212121]/60 mb-1 flex items-center gap-1">
                  <Lock size={11} /> Mot de passe * (min. 8 caractères)
                </label>
                <input
                  {...accountForm.register('password')}
                  type="password"
                  className="input-field"
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
                {accountForm.formState.errors.password && (
                  <p className="text-brand-red text-xs mt-1">{accountForm.formState.errors.password.message}</p>
                )}
              </div>
              <div>
                <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Confirmer le mot de passe *</label>
                <input
                  {...accountForm.register('confirmPassword')}
                  type="password"
                  className="input-field"
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
                {accountForm.formState.errors.confirmPassword && (
                  <p className="text-brand-red text-xs mt-1">{accountForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>
              <p className="font-inter text-xs text-[#212121]/40 leading-relaxed">
                Si vous avez déjà un compte NEXUS, entrez le même email et mot de passe — vous serez reconnecté automatiquement.
              </p>
              <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
                Continuer <ChevronRight size={16} />
              </button>
            </form>
          </motion.div>
        )}

        {/* ── STEP 1 — Rôle ── */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h3 className="font-montserrat font-bold text-navy text-xl mb-2">Je souhaite…</h3>
            <p className="font-inter text-[#212121]/60 text-sm mb-6">Choisissez votre rôle pour l'événement du 11 juillet.</p>
            <div className="space-y-3 mb-6">
              {roleOptions.map(({ value, label, desc, icon }) => {
                const selected = role === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRole(value as 'participant' | 'candidat')}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left cursor-pointer transition-all duration-200 ${
                      selected ? 'border-navy bg-navy/5' : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <span className="text-2xl">{icon}</span>
                    <div className="flex-1">
                      <div className="font-raleway font-semibold text-navy text-sm">{label}</div>
                      <div className="font-inter text-[#212121]/55 text-xs">{desc}</div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selected ? 'border-navy bg-navy' : 'border-gray-300'}`}>
                      {selected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(0)} className="btn-secondary flex items-center gap-2 flex-1">
                <ChevronLeft size={16} /> Retour
              </button>
              <button type="button" onClick={handleStep1} className="btn-primary flex items-center justify-center gap-2 flex-1">
                Continuer <ChevronRight size={16} />
              </button>
            </div>
          </motion.div>
        )}

        {/* ── STEP 2 — Infos personnelles ── */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h3 className="font-montserrat font-bold text-navy text-xl mb-2">Vos informations</h3>
            <p className="font-inter text-[#212121]/60 text-sm mb-6">Ces données serviront à votre confirmation.</p>
            <form onSubmit={handleStep2} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Prénom *</label>
                  <input {...infoForm.register('prenom')} className="input-field" placeholder="Prénom" />
                  {infoForm.formState.errors.prenom && <p className="text-brand-red text-xs mt-1">{infoForm.formState.errors.prenom.message}</p>}
                </div>
                <div>
                  <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Nom *</label>
                  <input {...infoForm.register('nom')} className="input-field" placeholder="Nom" />
                  {infoForm.formState.errors.nom && <p className="text-brand-red text-xs mt-1">{infoForm.formState.errors.nom.message}</p>}
                </div>
              </div>
              {/* Email depuis le compte — affiché mais non modifiable */}
              <div>
                <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Email</label>
                <div className="input-field bg-gray-50 text-[#212121]/60 cursor-not-allowed flex items-center gap-2">
                  <Lock size={12} className="text-[#212121]/30 flex-shrink-0" />
                  <span className="text-sm">{accountData?.email}</span>
                </div>
              </div>
              <div>
                <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Téléphone *</label>
                <input {...infoForm.register('telephone')} type="tel" className="input-field" placeholder="+212 6XX XX XX XX" />
                {infoForm.formState.errors.telephone && <p className="text-brand-red text-xs mt-1">{infoForm.formState.errors.telephone.message}</p>}
              </div>
              <div>
                <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Nationalité *</label>
                <select {...infoForm.register('nationalite')} className="input-field bg-transparent">
                  <option value="">Sélectionnez votre nationalité</option>
                  {countries.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                {infoForm.formState.errors.nationalite && <p className="text-brand-red text-xs mt-1">{infoForm.formState.errors.nationalite.message}</p>}
              </div>
              <div>
                <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Date de naissance *</label>
                <input {...infoForm.register('dateNaissance')} type="date" className="input-field" />
                {infoForm.formState.errors.dateNaissance && <p className="text-brand-red text-xs mt-1">{infoForm.formState.errors.dateNaissance.message}</p>}
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

        {/* ── STEP 3 — Candidature (candidat uniquement) ── */}
        {step === 3 && role === 'candidat' && (
          <motion.div key="step3c" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h3 className="font-montserrat font-bold text-navy text-xl mb-2">Votre candidature</h3>
            <p className="font-inter text-[#212121]/60 text-sm mb-6">Choisissez votre sujet et présentez-vous.</p>
            <form onSubmit={handleStep3Candidat} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Ville *</label>
                  <input {...candidatForm.register('ville')} className="input-field" placeholder="Rabat, Casablanca…" />
                  {candidatForm.formState.errors.ville && <p className="text-brand-red text-xs mt-1">{candidatForm.formState.errors.ville.message}</p>}
                </div>
                <div>
                  <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Profession *</label>
                  <input {...candidatForm.register('profession')} className="input-field" placeholder="Étudiant, ingénieur…" />
                  {candidatForm.formState.errors.profession && <p className="text-brand-red text-xs mt-1">{candidatForm.formState.errors.profession.message}</p>}
                </div>
              </div>
              <div>
                <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Sujet choisi *</label>
                <select {...candidatForm.register('sujet')} className="input-field bg-transparent">
                  <option value="">Choisissez votre sujet de discours</option>
                  {SUJETS.map((s, i) => <option key={i} value={s}>{i + 1}. {s}</option>)}
                </select>
                {candidatForm.formState.errors.sujet && <p className="text-brand-red text-xs mt-1">{candidatForm.formState.errors.sujet.message}</p>}
              </div>
              <div>
                <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Motivation (optionnel, max 500 car.)</label>
                <textarea
                  {...candidatForm.register('motivation')}
                  className="input-field resize-none"
                  rows={3}
                  placeholder="Pourquoi voulez-vous participer au concours d'éloquence NEXUS ?"
                  maxLength={500}
                />
                <p className="text-xs text-[#212121]/40 text-right mt-1">
                  {candidatForm.watch('motivation')?.length ?? 0}/500
                </p>
              </div>
              <div>
                <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Vidéo de présentation (optionnel)</label>
                <label className="flex items-center gap-3 p-3 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-navy/40 transition-colors">
                  <Upload size={18} className="text-[#212121]/40 flex-shrink-0" />
                  <span className="font-inter text-sm text-[#212121]/60 truncate flex-1">
                    {videoFile ? videoFile.name : 'Uploader une vidéo (MP4, MOV — max 100 Mo)'}
                  </span>
                  {videoFile && (
                    <button type="button" onClick={(e) => { e.preventDefault(); setVideoFile(null); }} className="text-[#212121]/40 hover:text-brand-red">
                      <X size={14} />
                    </button>
                  )}
                  <input type="file" accept="video/mp4,video/quicktime,video/mov,video/*" className="sr-only"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) setVideoFile(f); }} />
                </label>
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

        {/* ── STEP 4 (participant) ou 4 (candidat) — Confirmation ── */}
        {((step === 3 && role === 'participant') || (step === 4 && role === 'candidat')) && (
          <motion.div key="confirmation" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h3 className="font-montserrat font-bold text-navy text-xl mb-2">Confirmation</h3>
            <p className="font-inter text-[#212121]/60 text-sm mb-6">Vérifiez vos informations avant de confirmer.</p>

            <div className="bg-gray-50 rounded-xl p-4 space-y-2 mb-6 text-sm font-inter">
              {[
                ['Compte', accountData?.email ?? ''],
                ['Rôle', role === 'candidat' ? 'Candidat au Concours d\'Éloquence' : 'Participant'],
                ['Nom complet', `${infoData.prenom} ${infoData.nom}`],
                ['Téléphone', infoData.telephone],
                ['Nationalité', infoData.nationalite],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-2">
                  <span className="text-[#212121]/50 flex-shrink-0">{label}</span>
                  <span className="font-medium text-navy text-right">{value}</span>
                </div>
              ))}
              {role === 'candidat' && (
                <>
                  <div className="flex justify-between gap-2">
                    <span className="text-[#212121]/50 flex-shrink-0">Sujet</span>
                    <span className="font-medium text-navy text-right text-xs leading-tight">{candidatForm.getValues('sujet')}</span>
                  </div>
                  {videoFile && (
                    <div className="flex justify-between gap-2">
                      <span className="text-[#212121]/50 flex-shrink-0">Vidéo</span>
                      <span className="font-medium text-brand-green text-right text-xs">✓ {videoFile.name}</span>
                    </div>
                  )}
                </>
              )}
              <div className="border-t border-gray-200 pt-2 flex justify-between">
                <span className="text-[#212121]/50">Événement</span>
                <span className="font-medium text-navy text-right">NEXUS SPECTACLE · 11 Juil. 2026 · 15h00</span>
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer mb-6">
              <input type="checkbox" className="w-4 h-4 mt-0.5 accent-navy flex-shrink-0"
                checked={rgpd} onChange={(e) => setRgpd(e.target.checked)} />
              <span className="font-inter text-xs text-[#212121]/60 leading-relaxed">
                J'accepte les{' '}
                <a href="/cgv" className="text-brand-red underline" target="_blank" rel="noopener noreferrer">Conditions d'utilisation</a>
                {' '}et la{' '}
                <a href="/politique-confidentialite" className="text-brand-red underline" target="_blank" rel="noopener noreferrer">Politique de confidentialité</a>.
              </span>
            </label>

            <div className="flex gap-3">
              <button type="button"
                onClick={() => setStep(role === 'candidat' ? 3 : 2)}
                className="btn-secondary flex items-center gap-2 flex-1">
                <ChevronLeft size={16} /> Retour
              </button>
              <button
                type="button"
                onClick={finalSubmit}
                disabled={isSubmitting || !rgpd}
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
