import type { Metadata } from 'next';
import HeroHome from '@/components/sections/HeroHome';
import StatsSection from '@/components/sections/StatsSection';
import ModulesGrid from '@/components/sections/ModulesGrid';
import SponsorsSection from '@/components/sections/SponsorsSection';
import FeaturedArticles from '@/components/sections/FeaturedArticles';
import JoinMovement from '@/components/sections/JoinMovement';

export const metadata: Metadata = {
  title: 'Accueil',
  description:
    'NEXUS JEUNESSES — La plateforme de la jeunesse africaine en Afrique du Nord. Événement phare NEXUS SPECTACLE le 11 juillet 2026 à Rabat. Inscription gratuite.',
};

export default function HomePage() {
  return (
    <>
      <HeroHome />
      <StatsSection />
      <ModulesGrid />
      <JoinMovement />
      <FeaturedArticles />
      <SponsorsSection />
    </>
  );
}
