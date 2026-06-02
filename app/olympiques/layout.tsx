import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NEXUS OLYMPIQUES',
  description: 'NEXUS OLYMPIQUES — Le sommet de l\'excellence athlétique et du leadership jeunesse. Bientôt disponible.',
};

export default function OlympiquesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
