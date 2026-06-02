import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NEXUS RAPPORT',
  description: 'Tableau de bord d\'impact NEXUS SPECTACLE — données, insights, vidéos highlights et mini-documentaire.',
};

export default function RapportLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
