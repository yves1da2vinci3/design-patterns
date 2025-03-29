// Without Factory Pattern
class EmailNotification {
    send(message) {
      console.log(`Sending email: ${message}`);
    }
  }
  
  class SMSNotification {
    send(message) {
      console.log(`Sending SMS: ${message}`);
    }
  }
  
  class PushNotification {
    send(message) {
      console.log(`Sending push notification: ${message}`);
    }
  }
  
  // Usage
  const emailNotification = new EmailNotification();
  emailNotification.send('Hello, this is an email notification');
  
  const smsNotification = new SMSNotification();
  smsNotification.send('Hello, this is an SMS notification');
  
  const pushNotification = new PushNotification();
  pushNotification.send('Hello, this is a push notification');
  