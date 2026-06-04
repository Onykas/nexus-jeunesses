'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Mail, Bell, Settings, BarChart3, FileDown,
  ToggleLeft, ToggleRight, Send, Eye, Trash2, Search,
  Check, X, Loader2, Mic2, Newspaper, Building2,
  UserCheck, Award, Globe, Plus, Edit3, Save,
  PlayCircle, ChevronDown, RefreshCw, ExternalLink,
} from 'lucide-react';

/* ─── Types ─── */
type Tab = 'dashboard' | 'spectacle' | 'inscriptions' | 'medias' | 'comptes' | 'partenariats' | 'modules' | 'emails' | 'settings';

interface Inscription {
  id: string; prenom: string; nom: string; email: string; telephone: string;
  role: string; nationalite: string; status: string; createdAt: string;
}
interface Stats {
  total: number; accounts: number; candidates: number; votes: number;
  byRole: { role: string; _count: { role: number } }[];
}
interface Article {
  id: string; titre: string; slug: string; categorie: string; contenu: string;
  auteur: string; imageUrl: string | null; publie: boolean; publishedAt: string | null; createdAt: string;
}
interface Video {
  id: string; titre: string; url: string; description: string | null; categorie: string; createdAt: string;
}
interface EmailLog {
  id: string; to: string; subject: string; type: string; status: string; sentAt: string;
}

const CATEGORIES_ARTICLE = ['Éloquence', 'Leadership', 'Innovation', 'Culture', 'Actualités', 'Partenariat'];

/* ─── Helpers ─── */
function adminHeaders(pw: string) {
  return { 'Content-Type': 'application/json', 'x-admin-password': pw };
}

/* ─── Modal Article ─── */
function ArticleModal({
  article, pw, onClose, onSaved,
}: {
  article: Article | null; pw: string; onClose: () => void; onSaved: () => void;
}) {
  const [form, setForm] = useState({
    titre: article?.titre ?? '',
    categorie: article?.categorie ?? CATEGORIES_ARTICLE[0],
    auteur: article?.auteur ?? '',
    imageUrl: article?.imageUrl ?? '',
    contenu: article?.contenu ?? '',
    publie: article?.publie ?? false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const save = async () => {
    if (!form.titre || !form.contenu || !form.auteur) { setError('Titre, auteur et contenu requis'); return; }
    setLoading(true); setError('');
    try {
      const url = article ? `/api/admin/articles/${article.id}` : '/api/admin/articles';
      const method = article ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: adminHeaders(pw), body: JSON.stringify(form) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      onSaved();
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h2 className="font-montserrat font-bold text-navy text-lg">
            {article ? 'Modifier l\'article' : 'Nouvel article'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Titre *</label>
            <input
              value={form.titre}
              onChange={(e) => setForm(p => ({ ...p, titre: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-inter focus:outline-none focus:border-navy"
              placeholder="Titre de l'article"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Catégorie</label>
              <select
                value={form.categorie}
                onChange={(e) => setForm(p => ({ ...p, categorie: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-inter focus:outline-none focus:border-navy bg-transparent"
              >
                {CATEGORIES_ARTICLE.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Auteur *</label>
              <input
                value={form.auteur}
                onChange={(e) => setForm(p => ({ ...p, auteur: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-inter focus:outline-none focus:border-navy"
                placeholder="Prénom Nom"
              />
            </div>
          </div>
          <div>
            <label className="font-inter text-xs text-[#212121]/60 mb-1 block">URL image (optionnel)</label>
            <input
              value={form.imageUrl}
              onChange={(e) => setForm(p => ({ ...p, imageUrl: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-inter focus:outline-none focus:border-navy"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Contenu *</label>
            <textarea
              value={form.contenu}
              onChange={(e) => setForm(p => ({ ...p, contenu: e.target.value }))}
              rows={10}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-inter focus:outline-none focus:border-navy resize-y"
              placeholder="Rédigez l'article ici..."
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setForm(p => ({ ...p, publie: !p.publie }))}
              className={`transition-colors ${form.publie ? 'text-brand-green' : 'text-[#212121]/30'}`}
            >
              {form.publie ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
            </button>
            <span className="font-inter text-sm text-[#212121]/70">
              {form.publie ? 'Publié — visible sur le site' : 'Brouillon — non visible'}
            </span>
          </div>
          {error && <p className="text-brand-red text-xs">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="btn-secondary text-sm flex-1">Annuler</button>
            <button onClick={save} disabled={loading} className="btn-primary text-sm flex-1 flex items-center justify-center gap-2">
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {article ? 'Enregistrer' : 'Créer l\'article'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Modal Vidéo ─── */
function VideoModal({
  video, pw, onClose, onSaved,
}: {
  video: Video | null; pw: string; onClose: () => void; onSaved: () => void;
}) {
  const [form, setForm] = useState({
    titre: video?.titre ?? '',
    url: video?.url ?? '',
    description: video?.description ?? '',
    categorie: video?.categorie ?? 'general',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const save = async () => {
    if (!form.titre || !form.url) { setError('Titre et URL requis'); return; }
    setLoading(true); setError('');
    try {
      const url = video ? `/api/admin/videos/${video.id}` : '/api/admin/videos';
      const method = video ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: adminHeaders(pw), body: JSON.stringify(form) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      onSaved(); onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur');
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h2 className="font-montserrat font-bold text-navy text-lg">{video ? 'Modifier la vidéo' : 'Ajouter une vidéo'}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Titre *</label>
            <input value={form.titre} onChange={(e) => setForm(p => ({ ...p, titre: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-inter focus:outline-none focus:border-navy"
              placeholder="Titre de la vidéo" />
          </div>
          <div>
            <label className="font-inter text-xs text-[#212121]/60 mb-1 block">URL YouTube / Vimeo *</label>
            <input value={form.url} onChange={(e) => setForm(p => ({ ...p, url: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-inter focus:outline-none focus:border-navy"
              placeholder="https://youtube.com/watch?v=..." />
          </div>
          <div>
            <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Catégorie</label>
            <select value={form.categorie} onChange={(e) => setForm(p => ({ ...p, categorie: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-inter focus:outline-none focus:border-navy bg-transparent">
              {['general', 'spectacle', 'interview', 'eloquence', 'coulisses'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Description (optionnel)</label>
            <textarea value={form.description} onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
              rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-inter focus:outline-none focus:border-navy resize-none"
              placeholder="Courte description..." />
          </div>
          {error && <p className="text-brand-red text-xs">{error}</p>}
          <div className="flex gap-3">
            <button onClick={onClose} className="btn-secondary text-sm flex-1">Annuler</button>
            <button onClick={save} disabled={loading} className="btn-primary text-sm flex-1 flex items-center justify-center gap-2">
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {video ? 'Enregistrer' : 'Ajouter'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Page principale ─── */
export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [auth, setAuth] = useState(false);
  const [password, setPassword] = useState('');
  const [adminPw, setAdminPw] = useState('');

  // Data
  const [stats, setStats] = useState<Stats | null>(null);
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(false);

  // UI
  const [search, setSearch] = useState('');
  const [articleModal, setArticleModal] = useState<{ open: boolean; article: Article | null }>({ open: false, article: null });
  const [videoModal, setVideoModal] = useState<{ open: boolean; video: Video | null }>({ open: false, video: null });
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: string; id: string } | null>(null);

  // Toggles (module d'état local)
  const [votePublic, setVotePublic] = useState(false);
  const [voteFinal, setVoteFinal] = useState(false);
  const [publishResults, setPublishResults] = useState(false);
  const [inscriptionsOpen, setInscriptionsOpen] = useState(true);

  // Email form
  const [emailForm, setEmailForm] = useState({ destinataires: 'tous', sujet: '', contenu: '' });
  const [emailSending, setEmailSending] = useState(false);
  const [emailResult, setEmailResult] = useState<string | null>(null);

  // Modules text
  const [moduleTexts, setModuleTexts] = useState({
    rapport: 'NEXUS RAPPORT sera le premier rapport sur les jeunesses au Maroc.\n\nÀ venir — 17 octobre 2026',
    mesdames: 'Bientôt disponible',
    olympiques: 'Bientôt disponible',
  });
  const [editModule, setEditModule] = useState<string | null>(null);

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: <BarChart3 size={14} /> },
    { key: 'spectacle', label: 'Spectacle', icon: <Mic2 size={14} /> },
    { key: 'inscriptions', label: 'Inscriptions', icon: <Users size={14} /> },
    { key: 'medias', label: 'Médias', icon: <Newspaper size={14} /> },
    { key: 'comptes', label: 'Comptes', icon: <UserCheck size={14} /> },
    { key: 'partenariats', label: 'Partenariats', icon: <Building2 size={14} /> },
    { key: 'modules', label: 'Modules', icon: <Globe size={14} /> },
    { key: 'emails', label: 'Emails', icon: <Mail size={14} /> },
    { key: 'settings', label: 'Paramètres', icon: <Settings size={14} /> },
  ];

  /* ─── Data fetching ─── */
  const fetchStats = useCallback(async () => {
    const res = await fetch('/api/admin/inscriptions', { headers: { 'x-admin-password': adminPw } });
    if (res.ok) {
      const data = await res.json();
      setStats({ total: data.total, accounts: data.accounts, candidates: data.candidates, votes: data.votes, byRole: data.byRole });
      setInscriptions(data.inscriptions);
    }
  }, [adminPw]);

  const fetchArticles = useCallback(async () => {
    const res = await fetch('/api/admin/articles', { headers: { 'x-admin-password': adminPw } });
    if (res.ok) setArticles(await res.json());
  }, [adminPw]);

  const fetchVideos = useCallback(async () => {
    const res = await fetch('/api/admin/videos', { headers: { 'x-admin-password': adminPw } });
    if (res.ok) setVideos(await res.json());
  }, [adminPw]);

  const fetchEmailLogs = useCallback(async () => {
    const res = await fetch('/api/admin/email-log', { headers: { 'x-admin-password': adminPw } });
    if (res.ok) setEmailLogs(await res.json());
  }, [adminPw]);

  useEffect(() => {
    if (!auth) return;
    fetchStats();
  }, [auth, fetchStats]);

  useEffect(() => {
    if (!auth) return;
    if (activeTab === 'medias') { fetchArticles(); fetchVideos(); }
    if (activeTab === 'emails') fetchEmailLogs();
    if (activeTab === 'inscriptions' || activeTab === 'dashboard') fetchStats();
  }, [auth, activeTab, fetchArticles, fetchVideos, fetchEmailLogs, fetchStats]);

  /* ─── Auth ─── */
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_ADMIN_DEMO || password === 'nexus2026') {
      setAuth(true);
      setAdminPw(password);
    } else {
      alert('Mot de passe incorrect');
    }
  };

  /* ─── Actions ─── */
  const togglePublish = async (article: Article) => {
    await fetch(`/api/admin/articles/${article.id}`, {
      method: 'PUT',
      headers: adminHeaders(adminPw),
      body: JSON.stringify({ publie: !article.publie }),
    });
    fetchArticles();
  };

  const deleteItem = async () => {
    if (!deleteConfirm) return;
    setLoading(true);
    const url = deleteConfirm.type === 'article'
      ? `/api/admin/articles/${deleteConfirm.id}`
      : `/api/admin/videos/${deleteConfirm.id}`;
    await fetch(url, { method: 'DELETE', headers: { 'x-admin-password': adminPw } });
    setDeleteConfirm(null);
    setLoading(false);
    if (deleteConfirm.type === 'article') fetchArticles(); else fetchVideos();
  };

  const exportCsv = async () => {
    const res = await fetch('/api/admin/inscriptions?export=csv', { headers: { 'x-admin-password': adminPw } });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `nexus-inscriptions-${new Date().toISOString().split('T')[0]}.csv`; a.click();
  };

  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailSending(true); setEmailResult(null);
    try {
      const res = await fetch('/api/admin/send-email', {
        method: 'POST',
        headers: adminHeaders(adminPw),
        body: JSON.stringify(emailForm),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setEmailResult(`✅ Email envoyé à ${json.sent} destinataires`);
      setEmailForm(p => ({ ...p, sujet: '', contenu: '' }));
      fetchEmailLogs();
    } catch (e: unknown) {
      setEmailResult(`❌ ${e instanceof Error ? e.message : 'Erreur'}`);
    } finally { setEmailSending(false); }
  };

  const filtered = inscriptions.filter(
    (i) => i.prenom.toLowerCase().includes(search.toLowerCase())
      || i.nom.toLowerCase().includes(search.toLowerCase())
      || i.email.toLowerCase().includes(search.toLowerCase())
  );

  /* ─── Login screen ─── */
  if (!auth) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-brand-red rounded-xl flex items-center justify-center font-montserrat font-black text-white text-xl mx-auto mb-3">N</div>
            <h1 className="font-montserrat font-bold text-navy text-xl">Dashboard Admin</h1>
            <p className="font-inter text-[#212121]/50 text-sm">NEXUS DES JEUNESSES</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Mot de passe</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-inter focus:outline-none focus:border-navy"
                placeholder="••••••••" />
            </div>
            <button type="submit" className="btn-primary w-full">Accéder au dashboard</button>
          </form>
          <p className="text-center font-inter text-xs text-[#212121]/30 mt-4">Démo : nexus2026</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Modals */}
      {articleModal.open && (
        <ArticleModal
          article={articleModal.article}
          pw={adminPw}
          onClose={() => setArticleModal({ open: false, article: null })}
          onSaved={fetchArticles}
        />
      )}
      {videoModal.open && (
        <VideoModal
          video={videoModal.video}
          pw={adminPw}
          onClose={() => setVideoModal({ open: false, video: null })}
          onSaved={fetchVideos}
        />
      )}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center">
            <p className="font-montserrat font-bold text-navy text-base mb-2">Confirmer la suppression</p>
            <p className="font-inter text-[#212121]/60 text-sm mb-6">Cette action est irréversible.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="btn-secondary flex-1 text-sm">Annuler</button>
              <button onClick={deleteItem} disabled={loading} className="flex-1 bg-brand-red text-white rounded-lg py-2 text-sm font-raleway font-semibold flex items-center justify-center gap-2">
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />} Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

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
                <button key={key} onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-md font-raleway font-medium text-xs whitespace-nowrap transition-all ${activeTab === key ? 'bg-white/15 text-white' : 'text-white/60 hover:text-white hover:bg-white/10'}`}>
                  {icon} {label}
                </button>
              ))}
            </nav>
            <button onClick={() => { setAuth(false); setAdminPw(''); }} className="text-white/50 hover:text-white text-xs font-inter transition-colors flex-shrink-0">
              Déconnexion
            </button>
          </div>
        </div>

        <div className="container-xl py-10">

          {/* ── DASHBOARD ── */}
          {activeTab === 'dashboard' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                <div>
                  <h1 className="font-montserrat font-bold text-navy text-2xl">Tableau de bord</h1>
                  <p className="font-inter text-[#212121]/50 text-sm">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={fetchStats} className="btn-secondary flex items-center gap-2 text-sm">
                    <RefreshCw size={14} /> Actualiser
                  </button>
                  <button onClick={exportCsv} className="btn-secondary flex items-center gap-2 text-sm">
                    <FileDown size={14} /> Export CSV
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Total inscrits', value: stats?.total ?? '—', color: 'text-brand-red' },
                  { label: 'Comptes créés', value: stats?.accounts ?? '—', color: 'text-navy' },
                  { label: 'Candidats éloquence', value: stats?.candidates ?? '—', color: 'text-brand-orange' },
                  { label: 'Votes reçus', value: stats?.votes ?? '—', color: 'text-brand-green' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="card p-5">
                    <p className="font-inter text-[#212121]/50 text-xs mb-1">{label}</p>
                    <p className={`font-montserrat font-black text-3xl ${color}`}>{value}</p>
                  </div>
                ))}
              </div>
              {stats?.byRole && stats.byRole.length > 0 && (
                <div className="card p-5 mb-6">
                  <h2 className="font-raleway font-semibold text-navy text-sm mb-4">Répartition par rôle</h2>
                  <div className="flex flex-wrap gap-3">
                    {stats.byRole.map(({ role, _count }) => (
                      <div key={role} className="bg-gray-50 rounded-lg px-4 py-2 text-center">
                        <p className="font-montserrat font-bold text-navy text-lg">{_count.role}</p>
                        <p className="font-inter text-[#212121]/50 text-xs capitalize">{role}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="card overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-raleway font-semibold text-navy text-sm">Inscriptions récentes</h2>
                  <button onClick={() => setActiveTab('inscriptions')} className="text-brand-red text-xs font-inter hover:underline">Voir tout →</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>{['Nom', 'Email', 'Rôle', 'Nationalité', 'Statut'].map(h => (
                        <th key={h} className="px-4 py-3 text-left font-raleway font-semibold text-[#212121]/50 text-xs">{h}</th>
                      ))}</tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {inscriptions.slice(0, 8).map(row => (
                        <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 font-inter text-navy text-xs font-medium">{row.prenom} {row.nom}</td>
                          <td className="px-4 py-3 font-inter text-[#212121]/60 text-xs">{row.email}</td>
                          <td className="px-4 py-3"><span className="badge bg-navy/8 text-navy text-xs capitalize">{row.role}</span></td>
                          <td className="px-4 py-3 font-inter text-[#212121]/60 text-xs">{row.nationalite}</td>
                          <td className="px-4 py-3">
                            <span className={`badge text-xs ${row.status === 'confirmed' ? 'bg-brand-green/10 text-brand-green' : 'bg-brand-orange/10 text-brand-orange'}`}>
                              {row.status === 'confirmed' ? '✓ Confirmé' : '⏳ En attente'}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {inscriptions.length === 0 && (
                        <tr><td colSpan={5} className="px-4 py-8 text-center font-inter text-[#212121]/40 text-sm">Aucune inscription pour l'instant</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── SPECTACLE ── */}
          {activeTab === 'spectacle' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="font-montserrat font-bold text-navy text-2xl mb-8">Gestion Spectacle</h1>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="card p-6">
                  <h2 className="font-raleway font-semibold text-navy text-sm mb-4 flex items-center gap-2"><Award size={16} className="text-brand-red" /> Gestion des votes</h2>
                  <div className="space-y-3">
                    {[
                      { label: 'Vote public (Phase 1)', state: votePublic, set: setVotePublic },
                      { label: 'Vote final (Phase 2 — 11 juillet)', state: voteFinal, set: setVoteFinal },
                      { label: 'Publier les résultats', state: publishResults, set: setPublishResults },
                    ].map(({ label, state, set }) => (
                      <div key={label} className="flex items-center justify-between">
                        <span className="font-inter text-[#212121]/70 text-sm">{label}</span>
                        <button onClick={() => set(!state)} className={`transition-colors ${state ? 'text-brand-green' : 'text-[#212121]/30'}`}>
                          {state ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── INSCRIPTIONS ── */}
          {activeTab === 'inscriptions' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div>
                  <h1 className="font-montserrat font-bold text-navy text-2xl">Inscriptions</h1>
                  <p className="font-inter text-[#212121]/50 text-sm">{stats?.total ?? 0} au total</p>
                </div>
                <div className="flex gap-3 flex-wrap">
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#212121]/40" />
                    <input type="text" placeholder="Chercher…" value={search} onChange={(e) => setSearch(e.target.value)}
                      className="pl-8 pr-4 py-2 border border-gray-200 rounded-lg text-sm font-inter focus:outline-none focus:border-navy" />
                  </div>
                  <button onClick={exportCsv} className="btn-secondary flex items-center gap-2 text-sm">
                    <FileDown size={14} /> Export CSV
                  </button>
                </div>
              </div>
              <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>{['Nom', 'Email', 'Rôle', 'Nationalité', 'Date', 'Statut'].map(h => (
                        <th key={h} className="px-4 py-3 text-left font-raleway font-semibold text-[#212121]/50 text-xs">{h}</th>
                      ))}</tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filtered.map((row) => (
                        <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 font-inter text-navy text-xs font-medium">{row.prenom} {row.nom}</td>
                          <td className="px-4 py-3 font-inter text-[#212121]/60 text-xs">{row.email}</td>
                          <td className="px-4 py-3"><span className="badge bg-navy/8 text-navy text-xs capitalize">{row.role}</span></td>
                          <td className="px-4 py-3 font-inter text-[#212121]/60 text-xs">{row.nationalite}</td>
                          <td className="px-4 py-3 font-inter text-[#212121]/50 text-xs">{new Date(row.createdAt).toLocaleDateString('fr-FR')}</td>
                          <td className="px-4 py-3">
                            <span className={`badge text-xs ${row.status === 'confirmed' ? 'bg-brand-green/10 text-brand-green' : 'bg-brand-orange/10 text-brand-orange'}`}>
                              {row.status === 'confirmed' ? '✓ Confirmé' : '⏳ En attente'}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {filtered.length === 0 && (
                        <tr><td colSpan={6} className="px-4 py-8 text-center font-inter text-[#212121]/40 text-sm">Aucune inscription</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── MÉDIAS ── */}
          {activeTab === 'medias' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="font-montserrat font-bold text-navy text-2xl mb-8">Gestion Médias</h1>

              {/* Articles */}
              <div className="card overflow-hidden mb-6">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-raleway font-semibold text-navy text-sm flex items-center gap-2">
                    <Newspaper size={15} /> Articles ({articles.length})
                  </h2>
                  <button onClick={() => setArticleModal({ open: true, article: null })} className="btn-primary text-xs flex items-center gap-1.5">
                    <Plus size={13} /> Nouvel article
                  </button>
                </div>
                {articles.length === 0 ? (
                  <div className="p-10 text-center">
                    <p className="font-inter text-[#212121]/40 text-sm mb-4">Aucun article rédigé.</p>
                    <button onClick={() => setArticleModal({ open: true, article: null })} className="btn-secondary text-xs flex items-center gap-1.5 mx-auto">
                      <Plus size={13} /> Créer le premier article
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {articles.map((a) => (
                      <div key={a.id} className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors">
                        <div className="flex-1 min-w-0">
                          <p className="font-inter font-medium text-navy text-sm truncate">{a.titre}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-inter text-[#212121]/50 text-xs">{a.categorie}</span>
                            <span className="text-[#212121]/30 text-xs">·</span>
                            <span className="font-inter text-[#212121]/50 text-xs">{a.auteur}</span>
                            <span className="text-[#212121]/30 text-xs">·</span>
                            <span className="font-inter text-[#212121]/50 text-xs">{new Date(a.createdAt).toLocaleDateString('fr-FR')}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button onClick={() => togglePublish(a)}
                            className={`text-xs font-raleway font-semibold px-2 py-1 rounded-md transition-colors ${a.publie ? 'bg-brand-green/10 text-brand-green hover:bg-brand-green/20' : 'bg-gray-100 text-[#212121]/50 hover:bg-gray-200'}`}>
                            {a.publie ? '✓ Publié' : 'Brouillon'}
                          </button>
                          <button onClick={() => setArticleModal({ open: true, article: a })}
                            className="p-1.5 rounded hover:bg-gray-100 text-[#212121]/40 hover:text-navy transition-colors">
                            <Edit3 size={13} />
                          </button>
                          <button onClick={() => setDeleteConfirm({ type: 'article', id: a.id })}
                            className="p-1.5 rounded hover:bg-red-50 text-[#212121]/40 hover:text-brand-red transition-colors">
                            <Trash2 size={13} />
                          </button>
                          {a.publie && (
                            <a href={`/media/${a.slug}`} target="_blank" rel="noreferrer"
                              className="p-1.5 rounded hover:bg-gray-100 text-[#212121]/40 hover:text-navy transition-colors">
                              <ExternalLink size={13} />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Vidéos */}
              <div className="card overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-raleway font-semibold text-navy text-sm flex items-center gap-2">
                    <PlayCircle size={15} /> Vidéos ({videos.length})
                  </h2>
                  <button onClick={() => setVideoModal({ open: true, video: null })} className="btn-primary text-xs flex items-center gap-1.5">
                    <Plus size={13} /> Ajouter une vidéo
                  </button>
                </div>
                {videos.length === 0 ? (
                  <div className="p-10 text-center">
                    <p className="font-inter text-[#212121]/40 text-sm mb-4">Aucune vidéo ajoutée.</p>
                    <button onClick={() => setVideoModal({ open: true, video: null })} className="btn-secondary text-xs flex items-center gap-1.5 mx-auto">
                      <Plus size={13} /> Ajouter la première vidéo
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {videos.map((v) => (
                      <div key={v.id} className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors">
                        <div className="flex-1 min-w-0">
                          <p className="font-inter font-medium text-navy text-sm truncate">{v.titre}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-inter text-[#212121]/50 text-xs capitalize">{v.categorie}</span>
                            <span className="text-[#212121]/30 text-xs">·</span>
                            <a href={v.url} target="_blank" rel="noreferrer" className="font-inter text-brand-red text-xs hover:underline truncate max-w-[200px]">{v.url}</a>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button onClick={() => setVideoModal({ open: true, video: v })}
                            className="p-1.5 rounded hover:bg-gray-100 text-[#212121]/40 hover:text-navy transition-colors">
                            <Edit3 size={13} />
                          </button>
                          <button onClick={() => setDeleteConfirm({ type: 'video', id: v.id })}
                            className="p-1.5 rounded hover:bg-red-50 text-[#212121]/40 hover:text-brand-red transition-colors">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ── COMPTES ── */}
          {activeTab === 'comptes' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="font-montserrat font-bold text-navy text-2xl mb-8">Gestion Comptes</h1>
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                {[
                  { label: 'Comptes actifs', value: stats?.accounts ?? '—', color: 'text-navy' },
                  { label: 'Candidats éloquence', value: stats?.candidates ?? '—', color: 'text-brand-orange' },
                  { label: 'Votes reçus', value: stats?.votes ?? '—', color: 'text-brand-green' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="card p-5">
                    <p className="font-inter text-[#212121]/50 text-xs mb-1">{label}</p>
                    <p className={`font-montserrat font-black text-2xl ${color}`}>{value}</p>
                  </div>
                ))}
              </div>
              <div className="card p-6">
                <h2 className="font-raleway font-semibold text-navy text-sm mb-4">Assigner un rôle Juré</h2>
                <p className="font-inter text-[#212121]/55 text-xs mb-4">Entrez l&apos;email d&apos;un compte existant pour lui attribuer le statut de juré.</p>
                <div className="flex gap-3">
                  <input type="email" placeholder="Email du juré" className="input-field flex-1 border border-gray-200 rounded-lg px-3 py-2" />
                  <button className="btn-primary text-sm flex items-center gap-2"><Plus size={14} /> Assigner</button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── PARTENARIATS ── */}
          {activeTab === 'partenariats' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="font-montserrat font-bold text-navy text-2xl mb-8">Partenariats</h1>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-3 card p-6 text-center text-[#212121]/40">
                  <p className="font-inter text-sm">Les demandes de partenariat reçues apparaîtront ici.</p>
                </div>
                <div className="card p-6">
                  <h2 className="font-raleway font-semibold text-navy text-sm mb-3 flex items-center gap-2"><Building2 size={14} /> Soutiens institutionnels</h2>
                  {['Université Mohammed V', 'Pôle Vie Étudiante', 'AMCI', 'Ambassade RDC'].map(n => (
                    <div key={n} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <span className="font-inter text-xs text-[#212121]/70">{n}</span>
                      <button className="p-1 rounded hover:bg-gray-100 text-[#212121]/40 hover:text-navy transition-colors"><Edit3 size={12} /></button>
                    </div>
                  ))}
                </div>
                <div className="card p-6">
                  <h2 className="font-raleway font-semibold text-navy text-sm mb-3 flex items-center gap-2"><Globe size={14} /> Associations membres</h2>
                  <div className="text-center py-4 text-[#212121]/40"><p className="font-inter text-xs">Aucune association ajoutée.</p></div>
                  <button className="btn-secondary text-xs flex items-center gap-1.5 mx-auto"><Plus size={12} /> Ajouter</button>
                </div>
                <div className="card p-6">
                  <h2 className="font-raleway font-semibold text-navy text-sm mb-3 flex items-center gap-2"><Users size={14} /> Organisateurs</h2>
                  {['UESCOM', 'Speak To Lead', 'CESAM'].map(n => (
                    <div key={n} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <span className="font-inter text-xs text-[#212121]/70">{n}</span>
                      <button className="p-1 rounded hover:bg-gray-100 text-[#212121]/40 hover:text-navy transition-colors"><Edit3 size={12} /></button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── MODULES ── */}
          {activeTab === 'modules' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="font-montserrat font-bold text-navy text-2xl mb-8">Textes des modules</h1>
              <div className="space-y-4">
                {([['rapport', 'NEXUS RAPPORT'], ['mesdames', 'NEXUS MESDAMES'], ['olympiques', 'NEXUS OLYMPIQUES']] as [string, string][]).map(([key, label]) => (
                  <div key={key} className="card p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="font-raleway font-semibold text-navy text-sm">{label}</h2>
                      <button onClick={() => setEditModule(editModule === key ? null : key)} className="btn-secondary text-xs flex items-center gap-1.5">
                        <Edit3 size={12} /> {editModule === key ? 'Annuler' : 'Modifier'}
                      </button>
                    </div>
                    {editModule === key ? (
                      <div className="space-y-3">
                        <textarea
                          value={moduleTexts[key as keyof typeof moduleTexts]}
                          onChange={(e) => setModuleTexts(p => ({ ...p, [key]: e.target.value }))}
                          rows={5}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-inter focus:outline-none focus:border-navy resize-none"
                        />
                        <button onClick={() => setEditModule(null)} className="btn-primary text-xs flex items-center gap-1.5">
                          <Save size={12} /> Sauvegarder
                        </button>
                      </div>
                    ) : (
                      <p className="font-inter text-[#212121]/60 text-sm whitespace-pre-line leading-relaxed">{moduleTexts[key as keyof typeof moduleTexts]}</p>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── EMAILS ── */}
          {activeTab === 'emails' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="font-montserrat font-bold text-navy text-2xl mb-2">Emails & Notifications</h1>
              <p className="font-inter text-[#212121]/50 text-sm mb-8">Envoyez un email groupé à vos inscrits ou abonnés newsletter.</p>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Formulaire d'envoi */}
                <div className="card p-6">
                  <h2 className="font-raleway font-semibold text-navy text-sm mb-4 flex items-center gap-2">
                    <Send size={15} /> Envoyer un email
                  </h2>
                  <form onSubmit={sendEmail} className="space-y-4">
                    <div>
                      <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Destinataires</label>
                      <select
                        value={emailForm.destinataires}
                        onChange={(e) => setEmailForm(p => ({ ...p, destinataires: e.target.value }))}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-inter focus:outline-none focus:border-navy bg-transparent"
                      >
                        <option value="tous">Tous les inscrits confirmés</option>
                        <option value="spectateur">Spectateurs uniquement</option>
                        <option value="volontaire">Volontaires uniquement</option>
                        <option value="partenaire">Partenaires uniquement</option>
                        <option value="media">Médias uniquement</option>
                        <option value="newsletter">Abonnés newsletter</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Objet *</label>
                      <input
                        type="text" required
                        value={emailForm.sujet}
                        onChange={(e) => setEmailForm(p => ({ ...p, sujet: e.target.value }))}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-inter focus:outline-none focus:border-navy"
                        placeholder="Objet de l'email"
                      />
                    </div>
                    <div>
                      <label className="font-inter text-xs text-[#212121]/60 mb-1 block">Contenu *</label>
                      <textarea
                        required rows={8}
                        value={emailForm.contenu}
                        onChange={(e) => setEmailForm(p => ({ ...p, contenu: e.target.value }))}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-inter focus:outline-none focus:border-navy resize-none"
                        placeholder="Rédigez votre message ici..."
                      />
                    </div>
                    {emailResult && (
                      <div className={`rounded-lg p-3 text-sm font-inter ${emailResult.startsWith('✅') ? 'bg-brand-green/10 text-brand-green' : 'bg-brand-red/10 text-brand-red'}`}>
                        {emailResult}
                      </div>
                    )}
                    <button type="submit" disabled={emailSending} className="btn-primary w-full flex items-center justify-center gap-2">
                      {emailSending ? <><Loader2 size={15} className="animate-spin" /> Envoi en cours…</> : <><Send size={15} /> Envoyer l&apos;email</>}
                    </button>
                  </form>
                </div>

                {/* Historique */}
                <div className="card overflow-hidden">
                  <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="font-raleway font-semibold text-navy text-sm flex items-center gap-2">
                      <Bell size={15} /> Historique des envois
                    </h2>
                    <button onClick={fetchEmailLogs} className="p-1.5 rounded hover:bg-gray-100 transition-colors">
                      <RefreshCw size={14} className="text-[#212121]/50" />
                    </button>
                  </div>
                  {emailLogs.length === 0 ? (
                    <div className="p-8 text-center font-inter text-[#212121]/40 text-sm">Aucun email envoyé.</div>
                  ) : (
                    <div className="divide-y divide-gray-50 max-h-96 overflow-y-auto">
                      {emailLogs.map(log => (
                        <div key={log.id} className="px-4 py-3">
                          <p className="font-inter font-medium text-navy text-xs truncate">{log.subject}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-inter text-[#212121]/50 text-xs truncate">{log.to}</span>
                            <span className="text-[#212121]/30 text-xs">·</span>
                            <span className="font-inter text-[#212121]/40 text-xs">{new Date(log.sentAt).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── PARAMÈTRES ── */}
          {activeTab === 'settings' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="font-montserrat font-bold text-navy text-2xl mb-8">Paramètres du site</h1>
              <div className="grid md:grid-cols-2 gap-6 max-w-3xl">
                <div className="card p-6">
                  <h2 className="font-raleway font-semibold text-navy text-sm mb-4">Activations globales</h2>
                  <div className="space-y-4">
                    {[
                      { label: 'Inscriptions ouvertes', state: inscriptionsOpen, set: setInscriptionsOpen },
                      { label: 'Vote public actif', state: votePublic, set: setVotePublic },
                      { label: 'Vote final actif', state: voteFinal, set: setVoteFinal },
                      { label: 'Résultats publiés', state: publishResults, set: setPublishResults },
                    ].map(({ label, state, set }) => (
                      <div key={label} className="flex items-center justify-between">
                        <span className="font-inter text-[#212121]/70 text-sm">{label}</span>
                        <button onClick={() => set(!state)} className={`transition-colors ${state ? 'text-brand-green' : 'text-[#212121]/30'}`}>
                          {state ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="card p-6">
                  <h2 className="font-raleway font-semibold text-navy text-sm mb-4">Informations de contact</h2>
                  <div className="space-y-3">
                    {[
                      { label: 'Téléphone', value: '+212 7 15 79 59 62' },
                      { label: 'Lieu', value: 'Théâtre INSMAC, Rabat' },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <label className="font-inter text-xs text-[#212121]/60 mb-1 block">{label}</label>
                        <input defaultValue={value} className="input-field border border-gray-200 rounded-lg px-3 py-2 w-full text-sm" />
                      </div>
                    ))}
                    <button className="btn-primary text-xs flex items-center gap-1.5 mt-2"><Save size={12} /> Sauvegarder</button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </>
  );
}
