'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, X, Calendar, Linkedin } from 'lucide-react';

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
          <div className="font-inter text-[#212121]/60 text-xs">11 Juillet 2026 · 15h00</div>
          <div className="font-inter text-[#212121]/60 text-xs">INSMAC, Rabat</div>
        </div>

        <div className="space-y-3 mb-6">
          <a
            href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=NEXUS+SPECTACLE&dates=20260711T140000Z/20260711T170000Z&details=R%C3%A9servation+confirm%C3%A9e&location=INSMAC%2C+Rabat`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary w-full flex items-center justify-center gap-2 text-sm"
          >
            <Calendar size={16} /> Ajouter à Google Calendar
          </a>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4 text-center">
          <p className="font-inter text-sm text-green-800 font-semibold mb-1">
            💬 Rejoindre la communauté NEXUS
          </p>
          <p className="font-inter text-xs text-green-700 mb-3 leading-relaxed">
            Rejoignez notre communauté WhatsApp pour rester informé(e) de toutes les actualités NEXUS !
          </p>
          <a
            href="https://chat.whatsapp.com/FvbLrzGwxDS9ThyoApsz6M?mode=gi_t"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] text-white text-sm font-raleway font-bold px-5 py-2.5 rounded-lg hover:bg-[#20b858] transition-colors w-full justify-center"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Rejoindre le groupe WhatsApp NEXUS
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
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
              Instagram
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
