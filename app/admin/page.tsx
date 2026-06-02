'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Mail, Bell, Settings, BarChart3, FileDown,
  ToggleLeft, ToggleRight, Send, Eye, Trash2, Search,
  Plus, Check, X, Loader2
} from 'lucide-react';

type Tab = 'dashboard' | 'inscriptions' | 'emails' | 'rappels' | 'settings';

const mockInscriptions = [
  { id: 1, nom: 'Amara Diallo', email: 'amara@email.com', role: 'Participant', nationalite: 'Sénégal', date: '01/06/2026', status: 'confirmed' },
  { id: 2, nom: 'Yves Mabunda', email: 'yves@email.com', role: 'Volontaire', nationalite: 'DR Congo', date: '31/05/2026', status: 'confirmed' },
  { id: 3, nom: 'Fatima Ez-Zahrae', email: 'fatima@email.com', role: 'Spectateur', nationalite: 'Maroc', date: '30/05/2026', status: 'confirmed' },
  { id: 4, nom: 'Kofi Mensah', email: 'kofi@email.com', role: 'Partenaire', nationalite: 'Ghana', date: '29/05/2026', status: 'pending' },
  { id: 5, nom: 'Sara Traoré', email: 'sara@email.com', role: 'Média', nationalite: 'Mali', date: '28/05/2026', status: 'confirmed' },
];

const rappelSchedule = [
  { id: 1, label: 'J-30 — Confirmation de présence', date: '11 juin 2026', sent: 1240, active: true },
  { id: 2, label: 'J-14 — Programme complet', date: '27 juin 2026', sent: 0, active: true },
  { id: 3, label: 'J-7 — Préparez-vous', date: '4 juillet 2026', sent: 0, active: true },
  { id: 4, label: 'J-3 — Détails logistiques', date: '8 juillet 2026', sent: 0, active: true },
  { id: 5, label: 'J-1 — Demain, la jeunesse brille', date: '10 juillet 2026', sent: 0, active: true },
  { id: 6, label: 'J-0 SMS — C\'est aujourd\'hui !', date: '11 juillet 2026', sent: 0, active: false },
];

const statsCards = [
  { label: 'Total inscrits', value: '2 145', delta: '+38 aujourd\'hui', color: 'text-brand-red' },
  { label: 'Spectateurs', value: '1 820', delta: '84.8%', color: 'text-navy' },
  { label: 'Volontaires', value: '114', delta: '5.3%', color: 'text-brand-orange' },
  { label: 'Partenaires', value: '47', delta: '2.2%', color: 'text-brand-green' },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [auth, setAuth] = useState(false);
  const [password, setPassword] = useState('');
  const [search, setSearch] = useState('');
  const [rappels, setRappels] = useState(rappelSchedule);
  const [exportLoading, setExportLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_ADMIN_DEMO || password === 'nexus2026') {
      setAuth(true);
    } else {
      alert('Mot de passe incorrect');
    }
  };

  const toggleRappel = (id: number) => {
    setRappels((prev) => prev.map((r) => r.id === id ? { ...r, active: !r.active } : r));
  };

  const handleExport = async () => {
    setExportLoading(true);
    try {
      const res = await fetch('/api/admin/stats?export=csv');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nexus-inscriptions-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    } catch {
      alert('Export indisponible en démo');
    } finally {
      setExportLoading(false);
    }
  };

  const filtered = mockInscriptions.filter(
    (i) => i.nom.toLowerCase().includes(search.toLowerCase()) || i.email.toLowerCase().includes(search.toLowerCase())
  );

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: <BarChart3 size={16} /> },
    { key: 'inscriptions', label: 'Inscriptions', icon: <Users size={16} /> },
    { key: 'emails', label: 'Emails', icon: <Mail size={16} /> },
    { key: 'rappels', label: 'Rappels', icon: <Bell size={16} /> },
    { key: 'settings', label: 'Paramètres', icon: <Settings size={16} /> },
  ];

  if (!auth) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-brand-red rounded-xl flex items-center justify-center font-montserrat font-black text-white text-xl mx-auto mb-3">N</div>
            <h1 className="font-montserrat font-bold text-navy text-xl">Dashboard Admin</h1>
            <p className="font-inter text-[#212121]/50 text-sm">NEXUS JEUNESSES</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-inter focus:outline-none focus:border-navy"
                placeholder="••••••••"
              />
            </div>
            <button type="submit" className="btn-primary w-full">Accéder au dashboard</button>
          </form>
          <p className="text-center font-inter text-xs text-[#212121]/30 mt-4">Démo : nexus2026</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Top bar */}
      <div className="bg-navy text-white sticky top-16 md:top-20 z-40">
        <div className="container-xl flex items-center justify-between py-3">
          <div className="flex items-center gap-2">
            <span className="font-montserrat font-bold text-sm">Admin</span>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
          </div>
          <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {tabs.map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md font-raleway font-medium text-xs whitespace-nowrap transition-all ${
                  activeTab === key ? 'bg-white/15 text-white' : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {icon} {label}
              </button>
            ))}
          </nav>
          <button onClick={() => setAuth(false)} className="text-white/50 hover:text-white text-xs font-inter transition-colors">
            Déconnexion
          </button>
        </div>
      </div>

      <div className="container-xl py-10">
        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
              <div>
                <h1 className="font-montserrat font-bold text-navy text-2xl">Tableau de bord</h1>
                <p className="font-inter text-[#212121]/50 text-sm">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
              </div>
              <button onClick={handleExport} disabled={exportLoading} className="btn-secondary flex items-center gap-2 text-sm">
                {exportLoading ? <Loader2 size={14} className="animate-spin" /> : <FileDown size={14} />}
                Exporter CSV
              </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {statsCards.map(({ label, value, delta, color }) => (
                <div key={label} className="card p-5">
                  <p className="font-inter text-[#212121]/50 text-xs mb-1">{label}</p>
                  <p className={`font-montserrat font-black text-2xl ${color} mb-1`}>{value}</p>
                  <p className="font-inter text-[#212121]/40 text-xs">{delta}</p>
                </div>
              ))}
            </div>

            {/* Recent inscriptions */}
            <div className="card overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-raleway font-semibold text-navy text-sm">Inscriptions récentes</h2>
                <button onClick={() => setActiveTab('inscriptions')} className="text-brand-red text-xs font-inter hover:underline">Voir tout →</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Nom', 'Email', 'Rôle', 'Nationalité', 'Date', 'Statut'].map((h) => (
                        <th key={h} className="px-4 py-3 text-left font-raleway font-semibold text-[#212121]/50 text-xs">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {mockInscriptions.slice(0, 5).map((row) => (
                      <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-inter text-navy text-xs font-medium">{row.nom}</td>
                        <td className="px-4 py-3 font-inter text-[#212121]/60 text-xs">{row.email}</td>
                        <td className="px-4 py-3"><span className="badge bg-navy/8 text-navy text-xs">{row.role}</span></td>
                        <td className="px-4 py-3 font-inter text-[#212121]/60 text-xs">{row.nationalite}</td>
                        <td className="px-4 py-3 font-inter text-[#212121]/50 text-xs">{row.date}</td>
                        <td className="px-4 py-3">
                          <span className={`badge text-xs ${row.status === 'confirmed' ? 'bg-brand-green/10 text-brand-green' : 'bg-brand-orange/10 text-brand-orange'}`}>
                            {row.status === 'confirmed' ? '✓ Confirmé' : '⏳ En attente'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* INSCRIPTIONS */}
        {activeTab === 'inscriptions' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <h1 className="font-montserrat font-bold text-navy text-2xl">Inscriptions</h1>
              <div className="flex gap-3">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#212121]/40" />
                  <input
                    type="text"
                    placeholder="Chercher..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8 pr-4 py-2 border border-gray-200 rounded-lg text-sm font-inter focus:outline-none focus:border-navy"
                  />
                </div>
                <button onClick={handleExport} className="btn-secondary flex items-center gap-2 text-sm">
                  <FileDown size={14} /> Export CSV
                </button>
              </div>
            </div>
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {['#', 'Nom', 'Email', 'Rôle', 'Nationalité', 'Date', 'Statut', 'Actions'].map((h) => (
                        <th key={h} className="px-4 py-3 text-left font-raleway font-semibold text-[#212121]/50 text-xs">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map((row) => (
                      <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-inter text-[#212121]/40 text-xs">{row.id}</td>
                        <td className="px-4 py-3 font-inter text-navy text-xs font-medium">{row.nom}</td>
                        <td className="px-4 py-3 font-inter text-[#212121]/60 text-xs">{row.email}</td>
                        <td className="px-4 py-3"><span className="badge bg-navy/8 text-navy text-xs">{row.role}</span></td>
                        <td className="px-4 py-3 font-inter text-[#212121]/60 text-xs">{row.nationalite}</td>
                        <td className="px-4 py-3 font-inter text-[#212121]/50 text-xs">{row.date}</td>
                        <td className="px-4 py-3">
                          <span className={`badge text-xs ${row.status === 'confirmed' ? 'bg-brand-green/10 text-brand-green' : 'bg-brand-orange/10 text-brand-orange'}`}>
                            {row.status === 'confirmed' ? '✓ Confirmé' : '⏳ En attente'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button className="p-1.5 rounded hover:bg-gray-100 text-[#212121]/40 hover:text-navy transition-colors"><Eye size={13} /></button>
                            <button className="p-1.5 rounded hover:bg-red-50 text-[#212121]/40 hover:text-brand-red transition-colors"><Trash2 size={13} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* RAPPELS */}
        {activeTab === 'rappels' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="font-montserrat font-bold text-navy text-2xl mb-2">Gestion des rappels</h1>
            <p className="font-inter text-[#212121]/50 text-sm mb-8">Activez ou désactivez les rappels automatiques. Les emails sont envoyés à 9h00 (heure de Rabat).</p>
            <div className="space-y-3 max-w-2xl">
              {rappels.map((r) => (
                <div key={r.id} className="card p-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-raleway font-semibold text-navy text-sm">{r.label}</p>
                    <p className="font-inter text-[#212121]/50 text-xs">
                      {r.date}
                      {r.sent > 0 && <span className="ml-2 text-brand-green">✓ {r.sent.toLocaleString('fr-FR')} envoyés</span>}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleRappel(r.id)}
                    className={`transition-colors flex-shrink-0 ${r.active ? 'text-brand-green' : 'text-[#212121]/30'}`}
                    aria-label={r.active ? 'Désactiver' : 'Activer'}
                  >
                    {r.active ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-8 card p-6 max-w-2xl bg-navy/3">
              <h2 className="font-raleway font-semibold text-navy text-sm mb-3 flex items-center gap-2">
                <Send size={15} /> Envoyer un email manuel
              </h2>
              <div className="space-y-3">
                <select className="input-field bg-white border border-gray-200 rounded-lg px-3 py-2">
                  <option>Tous les inscrits (2 145)</option>
                  <option>Spectateurs uniquement (1 820)</option>
                  <option>Volontaires uniquement (114)</option>
                  <option>Partenaires uniquement (47)</option>
                </select>
                <input className="input-field" placeholder="Sujet de l'email" />
                <textarea className="input-field resize-none" rows={4} placeholder="Corps du message…" />
                <button className="btn-primary flex items-center gap-2 text-sm">
                  <Send size={14} /> Envoyer maintenant
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* EMAILS */}
        {activeTab === 'emails' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="font-montserrat font-bold text-navy text-2xl mb-2">Templates emails</h1>
            <p className="font-inter text-[#212121]/50 text-sm mb-8">Éditez les templates de vos emails transactionnels.</p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { label: 'Confirmation d\'inscription', status: '✓ Actif', color: 'brand-green' },
                { label: 'Rappel J-30', status: '✓ Actif', color: 'brand-green' },
                { label: 'Rappel J-14', status: '✓ Actif', color: 'brand-green' },
                { label: 'Rappel J-7', status: '✓ Actif', color: 'brand-green' },
                { label: 'Rappel J-3 (logistique)', status: '✓ Actif', color: 'brand-green' },
                { label: 'Rappel J-1', status: '✓ Actif', color: 'brand-green' },
                { label: 'Newsletter', status: '⚡ Brouillon', color: 'brand-orange' },
                { label: 'Notification partenaire', status: '⚡ Brouillon', color: 'brand-orange' },
              ].map(({ label, status, color }) => (
                <div key={label} className="card p-4 flex items-center justify-between">
                  <div>
                    <p className="font-raleway font-semibold text-navy text-sm">{label}</p>
                    <p className={`font-inter text-xs text-${color}`}>{status}</p>
                  </div>
                  <button className="btn-secondary text-xs px-3 py-1.5">Éditer</button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* SETTINGS */}
        {activeTab === 'settings' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="font-montserrat font-bold text-navy text-2xl mb-8">Paramètres</h1>
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl">
              <div className="card p-6">
                <h2 className="font-raleway font-semibold text-navy mb-4">Email expéditeur</h2>
                <div className="space-y-3">
                  <div>
                    <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Nom affiché</label>
                    <input defaultValue="NEXUS JEUNESSES" className="input-field" />
                  </div>
                  <div>
                    <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Email</label>
                    <input defaultValue="noreply@nexusjeunesses.org" className="input-field" />
                  </div>
                  <button className="btn-primary text-sm">Sauvegarder</button>
                </div>
              </div>
              <div className="card p-6">
                <h2 className="font-raleway font-semibold text-navy mb-4">Événement</h2>
                <div className="space-y-3">
                  <div>
                    <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Nom de l'événement</label>
                    <input defaultValue="NEXUS SPECTACLE 2026" className="input-field" />
                  </div>
                  <div>
                    <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Capacité maximale</label>
                    <input type="number" defaultValue={2500} className="input-field" />
                  </div>
                  <button className="btn-primary text-sm">Sauvegarder</button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
