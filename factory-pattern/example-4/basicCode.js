// Without Factory Pattern
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
  const creditCardPayment = new CreditCardPayment();
  creditCardPayment.process(100);
  
  const paypalPayment = new PayPalPayment();
  paypalPayment.process(50);
  
  const bitcoinPayment = new BitcoinPayment();
  bitcoinPayment.process(200);
  