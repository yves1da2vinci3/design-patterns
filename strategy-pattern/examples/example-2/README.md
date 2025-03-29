# Strategy Pattern - Exemple de système de paiement

## Le problème

Dans une boutique en ligne, nous devons gérer différentes méthodes de paiement (carte de crédit, PayPal, virement bancaire, crypto-monnaie, etc.). Chaque méthode de paiement possède sa propre logique de traitement, de validation et de confirmation.

### Défis spécifiques

1. **Différents algorithmes de paiement**: Chaque méthode de paiement nécessite un processus distinct avec des étapes et validations spécifiques.
2. **Évolution constante**: De nouvelles méthodes de paiement apparaissent régulièrement et doivent être intégrées.
3. **Structure conditionnelle complexe**: Sans pattern, chaque méthode de paiement devient une branche conditionnelle qui complexifie le code.
4. **Couplage fort**: La classe gérant les paiements doit connaître les détails de toutes les méthodes, ce qui complique la maintenance.
5. **Violation du principe de responsabilité unique**: Une classe monolithique gère à la fois le panier et tous les types de paiement.

## La solution: Pattern Strategy

Le Pattern Strategy permet de:

- Définir une famille d'algorithmes (stratégies de paiement)
- Encapsuler chacun dans une classe séparée
- Rendre ces stratégies interchangeables à l'exécution
- Découpler le processus de paiement de son implémentation spécifique

## Structure de base

1. **Context (ShoppingCart)**: La classe qui utilise une stratégie de paiement
2. **Strategy (interface implicite)**: Définit la méthode commune pour toutes les stratégies de paiement
3. **Concrete Strategies**: Les implémentations spécifiques (CreditCardPayment, PayPalPayment, etc.)

## Implémentation de base (sans le Pattern Strategy)

Dans l'implémentation de base, la classe `ShoppingCart` intègre directement toutes les méthodes de paiement dans sa méthode `checkout`:

```javascript
checkout(paymentMethod, paymentDetails) {
  // ...
  if (paymentMethod === 'credit_card') {
    // Logique pour carte de crédit...
  }
  else if (paymentMethod === 'paypal') {
    // Logique pour PayPal...
  }
  else if (paymentMethod === 'bank_transfer') {
    // Logique pour virement bancaire...
  }
  // etc.
}
```

Problèmes avec cette approche:

- Code monolithique avec des méthodes de paiement imbriquées
- Difficile à maintenir et à étendre (modification de la classe existante)
- Duplication de code et structure conditionnelle complexe
- Violation du principe ouvert/fermé (nécessite modification pour extension)

## Implémentation avec le Pattern Strategy

### 1. Context (ShoppingCart)

```javascript
class ShoppingCart {
  // ...
  setPaymentStrategy(paymentStrategy) {
    this.paymentStrategy = paymentStrategy;
  }

  checkout(paymentDetails) {
    if (!this.paymentStrategy) {
      console.log('Erreur: Aucune méthode de paiement sélectionnée');
      return false;
    }

    const total = this.calculateTotal();

    // Déléguer le traitement du paiement à la stratégie
    const result = this.paymentStrategy.processPayment(total, paymentDetails);

    // Traiter le résultat...
    return result.success;
  }
}
```

### 2. Strategy (interface implicite)

En JavaScript, l'interface est implicite — toute classe implémentant la méthode `processPayment` peut servir de stratégie.

### 3. Concrete Strategies

```javascript
class CreditCardPayment {
  constructor(cart) {
    this.cart = cart;
  }

  processPayment(amount, details) {
    // Logique spécifique au paiement par carte de crédit
    // ...
    return { success: true, immediate: true /* ... */ };
  }

  // Méthodes spécifiques...
}
```

### 4. Factory (bonus)

Pour simplifier la création des stratégies:

```javascript
class PaymentStrategyFactory {
  static createPaymentStrategy(type, cart) {
    switch (type) {
      case 'credit_card':
        return new CreditCardPayment(cart);
      case 'paypal':
        return new PayPalPayment(cart);
      // ...
    }
  }
}
```

## Utilisation

```javascript
const cart = new ShoppingCart();
// Ajouter des articles...

// Définir la stratégie de paiement
cart.setPaymentStrategy(
  PaymentStrategyFactory.createPaymentStrategy('credit_card', cart)
);

// Procéder au checkout avec les détails de paiement
const result = cart.checkout({
  cardNumber: '4111 1111 1111 1111',
  expiryDate: '12/25',
  cvv: '123',
});
```

## Avantages du Pattern Strategy

1. **Séparation des préoccupations**: Chaque stratégie de paiement est encapsulée dans sa propre classe.
2. **Extensibilité**: Ajouter une nouvelle méthode de paiement ne nécessite pas de modifier la classe `ShoppingCart` (principe ouvert/fermé).
3. **Interchangeabilité**: Les stratégies peuvent être changées dynamiquement pendant l'exécution.
4. **Réutilisabilité**: Les stratégies peuvent être utilisées dans différents contextes.
5. **Lisibilité et maintenabilité**: Code plus propre et mieux organisé.
6. **Testabilité**: Possibilité de tester chaque stratégie indépendamment.

## Applications réelles

Le pattern Strategy pour les systèmes de paiement est largement utilisé dans:

1. **Plateformes e-commerce**: Comme Shopify, WooCommerce, Magento
2. **Passerelles de paiement**: Comme Stripe, PayPal qui permettent d'intégrer plusieurs méthodes
3. **Applications de paiement mobile**: Acceptant différentes méthodes (NFC, QR codes, etc.)
4. **Solutions omnicanales**: Qui doivent gérer des paiements dans différents contextes (en ligne, en magasin)

## Conclusion

Le Pattern Strategy transforme un système de paiement monolithique et difficile à maintenir en une architecture flexible et extensible. En encapsulant chaque algorithme de paiement dans sa propre classe, il devient facile d'ajouter de nouvelles méthodes de paiement sans modifier le code existant, respectant ainsi le principe ouvert/fermé.

Ce pattern est particulièrement adapté aux systèmes qui doivent s'adapter à de nouvelles fonctionnalités tout en maintenant un code propre et maintenable.
