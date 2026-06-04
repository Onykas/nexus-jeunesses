'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone } from 'lucide-react';

const modules = [
  { href: '/spectacle', label: 'Spectacle' },
  { href: '/media', label: 'Média' },
  { href: '/olympiques', label: 'Olympiques' },
  { href: '/rapport', label: 'Rapport' },
  { href: '/diner', label: 'Dîner' },
  { href: '/mesdames', label: 'Mesdames' },
];

const legal = [
  { href: '/mentions-legales', label: 'Mentions légales' },
  { href: '/politique-confidentialite', label: 'Confidentialité' },
  { href: '/cgv', label: 'CGU' },
  { href: '/contact', label: 'Contact' },
];

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="container-xl py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <Image
                src="/images/logo.png.PNG"
                alt="NEXUS DES JEUNESSES"
                width={180}
                height={72}
                className="h-16 w-auto object-contain"
              />
            </div>
            <p className="font-inter text-white/70 text-sm leading-relaxed mb-1">
              Se réunir pour l&apos;avenir.
            </p>
            <p className="font-inter text-white/50 text-xs leading-relaxed">
              Le premier et seul programme d&apos;une année qui réunit la jeunesse du monde présenté au Maroc.
            </p>
          </div>

          {/* Modules */}
          <div>
            <h3 className="font-montserrat font-bold text-white text-sm uppercase tracking-widest mb-4">
              Modules
            </h3>
            <ul className="flex flex-col gap-2">
              {modules.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="font-inter text-white/70 text-sm hover:text-brand-red transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-montserrat font-bold text-white text-sm uppercase tracking-widest mb-4">
              Légal
            </h3>
            <ul className="flex flex-col gap-2">
              {legal.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="font-inter text-white/70 text-sm hover:text-brand-red transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-montserrat font-bold text-white text-sm uppercase tracking-widest mb-4">
              Contact
            </h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-brand-red mt-0.5 flex-shrink-0" />
                <span className="font-inter text-white/70 text-sm">
                  Théâtre INSMAC<br />Rabat, Maroc
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-brand-red flex-shrink-0" />
                <a
                  href="tel:+212715795962"
                  className="font-inter text-white/70 text-sm hover:text-brand-red transition-colors"
                >
                  +212 7 15 79 59 62
                </a>
              </li>
            </ul>

            <div className="mt-6">
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="votre@email.com"
                  className="flex-1 bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white placeholder-white/40 text-sm focus:outline-none focus:border-brand-red transition-colors"
                />
                <button type="submit" className="bg-brand-red text-white px-3 py-2 rounded-md text-sm hover:bg-red-700 transition-colors">
                  →
                </button>
              </form>
              <p className="text-white/40 text-xs mt-1">Recevez nos actualités</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="font-inter text-white/50 text-sm">
            © 2026 NEXUS DES JEUNESSES. Tous droits réservés.
          </p>
          <p className="font-inter text-white/40 text-xs">
            La jeunesse ne subit plus. Elle éclaire.
          </p>
        </div>
      </div>
    </footer>
  );
}
