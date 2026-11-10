# Portfolio Fabien Emery — fabienemery.ch

Site 100 % statique (HTML / CSS / JS), hébergé gratuitement sur **GitHub Pages**.
Plus de PHP ni de serveur à maintenir.

```
.
├── index.html            ← page FR (langue par défaut)
├── en/index.html         ← page EN
├── de/index.html         ← page DE
├── 404.html              ← page d'erreur
├── assets/
│   ├── css/style.css
│   ├── js/main.js        ← menu, langue, formulaire de contact (Web3Forms)
│   └── img/              ← photo.jpg, favicons
├── docs/
│   ├── CV_FE.pdf         ← le CV téléchargeable
│   └── certifications/   ← PDF des certificats
├── CNAME                 ← domaine personnalisé (fabienemery.ch)
├── .nojekyll             ← dit à GitHub de servir les fichiers tels quels
├── robots.txt / sitemap.xml
└── CLAUDE.md             ← consignes pour Claude Code
```

---

## Mise en ligne — à faire une seule fois

### 1. Créer le dépôt GitHub
1. Sur github.com (compte **Thearwen**) → **New repository**
2. Nom : `portfolio` · Visibilité : **Public** · ne rien cocher d'autre (pas de README)
3. Pousser ce dossier dedans (ou laisser Claude le faire)

### 2. Activer GitHub Pages
Dans le dépôt → **Settings → Pages** :
- *Source* : **Deploy from a branch**
- *Branch* : `main` · dossier `/ (root)` → **Save**
- *Custom domain* : `fabienemery.ch` (déjà rempli grâce au fichier `CNAME`)

Après ~1 minute, le site est visible sur `https://thearwen.github.io/portfolio/`
(les liens de langue et la 404 ne marcheront parfaitement qu'une fois le domaine branché).

### 3. Brancher le domaine chez Infomaniak (zone DNS)
Manager Infomaniak → **Domaines → fabienemery.ch → Zone DNS**.

Supprimer les anciens enregistrements **A / AAAA** de `fabienemery.ch` et `www`
(ceux qui pointent vers l'hébergement Infomaniak), puis ajouter :

| Type  | Nom (source) | Valeur (cible)          |
|-------|--------------|-------------------------|
| A     | @ (vide)     | 185.199.108.153         |
| A     | @ (vide)     | 185.199.109.153         |
| A     | @ (vide)     | 185.199.110.153         |
| A     | @ (vide)     | 185.199.111.153         |
| AAAA  | @ (vide)     | 2606:50c0:8000::153     |
| AAAA  | @ (vide)     | 2606:50c0:8001::153     |
| AAAA  | @ (vide)     | 2606:50c0:8002::153     |
| AAAA  | @ (vide)     | 2606:50c0:8003::153     |
| CNAME | www          | thearwen.github.io.     |

> ⚠️ **Ne touche pas aux enregistrements `MX`, `SPF`/`TXT`, `autodiscover`…** :
> ce sont eux qui font fonctionner l'adresse `fabien.emery@fabienemery.ch`.

Ensuite, dans **Settings → Pages**, attendre que la vérification DNS passe au vert
(quelques minutes à quelques heures) puis cocher **Enforce HTTPS**.

Conseillé : **Settings (du compte) → Pages → Add a verified domain** pour
`fabienemery.ch` (ajoute un enregistrement TXT) → personne d'autre ne peut
utiliser ton domaine sur GitHub.

### 4. Activer le formulaire de contact (Web3Forms, gratuit)
1. Aller sur https://web3forms.com → entrer `fabien.emery@fabienemery.ch` → **Create Access Key**
2. Copier la clé reçue par email
3. Remplacer `REMPLACER_PAR_TA_CLE_WEB3FORMS` par la clé dans les **3** fichiers :
   `index.html`, `en/index.html`, `de/index.html`

La clé n'est pas un secret : elle peut être publique dans le code.
Tant qu'elle n'est pas mise, le bouton « Envoyer » ouvre simplement le logiciel
mail du visiteur avec le message pré-rempli — rien n'est cassé.

### 5. Résilier l'hébergement Infomaniak
Une fois le site en ligne sur GitHub **et** le formulaire testé :
résilier **uniquement l'hébergement web**. Garder :
- le **nom de domaine** `fabienemery.ch` (sinon le site disparaît),
- le **service mail** si tu utilises `fabien.emery@fabienemery.ch`.

---

## Modifier le site ensuite

Chaque `git push` sur `main` met le site à jour automatiquement (≈ 1 min).

| Je veux changer…              | Fichier(s)                                   |
|-------------------------------|----------------------------------------------|
| Un texte                      | `index.html` **et** `en/` **et** `de/`       |
| La couleur d'accent           | `assets/css/style.css` → `--accent`          |
| Le CV                         | remplacer `docs/CV_FE.pdf` (même nom)        |
| Ajouter un certificat         | PDF dans `docs/certifications/` + une carte `cert-card` dans les 3 pages |
| La photo                      | `assets/img/photo.jpg` (JPEG, < 300 Ko)      |

Tester en local : `python3 -m http.server 8000` dans ce dossier, puis ouvrir http://localhost:8000

## Ce qui a changé par rapport à la version Infomaniak
- `api/contact.php` → remplacé par Web3Forms (GitHub Pages n'exécute pas de PHP)
- `api/log_cv.php` (compteur de téléchargements du CV) → retiré ; pour des stats,
  ajouter plus tard un outil gratuit comme GoatCounter ou Cloudflare Web Analytics
- `.htaccess` → inutile (GitHub gère HTTPS, cache et compression)
- Emails « [email protected] » (restes de la protection Cloudflare) → vrais liens `mailto:`
- Lien cassé du certificat *Python for Data Analysis (Pandas & NumPy)* → corrigé
- Photo : PNG de 516 Ko renommé en .jpg → vrai JPEG de 32 Ko (chargement plus rapide)
- Messages du formulaire traduits en EN/DE (ils étaient en français partout)
- Ajout : page 404, `robots.txt`, `sitemap.xml`, balises `canonical` et `og:image`
