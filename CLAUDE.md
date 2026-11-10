# CLAUDE.md — Portfolio fabienemery.ch

Portfolio personnel de Fabien Emery (Business Analyst SAP & Data), servi par GitHub Pages
depuis la branche `main`, racine du dépôt. Domaine : fabienemery.ch (fichier `CNAME`).

## Règles
- Site **100 % statique** : HTML/CSS/JS vanilla, aucun build, aucun framework, aucun PHP.
  Ne pas introduire de dépendance npm ni d'étape de build sans le demander.
- Le site existe en **3 langues** : `index.html` (FR), `en/index.html`, `de/index.html`.
  Toute modification de contenu ou de structure doit être répercutée dans les **trois** pages.
- Chemins : la page FR utilise `assets/...` et `docs/...` ; EN/DE utilisent `../assets/...`.
  Les liens de langue sont absolus (`/`, `/en/`, `/de/`).
- Noms de fichiers PDF avec espaces : encoder les espaces en `%20` dans les `href`.
- Formulaire de contact : Web3Forms (`https://api.web3forms.com/submit`), clé dans
  `<input name="access_key">` (publique par conception). Honeypot : `botcheck`.
  Logique et messages traduits dans `assets/js/main.js`.
- Ne jamais committer de secret, mot de passe ou fichier `.env` : le dépôt est public.
- Langue de travail avec Fabien : français.

## Vérifier avant de committer
- `python3 -m http.server 8000` puis contrôler les 3 pages, le menu mobile (< 720 px)
  et que tous les liens `docs/` pointent vers des fichiers existants.
