import Link from 'next/link';
import { ArrowRight, Mic2, Newspaper, Award, BarChart3, Utensils, Dumbbell } from 'lucide-react';
import AnimatedSection from '@/components/ui/AnimatedSection';

const modules = [
  {
    id: 'spectacle',
    href: '/spectacle',
    icon: Mic2,
    title: 'NEXUS SPECTACLE',
    tagline: 'Cœur culturel & intellectuel',
    description:
      'Eloquentia 2.0, performances de danse culturelle et 3 interventions TED X-style. L\'événement phare du 11 juillet 2026.',
    cta: 'S\'inscrire — Gratuit',
    ctaHref: '/spectacle#inscription',
    accent: '#D32F2F',
    badge: '11 Juillet 2026',
    badgeColor: 'bg-brand-red/10 text-brand-red',
  },
  {
    id: 'media',
    href: '/media',
    icon: Newspaper,
    title: 'NEXUS MÉDIA',
    tagline: 'Ligne éditoriale & visibilité',
    description:
      'Articles, vidéos, podcasts — l\'univers éditorial qui documente et amplifie la voix de la jeunesse africaine.',
    cta: 'Découvrir',
    ctaHref: '/media',
    accent: '#FF9800',
    badge: 'Éditorial',
    badgeColor: 'bg-brand-orange/10 text-brand-orange',
  },
  {
    id: 'olympiques',
    href: '/olympiques',
    icon: Dumbbell,
    title: 'NEXUS OLYMPIQUES',
    tagline: 'Excellence athlétique',
    description:
      'Le sommet de l\'excellence athlétique et du leadership jeunesse. Une activation à venir.',
    cta: 'Rester informé',
    ctaHref: '/olympiques',
    accent: '#4CAF50',
    badge: 'Bientôt',
    badgeColor: 'bg-brand-green/10 text-brand-green',
  },
  {
    id: 'rapport',
    href: '/rapport',
    icon: BarChart3,
    title: 'NEXUS RAPPORT',
    tagline: 'Impact & synthèse',
    description:
      'Tableau de bord analytique, insights démographiques, témoignages et mini-documentaire post-événement.',
    cta: 'Voir le rapport',
    ctaHref: '/rapport',
    accent: '#0A1E3C',
    badge: 'Analytique',
    badgeColor: 'bg-navy/10 text-navy',
  },
  {
    id: 'diner',
    href: '/diner',
    icon: Utensils,
    title: 'NEXUS DÎNER',
    tagline: 'Cercle de leadership',
    description:
      'Un dîner d\'élite exclusive réunissant leaders politiques, entrepreneurs et académiques dans un cadre diplomatique.',
    cta: 'Candidater',
    ctaHref: '/diner#candidature',
    accent: '#212121',
    badge: 'Sur invitation',
    badgeColor: 'bg-gray-100 text-gray-600',
  },
  {
    id: 'join',
    href: '/spectacle#inscription',
    icon: Award,
    title: 'REJOIGNEZ LE MOUVEMENT',
    tagline: 'Votre place vous attend',
    description:
      'Participez en tant que spectateur, volontaire, partenaire ou média. La jeunesse africaine porte sa propre lumière.',
    cta: 'S\'inscrire maintenant',
    ctaHref: '/spectacle#inscription',
    accent: '#D32F2F',
    badge: 'Gratuit',
    badgeColor: 'bg-brand-red/10 text-brand-red',
    highlight: true,
  },
];

export default function ModulesGrid() {
  return (
    <section className="py-20 bg-gray-50" aria-label="Modules NEXUS">
      <div className="container-xl">
        <AnimatedSection className="text-center mb-14">
          <span className="font-raleway text-brand-red font-semibold text-sm uppercase tracking-widest mb-3 block">
            L'écosystème NEXUS
          </span>
          <h2 className="section-title text-4xl md:text-5xl mb-4">
            6 modules. Une vision.
          </h2>
          <p className="section-subtitle max-w-2xl mx-auto text-lg">
            Un écosystème institutionnel multi-modules fédérant la jeunesse de 12+ nationalités
            autour d'une vision d'influence, de visibilité et d'intégration.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map(({ id, href, icon: Icon, title, tagline, description, cta, ctaHref, accent, badge, badgeColor, highlight }, i) => (
            <AnimatedSection key={id} delay={i * 0.08}>
              <div
                className={`card h-full flex flex-col p-6 group hover:-translate-y-1 transition-all duration-300 ${
                  highlight ? 'ring-2 ring-brand-red bg-gradient-to-br from-navy to-navy/90 text-white' : ''
                }`}
              >
                {/* Icon + badge */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${accent}18` }}
                  >
                    <Icon size={22} style={{ color: highlight ? '#fff' : accent }} />
                  </div>
                  <span className={`badge text-xs font-medium ${highlight ? 'bg-white/10 text-white' : badgeColor}`}>
                    {badge}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <p className={`font-raleway text-xs font-semibold uppercase tracking-widest mb-1 ${highlight ? 'text-white/60' : 'text-[#212121]/50'}`}>
                    {tagline}
                  </p>
                  <h3 className={`font-montserrat font-bold text-lg mb-3 ${highlight ? 'text-white' : 'text-navy'}`}>
                    {title}
                  </h3>
                  <p className={`font-inter text-sm leading-relaxed ${highlight ? 'text-white/75' : 'text-[#212121]/70'}`}>
                    {description}
                  </p>
                </div>

                {/* CTA */}
                <Link
                  href={ctaHref}
                  className={`group/cta mt-5 flex items-center gap-2 font-raleway font-semibold text-sm transition-all duration-200 ${
                    highlight
                      ? 'text-white hover:text-brand-red'
                      : 'text-navy hover:text-brand-red'
                  }`}
                >
                  {cta}
                  <ArrowRight size={16} className="transition-transform duration-200 group-hover/cta:translate-x-1" />
                </Link>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
