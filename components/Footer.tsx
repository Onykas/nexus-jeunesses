'use client';

import Link from 'next/link';
import { Instagram, Linkedin, Twitter, Youtube, Mail, MapPin, Phone } from 'lucide-react';

const modules = [
  { href: '/spectacle', label: 'Spectacle' },
  { href: '/media', label: 'Média' },
  { href: '/olympiques', label: 'Olympiques' },
  { href: '/rapport', label: 'Rapport' },
  { href: '/diner', label: 'Dîner' },
];

const legal = [
  { href: '/mentions-legales', label: 'Mentions légales' },
  { href: '/politique-confidentialite', label: 'Confidentialité' },
  { href: '/cgv', label: 'CGU' },
  { href: '/contact', label: 'Contact' },
];

const socials = [
  { href: 'https://instagram.com/nexusjeunesses', label: 'Instagram', Icon: Instagram },
  { href: 'https://linkedin.com/company/nexusjeunesses', label: 'LinkedIn', Icon: Linkedin },
  { href: 'https://twitter.com/nexusjeunesses', label: 'Twitter/X', Icon: Twitter },
  { href: 'https://youtube.com/@nexusjeunesses', label: 'YouTube', Icon: Youtube },
];

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="container-xl py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <div className="w-10 h-10 bg-brand-red rounded-lg flex items-center justify-center font-montserrat font-black text-white">
                  N
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-brand-orange rounded-sm" />
              </div>
              <div>
                <div className="font-montserrat font-black text-white text-base leading-tight">NEXUS</div>
                <div className="font-raleway text-white/60 text-xs tracking-widest uppercase">JEUNESSES</div>
              </div>
            </div>
            <p className="font-inter text-white/70 text-sm leading-relaxed mb-4">
              La plateforme officielle de la jeunesse africaine en Afrique du Nord.
              Orchestrée par UESCOM — Union des Étudiants et Stagiaires Congolais au Maroc.
            </p>
            <div className="flex gap-3">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white/70 hover:bg-brand-red hover:text-white transition-all duration-300"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
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
                  Théâtre Mohamed Bahnini<br />Rabat, Maroc
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-brand-red flex-shrink-0" />
                <a
                  href="mailto:contact@nexusjeunesses.org"
                  className="font-inter text-white/70 text-sm hover:text-brand-red transition-colors"
                >
                  contact@nexusjeunesses.org
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-brand-red flex-shrink-0" />
                <a
                  href="tel:+212600000000"
                  className="font-inter text-white/70 text-sm hover:text-brand-red transition-colors"
                >
                  +212 6 00 00 00 00
                </a>
              </li>
            </ul>

            {/* Newsletter mini */}
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
            © 2026 NEXUS JEUNESSES — UESCOM. Tous droits réservés.
          </p>
          <p className="font-inter text-white/40 text-xs">
            La jeunesse ne subit plus. Elle éclaire.
          </p>
        </div>
      </div>
    </footer>
  );
}
