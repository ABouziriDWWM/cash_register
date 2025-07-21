# Caisse Enregistreuse - Documentation

## Description

Une caisse enregistreuse complète développée en HTML, CSS et JavaScript pur. Cette application web offre toutes les fonctionnalités nécessaires pour gérer les ventes dans un commerce.

LE SITE WEB: https://cashregisteramine.netlify.app/

### ✅ Fonctionnalités principales

- **Affichage en temps réel** : Sous-total, TVA (20%), remises et total
- **Produits prédéfinis** : 6 produits avec prix configurés
- **Gestion dynamique des produits** : Ajout et suppression de produits personnalisés
- **Saisie manuelle** : Ajout de produits personnalisés
- **Clavier numérique** : Interface tactile pour saisie rapide
- **Gestion des remises** : Pourcentage ou montant fixe
- **Modes de paiement** : Espèces, carte bancaire, chèque
- **Impression de tickets** : Génération de reçus détaillés
- **Historique des ventes** : Stockage local des transactions
- **Interface responsive** : Compatible mobile et tablette

### 🎯 Fonctionnalités avancées

- **Calcul automatique de la TVA** : 20% appliqué automatiquement
- **Gestion du rendu monnaie** : Pour les paiements en espèces
- **Produits personnalisables** : Ajout/suppression dynamique avec sauvegarde automatique
- **Sélection intuitive** : Clic droit ou Ctrl+Clic pour sélectionner les produits à supprimer
- **Raccourcis clavier** : Navigation rapide (Ctrl+N, Ctrl+P, Ctrl+H)
- **Animations fluides** : Interface moderne avec transitions
- **Sauvegarde automatique** : Historique et produits persistants dans le navigateur
- **Validation des données** : Contrôles de saisie robustes

## Structure du projet

```
cash-register/
├── index.html          # Structure HTML principale
├── styles.css          # Styles CSS avec design moderne
├── script.js           # Logique JavaScript complète
└── README.md           # Documentation (ce fichier)
```

## Installation et utilisation

### Installation

1. Téléchargez tous les fichiers dans un dossier
2. Ouvrez `index.html` dans un navigateur web moderne
3. L'application est prête à utiliser !

### Utilisation

#### Gestion des produits

1. **Ajouter un produit** :
   - Saisissez le nom du produit dans le premier champ
   - Saisissez le prix dans le second champ
   - Cliquez sur "➕ Ajouter"
   - Le produit apparaît immédiatement dans la grille

2. **Supprimer un produit** :
   - **Méthode 1** : Clic droit sur le produit à supprimer
   - **Méthode 2** : Ctrl+Clic (ou Cmd+Clic sur Mac) sur le produit
   - Le produit sélectionné devient rouge
   - Cliquez sur "➖ Supprimer"
   - Confirmez la suppression dans la boîte de dialogue

#### Ajout de produits

1. **Produits prédéfinis** : Cliquez sur les boutons de produits
2. **Saisie manuelle** : 
   - Saisissez le nom, prix et quantité
   - Cliquez sur "Ajouter"
3. **Clavier numérique** : 
   - Utilisez les chiffres pour saisir des montants
   - Bouton "Qté" pour basculer entre prix et quantité

#### Gestion des remises

1. Saisissez le montant ou pourcentage dans le champ
2. Cliquez sur "% Remise" pour un pourcentage
3. Cliquez sur "€ Remise" pour un montant fixe
4. "Annuler remise" pour supprimer la remise

#### Paiement

1. **Espèces** : Saisissez le montant reçu, le rendu est calculé automatiquement
2. **Carte/Chèque** : Paiement direct sans rendu
3. Confirmez le paiement pour enregistrer la vente

#### Actions rapides

- **Imprimer** : Génère un ticket de caisse imprimable
- **Nouvelle vente** : Remet à zéro pour une nouvelle transaction
- **Supprimer dernier** : Retire le dernier article ajouté
- **Tout effacer** : Vide complètement le panier

#### Historique

- **Voir historique** : Affiche les 20 dernières ventes
- **Effacer historique** : Supprime toutes les données sauvegardées
- **Résumé du jour** : Nombre de ventes et total du jour

## Raccourcis clavier

- `Ctrl + N` : Nouvelle vente
- `Ctrl + P` : Imprimer le ticket
- `Ctrl + H` : Voir l'historique
- `Échap` : Fermer les modales
- `Entrée` : Ajouter un article (dans les champs de saisie)

## Configuration

### Modification des produits prédéfinis

Éditez le fichier `index.html` dans la section "products-grid" :

```html
<button class="product-btn" data-name="Nom" data-price="Prix">
    Nom<br>Prix€
</button>
```

### Modification du taux de TVA

Éditez le fichier `script.js`, ligne 9 :

```javascript
this.taxRate = 0.20; // 20% TVA (modifiez selon vos besoins)
```

### Personnalisation des informations magasin

Éditez le fichier `index.html` dans la section "store-info" :

```html
<div class="store-info">
    <strong>VOTRE MAGASIN</strong><br>
    Votre adresse<br>
    Code postal Ville<br>
    Tel: Votre numéro
</div>
```

## Compatibilité

- **Navigateurs** : Chrome, Firefox, Safari, Edge (versions récentes)
- **Appareils** : Desktop, tablettes, smartphones
- **Résolution** : Responsive design adaptatif
- **Stockage** : LocalStorage pour la persistance des données

## Sécurité et données

- **Stockage local** : Les données restent sur l'appareil
- **Pas de serveur** : Fonctionne entièrement côté client
- **Confidentialité** : Aucune donnée transmise à l'extérieur
- **Sauvegarde** : Recommandé d'exporter régulièrement l'historique

## Dépannage

### Problèmes courants

1. **L'historique disparaît** : Vérifiez que les cookies/localStorage ne sont pas bloqués
2. **Calculs incorrects** : Actualisez la page et ressaisissez les données
3. **Interface déformée** : Vérifiez la compatibilité du navigateur
4. **Impression ne fonctionne pas** : Autorisez les pop-ups pour ce site

### Support

Pour toute question ou problème :
1. Vérifiez cette documentation
2. Testez dans un autre navigateur
3. Videz le cache du navigateur si nécessaire

## Licence

Ce projet est libre d'utilisation pour un usage commercial ou personnel.

## Crédits

Développé avec HTML5, CSS3 et JavaScript ES6+
Design moderne avec dégradés et animations CSS
Interface utilisateur optimisée pour la vente au détail

---

**Version** : 1.1  
**Dernière mise à jour** : Juillet 2025  
**Compatibilité** : Navigateurs modernes

### Notes de version 1.1
- ✅ Ajout de la gestion dynamique des produits
- ✅ Boutons "Ajouter" et "Supprimer" pour les produits
- ✅ Sélection intuitive avec clic droit ou Ctrl+Clic
- ✅ Sauvegarde automatique des produits personnalisés
- ✅ Interface améliorée avec instructions utilisateur

