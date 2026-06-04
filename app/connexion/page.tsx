'use client';

import { Suspense } from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, LogIn, Check } from 'lucide-react';

const schema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
});

type FormData = z.infer<typeof schema>;

function SuccessBanner() {
  const params = useSearchParams();
  if (params.get('success') !== 'compte-cree') return null;
  return (
    <div className="bg-brand-green/10 border border-brand-green/30 rounded-xl p-4 mb-6 flex items-center gap-3">
      <Check size={18} className="text-brand-green flex-shrink-0" />
      <p className="font-inter text-brand-green text-sm font-medium">
        Compte créé avec succès. Connectez-vous pour continuer.
      </p>
    </div>
  );
}

function ConnexionForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setServerError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Email ou mot de passe incorrect');
      router.push('/spectacle');
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : 'Erreur de connexion');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-card p-8">
      <Suspense fallback={null}>
        <SuccessBanner />
      </Suspense>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Email *</label>
          <input
            {...register('email')}
            type="email"
            className="input-field"
            placeholder="votre@email.com"
            autoComplete="email"
          />
          {errors.email && <p className="text-brand-red text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Mot de passe *</label>
          <input
            {...register('password')}
            type="password"
            className="input-field"
            placeholder="••••••••"
            autoComplete="current-password"
          />
          {errors.password && <p className="text-brand-red text-xs mt-1">{errors.password.message}</p>}
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
            ? <><Loader2 size={16} className="animate-spin" /> Connexion…</>
            : <><LogIn size={16} /> Se connecter</>}
        </button>
      </form>

      <p className="text-center font-inter text-[#212121]/50 text-xs mt-5">
        Pas encore de compte ?{' '}
        <Link href="/inscription-compte" className="text-brand-red hover:underline">
          Créer mon compte NEXUS
        </Link>
      </p>
    </div>
  );
}

export default function ConnexionPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 pt-24">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-brand-red rounded-xl flex items-center justify-center font-montserrat font-black text-white text-xl mx-auto mb-4">
            N
          </div>
          <h1 className="font-montserrat font-black text-navy text-2xl mb-1">Connexion</h1>
          <p className="font-inter text-[#212121]/55 text-sm">
            Connectez-vous à votre compte NEXUS pour voter.
          </p>
        </div>

        <Suspense fallback={<div className="bg-white rounded-2xl shadow-card p-8" />}>
          <ConnexionForm />
        </Suspense>
      </div>
    </div>
  );
}
