# Guide de déploiement — NEXUS JEUNESSES

## 1. Prérequis

- Node.js 18+
- Compte Vercel (gratuit)
- Base de données PostgreSQL (Supabase recommandé — plan gratuit)
- Compte Resend (email — 3000/mois gratuits)

---

## 2. Base de données (Supabase)

1. Créer un projet sur [supabase.com](https://supabase.com)
2. Copier l'URL de connexion : `Settings > Database > Connection string`
3. L'ajouter dans `.env.local` :
   ```
   DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres"
   ```

4. Initialiser la base :
   ```bash
   npm run db:generate
   npm run db:push
   ```

---

## 3. Email (Resend)

1. Créer un compte sur [resend.com](https://resend.com)
2. Ajouter votre domaine (ou utiliser `onboarding@resend.dev` en test)
3. Créer une API key et l'ajouter dans `.env.local` :
   ```
   RESEND_API_KEY="re_XXXXXXXX"
   FROM_EMAIL="NEXUS JEUNESSES <noreply@nexusjeunesses.org>"
   ADMIN_EMAIL="admin@nexusjeunesses.org"
   ```

---

## 4. Déploiement Vercel

```bash
# 1. Installer Vercel CLI
npm i -g vercel

# 2. Se connecter
vercel login

# 3. Déployer
vercel

# 4. Variables d'environnement
# Dans le dashboard Vercel > Settings > Environment Variables,
# ajouter toutes les variables de .env.local
```

**Ou via GitHub :**
1. Pusher le code sur GitHub
2. Importer le repo dans Vercel
3. Ajouter les env vars dans le dashboard Vercel
4. Chaque push sur `main` = déploiement automatique

---

## 5. Variables d'environnement Vercel

| Variable | Valeur |
|---|---|
| `DATABASE_URL` | URL Supabase/Neon |
| `RESEND_API_KEY` | Clé API Resend |
| `FROM_EMAIL` | Email expéditeur |
| `ADMIN_EMAIL` | Email administrateur |
| `ADMIN_API_KEY` | Clé secrète admin (inventez un UUID) |
| `NEXT_PUBLIC_APP_URL` | `https://votre-domaine.vercel.app` |
| `NEXT_PUBLIC_GA_ID` | ID Google Analytics 4 (optionnel) |

---

## 6. Accès Admin

URL : `https://votre-site.vercel.app/admin`  
Mot de passe démo : `nexus2026`  
*(Changez `NEXT_PUBLIC_ADMIN_DEMO` en production)*

---

## 7. Commandes utiles

```bash
npm run dev          # Développement local (http://localhost:3000)
npm run build        # Build de production
npm run db:studio    # Interface Prisma Studio (gestion BDD)
npm run db:push      # Sync schema → BDD
```

---

## 8. Structure des pages

| URL | Page |
|---|---|
| `/` | Accueil |
| `/spectacle` | NEXUS SPECTACLE + inscription |
| `/media` | NEXUS MÉDIA |
| `/olympiques` | NEXUS OLYMPIQUES |
| `/rapport` | NEXUS RAPPORT |
| `/diner` | NEXUS DÎNER |
| `/admin` | Dashboard admin |
| `/merci` | Page confirmation post-inscription |
| `/contact` | Contact |

---

## 9. SMS/WhatsApp (optionnel — Twilio)

Ajouter dans `.env.local` :
```
TWILIO_ACCOUNT_SID="ACxxxxxxxxxx"
TWILIO_AUTH_TOKEN="xxxxxxxxxx"
TWILIO_PHONE_NUMBER="+1234567890"
```

Puis implémenter dans `lib/sms.ts` en utilisant le SDK `twilio`.
