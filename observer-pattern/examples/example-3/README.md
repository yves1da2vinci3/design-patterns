# Système de Surveillance du Marché Boursier avec le Pattern Observer

## Problème

Dans un système de marché boursier, de nombreux acteurs (investisseurs, analystes, courtiers) doivent être informés en temps réel des changements de prix des actions, des nouvelles entrées en bourse, et d'autres événements du marché. Sans une architecture adaptée, cette notification en temps réel peut conduire à:

1. **Couplage fort** - Le marché doit connaître tous les détails de ses observateurs
2. **Notification incohérente** - Certains participants peuvent manquer des mises à jour importantes
3. **Complexité de gestion** - Difficulté à ajouter ou retirer des participants du système
4. **Traitement inefficace** - Participants recevant des notifications pour des événements qui ne les intéressent pas

## Solution : Le Pattern Observer avec Événements Typés

Cette implémentation utilise le Pattern Observer avec un système d'événements typés, où:

1. Les observateurs peuvent s'abonner uniquement aux types d'événements qui les intéressent
2. Le marché publie des événements sans connaître les détails des observateurs
3. Chaque type d'événement transporte des données spécifiques pertinentes

## Implémentation de base (sans Observer)

Dans l'implémentation basique (`basicCode.js`), le marché maintient directement une liste d'investisseurs et les notifie explicitement:

```javascript
updateStockPrice(symbol, newPrice) {
  // Logique de mise à jour du prix...

  // Notification manuelle à chaque investisseur
  for (const investor of this.investors) {
    investor.notifyPriceChange(symbol, oldPrice, newPrice);
  }
}
```

### Problèmes avec cette approche

1. **Couplage fort** - Le marché doit explicitement gérer la liste des investisseurs
2. **Spécialisation excessive** - Les méthodes de notification sont spécifiques (notifyPriceChange, notifyNewStock)
3. **Manque de flexibilité** - Difficile d'ajouter de nouveaux types d'observateurs
4. **Problèmes d'accès** - Les investisseurs n'ont pas accès au marché dans les callbacks

## Implémentation avec le Pattern Observer

L'implémentation refactorisée (`refactorCode.js`) utilise un système plus sophistiqué:

### Composants clés

1. **Observable** - Classe de base qui gère les abonnements et notifications par type d'événement
2. **Observer** - Interface pour les objets qui souhaitent être notifiés
3. **Types d'événements** - Énumération des événements possibles (PRICE_CHANGED, STOCK_ADDED, etc.)
4. **Investisseur et Analyste** - Observateurs qui réagissent différemment aux mêmes événements

### Pattern Observer amélioré

Cette implémentation va au-delà du pattern Observer classique en ajoutant:

1. **Événements typés** - Permet aux observateurs de s'abonner sélectivement
2. **Données contextuelles** - Chaque notification contient des informations détaillées
3. **Gestion d'abonnement dynamique** - Les objets peuvent s'abonner/se désabonner en cours d'exécution
4. **Relations bidirectionnelles** - Les observateurs ont une référence vers l'observable

### Exemple d'abonnement et notification

```javascript
// Abonnement
market.subscribe(MarketEvents.PRICE_CHANGED, investor);

// Notification
notify(eventType, data) {
  if (!this.observers.has(eventType)) {
    return;
  }

  const observers = this.observers.get(eventType);
  for (const observer of observers) {
    observer.update(eventType, data);
  }
}

// Traitement par l'observateur
update(eventType, data) {
  switch (eventType) {
    case MarketEvents.PRICE_CHANGED:
      this.handlePriceChange(data);
      break;
    // Autres types d'événements...
  }
}
```

## Points forts de cette implémentation

1. **Découplage** - Le marché émet des événements sans se soucier de qui écoute
2. **Filtrage par événement** - Les observateurs ne reçoivent que les événements pertinents
3. **Extensibilité** - Facile d'ajouter de nouveaux types d'événements et d'observateurs
4. **Cohérence** - Tous les observateurs intéressés par un événement sont notifiés
5. **Référence bidirectionnelle** - Les observateurs ont accès au marché pour interagir

## Applications dans le monde réel

Ce pattern est fondamental pour les systèmes financiers:

- Plateformes de trading en temps réel
- Applications de suivi de marché (Bloomberg Terminal, etc.)
- Systèmes d'alerte sur les prix
- Logiciels d'analyse technique
- Algorithmes de trading automatisé
