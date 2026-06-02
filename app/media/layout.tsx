import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NEXUS MÉDIA',
  description: 'L\'univers éditorial de NEXUS — articles, vidéos, podcasts sur le leadership et l\'innovation de la jeunesse africaine.',
};

export default function MediaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
