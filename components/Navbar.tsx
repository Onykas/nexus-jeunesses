'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/spectacle', label: 'Spectacle' },
  { href: '/media', label: 'Média' },
  { href: '/olympiques', label: 'Olympiques' },
  { href: '/rapport', label: 'Rapport' },
  { href: '/diner', label: 'Dîner' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-navy/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <nav className="container-xl flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group" aria-label="NEXUS JEUNESSES - Accueil">
          <div className="relative">
            <div className="w-9 h-9 bg-brand-red rounded-lg flex items-center justify-center font-montserrat font-black text-white text-sm transition-transform duration-300 group-hover:scale-110">
              N
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-brand-orange rounded-sm" />
          </div>
          <div className="hidden sm:block">
            <div className="font-montserrat font-black text-white text-sm leading-tight tracking-wide">
              NEXUS
            </div>
            <div className="font-raleway text-white/70 text-xs tracking-widest uppercase">
              JEUNESSES
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-1" role="navigation" aria-label="Navigation principale">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`px-4 py-2 rounded-md font-raleway font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? 'text-white bg-white/10'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/spectacle#inscription" className="btn-red text-sm py-2 px-5">
            S&apos;inscrire
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-md text-white hover:bg-white/10 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-navy/98 backdrop-blur-md border-t border-white/10"
          >
            <ul className="container-xl py-4 flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`block px-4 py-3 rounded-lg font-raleway font-medium transition-all duration-200 ${
                        isActive
                          ? 'text-white bg-white/10'
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
              <li className="mt-2">
                <Link
                  href="/spectacle#inscription"
                  className="block btn-red text-center text-sm"
                >
                  S&apos;inscrire — Gratuit
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
