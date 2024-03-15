// Without Command Pattern

class TV {
    turnOn() {
      console.log("TV is ON");
    }
  
    turnOff() {
      console.log("TV is OFF");
    }
  }
  
  class RemoteControl {
    constructor(device) {
      this.device = device;
    }
  
    turnOn() {
      this.device.turnOn();
    }
  
    turnOff() {
      this.device.turnOff();
    }
  }
  
  // Usage
  const tv = new TV();
  const remote = new RemoteControl(tv);
  remote.turnOn(); // Output: TV is ON
  remote.turnOff(); // Output: TV is OFF
  