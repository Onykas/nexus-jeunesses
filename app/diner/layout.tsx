import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NEXUS DÎNER — Le rendez-vous des leaders',
  description: 'NEXUS DÎNER — Un dîner d\'élite exclusive réunissant leaders politiques, entrepreneurs et académiques dans un cadre diplomatique à Rabat.',
};

export default function DinerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
