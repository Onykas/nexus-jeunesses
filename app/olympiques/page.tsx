'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, Bell, Trophy, Zap, Globe } from 'lucide-react';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { toast } from '@/components/ui/Toaster';
export default function OlympiquesPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, source: 'olympiques' }) });
      setSubmitted(true);
      toast('Vous serez informé en premier !', 'success');
    } catch {
      toast('Erreur, réessayez.', 'error');
    }
  };

  const categories = [
    { icon: Trophy, title: 'Compétitions sportives', desc: 'Football, basketball, athlétisme et plus encore. Des épreuves qui célèbrent l\'excellence physique africaine.' },
    { icon: Zap, title: 'Performance & leadership', desc: 'Comment l\'excellence sportive forge le leadership. Ateliers et conférences avec des athlètes de haut niveau.' },
    { icon: Globe, title: 'Nations unies par le sport', desc: 'Des équipes multi-nationales pour un message d\'unité et de fraternité pan-africaine.' },
  ];

  return (
    <>
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-navy">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1920&q=80')] bg-cover bg-center opacity-20" />
        </div>
        <div className="relative container-xl pt-32 pb-16 text-white text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-brand-green/20 border border-brand-green/30 text-brand-green text-xs font-semibold px-4 py-2 rounded-full mb-6">
              <Bell size={12} /> Bientôt disponible
            </div>
            <h1 className="font-montserrat font-black text-5xl md:text-7xl leading-tight mb-4">
              NEXUS<br /><span className="text-brand-green">OLYMPIQUES</span>
            </h1>
            <p className="font-raleway text-xl text-white/80 max-w-xl mx-auto">
              Le sommet de l'excellence athlétique et du leadership jeunesse.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container-xl">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="section-title text-3xl mb-4">À quoi s'attendre ?</h2>
            <p className="section-subtitle">NEXUS OLYMPIQUES sera une activation unique célébrant l'excellence athlétique africaine, bientôt disponible avec tous les détails.</p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {categories.map(({ icon: Icon, title, desc }, i) => (
              <AnimatedSection key={title} delay={i * 0.1}>
                <div className="card p-6 text-center">
                  <div className="w-14 h-14 bg-brand-green/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon size={24} className="text-brand-green" />
                  </div>
                  <h3 className="font-raleway font-semibold text-navy text-base mb-2">{title}</h3>
                  <p className="font-inter text-[#212121]/60 text-sm leading-relaxed">{desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Notification form */}
          <AnimatedSection className="max-w-lg mx-auto text-center bg-gray-50 rounded-2xl p-8">
            <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell size={28} className="text-brand-green" />
            </div>
            <h2 className="font-montserrat font-bold text-navy text-2xl mb-2">Ne manquez pas le départ</h2>
            <p className="font-inter text-[#212121]/60 text-sm mb-6">Laissez votre email pour être parmi les premiers informés du lancement officiel de NEXUS OLYMPIQUES.</p>
            {submitted ? (
              <div className="bg-brand-green/10 border border-brand-green/30 rounded-xl p-4">
                <p className="font-raleway font-semibold text-brand-green">✓ Parfait ! Vous serez notifié en premier.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-3">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="votre@email.com" className="flex-1 border border-gray-200 rounded-lg px-4 py-3 text-sm font-inter focus:outline-none focus:border-brand-green" required />
                <button type="submit" className="bg-brand-green text-white px-6 py-3 rounded-lg font-raleway font-semibold text-sm hover:bg-green-600 transition-colors">
                  M'alerter
                </button>
              </form>
            )}
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
