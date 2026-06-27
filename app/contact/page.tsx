'use client';

import { useState } from 'react';
import { Mail, MapPin, Phone, Instagram, Linkedin, Youtube } from 'lucide-react';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { toast } from '@/components/ui/Toaster';

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'question',
          nom: fd.get('nom'),
          email: fd.get('email'),
          message: fd.get('message'),
          rgpd: true,
        }),
      });
      setSent(true);
      toast('Message envoyé avec succès !', 'success');
    } catch {
      toast('Erreur lors de l\'envoi.', 'error');
    }
  };

  return (
    <div className="pt-32 pb-20 bg-white">
      <div className="container-xl max-w-4xl">
        <AnimatedSection className="text-center mb-14">
          <h1 className="section-title text-4xl mb-3">Contactez-nous</h1>
          <p className="section-subtitle">Une question, une proposition de partenariat, une accréditation presse ?</p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-12">
          <AnimatedSection direction="left">
            <div className="space-y-6">
              {[
                { icon: Mail, label: 'Email général', value: 'contact@nexusjeunesses.org', href: 'mailto:contact@nexusjeunesses.org' },
                { icon: Mail, label: 'Partenariats', value: 'partenariats@nexusjeunesses.org', href: 'mailto:partenariats@nexusjeunesses.org' },
                { icon: Mail, label: 'Presse', value: 'presse@nexusjeunesses.org', href: 'mailto:presse@nexusjeunesses.org' },
                { icon: MapPin, label: 'Lieu de l\'événement', value: 'INSMAC, Rabat', href: '#' },
                { icon: Phone, label: 'Téléphone', value: '+212 6 00 00 00 00', href: 'tel:+212600000000' },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-brand-red/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-brand-red" />
                  </div>
                  <div>
                    <p className="font-raleway font-semibold text-navy text-sm">{label}</p>
                    <a href={href} className="font-inter text-[#212121]/65 text-sm hover:text-brand-red transition-colors">{value}</a>
                  </div>
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                {[
                  { href: 'https://instagram.com/nexusjeunesses', Icon: Instagram, label: 'Instagram' },
                  { href: 'https://linkedin.com/company/nexusjeunesses', Icon: Linkedin, label: 'LinkedIn' },
                  { href: 'https://youtube.com/@nexusjeunesses', Icon: Youtube, label: 'YouTube' },
                ].map(({ href, Icon, label }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                    className="w-10 h-10 bg-navy/8 rounded-lg flex items-center justify-center text-navy hover:bg-brand-red hover:text-white transition-all duration-300">
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection direction="right" delay={0.1}>
            {sent ? (
              <div className="card p-8 text-center">
                <div className="text-4xl mb-3">✉️</div>
                <h3 className="font-montserrat font-bold text-navy text-xl mb-2">Message envoyé !</h3>
                <p className="font-inter text-[#212121]/65 text-sm">Nous vous répondrons dans les 48h.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="card p-6 space-y-4">
                <div>
                  <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Nom complet *</label>
                  <input name="nom" required className="input-field" placeholder="Votre nom" />
                </div>
                <div>
                  <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Email *</label>
                  <input name="email" type="email" required className="input-field" placeholder="votre@email.com" />
                </div>
                <div>
                  <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Message *</label>
                  <textarea name="message" required className="input-field resize-none" rows={5} placeholder="Votre message..." />
                </div>
                <button type="submit" className="btn-primary w-full">Envoyer le message</button>
              </form>
            )}
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
