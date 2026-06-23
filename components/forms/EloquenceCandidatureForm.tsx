'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Loader2, Check, Video } from 'lucide-react';
import { countries } from '@/lib/countries';

const schema = z.object({
  prenom: z.string().min(2, 'Prénom requis'),
  nom: z.string().min(2, 'Nom requis'),
  email: z.string().email('Email invalide'),
  telephone: z.string().min(8, 'Téléphone invalide'),
  nationalite: z.string().min(1, 'Nationalité requise'),
  dateNaissance: z.string().min(1, 'Date de naissance requise'),
  motivation: z.string().max(1000, 'Maximum 1000 caractères').optional(),
});

type FormData = z.infer<typeof schema>;

const VIDEO_ACCEPT = '.mp4,.mov,.avi,video/mp4,video/quicktime,video/x-msvideo';
const MAX_SIZE_MB = 200;

export default function EloquenceCandidatureForm({ onClose }: { onClose: () => void }) {
  const [done, setDone] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoError, setVideoError] = useState('');

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    if (!videoFile) {
      setVideoError('La vidéo de présentation est requise');
      return;
    }
    if (videoFile.size > MAX_SIZE_MB * 1024 * 1024) {
      setVideoError(`La vidéo ne doit pas dépasser ${MAX_SIZE_MB} Mo`);
      return;
    }
    setVideoError('');
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => { if (v) formData.append(k, v as string); });
      formData.append('cv', videoFile);

      const res = await fetch('/api/candidature-eloquence', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error();
      setDone(true);
    } catch {
      setVideoError("Erreur lors de l'envoi. Veuillez réessayer.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label="Fermer"
        >
          <X size={16} />
        </button>

        {done ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={28} className="text-green-600" />
            </div>
            <h3 className="font-montserrat font-bold text-navy text-lg mb-2">Candidature reçue !</h3>
            <p className="font-inter text-[#212121]/60 text-sm">
              Merci pour votre candidature. L'équipe NEXUS reviendra vers vous après validation de votre dossier.
            </p>
            <button onClick={onClose} className="btn-primary mt-6 text-sm">Fermer</button>
          </div>
        ) : (
          <>
            <h3 className="font-montserrat font-bold text-navy text-xl mb-1">
              Candidater au concours d'éloquence
            </h3>
            <p className="font-inter text-[#212121]/55 text-sm mb-6">
              Soumettez votre candidature pour participer au concours d'éloquence NEXUS SPECTACLE.
            </p>

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
                <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Téléphone *</label>
                <input {...register('telephone')} type="tel" className="input-field" placeholder="+212 6XX…" />
                {errors.telephone && <p className="text-brand-red text-xs mt-1">{errors.telephone.message}</p>}
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
                <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Date de naissance *</label>
                <input {...register('dateNaissance')} type="date" className="input-field" />
                {errors.dateNaissance && <p className="text-brand-red text-xs mt-1">{errors.dateNaissance.message}</p>}
              </div>

              <div>
                <label className="font-inter text-xs text-[#212121]/60 mb-1 block">
                  Motivation <span className="text-[#212121]/40">(optionnelle)</span>
                  {watch('motivation') ? ` — ${watch('motivation')!.length}/1000` : ''}
                </label>
                <textarea
                  {...register('motivation')}
                  rows={3}
                  className="input-field resize-none"
                  placeholder="Pourquoi souhaitez-vous participer au concours d'éloquence NEXUS ?"
                />
                {errors.motivation && <p className="text-brand-red text-xs mt-1">{errors.motivation.message}</p>}
              </div>

              {/* Vidéo de présentation */}
              <div>
                <label className="font-inter text-xs text-[#212121]/60 mb-1 block">
                  Vidéo de présentation * <span className="text-[#212121]/40">(MP4, MOV, AVI — max {MAX_SIZE_MB} Mo)</span>
                </label>
                <label className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-navy/40 transition-colors">
                  <Video size={20} className={videoFile ? 'text-brand-red' : 'text-[#212121]/30'} />
                  <div className="flex-1 min-w-0">
                    {videoFile ? (
                      <>
                        <p className="font-inter text-sm text-[#212121] truncate">{videoFile.name}</p>
                        <p className="font-inter text-xs text-[#212121]/40">
                          {(videoFile.size / (1024 * 1024)).toFixed(1)} Mo
                        </p>
                      </>
                    ) : (
                      <p className="font-inter text-sm text-[#212121]/50">
                        Cliquez pour uploader votre vidéo (depuis votre téléphone ou ordinateur)
                      </p>
                    )}
                  </div>
                  <input
                    type="file"
                    accept={VIDEO_ACCEPT}
                    className="sr-only"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) { setVideoFile(f); setVideoError(''); }
                    }}
                  />
                </label>
                {videoError && <p className="text-brand-red text-xs mt-1">{videoError}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {isSubmitting
                  ? <><Loader2 size={16} className="animate-spin" /> Envoi en cours…</>
                  : 'Soumettre ma candidature'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
