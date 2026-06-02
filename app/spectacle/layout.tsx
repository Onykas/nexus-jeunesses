import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NEXUS SPECTACLE',
  description:
    'NEXUS SPECTACLE — L\'élite de la jeunesse de demain. 11 juillet 2026, Théâtre Mohamed Bahnini, Rabat. Entrée gratuite, réservation obligatoire.',
};

export default function SpectacleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
