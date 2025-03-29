// With Factory Pattern
class NotificationFactory {
    createNotificationChannel(type) {
      switch (type) {
        case 'email':
          return new EmailNotification();
        case 'sms':
          return new SMSNotification();
        case 'push':
          return new PushNotification();
        default:
          throw new Error('Invalid notification channel');
      }
    }
  }
  
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
  const notificationFactory = new NotificationFactory();
  
  const emailNotification = notificationFactory.createNotificationChannel('email');
  emailNotification.send('Hello, this is an email notification');
  
  const smsNotification = notificationFactory.createNotificationChannel('sms');
  smsNotification.send('Hello, this is an SMS notification');
  
  const pushNotification = notificationFactory.createNotificationChannel('push');
  pushNotification.send('Hello, this is a push notification');
  