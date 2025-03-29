// Implémentation sans le Strategy Pattern
class CreditCardPayment {
  constructor(paymentDetails) {
    this.cardNumber = paymentDetails.cardNumber;
    this.cvv = paymentDetails.cvv;
    this.expiry = paymentDetails.expiry;
    this.amount = paymentDetails.amount;
  }

  processPayment() {
    // Logique de traitement du paiement par carte de crédit
    console.log(
      `Paiement de ${this.amount}€ traité par carte de crédit ${this.cardNumber}`
    );
    return true;
  }
}

class PayPalPayment {
  constructor(paymentDetails) {
    this.email = paymentDetails.email;
    this.password = paymentDetails.password;
    this.amount = paymentDetails.amount;
  }

  processPayment() {
    // Logique de traitement du paiement par PayPal
    console.log(
      `Paiement de ${this.amount}€ traité via PayPal (${this.email})`
    );
    return true;
  }
}

class BankTransferPayment {
  constructor(paymentDetails) {
    this.accountNumber = paymentDetails.accountNumber;
    this.bankCode = paymentDetails.bankCode;
    this.amount = paymentDetails.amount;
  }

  processPayment() {
    // Logique de traitement du paiement par virement bancaire
    console.log(
      `Paiement de ${this.amount}€ traité par virement bancaire (${this.accountNumber})`
    );
    return true;
  }
}

// Utilisation (problématique)
function processPayment(paymentType, paymentDetails) {
  if (paymentType === 'creditCard') {
    const payment = new CreditCardPayment(paymentDetails);
    return payment.processPayment();
  } else if (paymentType === 'paypal') {
    const payment = new PayPalPayment(paymentDetails);
    return payment.processPayment();
  } else if (paymentType === 'bankTransfer') {
    const payment = new BankTransferPayment(paymentDetails);
    return payment.processPayment();
  } else {
    throw new Error('Méthode de paiement non prise en charge');
  }
}

// Exemple d'utilisation
const creditCardDetails = {
  cardNumber: '1234-5678-9012-3456',
  cvv: '123',
  expiry: '12/24',
  amount: 100,
};

processPayment('creditCard', creditCardDetails);
