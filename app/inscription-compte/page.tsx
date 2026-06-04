'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Check, UserPlus } from 'lucide-react';
import { countries } from '@/lib/countries';

const schema = z.object({
  prenom: z.string().min(2, 'Prénom requis'),
  nom: z.string().min(2, 'Nom requis'),
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Minimum 8 caractères'),
  passwordConfirm: z.string(),
  nationalite: z.string().min(1, 'Nationalité requise'),
  dateNaissance: z.string().optional(),
}).refine((d) => d.password === d.passwordConfirm, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['passwordConfirm'],
});

type FormData = z.infer<typeof schema>;

export default function InscriptionComptePage() {
  const router = useRouter();
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setServerError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prenom: data.prenom,
          nom: data.nom,
          email: data.email,
          password: data.password,
          nationalite: data.nationalite,
          dateNaissance: data.dateNaissance,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Erreur lors de la création du compte');
      setDone(true);
      setTimeout(() => router.push('/connexion?success=compte-cree'), 2000);
    } catch (err: any) {
      setServerError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 pt-24">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-brand-red rounded-xl flex items-center justify-center font-montserrat font-black text-white text-xl mx-auto mb-4">
            N
          </div>
          <h1 className="font-montserrat font-black text-navy text-2xl mb-1">Créer mon compte NEXUS</h1>
          <p className="font-inter text-[#212121]/55 text-sm">
            Votez pour les candidats et participez à l'expérience NEXUS JEUNESSES.
          </p>
        </div>

        {done ? (
          <div className="bg-white rounded-2xl shadow-card p-8 text-center">
            <div className="w-14 h-14 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={28} className="text-brand-green" />
            </div>
            <h2 className="font-montserrat font-bold text-navy text-lg mb-2">Compte créé !</h2>
            <p className="font-inter text-[#212121]/60 text-sm">
              Votre compte NEXUS a été créé avec succès. Redirection vers la connexion…
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-card p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Prénom *</label>
                  <input {...register('prenom')} className="input-field" placeholder="Prénom" />
                  {errors.prenom && <p className="text-brand-red text-xs mt-1">{errors.prenom.message}</p>}
                </div>
                <div>
                  <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Nom *</label>
                  <input {...register('nom')} className="input-field" placeholder="Nom" />
                  {errors.nom && <p className="text-brand-red text-xs mt-1">{errors.nom.message}</p>}
                </div>
              </div>

              <div>
                <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Email *</label>
                <input {...register('email')} type="email" className="input-field" placeholder="votre@email.com" />
                {errors.email && <p className="text-brand-red text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Nationalité *</label>
                <select {...register('nationalite')} className="input-field bg-transparent">
                  <option value="">Sélectionnez votre nationalité</option>
                  {countries.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.nationalite && <p className="text-brand-red text-xs mt-1">{errors.nationalite.message}</p>}
              </div>

              <div>
                <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Date de naissance (optionnel)</label>
                <input {...register('dateNaissance')} type="date" className="input-field" />
              </div>

              <div>
                <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Mot de passe * (min. 8 caractères)</label>
                <input {...register('password')} type="password" className="input-field" placeholder="••••••••" />
                {errors.password && <p className="text-brand-red text-xs mt-1">{errors.password.message}</p>}
              </div>

              <div>
                <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Confirmer le mot de passe *</label>
                <input {...register('passwordConfirm')} type="password" className="input-field" placeholder="••••••••" />
                {errors.passwordConfirm && <p className="text-brand-red text-xs mt-1">{errors.passwordConfirm.message}</p>}
              </div>

              {serverError && (
                <div className="bg-brand-red/8 border border-brand-red/20 rounded-lg p-3">
                  <p className="font-inter text-brand-red text-xs">{serverError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
              >
                {isSubmitting
                  ? <><Loader2 size={16} className="animate-spin" /> Création…</>
                  : <><UserPlus size={16} /> Créer mon compte NEXUS</>}
              </button>
            </form>

            <p className="text-center font-inter text-[#212121]/50 text-xs mt-5">
              Déjà un compte ?{' '}
              <Link href="/connexion" className="text-brand-red hover:underline">
                Se connecter
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
