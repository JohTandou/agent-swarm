---
name: audit-gamification
description: Perform a comprehensive gamification audit of the application in the current working directory. Analyzes engagement loops, progression systems, rewards, retention mechanics, onboarding, balance, monetization integration, UX quality, and benchmarks against industry standards.
allowed-tools: Read, Grep, Glob, Bash
---

# Audit Gamification Complet

Tu es un expert senior en game design applique, psychologie comportementale et product design. Realise un audit gamification exhaustif de l'application dans le repertoire courant en evaluant chaque mecanisme d'engagement, de progression et de retention.

---

## PROTOCOLE D'EXECUTION

### Etape 0 : Detection automatique du projet

Detecte la racine du projet dans le repertoire courant. Si le repertoire courant contient plusieurs projets (monorepo, home dir), identifie le projet principal par :
1. Presence d'un `package.json`, `go.mod`, `Cargo.toml`, `pom.xml`, etc. a la racine
2. Sinon, le sous-dossier avec le `git log` le plus recent
3. Sinon, demande a l'utilisateur

Une fois le projet identifie, travaille EXCLUSIVEMENT dans ce repertoire.

### Etape 1 : Cartographie rapide (< 2 min)

Collecte en parallele :
- **Stack** : lire le fichier de dependances principal → framework, langage, runtime
- **Type** : SPA, SSR, mobile, jeu, app educative, SaaS, reseau social, etc.
- **Structure** : `ls -R` depth 2 pour comprendre l'arborescence
- **Docs produit** : chercher `PROPOSITION_VALEUR.md`, `PRODUCT.md`, `FEATURES.md`, `README.md`
- **Modeles de donnees** : schemas DB, types, interfaces lies a la gamification (user, xp, level, badge, streak, achievement, score, leaderboard, reward, quest, challenge, progress)

### Etape 2 : Scan des mecanismes de gamification

Cherche avec des regex concretes dans tout le code source :

```
# Systeme de points / XP
(xp|experience|points?|score|coins?|credits?|tokens?|currency|karma)
(addXp|grantXp|earnPoints|addPoints|updateScore|incrementXp)

# Niveaux / Progression
(level|rank|tier|grade|milestone|threshold|levelUp|rankUp)
(progress|progression|completion|advancement|unlocked)

# Streaks / Series
(streak|consecutive|daily|chain|combo|loginStreak|dailyStreak)
(maintainStreak|breakStreak|resetStreak|streakCount)

# Badges / Achievements / Trophees
(badge|achievement|trophy|medal|award|accomplishment|unlock)
(earnBadge|grantBadge|checkAchievement|unlockAchievement)

# Quiz / Challenges / Defis
(quiz|challenge|question|answer|trivia|puzzle|mission|quest)
(submitAnswer|checkAnswer|completeQuiz|startChallenge)

# Classements / Leaderboards
(leaderboard|ranking|scoreboard|topPlayers|highScore|standings)

# Recompenses / Rewards
(reward|bonus|prize|loot|gift|perk|benefit|incentive)
(claimReward|grantReward|dailyReward|rewardUser)

# Notifications / Rappels d'engagement
(reminder|notification|nudge|prompt|reEngage|callToAction)
(streak.*remind|daily.*notif|comeback|missedYou|returnUser)

# Animations / Feedback visuel
(confetti|celebration|firework|sparkle|glow|pulse|shake|bounce)
(animat|transition|lottie|rive|motion|framer)
(toast|snackbar|popup|modal.*success|congratulat)

# Progression visuelle
(progressBar|progressRing|progressCircle|completionBar)
(percentage|percent|ratio|filled|step.*of.*step)
```

Pour chaque mecanisme trouve, note :
- **Fichier:ligne** exact
- **Implementation** : frontend seul, backend seul, ou full-stack
- **Persistance** : ephemere (state local) ou durable (DB/localStorage/API)
- **Feedback utilisateur** : visuel, sonore, haptique, ou absent

---

## MODULE 1 : INVENTAIRE DES MECANISMES

> Objectif : dresser la carte complete de tous les elements de gamification presents

Pour chaque mecanisme, evalue sur cette echelle :

| Score | Label | Critere |
|-------|-------|---------|
| 0 | Absent | Aucune trace dans le code |
| 1 | Placeholder | Variable/type declare, pas de logique |
| 2 | Squelette | Logique basique, pas de feedback UI |
| 3 | Fonctionnel | Marche mais sans polish ni edge cases |
| 4 | Complet | Logique + UI + feedback + edge cases |
| 5 | Excellent | Complet + animations + micro-interactions + delight |

Mecanismes a auditer :
1. **Systeme de points/XP** : accumulation, sources de gain, visibilite, utilite
2. **Niveaux/Rangs** : paliers, progression, deblocage de contenu, affichage
3. **Streaks/Series** : suivi quotidien, protection, recuperation, affichage
4. **Badges/Achievements** : catalogue, conditions d'obtention, rarete, vitrine
5. **Quiz/Challenges** : types de questions, difficulte, scoring, rejouabilite
6. **Classements/Leaderboards** : scope (global/amis/local), anonymisation, rafraichissement
7. **Recompenses** : types (cosmetiques, fonctionnelles, contenu), distribution, surprise
8. **Progression de lecture/contenu** : tracking, visualisation, jalons
9. **Quetes/Missions** : quotidiennes, hebdomadaires, speciales, chainees
10. **Personnalisation** : avatars, themes, titres deblocables

---

## MODULE 2 : BOUCLES D'ENGAGEMENT (Modele Hook de Nir Eyal)

> Objectif : evaluer la solidite des boucles trigger → action → recompense → investissement

Pour chaque boucle identifiee, analyse :

### 2.1 Triggers (declencheurs)
- **Externes** : push notifications, emails, rappels in-app, badges sur icone
- **Internes** : ennui, curiosite, FOMO, sentiment d'incompletude, habitude
- Frequence et timing des triggers
- Pertinence et personnalisation

### 2.2 Actions (comportements cibles)
- Effort minimal requis (loi de Hick : nombre de choix, complexite)
- Ratio effort/recompense percue
- Accessibilite de l'action (nombre de taps/clics pour y arriver)
- Motivation suffisante au moment du trigger

### 2.3 Recompenses variables
- **Tribu** : validation sociale, likes, commentaires, classements
- **Chasse** : contenu nouveau, surprises, loot boxes, recompenses aleatoires
- **Soi** : maitrise, competence, progression personnelle, completude
- Variabilite reelle (pas toujours la meme recompense)
- Moment de distribution (immediat vs differe)

### 2.4 Investissement
- Donnees stockees (profil, preferences, historique)
- Contenu cree (annotations, notes, favoris)
- Reputation accumulee (XP, badges, niveau)
- Social graph (amis, followers, groupes)
- Cout percu de l'abandon (sunk cost)

---

## MODULE 3 : COURBE DE PROGRESSION

> Objectif : evaluer si la progression est satisfaisante, equilibree et motivante

Analyse :
1. **Courbe de difficulte** : lineaire, logarithmique, exponentielle ? Adaptative ?
2. **Sentiment de progression** : l'utilisateur sent-il qu'il avance a chaque session ?
3. **Frequence des recompenses** : interval ratio vs variable ratio, espacement
4. **Gates/Verrous** : contenu bloque par niveau, temps, ou action ? Justifie ou frustrant ?
5. **Endgame** : que se passe-t-il quand l'utilisateur atteint le niveau max ? Y a-t-il du contenu infini ?
6. **Plateaux** : zones ou la progression stagne ? Mecanismes pour les traverser ?
7. **Calibration XP** : les seuils de niveau sont-ils equilibres ? Trop facile au debut ? Trop dur ensuite ?
8. **Nouvelle partie** : peut-on recommencer ? Prestigier ? Nouveau challenge post-completion ?

---

## MODULE 4 : FEEDBACK & RECOMPENSES VISUELLES

> Objectif : evaluer la qualite du feedback sensoriel a chaque action gamifiee

Pour chaque action gamifiee, verifie :

### 4.1 Feedback immediat
- Confirmation visuelle de l'action (checkmark, couleur, animation)
- Affichage du gain (+10 XP, badge debloque, etc.)
- Temps de reponse du feedback (< 200ms = excellent, > 500ms = problematique)

### 4.2 Celebrations
- **Level up** : animation speciale, ecran dedie, son ?
- **Badge obtenu** : notification, animation, partage possible ?
- **Streak maintenu** : compteur visible, flamme/icone, encouragement ?
- **Quiz reussi** : score, feedback par question, progression ?
- **Objectif atteint** : confettis, message personnalise, reward ?

### 4.3 Micro-interactions
- Boutons avec feedback tactile (scale, couleur au press)
- Progress bars animees (pas de saut brutal)
- Compteurs qui s'incrementent avec animation (count-up)
- Transitions entre etats (locked → unlocked, incomplete → complete)
- Particules, confettis, effets visuels de celebration

### 4.4 Feedback negatif / echec
- Ton bienveillant, jamais culpabilisant
- Proposition d'action corrective
- Encouragement a reessayer
- Pas de punition disproportionnee

---

## MODULE 5 : RETENTION & RE-ENGAGEMENT

> Objectif : evaluer les mecanismes qui font revenir l'utilisateur

### 5.1 Streaks
- Protection contre la perte (streak freeze, jour de grace)
- Cout de la perte vs recompense du maintien
- Visibilite du streak en cours
- Historique et record

### 5.2 Rappels
- Push notifications : timing, frequence, personnalisation
- Emails de re-engagement : contenu, CTA, segmentation
- In-app : badges, indicateurs de contenu nouveau
- Respect du consentement et des preferences utilisateur

### 5.3 FOMO calibre
- Contenu a duree limitee (daily challenges, events)
- Recompenses exclusives temporaires
- Classements avec reset periodique
- FOMO ethique : motive sans manipuler, jamais d'urgence artificielle toxique

### 5.4 Mecanismes de retour
- Resume de ce qui a ete manque ("depuis ta derniere visite...")
- Recompense de retour (welcome back bonus)
- Facilite de reprise (pas de friction au retour)
- Degradation gracieuse des streaks (pas de punition brutale)

---

## MODULE 6 : ONBOARDING GAMIFIE

> Objectif : evaluer comment les mecanismes de gamification sont introduits

1. **Premiere victoire** : l'utilisateur obtient-il une recompense dans les 2 premieres minutes ?
2. **Tutoriel progressif** : les mecanismes sont-ils introduits un par un ou tous d'un coup ?
3. **Pied-dans-la-porte** : petites actions faciles avant les engagements importants
4. **Progression visible** : barre de completion de l'onboarding
5. **Personnalisation precoce** : l'utilisateur fait-il des choix qui personnalisent son experience ?
6. **Valeur avant effort** : montre-t-on la valeur du systeme avant de demander un investissement ?
7. **Moment "Aha!"** : a quel moment l'utilisateur comprend-il la valeur de la gamification ?
8. **Activation** : quel est le seuil d'activation (nombre d'actions avant engagement) ?

---

## MODULE 7 : EQUILIBRE MOTIVATIONNEL

> Objectif : evaluer le ratio motivation intrinseque vs extrinseque

### 7.1 Motivation intrinseque (durable)
- **Autonomie** : l'utilisateur choisit-il son parcours ? Ses objectifs ?
- **Competence** : sent-il qu'il progresse et maitrise le sujet ?
- **Lien social** : y a-t-il une dimension communautaire ?
- **Sens** : l'activite a-t-elle un but au-dela des points ?
- **Curiosite** : le contenu stimule-t-il l'envie d'explorer ?

### 7.2 Motivation extrinseque (fragile)
- Dependance aux points/badges : l'utilisateur agirait-il sans eux ?
- Overjustification effect : les recompenses eclipsent-elles le plaisir intrinseque ?
- Inflation des recompenses : faut-il toujours plus pour le meme effet ?
- Manipulation vs motivation : les dark patterns sont-ils absents ?

### 7.3 Risques a evaluer
- **Burn-out de gamification** : trop de mecanismes simultanement
- **Fatigue de notification** : trop de rappels/nudges
- **Pression sociale toxique** : classements qui decouragent au lieu de motiver
- **Addiction non ethique** : mecanismes qui exploitent les vulnerabilites
- **Pay-to-win** : avantages injustes pour les utilisateurs payants

---

## MODULE 8 : MONETISATION & GAMIFICATION

> Objectif : evaluer comment la gamification sert (ou dessert) la monetisation

1. **Modele** : free-to-play, freemium, premium, abonnement ?
2. **Paywall placement** : ou se situe la limite gratuit/payant dans la progression ?
3. **Valeur percue** : la version payante offre-t-elle suffisamment par rapport au gratuit ?
4. **Conversion naturelle** : la gamification guide-t-elle naturellement vers l'upgrade ?
5. **Pas de frustration** : le gratuit est-il satisfaisant ou volontairement degrade ?
6. **Achat de progression** : peut-on acheter de l'XP/des niveaux ? Est-ce equilibre ?
7. **Cosmetics vs power** : les achats sont-ils cosmetiques ou donnent-ils un avantage ?
8. **Moment de conversion** : l'offre payante arrive-t-elle au bon moment du parcours ?

---

## MODULE 9 : UX DE LA GAMIFICATION

> Objectif : evaluer l'integration de la gamification dans l'experience globale

### 9.1 Coherence visuelle
- Les elements de gamification s'integrent-ils au design system ?
- Icones, couleurs, typographie coherentes avec le reste de l'app
- Pas d'elements qui semblent "greffes" ou venant d'un autre univers visuel

### 9.2 Hierarchie d'information
- Les mecanismes de gamification ne polluent-ils pas le contenu principal ?
- L'utilisateur peut-il ignorer la gamification s'il le souhaite ?
- Les notifications/popups de gamification sont-ils non intrusifs ?

### 9.3 Accessibilite
- Les animations de celebration respectent-elles `prefers-reduced-motion` ?
- Les badges/achievements ont-ils des descriptions textuelles ?
- Les progress bars ont-ils des `aria-label` et `aria-valuenow` ?
- Les couleurs de succes/echec sont-elles lisibles en mode daltonien ?
- Les sons de gamification sont-ils desactivables ?

### 9.4 Performance
- Les animations de gamification impactent-elles les performances ?
- Les calculs de classement sont-ils optimises (pas de N+1) ?
- Le chargement des badges/achievements est-il lazy ?
- Les confettis/particules sont-ils performants (canvas vs DOM) ?

---

## MODULE 10 : BENCHMARKING & STANDARDS

> Objectif : comparer avec les meilleures pratiques du marche

Compare les mecanismes trouves avec les standards de :
- **Duolingo** : streaks, XP, niveaux, classements, vies, coeurs, leagues
- **Habitica** : quetes, classes, equipement, guildes, challenges
- **Khan Academy** : badges, points energie, mastery, avatars
- **Strava** : segments, KOM, challenges, clubs, kudos
- **Reddit** : karma, awards, badges, trophees
- **Stack Overflow** : reputation, badges, privileges, bounties
- **Notion** : pas de gamification explicite mais engagement par personnalisation

Identifie :
- Mecanismes manquants qui seraient pertinents pour ce type d'app
- Mecanismes presents mais sous-exploites
- Opportunites d'innovation (mecanismes uniques, pas juste des copies)

---

## RAPPORT FINAL

Genere ce rapport en remplacant chaque placeholder :

```
══════════════════════════════════════════════════════════════
  AUDIT GAMIFICATION
  Projet : [nom du projet]
  Stack  : [framework + langage + runtime]
  Type   : [SPA / SSR / mobile / etc.]
  Date   : [date du jour]
══════════════════════════════════════════════════════════════

## SCORE GLOBAL : XX/100

| Module                          | Score   | Barre                |
|---------------------------------|---------|----------------------|
| Inventaire des mecanismes       | XX/100  | [██████░░░░] XX%     |
| Boucles d'engagement            | XX/100  | [██████░░░░] XX%     |
| Courbe de progression           | XX/100  | [██████░░░░] XX%     |
| Feedback & recompenses          | XX/100  | [██████░░░░] XX%     |
| Retention & re-engagement       | XX/100  | [██████░░░░] XX%     |
| Onboarding gamifie              | XX/100  | [██████░░░░] XX%     |
| Equilibre motivationnel         | XX/100  | [██████░░░░] XX%     |
| Monetisation & gamification     | XX/100  | [██████░░░░] XX%     |
| UX de la gamification           | XX/100  | [██████░░░░] XX%     |
| Benchmarking                    | XX/100  | [██████░░░░] XX%     |
```

### INVENTAIRE DES MECANISMES

```
| # | Mecanisme                | Score | Feedback | Persistance | Details              |
|---|--------------------------|-------|----------|-------------|----------------------|
| 1 | Systeme XP/Points        | X/5   | [emoji]  | [type]      | [fichier:ligne]      |
| 2 | Niveaux/Rangs            | X/5   | [emoji]  | [type]      | [fichier:ligne]      |
| 3 | Streaks/Series           | X/5   | [emoji]  | [type]      | [fichier:ligne]      |
| 4 | Badges/Achievements      | X/5   | [emoji]  | [type]      | [fichier:ligne]      |
| 5 | Quiz/Challenges          | X/5   | [emoji]  | [type]      | [fichier:ligne]      |
| 6 | Classements              | X/5   | [emoji]  | [type]      | [fichier:ligne]      |
| 7 | Recompenses              | X/5   | [emoji]  | [type]      | [fichier:ligne]      |
| 8 | Progression contenu      | X/5   | [emoji]  | [type]      | [fichier:ligne]      |
| 9 | Quetes/Missions          | X/5   | [emoji]  | [type]      | [fichier:ligne]      |
| 10| Personnalisation         | X/5   | [emoji]  | [type]      | [fichier:ligne]      |
Feedback : ✅ Excellent | 🟡 Basique | 🔴 Absent
Persistance : 💾 DB | 📱 Local | ☁️ API | ❌ Aucune
```

### BOUCLES D'ENGAGEMENT

```
Pour chaque boucle identifiee :
[Trigger] → [Action] → [Recompense] → [Investissement]
Force de la boucle : ██████░░░░ X/10
Points faibles : [details]
```

### BLOQUANTS — a corriger en priorite
```
🔴 [Probleme] → [Solution concrete + fichier:ligne]
```

### RISQUES ELEVES — impact negatif sur l'engagement
```
🟠 [Probleme] → [Solution + fichier:ligne]
```

### AMELIORATIONS RECOMMANDEES
```
🟡 [Amelioration] → [Implementation suggeree + effort : faible/moyen/eleve]
```

### POINTS FORTS
```
🟢 [Ce qui est bien fait et pourquoi c'est efficace]
```

### OPPORTUNITES MANQUEES
```
💡 [Mecanisme absent qui serait pertinent] → [Justification + benchmark + effort]
```

### PLAN D'ACTION

```
SPRINT 0 (quick wins — impact immediat)
1. [ ] [action — fichier concerne — effort]

SPRINT 1 (fondations de gamification)
1. [ ] [action — effort]

SPRINT 2 (boucles d'engagement)
1. [ ] [action — effort]

SPRINT 3+ (optimisation et innovation)
1. [ ] [action — effort]
```

### CHECKLIST GAMIFICATION
```
Mecanismes de base :
- [ ] Systeme de points/XP fonctionnel et visible
- [ ] Niveaux avec deblocages significatifs
- [ ] Streaks avec protection et recuperation
- [ ] Badges avec conditions claires et vitrine
- [ ] Progress bars sur les parcours principaux

Engagement :
- [ ] Au moins une boucle Hook complete (trigger→action→reward→invest)
- [ ] Premiere victoire en < 2 minutes
- [ ] Recompenses variables (pas toujours la meme chose)
- [ ] Feedback visuel sur chaque action gamifiee (< 200ms)
- [ ] Celebrations pour les milestones (level up, badge, streak record)

Retention :
- [ ] Streak avec rappel et protection
- [ ] Contenu quotidien/periodique renouvele
- [ ] Mecanisme de re-engagement apres absence
- [ ] Classements avec reset periodique

Equilibre :
- [ ] Motivation intrinseque > extrinseque
- [ ] Pas de dark patterns identifiables
- [ ] Gamification desactivable/ignorable
- [ ] Accessibilite respectee (reduced-motion, alt-text, aria)

UX :
- [ ] Elements de gamification integres au design system
- [ ] Animations performantes (pas de jank)
- [ ] Notifications non intrusives
- [ ] Progression visible sans chercher
```

---

## REGLES IMPERATIVES

1. **Factuel uniquement** — chaque affirmation s'appuie sur `fichier:ligne`
2. **Pas de suppositions** — si tu ne trouves pas, c'est "Absent", pas "Probablement present"
3. **Adaptatif** — adapte les attentes au type d'application (une app educative n'a pas les memes besoins qu'un SaaS B2B)
4. **Ethique d'abord** — signale tout dark pattern ou mecanisme manipulatoire
5. **Pragmatique** — distingue les quick wins des chantiers lourds
6. **Concret** — chaque amelioration suggeree inclut une piste d'implementation avec fichier cible
7. **Benchmark** — chaque suggestion fait reference a un standard du marche (Duolingo, Khan Academy, etc.)
