import Link from 'next/link';
import { CheckCircle, ArrowLeft, Calendar, Share2 } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Merci — Inscription confirmée' };

export default function MerciPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
      <div className="container-xl py-16 text-center max-w-xl">
        <div className="w-24 h-24 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={48} className="text-brand-green" />
        </div>
        <h1 className="font-montserrat font-black text-navy text-4xl mb-4">Merci !</h1>
        <p className="font-inter text-[#212121]/70 text-lg mb-8 leading-relaxed">
          Votre inscription au NEXUS SPECTACLE est confirmée. Vous recevrez un email de confirmation
          avec votre invitation calendrier dans les prochaines minutes.
        </p>
        <div className="bg-white rounded-2xl p-6 shadow-card mb-8">
          <div className="font-montserrat font-bold text-navy text-lg mb-2">NEXUS SPECTACLE</div>
          <div className="font-inter text-[#212121]/60">11 Juillet 2026 · 18h00</div>
          <div className="font-inter text-[#212121]/60">Théâtre Mohamed Bahnini, Rabat</div>
        </div>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/" className="btn-secondary flex items-center gap-2">
            <ArrowLeft size={16} /> Retour à l'accueil
          </Link>
          <a
            href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=NEXUS+SPECTACLE&dates=20260711T160000Z/20260711T200000Z`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary flex items-center gap-2"
          >
            <Calendar size={16} /> Google Calendar
          </a>
        </div>
      </div>
    </div>
  );
}
