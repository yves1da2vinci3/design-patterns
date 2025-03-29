// Implémentation avec le Pattern Strategy
// Exemple: Système de paiement pour boutique en ligne

// 1. Context - Classe qui utilisera la stratégie
class ShoppingCart {
  constructor() {
    this.items = [];
    this.discounts = [];
    this.paymentStrategy = null; // Référence à la stratégie de paiement
  }

  addItem(item) {
    this.items.push(item);
    console.log(`Article ajouté au panier: ${item.name} - ${item.price}€`);
  }

  removeItem(itemId) {
    const index = this.items.findIndex((item) => item.id === itemId);
    if (index !== -1) {
      const item = this.items[index];
      this.items.splice(index, 1);
      console.log(`Article retiré du panier: ${item.name}`);
      return true;
    }
    return false;
  }

  addDiscount(discount) {
    this.discounts.push(discount);
    console.log(`Réduction ajoutée: ${discount.name}`);
  }

  calculateSubtotal() {
    return this.items.reduce((total, item) => total + item.price, 0);
  }

  calculateDiscounts() {
    let totalDiscount = 0;

    for (const discount of this.discounts) {
      if (discount.type === 'percent') {
        totalDiscount += this.calculateSubtotal() * (discount.value / 100);
      } else if (discount.type === 'fixed') {
        totalDiscount += discount.value;
      } else if (discount.type === 'buy_x_get_y_free') {
        // Logique spécifique pour les promotions "achetez X, obtenez Y gratuit"
        const { buyQuantity, getFreeQuantity, applicableItemType } = discount;

        // Compter les articles du type applicable
        const applicableItems = this.items.filter(
          (item) => item.type === applicableItemType
        );
        const applicableCount = applicableItems.length;

        // Calculer combien d'articles gratuits peuvent être obtenus
        const sets = Math.floor(
          applicableCount / (buyQuantity + getFreeQuantity)
        );
        const freeItems = sets * getFreeQuantity;

        // Trier les articles par prix pour donner gratuitement les moins chers
        const sortedItems = [...applicableItems].sort(
          (a, b) => a.price - b.price
        );

        // Calculer la valeur des articles gratuits
        let freeValue = 0;
        for (let i = 0; i < freeItems && i < sortedItems.length; i++) {
          freeValue += sortedItems[i].price;
        }

        totalDiscount += freeValue;
      }
    }

    return totalDiscount;
  }

  calculateTotal() {
    const subtotal = this.calculateSubtotal();
    const discounts = this.calculateDiscounts();
    return subtotal - discounts;
  }

  // Définir la stratégie de paiement à utiliser
  setPaymentStrategy(paymentStrategy) {
    this.paymentStrategy = paymentStrategy;
  }

  // Procéder au paiement en utilisant la stratégie définie
  checkout(paymentDetails) {
    if (!this.paymentStrategy) {
      console.log('Erreur: Aucune méthode de paiement sélectionnée');
      return false;
    }

    const total = this.calculateTotal();
    console.log(`\nTotal du panier: ${total}€`);

    // Déléguer le traitement du paiement à la stratégie
    const result = this.paymentStrategy.processPayment(total, paymentDetails);

    if (result.success) {
      // Si le paiement est immédiat, vider le panier
      if (result.immediate) {
        this.items = [];
      }

      // Gérer les notifications post-paiement
      if (result.notificationMethod) {
        result.notificationMethod();
      }
    }

    return result.success;
  }

  // Méthodes pour l'envoi d'emails (simulées)
  sendConfirmationEmail() {
    console.log('Email de confirmation envoyé');
  }

  sendPendingOrderEmail(reference) {
    console.log(
      `Email envoyé avec les instructions de paiement (Réf: ${reference})`
    );
  }
}

// 2. Strategy Interface (implicite en JavaScript)
// Les stratégies de paiement doivent implémenter une méthode processPayment

// 3. Concrete Strategies - Implémentations spécifiques de paiement
class CreditCardPayment {
  constructor(cart) {
    this.cart = cart;
  }

  processPayment(amount, details) {
    const { cardNumber, expiryDate, cvv } = details;

    // Vérification de la validité de la carte
    if (!this.validateCreditCard(cardNumber, expiryDate, cvv)) {
      console.log('Paiement échoué: Informations de carte invalides');
      return { success: false };
    }

    // Connexion au service de paiement
    console.log(
      `Traitement du paiement par carte de crédit: ${this.maskCreditCard(
        cardNumber
      )}`
    );
    console.log(`Montant: ${amount}€`);

    // Simuler l'autorisation du paiement
    if (Math.random() > 0.1) {
      // 10% de chance d'échec pour simuler des problèmes
      console.log('Paiement par carte de crédit autorisé');
      return {
        success: true,
        immediate: true,
        notificationMethod: () => this.cart.sendConfirmationEmail(),
      };
    } else {
      console.log('Paiement échoué: Transaction refusée par la banque');
      return { success: false };
    }
  }

  validateCreditCard(cardNumber, expiryDate, cvv) {
    // Simple validation: vérifier la longueur du numéro de carte et la présence du CVV
    const isNumberValid = /^\d{16}$/.test(cardNumber.replace(/\s/g, ''));
    const isCvvValid = /^\d{3,4}$/.test(cvv);
    const isExpiryValid = /^\d{2}\/\d{2}$/.test(expiryDate);

    return isNumberValid && isCvvValid && isExpiryValid;
  }

  maskCreditCard(cardNumber) {
    const cleaned = cardNumber.replace(/\s/g, '');
    return `**** **** **** ${cleaned.slice(-4)}`;
  }
}

class PayPalPayment {
  constructor(cart) {
    this.cart = cart;
  }

  processPayment(amount, details) {
    const { email, password } = details;

    // Vérification du compte PayPal
    if (!this.validatePayPalAccount(email)) {
      console.log('Paiement échoué: Compte PayPal invalide');
      return { success: false };
    }

    // Connexion à l'API PayPal
    console.log(`Redirection vers PayPal pour le compte: ${email}`);
    console.log(`Montant: ${amount}€`);

    // Simuler l'autorisation du paiement
    if (Math.random() > 0.05) {
      // 5% de chance d'échec
      console.log('Paiement par PayPal autorisé');
      return {
        success: true,
        immediate: true,
        notificationMethod: () => this.cart.sendConfirmationEmail(),
      };
    } else {
      console.log('Paiement échoué: Solde PayPal insuffisant');
      return { success: false };
    }
  }

  validatePayPalAccount(email) {
    // Simple vérification de format d'email
    return /^[\w.-]+@[\w.-]+\.\w+$/.test(email);
  }
}

class BankTransferPayment {
  constructor(cart) {
    this.cart = cart;
  }

  processPayment(amount, details) {
    const { accountNumber, bankCode } = details;

    // Vérification des informations bancaires
    if (!this.validateBankAccount(accountNumber, bankCode)) {
      console.log('Paiement échoué: Informations bancaires invalides');
      return { success: false };
    }

    // Générer les informations de virement
    const transferReference = this.generateTransferReference();

    console.log(`Détails du virement bancaire:`);
    console.log(`Montant: ${amount}€`);
    console.log(`Compte à créditer: FRXX-XXXX-XXXX`);
    console.log(`Référence à indiquer: ${transferReference}`);
    console.log(
      'Votre commande sera traitée dès réception du paiement (délai 2-3 jours ouvrés)'
    );

    // Pour les virements, on renvoie success mais immediate à false car le paiement n'est pas instantané
    return {
      success: true,
      immediate: false,
      notificationMethod: () =>
        this.cart.sendPendingOrderEmail(transferReference),
      reference: transferReference,
    };
  }

  validateBankAccount(accountNumber, bankCode) {
    // Simple validation de numéro de compte et code banque
    return /^\d{10,}$/.test(accountNumber) && /^\d{5,}$/.test(bankCode);
  }

  generateTransferReference() {
    return `CMD-${Date.now().toString(36).toUpperCase()}`;
  }
}

class CryptocurrencyPayment {
  constructor(cart) {
    this.cart = cart;
    // Adresses fictives pour chaque type de crypto
    this.walletAddresses = {
      BTC: '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy',
      ETH: '0xffd8456fe0ce35863bd7778183bc1ef2c05c5e89',
    };

    // Taux de conversion simulés
    this.conversionRates = {
      BTC: 0.000033,
      ETH: 0.00052,
    };
  }

  processPayment(amount, details) {
    const { walletAddress, coinType } = details;

    // Vérification de l'adresse de portefeuille
    if (!this.validateCryptoWallet(walletAddress, coinType)) {
      console.log('Paiement échoué: Adresse de portefeuille invalide');
      return { success: false };
    }

    // Calculer le montant équivalent en crypto
    const cryptoAmount = this.convertToCrypto(amount, coinType);
    const walletAddressToSend = this.walletAddresses[coinType];

    console.log(`Détails du paiement en ${coinType}:`);
    console.log(`Montant: ${cryptoAmount} ${coinType}`);
    console.log(`Adresse de destination: ${walletAddressToSend}`);
    console.log(
      'Votre commande sera traitée dès confirmation de la transaction (6 confirmations)'
    );

    // Paiement en attente de confirmation sur la blockchain
    return {
      success: true,
      immediate: false,
      notificationMethod: () =>
        this.sendPendingCryptoOrderEmail(
          walletAddressToSend,
          cryptoAmount,
          coinType
        ),
      cryptoAmount,
      walletAddress: walletAddressToSend,
    };
  }

  validateCryptoWallet(walletAddress, coinType) {
    // Vérification basique en fonction du type de crypto
    if (coinType === 'BTC') {
      return (
        walletAddress.startsWith('1') ||
        walletAddress.startsWith('3') ||
        walletAddress.startsWith('bc1')
      );
    } else if (coinType === 'ETH') {
      return walletAddress.startsWith('0x') && walletAddress.length === 42;
    }
    return false;
  }

  convertToCrypto(amount, coinType) {
    return (amount * this.conversionRates[coinType]).toFixed(6);
  }

  sendPendingCryptoOrderEmail(address, amount, coinType) {
    console.log(
      `Email envoyé avec les instructions de paiement crypto (${amount} ${coinType})`
    );
  }
}

// 4. Factory de stratégies de paiement (pattern supplémentaire pour simplifier la création)
class PaymentStrategyFactory {
  static createPaymentStrategy(type, cart) {
    switch (type) {
      case 'credit_card':
        return new CreditCardPayment(cart);
      case 'paypal':
        return new PayPalPayment(cart);
      case 'bank_transfer':
        return new BankTransferPayment(cart);
      case 'cryptocurrency':
        return new CryptocurrencyPayment(cart);
      default:
        throw new Error(`Méthode de paiement non supportée: ${type}`);
    }
  }
}

// Utilisation
console.log('=== SYSTÈME DE PAIEMENT AVEC PATTERN STRATEGY ===\n');

// Création d'un panier
const cart = new ShoppingCart();

// Ajout des articles
cart.addItem({
  id: 1,
  name: 'Livre: Design Patterns',
  price: 35.99,
  type: 'book',
});
cart.addItem({
  id: 2,
  name: 'Clavier mécanique',
  price: 129.99,
  type: 'electronics',
});
cart.addItem({
  id: 3,
  name: 'Souris sans fil',
  price: 49.99,
  type: 'electronics',
});

// Ajout d'une réduction
cart.addDiscount({ name: 'Réduction été', type: 'percent', value: 10 });

// Paiement par carte de crédit
console.log('\n--- Paiement par carte de crédit ---');
// Définir la stratégie de paiement pour le panier
cart.setPaymentStrategy(
  PaymentStrategyFactory.createPaymentStrategy('credit_card', cart)
);
// Procéder au checkout avec les détails de paiement
const creditCardResult = cart.checkout({
  cardNumber: '4111 1111 1111 1111',
  expiryDate: '12/25',
  cvv: '123',
});

// Création d'un nouveau panier
const cart2 = new ShoppingCart();

// Ajout des articles
cart2.addItem({
  id: 4,
  name: 'Smartphone',
  price: 599.99,
  type: 'electronics',
});
cart2.addItem({
  id: 5,
  name: 'Coque de protection',
  price: 19.99,
  type: 'accessory',
});

// Paiement par PayPal
console.log('\n--- Paiement par PayPal ---');
// Définir la stratégie de paiement pour le panier
cart2.setPaymentStrategy(
  PaymentStrategyFactory.createPaymentStrategy('paypal', cart2)
);
// Procéder au checkout avec les détails de paiement
const paypalResult = cart2.checkout({
  email: 'client@example.com',
  password: '********',
});

// Création d'un troisième panier
const cart3 = new ShoppingCart();

// Ajout des articles
cart3.addItem({
  id: 6,
  name: 'Ordinateur portable',
  price: 1299.99,
  type: 'electronics',
});
cart3.addItem({
  id: 7,
  name: 'Sac de transport',
  price: 59.99,
  type: 'accessory',
});
cart3.addItem({
  id: 8,
  name: 'Souris Bluetooth',
  price: 39.99,
  type: 'electronics',
});

// Ajout d'une promotion "achetez X, obtenez Y gratuit"
cart3.addDiscount({
  name: '2 accessoires achetés, 1 offert',
  type: 'buy_x_get_y_free',
  buyQuantity: 2,
  getFreeQuantity: 1,
  applicableItemType: 'accessory',
});

// Paiement par virement
console.log('\n--- Paiement par virement bancaire ---');
// Définir la stratégie de paiement pour le panier
cart3.setPaymentStrategy(
  PaymentStrategyFactory.createPaymentStrategy('bank_transfer', cart3)
);
// Procéder au checkout avec les détails de paiement
const transferResult = cart3.checkout({
  accountNumber: '1234567890',
  bankCode: '98765',
});

// Création d'un quatrième panier pour démontrer la facilité d'ajout d'une nouvelle méthode
const cart4 = new ShoppingCart();
cart4.addItem({
  id: 9,
  name: 'Casque audio',
  price: 149.99,
  type: 'electronics',
});

// Paiement par crypto-monnaie
console.log('\n--- Paiement par crypto-monnaie ---');
// Définir la stratégie de paiement pour le panier
cart4.setPaymentStrategy(
  PaymentStrategyFactory.createPaymentStrategy('cryptocurrency', cart4)
);
// Procéder au checkout avec les détails de paiement
const cryptoResult = cart4.checkout({
  walletAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
  coinType: 'ETH',
});

// Avantages du Pattern Strategy:
// 1. Séparation des préoccupations - Chaque stratégie de paiement est encapsulée dans sa propre classe
// 2. Extensibilité - Ajouter une nouvelle méthode de paiement ne nécessite pas de modifier la classe ShoppingCart
// 3. Interchangeabilité - Les stratégies peuvent être changées dynamiquement pendant l'exécution
// 4. Réutilisabilité - Les stratégies peuvent être utilisées dans différents contextes
// 5. Lisibilité et maintenabilité - Code plus propre et mieux organisé
// 6. Testabilité - Possibilité de tester chaque stratégie indépendamment
