'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, X, Calendar, Share2, Instagram, Linkedin } from 'lucide-react';
import Link from 'next/link';

declare const confetti: any;

export default function ConfirmationModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const launchConfetti = async () => {
      try {
        const canvasConfetti = (await import('canvas-confetti')).default;
        canvasConfetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#0A1E3C', '#D32F2F', '#FF9800', '#4CAF50', '#FFFFFF'],
        });
      } catch {}
    };
    launchConfetti();
  }, []);

  const shareText = encodeURIComponent('Je serai au NEXUS SPECTACLE le 11 juillet 2026 à Rabat ! La jeunesse ne subit plus. Elle éclaire. #NEXUSJEUNESSES');

  return (
    <div
      className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Inscription confirmée"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-[#212121]/40 hover:bg-gray-100 hover:text-[#212121] transition-colors"
          aria-label="Fermer"
        >
          <X size={18} />
        </button>

        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={40} className="text-brand-green" />
          </div>
          <h2 className="font-montserrat font-black text-navy text-2xl mb-2">
            Inscription confirmée !
          </h2>
          <p className="font-inter text-[#212121]/65 text-sm leading-relaxed">
            Bienvenue dans la famille NEXUS. Vérifiez votre email pour votre confirmation et votre invitation calendrier.
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-6 text-center">
          <div className="font-montserrat font-bold text-navy text-sm mb-1">NEXUS SPECTACLE</div>
          <div className="font-inter text-[#212121]/60 text-xs">11 Juillet 2026 · 18h00</div>
          <div className="font-inter text-[#212121]/60 text-xs">Théâtre Mohamed Bahnini, Rabat</div>
        </div>

        <div className="space-y-3 mb-6">
          <a
            href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=NEXUS+SPECTACLE&dates=20260711T160000Z/20260711T200000Z&details=R%C3%A9servation+confirm%C3%A9e&location=Th%C3%A9%C3%A2tre+Mohamed+Bahnini+Rabat`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary w-full flex items-center justify-center gap-2 text-sm"
          >
            <Calendar size={16} /> Ajouter à Google Calendar
          </a>
        </div>

        <div>
          <p className="font-inter text-[#212121]/50 text-xs text-center mb-3">Partagez l'événement</p>
          <div className="flex gap-2 justify-center">
            <a
              href={`https://www.instagram.com/`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs font-raleway font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              <Instagram size={14} /> Instagram
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://nexusjeunesses.org/spectacle')}&summary=${shareText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#0077B5] text-white text-xs font-raleway font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              <Linkedin size={14} /> LinkedIn
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
