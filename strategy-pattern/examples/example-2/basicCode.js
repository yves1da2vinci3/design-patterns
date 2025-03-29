// Implémentation sans le Pattern Strategy
// Exemple: Système de paiement pour boutique en ligne

class ShoppingCart {
  constructor() {
    this.items = [];
    this.discounts = [];
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

  checkout(paymentMethod, paymentDetails) {
    const total = this.calculateTotal();
    console.log(`\nTotal du panier: ${total}€`);

    // Processus de paiement avec différentes méthodes
    if (paymentMethod === 'credit_card') {
      // Logique de paiement par carte de crédit
      const { cardNumber, expiryDate, cvv } = paymentDetails;

      // Vérification de la validité de la carte
      if (!this.validateCreditCard(cardNumber, expiryDate, cvv)) {
        console.log('Paiement échoué: Informations de carte invalides');
        return false;
      }

      // Connexion au service de paiement
      console.log(
        `Traitement du paiement par carte de crédit: ${this.maskCreditCard(
          cardNumber
        )}`
      );
      console.log(`Montant: ${total}€`);

      // Simuler l'autorisation du paiement
      if (Math.random() > 0.1) {
        // 10% de chance d'échec pour simuler des problèmes
        console.log('Paiement par carte de crédit autorisé');
        this.sendConfirmationEmail();
        this.items = []; // Vider le panier après achat réussi
        return true;
      } else {
        console.log('Paiement échoué: Transaction refusée par la banque');
        return false;
      }
    } else if (paymentMethod === 'paypal') {
      // Logique de paiement par PayPal
      const { email, password } = paymentDetails;

      // Vérification du compte PayPal
      if (!this.validatePayPalAccount(email)) {
        console.log('Paiement échoué: Compte PayPal invalide');
        return false;
      }

      // Connexion à l'API PayPal
      console.log(`Redirection vers PayPal pour le compte: ${email}`);
      console.log(`Montant: ${total}€`);

      // Simuler l'autorisation du paiement
      if (Math.random() > 0.05) {
        // 5% de chance d'échec
        console.log('Paiement par PayPal autorisé');
        this.sendConfirmationEmail();
        this.items = []; // Vider le panier après achat réussi
        return true;
      } else {
        console.log('Paiement échoué: Solde PayPal insuffisant');
        return false;
      }
    } else if (paymentMethod === 'bank_transfer') {
      // Logique de paiement par virement bancaire
      const { accountNumber, bankCode } = paymentDetails;

      // Vérification des informations bancaires
      if (!this.validateBankAccount(accountNumber, bankCode)) {
        console.log('Paiement échoué: Informations bancaires invalides');
        return false;
      }

      // Générer les informations de virement
      const transferReference = this.generateTransferReference();

      console.log(`Détails du virement bancaire:`);
      console.log(`Montant: ${total}€`);
      console.log(`Compte à créditer: FRXX-XXXX-XXXX`);
      console.log(`Référence à indiquer: ${transferReference}`);
      console.log(
        'Votre commande sera traitée dès réception du paiement (délai 2-3 jours ouvrés)'
      );

      // Pour les virements, on ne vide pas immédiatement le panier
      // mais on le met en attente de paiement
      this.sendPendingOrderEmail(transferReference);
      return true;
    } else if (paymentMethod === 'cryptocurrency') {
      // Logique de paiement par cryptomonnaie
      const { walletAddress, coinType } = paymentDetails;

      // Vérification de l'adresse de portefeuille
      if (!this.validateCryptoWallet(walletAddress, coinType)) {
        console.log('Paiement échoué: Adresse de portefeuille invalide');
        return false;
      }

      // Calculer le montant équivalent en crypto (simulation)
      const cryptoAmount = this.convertToCrypto(total, coinType);
      const walletAddressToSend = this.getCryptoWalletAddress(coinType);

      console.log(`Détails du paiement en ${coinType}:`);
      console.log(`Montant: ${cryptoAmount} ${coinType}`);
      console.log(`Adresse de destination: ${walletAddressToSend}`);
      console.log(
        'Votre commande sera traitée dès confirmation de la transaction (6 confirmations)'
      );

      // Pour les cryptos, on ne vide pas immédiatement le panier
      // mais on le met en attente de confirmation
      this.sendPendingCryptoOrderEmail(
        walletAddressToSend,
        cryptoAmount,
        coinType
      );
      return true;
    } else {
      console.log(`Méthode de paiement non supportée: ${paymentMethod}`);
      return false;
    }
  }

  // Méthodes de validation des moyens de paiement
  validateCreditCard(cardNumber, expiryDate, cvv) {
    // Simple validation: vérifier la longueur du numéro de carte et la présence du CVV
    const isNumberValid = /^\d{16}$/.test(cardNumber.replace(/\s/g, ''));
    const isCvvValid = /^\d{3,4}$/.test(cvv);
    const isExpiryValid = /^\d{2}\/\d{2}$/.test(expiryDate);

    return isNumberValid && isCvvValid && isExpiryValid;
  }

  validatePayPalAccount(email) {
    // Simple vérification de format d'email
    return /^[\w.-]+@[\w.-]+\.\w+$/.test(email);
  }

  validateBankAccount(accountNumber, bankCode) {
    // Simple validation de numéro de compte et code banque
    return /^\d{10,}$/.test(accountNumber) && /^\d{5,}$/.test(bankCode);
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

  // Méthodes utilitaires
  maskCreditCard(cardNumber) {
    const cleaned = cardNumber.replace(/\s/g, '');
    return `**** **** **** ${cleaned.slice(-4)}`;
  }

  generateTransferReference() {
    return `CMD-${Date.now().toString(36).toUpperCase()}`;
  }

  convertToCrypto(amount, coinType) {
    // Taux de conversion simulés
    const rates = {
      BTC: 0.000033,
      ETH: 0.00052,
    };

    return (amount * rates[coinType]).toFixed(6);
  }

  getCryptoWalletAddress(coinType) {
    // Adresses fictives pour chaque type de crypto
    const addresses = {
      BTC: '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy',
      ETH: '0xffd8456fe0ce35863bd7778183bc1ef2c05c5e89',
    };

    return addresses[coinType] || '';
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

  sendPendingCryptoOrderEmail(address, amount, coinType) {
    console.log(
      `Email envoyé avec les instructions de paiement crypto (${amount} ${coinType})`
    );
  }
}

// Utilisation
console.log('=== SYSTÈME DE PAIEMENT SANS PATTERN STRATEGY ===\n');

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
const creditCardResult = cart.checkout('credit_card', {
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
const paypalResult = cart2.checkout('paypal', {
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
const transferResult = cart3.checkout('bank_transfer', {
  accountNumber: '1234567890',
  bankCode: '98765',
});

// Problèmes avec cette approche:
// 1. Code monolithique - La méthode checkout est très longue et gère tous les types de paiement
// 2. Difficile à étendre - L'ajout d'une nouvelle méthode de paiement nécessite de modifier la classe ShoppingCart
// 3. Couplage fort - La classe ShoppingCart connaît les détails de chaque méthode de paiement
// 4. Duplication de code - Structure conditionnelle répétitive pour chaque type de paiement
// 5. Violation du principe de responsabilité unique - Une classe qui gère à la fois le panier et les paiements
