// With Factory Pattern
class PaymentMethodFactory {
  createPaymentMethod(type) {
    switch (type) {
      case 'credit':
        return new CreditCardPayment();
      case 'paypal':
        return new PayPalPayment();
      case 'bitcoin':
        return new BitcoinPayment();
      default:
        throw new Error('Invalid payment method');
    }
  }
}

class CreditCardPayment {
  process(amount) {
    console.log(`Processing credit card payment for $${amount}`);
  }
}

class PayPalPayment {
  process(amount) {
    console.log(`Processing PayPal payment for $${amount}`);
  }
}

class BitcoinPayment {
  process(amount) {
    console.log(`Processing Bitcoin payment for $${amount}`);
  }
}

// Usage
const paymentFactory = new PaymentMethodFactory();

const creditCardPayment = paymentFactory.createPaymentMethod('credit');
creditCardPayment.process(100);

const paypalPayment = paymentFactory.createPaymentMethod('paypal');
paypalPayment.process(50);

const bitcoinPayment = paymentFactory.createPaymentMethod('bitcoin');
bitcoinPayment.process(200);
