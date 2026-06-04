'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, UserPlus, LogIn, ChevronDown, LogOut, User } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/spectacle', label: 'Spectacle' },
  { href: '/media', label: 'Média' },
  { href: '/olympiques', label: 'Olympiques' },
  { href: '/rapport', label: 'Rapport' },
  { href: '/diner', label: 'Dîner' },
  { href: '/mesdames', label: 'Mesdames' },
];

interface UserData {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  isJury: boolean;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, [pathname]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setUserMenuOpen(false);
    router.push('/');
    router.refresh();
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-navy/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <nav className="container-xl flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center group" aria-label="NEXUS DES JEUNESSES - Accueil">
          <Image
            src="/images/logo.png.PNG"
            alt="NEXUS DES JEUNESSES"
            width={200}
            height={80}
            className="h-14 w-auto object-contain transition-opacity duration-300 group-hover:opacity-80"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-1" role="navigation" aria-label="Navigation principale">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`px-3 py-2 rounded-md font-raleway font-medium text-sm transition-all duration-200 ${
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

        {/* CTA buttons / user menu */}
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-white/10 hover:bg-white/15 transition-all duration-200 border border-white/20"
              >
                <div className="w-6 h-6 rounded-full bg-brand-red flex items-center justify-center text-white text-xs font-montserrat font-bold flex-shrink-0">
                  {user.prenom[0].toUpperCase()}
                </div>
                <span className="font-raleway font-semibold text-white text-sm">
                  {user.prenom}
                </span>
                <ChevronDown size={14} className={`text-white/60 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                  >
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                      <p className="font-raleway font-bold text-navy text-sm">{user.prenom} {user.nom}</p>
                      <p className="font-inter text-[#212121]/50 text-xs truncate">{user.email}</p>
                      {user.isJury && (
                        <span className="inline-block mt-1 bg-brand-orange/10 text-brand-orange text-xs font-raleway font-semibold px-2 py-0.5 rounded-md">
                          Juré
                        </span>
                      )}
                    </div>
                    <div className="py-1">
                      <Link
                        href="/mon-compte"
                        className="flex items-center gap-2.5 px-4 py-2.5 font-inter text-sm text-[#212121]/70 hover:text-navy hover:bg-gray-50 transition-colors"
                      >
                        <User size={14} /> Mon compte
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 font-inter text-sm text-brand-red hover:bg-brand-red/5 transition-colors"
                      >
                        <LogOut size={14} /> Déconnexion
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link
                href="/connexion"
                className="flex items-center gap-1.5 px-4 py-2 border border-white/30 text-white/80 hover:text-white hover:border-white font-raleway font-semibold text-sm rounded-md transition-all duration-200"
              >
                <LogIn size={14} />
                Connexion
              </Link>
              <Link
                href="/inscription-compte"
                className="flex items-center gap-1.5 btn-red text-sm py-2 px-4"
              >
                <UserPlus size={14} />
                Mon compte NEXUS
              </Link>
            </>
          )}
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
                {user ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-3 px-4 py-3 bg-white/8 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-brand-red flex items-center justify-center text-white text-sm font-bold">
                        {user.prenom[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-raleway font-semibold text-white text-sm">{user.prenom} {user.nom}</p>
                        <p className="font-inter text-white/50 text-xs">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-raleway font-semibold text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <LogOut size={14} /> Déconnexion
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/connexion"
                      className="flex items-center justify-center gap-1.5 border border-white/30 text-white font-raleway font-semibold text-sm py-2.5 rounded-md"
                    >
                      <LogIn size={14} /> Connexion
                    </Link>
                    <Link
                      href="/inscription-compte"
                      className="flex items-center justify-center gap-1.5 btn-red text-sm"
                    >
                      <UserPlus size={14} /> Mon compte
                    </Link>
                  </div>
                )}
              </li>
              {!user && (
                <li className="mt-1">
                  <Link
                    href="/spectacle#inscription"
                    className="block btn-primary text-center text-sm"
                  >
                    Réserver ma place — Gratuit
                  </Link>
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
