import type { Metadata } from 'next';
import HeroHome from '@/components/sections/HeroHome';
import ModulesGrid from '@/components/sections/ModulesGrid';
import EloquenceCTA from '@/components/sections/EloquenceCTA';
import JoinMovement from '@/components/sections/JoinMovement';
import FeaturedArticles from '@/components/sections/FeaturedArticles';
import SponsorsSection from '@/components/sections/SponsorsSection';

export const metadata: Metadata = {
  title: 'Accueil',
  description:
    'NEXUS DES JEUNESSES — Le premier et seul programme d\'une année qui réunit la jeunesse du monde présente au Maroc. NEXUS SPECTACLE le 11 juillet 2026 à Rabat. Entrée sur réservation.',
};

export default function HomePage() {
  return (
    <>
      <HeroHome />
      <ModulesGrid />
      <EloquenceCTA />
      <JoinMovement />
      <FeaturedArticles />
      <SponsorsSection />
    </>
  );
}
