// Implémentation avec le Strategy Pattern

// Interface de stratégie (implicite en JavaScript)
class PaymentStrategy {
  processPayment(amount) {
    throw new Error('La méthode processPayment doit être implémentée');
  }
}

// Stratégie concrète: Paiement par carte de crédit
class CreditCardStrategy extends PaymentStrategy {
  constructor(cardNumber, cvv, expiry) {
    super();
    this.cardNumber = cardNumber;
    this.cvv = cvv;
    this.expiry = expiry;
  }

  processPayment(amount) {
    console.log(
      `Paiement de ${amount}€ traité par carte de crédit ${this.cardNumber}`
    );
    return true;
  }
}

// Stratégie concrète: Paiement par PayPal
class PayPalStrategy extends PaymentStrategy {
  constructor(email, password) {
    super();
    this.email = email;
    this.password = password;
  }

  processPayment(amount) {
    console.log(`Paiement de ${amount}€ traité via PayPal (${this.email})`);
    return true;
  }
}

// Stratégie concrète: Paiement par virement bancaire
class BankTransferStrategy extends PaymentStrategy {
  constructor(accountNumber, bankCode) {
    super();
    this.accountNumber = accountNumber;
    this.bankCode = bankCode;
  }

  processPayment(amount) {
    console.log(
      `Paiement de ${amount}€ traité par virement bancaire (${this.accountNumber})`
    );
    return true;
  }
}

// Contexte qui utilise une stratégie de paiement
class PaymentProcessor {
  constructor(paymentStrategy) {
    this.paymentStrategy = paymentStrategy;
  }

  // Permet de changer de stratégie à l'exécution
  setPaymentStrategy(paymentStrategy) {
    this.paymentStrategy = paymentStrategy;
  }

  processPayment(amount) {
    return this.paymentStrategy.processPayment(amount);
  }
}

// Utilisation
// Créer les stratégies
const creditCardStrategy = new CreditCardStrategy(
  '1234-5678-9012-3456',
  '123',
  '12/24'
);
const paypalStrategy = new PayPalStrategy('user@example.com', 'password');
const bankTransferStrategy = new BankTransferStrategy(
  'FR761234567890',
  'ABCDEFGH'
);

// Créer le processeur de paiement avec une stratégie initiale
const paymentProcessor = new PaymentProcessor(creditCardStrategy);
paymentProcessor.processPayment(100);

// Changer la stratégie à l'exécution
paymentProcessor.setPaymentStrategy(paypalStrategy);
paymentProcessor.processPayment(200);

paymentProcessor.setPaymentStrategy(bankTransferStrategy);
paymentProcessor.processPayment(300);
