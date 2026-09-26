# Fetify

Mise en relation avec des prestataires pour les événements de vie (mariage, baptême, anniversaire, soirée entre proches).

Stack : **Next.js 16** (App Router, TypeScript) + **Supabase** (PostgreSQL, Auth, Storage).

## Fonctionnalités

| Page | Rôle |
| --- | --- |
| `/` | Landing page + liste d'attente (organisateurs et prestataires) |
| `/prestataires` | Annuaire filtrable (métier, département, événement) |
| `/prestataires/[slug]` | Fiche prestataire + demande de devis directe |
| `/demande` | Demande de devis, distribuée automatiquement aux prestataires correspondants |
| `/inscription`, `/connexion` | Comptes prestataires (email + mot de passe) |
| `/espace-pro` | Fiche, photos et demandes reçues du prestataire connecté |

Une fiche créée par un prestataire n'est visible dans l'annuaire qu'après validation :
passer `published` à `true` (et éventuellement `featured`) depuis le tableau de bord Supabase
(Table Editor → `providers`).

## Mise en route

1. Créer un projet sur [supabase.com](https://supabase.com).
2. Dans **SQL Editor**, exécuter `supabase/migrations/20260926000000_init.sql`, puis `supabase/seed.sql` (premières fiches de l'annuaire).
3. Dans **Authentication → URL Configuration**, renseigner l'URL du site (`http://localhost:3000` en local) et ajouter `<URL du site>/auth/confirm` aux Redirect URLs.
4. Copier `.env.example` en `.env.local` et y mettre l'URL et la clé `anon` du projet (**Project Settings → API**).
5. Lancer :

```bash
npm install
npm run dev
```

Sans variables Supabase, le site s'affiche mais les formulaires indiquent que le service est indisponible.

## Organisation du code

- `app/` — pages et server actions (`actions.ts`, `auth/actions.ts`, `espace-pro/actions.ts`)
- `components/` — formulaires et éléments d'interface
- `lib/` — constantes (métiers, départements…), accès aux données, clients Supabase
- `proxy.ts` — rafraîchit la session et protège `/espace-pro`
- `supabase/` — schéma SQL (tables, règles d'accès RLS, fonction de mise en relation) et données initiales
- `prototype/index.html` — la landing page statique d'origine

## Données et sécurité

Toutes les tables ont la Row Level Security activée :

- la liste d'attente est en écriture seule pour le public ;
- un prestataire ne peut modifier que sa fiche, et ne peut pas se publier ni se mettre en avant lui-même ;
- les demandes de devis passent par la fonction `submit_quote_request`, qui les distribue aux prestataires publiés du même département (et du bon métier et type d'événement) ; seuls ces destinataires peuvent les lire ;
- les photos sont stockées dans le bucket `provider-photos`, chaque prestataire n'écrivant que dans son propre dossier.

## Déploiement

Le plus simple est [Vercel](https://vercel.com) : importer le dépôt GitHub, renseigner les trois variables de `.env.example` (avec l'URL de production pour `NEXT_PUBLIC_SITE_URL`), puis ajouter l'URL de production dans la configuration Auth de Supabase.
