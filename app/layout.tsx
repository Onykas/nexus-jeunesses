import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from '@/components/ui/Toaster';
import Script from 'next/script';

export const metadata: Metadata = {
  title: {
    default: 'NEXUS JEUNESSES | La jeunesse ne subit plus. Elle éclaire.',
    template: '%s | NEXUS JEUNESSES',
  },
  description:
    'NEXUS JEUNESSES est la plateforme digitale officielle de la jeunesse africaine en Afrique du Nord, orchestrée par UESCOM. Événement phare : NEXUS SPECTACLE, 11 juillet 2026, Théâtre Mohamed Bahnini, Rabat.',
  keywords: [
    'NEXUS JEUNESSES',
    'UESCOM',
    'jeunesse africaine',
    'Maroc',
    'Rabat',
    'événement culturel',
    'leadership',
    'éloquence',
  ],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://nexusjeunesses.org',
    siteName: 'NEXUS JEUNESSES',
    title: 'NEXUS JEUNESSES | La jeunesse ne subit plus. Elle éclaire.',
    description:
      'Plateforme digitale officielle de NEXUS JEUNESSES — événement culturel et intellectuel haute-gamme, 11 juillet 2026, Rabat.',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NEXUS JEUNESSES',
    description: 'La jeunesse ne subit plus. Elle éclaire.',
    images: ['/images/og-image.jpg'],
  },
  robots: { index: true, follow: true },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://nexusjeunesses.org'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className="font-inter bg-white text-[#212121]">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Toaster />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', { page_path: window.location.pathname });
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
