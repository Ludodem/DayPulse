# DayPulse

**"Prends le pouls de ta journée"**

Application web simple et responsive permettant de noter chaque journée sur plusieurs métriques personnalisables, avec une visualisation calendrier heatmap et des vues agrégées.

## Stack technique

- **Framework** : React 18+ avec Vite
- **Langage** : TypeScript
- **Styling** : Tailwind CSS v4
- **Visualisation** : Recharts (graphiques) + calendrier heatmap custom
- **Stockage** : localStorage (pas de backend) avec export/import JSON
- **Hébergement** : GitHub Pages (via `gh-pages` ou GitHub Actions)
- **Routing** : React Router (hash router pour compatibilité GitHub Pages)

## Fonctionnalités

### 1. Métriques configurables
- L'utilisateur peut créer, renommer et supprimer des métriques (ex: "Energy", "Happiness", "Focus")
- Chaque métrique a un nom et optionnellement un emoji/icône
- Les métriques sont persistées dans localStorage

### 2. Saisie de scores
- Score de 0 à 10 pour chaque métrique, pour chaque jour
- **Saisie rapide** : la page d'accueil affiche directement la saisie pour le jour en cours
- Possibilité de naviguer vers n'importe quel jour (passé ou futur) pour saisir/modifier un score
- Interface de saisie intuitive : slider ou boutons cliquables (0-10)
- Feedback visuel immédiat avec la couleur du score (gradient rouge -> vert)

### 3. Visualisation calendrier (heatmap)
- Vue calendrier mensuelle style "GitHub contributions"
- Chaque jour affiche un carré/cercle coloré selon le score moyen (toutes métriques confondues) ou par métrique individuelle
- **Gradient de couleurs** :
  - 0 = rouge foncé (#dc2626)
  - 5 = jaune (#eab308)
  - 10 = vert foncé (#16a34a)
  - Pas de score = gris clair
- Clic sur un jour pour voir le détail et modifier les scores

### 4. Vues agrégées
- **Vue semaine** : moyenne des scores par semaine, affichée sous forme de barres ou ligne
- **Vue mois** : moyenne mensuelle avec comparaison entre mois
- **Vue année** : vue complète type heatmap annuel (365 jours)
- Filtrage par métrique individuelle ou score global (moyenne de toutes les métriques)

### 5. Données
- Persistance dans localStorage
- **Export JSON** : télécharger toutes ses données
- **Import JSON** : restaurer ses données depuis un fichier
- Structure de données claire et documentée

### 6. Responsive design
- **Mobile first** : interface optimisée pour le téléphone (saisie quotidienne rapide)
- **Tablette/PC** : mise en page étendue avec plus de données visibles
- Le calendrier heatmap s'adapte à la taille d'écran

## Structure du projet

```
DayPulse/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Layout.tsx              # Shell de l'app (navbar, navigation)
│   │   ├── DayInput.tsx            # Saisie des scores pour un jour
│   │   ├── ScoreSlider.tsx         # Composant slider/boutons 0-10
│   │   ├── CalendarHeatmap.tsx     # Vue calendrier heatmap mensuel
│   │   ├── YearHeatmap.tsx         # Vue heatmap annuel (365 jours)
│   │   ├── WeeklyChart.tsx         # Graphique vue semaine
│   │   ├── MonthlyChart.tsx        # Graphique vue mois
│   │   ├── MetricManager.tsx       # CRUD des métriques
│   │   └── DataExportImport.tsx    # Boutons export/import JSON
│   ├── pages/
│   │   ├── Home.tsx                # Page d'accueil = saisie du jour
│   │   ├── Calendar.tsx            # Page visualisation calendrier
│   │   ├── Stats.tsx               # Page stats agrégées (semaine/mois/année)
│   │   └── Settings.tsx            # Page paramètres (métriques, données)
│   ├── hooks/
│   │   ├── useScores.ts            # Hook CRUD scores (localStorage)
│   │   └── useMetrics.ts           # Hook CRUD métriques (localStorage)
│   ├── utils/
│   │   ├── colors.ts               # Fonctions gradient couleur score -> RGB
│   │   ├── dates.ts                # Helpers dates (semaines, mois, etc.)
│   │   └── storage.ts              # Abstraction localStorage + export/import
│   ├── types.ts                    # Types TypeScript partagés
│   ├── App.tsx                     # Router principal
│   ├── main.tsx                    # Point d'entrée
│   └── index.css                   # Styles globaux + Tailwind
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
└── README.md
```

## Modèle de données

```typescript
// Une métrique configurable
interface Metric {
  id: string;          // UUID
  name: string;        // "Energy", "Happiness"...
  emoji?: string;      // "⚡", "😊"...
  order: number;       // Ordre d'affichage
  createdAt: string;   // ISO date
}

// Un score pour un jour + une métrique
interface DayScore {
  date: string;        // "2026-04-08" (format ISO)
  metricId: string;    // Référence vers Metric.id
  value: number;       // 0-10
  updatedAt: string;   // ISO datetime
}

// Structure localStorage
interface StorageData {
  version: number;
  metrics: Metric[];
  scores: DayScore[];
}
```

## Plan d'implémentation

### Phase 1 : Fondations
1. Initialiser le projet Vite + React + TypeScript + Tailwind
2. Mettre en place le routing (React Router, hash mode)
3. Créer le Layout (navbar responsive avec navigation entre pages)
4. Implémenter `storage.ts` et les types de données
5. Implémenter `useMetrics` et `useScores` hooks

### Phase 2 : Saisie des scores
6. Page Settings : MetricManager (créer/modifier/supprimer des métriques)
7. Composant ScoreSlider (input visuel 0-10 avec couleur)
8. Page Home : DayInput pour le jour en cours
9. Navigation par date (jour précédent/suivant, date picker)

### Phase 3 : Visualisation
10. Fonction utilitaire gradient couleur (colors.ts)
11. CalendarHeatmap : vue mensuelle avec navigation mois
12. YearHeatmap : vue 365 jours
13. Page Calendar intégrant les deux vues

### Phase 4 : Statistiques agrégées
14. WeeklyChart : moyennes hebdomadaires (Recharts)
15. MonthlyChart : moyennes mensuelles
16. Page Stats avec switch semaine/mois/année et filtre par métrique

### Phase 5 : Finitions
17. Export/Import JSON (DataExportImport)
18. Métriques par défaut au premier lancement (Energy, Happiness, Focus)
19. PWA manifest + favicon
20. Déploiement GitHub Pages (GitHub Actions)
21. README avec screenshots et description

## Backlog (futures évolutions)

- **Import de données externes & corrélation** : pouvoir importer des données journalières contextuelles (météo, heures de sommeil, activité physique, etc.) et les croiser avec les scores pour détecter des corrélations. Exemple : visualiser que les jours de beau temps corrèlent avec un score "Happiness" plus élevé. Nécessite un système d'import flexible (API météo, CSV, saisie manuelle) et une page d'analyse avec graphiques de corrélation.

- **Tendance par métrique** : afficher une flèche montante/descendante/stable à côté de chaque métrique sur la page Home, comparant la moyenne de la semaine en cours vs la semaine précédente. Donne un feedback immédiat sur l'évolution sans aller dans les Stats.

## Conventions de code

- Composants fonctionnels React avec hooks
- Nommage PascalCase pour les composants, camelCase pour les fonctions/variables
- Un composant par fichier
- Tailwind pour tout le styling (pas de CSS custom sauf nécessité)
- Pas de state management externe (useState/useContext suffisent)
- Dates en format ISO string "YYYY-MM-DD" partout
