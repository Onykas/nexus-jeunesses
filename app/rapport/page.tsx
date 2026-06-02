'use client';

import { motion } from 'framer-motion';
import { Users, Globe, Heart, TrendingUp, Play } from 'lucide-react';
import AnimatedSection from '@/components/ui/AnimatedSection';
import CountUp from '@/components/ui/CountUp';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Legend } from 'recharts';

const statsData = [
  { label: 'Total spectateurs', value: 2145, icon: Users, color: 'text-brand-red', bg: 'bg-brand-red/10' },
  { label: 'Pays représentés', value: 45, icon: Globe, color: 'text-brand-orange', bg: 'bg-brand-orange/10' },
  { label: 'Engagement réseaux sociaux', value: 184200, icon: Heart, suffix: '', color: 'text-brand-green', bg: 'bg-brand-green/10' },
  { label: 'Croissance abonnés', value: 340, suffix: '%', icon: TrendingUp, color: 'text-navy', bg: 'bg-navy/10' },
];

const inscriptionsByWeek = [
  { week: 'S-8', count: 120 },
  { week: 'S-7', count: 180 },
  { week: 'S-6', count: 210 },
  { week: 'S-5', count: 290 },
  { week: 'S-4', count: 380 },
  { week: 'S-3', count: 420 },
  { week: 'S-2', count: 580 },
  { week: 'S-1', count: 780 },
];

const nationaliteData = [
  { name: 'DR Congo', value: 28, fill: '#0A1E3C' },
  { name: 'Maroc', value: 22, fill: '#D32F2F' },
  { name: 'Sénégal', value: 14, fill: '#FF9800' },
  { name: 'Nigeria', value: 10, fill: '#4CAF50' },
  { name: "Côte d'Ivoire", value: 9, fill: '#9C27B0' },
  { name: 'Autres', value: 17, fill: '#90A4AE' },
];

const testimonials = [
  { name: 'Aminata K.', pays: 'Sénégal', quote: 'NEXUS m\'a fait comprendre que ma voix compte au-delà des frontières. C\'est exactement ce dont la jeunesse africaine avait besoin.', stars: 5 },
  { name: 'Yves M.', pays: 'DR Congo', quote: 'L\'éloquence comme arme. Jamais je n\'aurais cru qu\'un événement à Rabat changerait ma trajectoire professionnelle.', stars: 5 },
  { name: 'Sara D.', pays: 'Maroc', quote: 'Une expérience unique — la diversité célébrée, le leadership valorisé, l\'impact mesuré. Bravo à UESCOM.', stars: 5 },
];

const videos = [
  { title: 'Finale Eloquentia 2.0 — Moments forts', thumb: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&q=80' },
  { title: 'Discours de Dakar — Intervenant Keynote', thumb: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&q=80' },
  { title: 'Moments clés — Coulisses du NEXUS', thumb: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80' },
];

export default function RapportPage() {
  return (
    <>
      <section className="relative bg-navy pt-32 pb-16 overflow-hidden">
        <div className="container-xl relative text-white text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="font-raleway text-brand-orange font-semibold text-sm uppercase tracking-widest mb-4 block">NEXUS RAPPORT</span>
            <h1 className="font-montserrat font-black text-5xl md:text-6xl mb-4">
              NEXUS SPECTACLE<br /><span className="text-brand-red">Impact Report</span>
            </h1>
            <p className="font-inter text-white/70 text-lg max-w-xl mx-auto">
              Les données, les histoires, et le mini-documentaire de la nuit qui a illuminé Rabat.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Dashboard stats */}
      <section className="py-16 bg-white">
        <div className="container-xl">
          <AnimatedSection className="mb-10">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
              <h2 className="section-title text-2xl">Tableau de bord d'impact</h2>
              <span className="badge bg-brand-green/10 text-brand-green text-xs">● Live</span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {statsData.map(({ label, value, icon: Icon, color, bg, suffix }, i) => (
                <AnimatedSection key={label} delay={i * 0.1}>
                  <div className="card p-5 text-center">
                    <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${bg} ${color} mb-3`}>
                      <Icon size={20} />
                    </div>
                    <div className={`font-montserrat font-black text-2xl ${color} mb-1`}>
                      <CountUp end={value} suffix={suffix || '+'} />
                    </div>
                    <p className="font-inter text-[#212121]/55 text-xs">{label}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-6">
              <AnimatedSection delay={0.1}>
                <div className="card p-6">
                  <h3 className="font-raleway font-semibold text-navy text-sm mb-4">Inscriptions par semaine</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={inscriptionsByWeek}>
                      <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#888' }} />
                      <YAxis tick={{ fontSize: 11, fill: '#888' }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#D32F2F" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </AnimatedSection>
              <AnimatedSection delay={0.2}>
                <div className="card p-6">
                  <h3 className="font-raleway font-semibold text-navy text-sm mb-4">Répartition par nationalité</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={nationaliteData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        dataKey="value"
                        nameKey="name"
                      />
                      <Tooltip />
                      <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </AnimatedSection>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Video highlights */}
      <section className="py-16 bg-gray-50">
        <div className="container-xl">
          <AnimatedSection className="mb-8">
            <h2 className="section-title text-2xl mb-2">Moments forts</h2>
            <p className="section-subtitle">Les séquences inoubliables de la soirée.</p>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6">
            {videos.map(({ title, thumb }, i) => (
              <AnimatedSection key={title} delay={i * 0.1}>
                <div className="card overflow-hidden group cursor-pointer">
                  <div className="relative h-44 overflow-hidden">
                    <img src={thumb} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                    <div className="absolute inset-0 bg-navy/50 flex items-center justify-center">
                      <div className="w-14 h-14 bg-brand-red/80 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Play size={20} className="text-white ml-0.5" fill="white" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="font-raleway font-semibold text-navy text-sm">{title}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container-xl">
          <AnimatedSection className="text-center mb-10">
            <h2 className="section-title text-2xl mb-2">Ce qu'ils en disent</h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(({ name, pays, quote, stars }, i) => (
              <AnimatedSection key={name} delay={i * 0.1}>
                <div className="card p-6">
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: stars }).map((_, j) => (
                      <span key={j} className="text-brand-orange">★</span>
                    ))}
                  </div>
                  <p className="font-inter text-[#212121]/70 text-sm leading-relaxed mb-4 italic">"{quote}"</p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-navy to-brand-red flex items-center justify-center text-white font-bold text-xs">
                      {name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-raleway font-semibold text-navy text-xs">{name}</div>
                      <div className="font-inter text-[#212121]/50 text-xs">{pays}</div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Mini documentary */}
      <section className="py-16 bg-navy text-white">
        <div className="container-xl">
          <AnimatedSection className="max-w-2xl mx-auto text-center">
            <h2 className="font-montserrat font-bold text-3xl mb-3">Le mini-documentaire</h2>
            <p className="font-inter text-white/70 mb-8">Produit 72h après l'événement — une plongée dans les coulisses et les émotions du NEXUS SPECTACLE.</p>
            <div className="relative bg-black/40 rounded-2xl overflow-hidden aspect-video flex items-center justify-center border border-white/10">
              <div className="text-center">
                <div className="w-20 h-20 bg-brand-red/80 rounded-full flex items-center justify-center mx-auto mb-3 cursor-pointer hover:bg-brand-red transition-colors">
                  <Play size={28} className="text-white ml-1" fill="white" />
                </div>
                <p className="font-inter text-white/60 text-sm">Disponible le 14 juillet 2026</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
