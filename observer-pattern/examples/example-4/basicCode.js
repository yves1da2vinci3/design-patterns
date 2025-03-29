// Implémentation sans le Pattern Observer
// Exemple: Système de surveillance météorologique

// Station météo centrale
class WeatherStation {
  constructor(location) {
    this.location = location;
    this.temperature = 0;
    this.humidity = 0;
    this.pressure = 0;
    this.windSpeed = 0;
    this.windDirection = 'N';

    // Liste des dispositifs à notifier
    this.displays = [];
    this.loggers = [];
    this.alertSystems = [];
  }

  registerDisplay(display) {
    this.displays.push(display);
    console.log(`Nouvel affichage enregistré pour ${this.location}`);
  }

  registerLogger(logger) {
    this.loggers.push(logger);
    console.log(`Nouveau logger enregistré pour ${this.location}`);
  }

  registerAlertSystem(alertSystem) {
    this.alertSystems.push(alertSystem);
    console.log(`Nouveau système d'alerte enregistré pour ${this.location}`);
  }

  // Méthode pour mettre à jour les mesures
  setMeasurements(temperature, humidity, pressure, windSpeed, windDirection) {
    // Vérifier si des changements significatifs se sont produits
    const tempChanged = Math.abs(this.temperature - temperature) >= 0.5;
    const humidityChanged = Math.abs(this.humidity - humidity) >= 2;
    const pressureChanged = Math.abs(this.pressure - pressure) >= 1;
    const windChanged =
      Math.abs(this.windSpeed - windSpeed) >= 1 ||
      this.windDirection !== windDirection;

    // Stocker les nouvelles valeurs
    this.temperature = temperature;
    this.humidity = humidity;
    this.pressure = pressure;
    this.windSpeed = windSpeed;
    this.windDirection = windDirection;

    console.log(
      `\n[Station ${this.location}] Nouvelles mesures: ${temperature}°C, ${humidity}% d'humidité, ${pressure} hPa, vent ${windSpeed} km/h direction ${windDirection}`
    );

    // Notifier tous les affichages
    for (const display of this.displays) {
      display.update(temperature, humidity, pressure, windSpeed, windDirection);
    }

    // Enregistrer les données dans les loggers
    for (const logger of this.loggers) {
      logger.logWeatherData(
        this.location,
        temperature,
        humidity,
        pressure,
        windSpeed,
        windDirection
      );
    }

    // Vérifier s'il faut déclencher des alertes
    for (const alertSystem of this.alertSystems) {
      if (temperature >= 35 || temperature <= -10) {
        alertSystem.temperatureAlert(this.location, temperature);
      }

      if (windSpeed >= 50) {
        alertSystem.strongWindAlert(this.location, windSpeed, windDirection);
      }

      if (pressure <= 970) {
        alertSystem.lowPressureAlert(this.location, pressure);
      }
    }
  }

  // Accesseurs pour les différentes mesures
  getTemperature() {
    return this.temperature;
  }
  getHumidity() {
    return this.humidity;
  }
  getPressure() {
    return this.pressure;
  }
  getWindSpeed() {
    return this.windSpeed;
  }
  getWindDirection() {
    return this.windDirection;
  }
}

// Affichage météo (ex: écran dans une maison)
class WeatherDisplay {
  constructor(name) {
    this.name = name;
    this.temperature = 0;
    this.humidity = 0;
    this.pressure = 0;
    this.windSpeed = 0;
    this.windDirection = 'N';
  }

  update(temperature, humidity, pressure, windSpeed, windDirection) {
    this.temperature = temperature;
    this.humidity = humidity;
    this.pressure = pressure;
    this.windSpeed = windSpeed;
    this.windDirection = windDirection;

    this.display();
  }

  display() {
    console.log(
      `[Affichage ${this.name}] Conditions actuelles: ${this.temperature}°C, ${this.humidity}% d'humidité`
    );
    console.log(
      `[Affichage ${this.name}] Pression: ${this.pressure} hPa, Vent: ${this.windSpeed} km/h ${this.windDirection}`
    );
  }
}

// Système de journalisation météo
class WeatherLogger {
  constructor() {
    this.logEntries = [];
  }

  logWeatherData(
    location,
    temperature,
    humidity,
    pressure,
    windSpeed,
    windDirection
  ) {
    const timestamp = new Date().toISOString();
    const entry = {
      timestamp,
      location,
      temperature,
      humidity,
      pressure,
      windSpeed,
      windDirection,
    };

    this.logEntries.push(entry);
    console.log(
      `[Logger] Enregistrement des données pour ${location} à ${timestamp}`
    );
  }

  getLogCount() {
    return this.logEntries.length;
  }

  getLastEntry() {
    if (this.logEntries.length === 0) {
      return null;
    }
    return this.logEntries[this.logEntries.length - 1];
  }

  getAverageTemperature(location) {
    const entries = this.logEntries.filter(
      (entry) => entry.location === location
    );
    if (entries.length === 0) {
      return null;
    }

    const sum = entries.reduce((acc, entry) => acc + entry.temperature, 0);
    return sum / entries.length;
  }
}

// Système d'alerte météo
class WeatherAlertSystem {
  constructor(name) {
    this.name = name;
    this.alertsTriggered = [];
  }

  temperatureAlert(location, temperature) {
    const alertType = temperature > 35 ? 'chaleur extrême' : 'froid extrême';
    const message = `ALERTE ${alertType.toUpperCase()} à ${location}: ${temperature}°C`;

    this.triggerAlert(message, 'temperature', location);
  }

  strongWindAlert(location, windSpeed, windDirection) {
    const message = `ALERTE VENT FORT à ${location}: ${windSpeed} km/h direction ${windDirection}`;

    this.triggerAlert(message, 'wind', location);
  }

  lowPressureAlert(location, pressure) {
    const message = `ALERTE DÉPRESSION à ${location}: ${pressure} hPa`;

    this.triggerAlert(message, 'pressure', location);
  }

  triggerAlert(message, type, location) {
    const alert = {
      timestamp: new Date(),
      message,
      type,
      location,
    };

    this.alertsTriggered.push(alert);
    console.log(`[Système d'alerte ${this.name}] ${message}`);

    // Dans un système réel, cela pourrait envoyer des SMS, des emails, etc.
  }

  getAlertCount() {
    return this.alertsTriggered.length;
  }

  getAlertsByType(type) {
    return this.alertsTriggered.filter((alert) => alert.type === type);
  }
}

// Application principale
console.log('=== SYSTÈME MÉTÉO SANS PATTERN OBSERVER ===\n');

// Création de stations météo
const parisStation = new WeatherStation('Paris');
const lyonStation = new WeatherStation('Lyon');

// Création d'affichages
const displayMairie = new WeatherDisplay('Mairie');
const displayAeroport = new WeatherDisplay('Aéroport');
const displayCentreville = new WeatherDisplay('Centre-ville');

// Création d'un système de journalisation
const weatherLogger = new WeatherLogger();

// Création d'un système d'alerte
const nationalAlertSystem = new WeatherAlertSystem('Alerte Nationale');

// Enregistrement des affichages auprès des stations
parisStation.registerDisplay(displayMairie);
parisStation.registerDisplay(displayCentreville);
lyonStation.registerDisplay(displayAeroport);

// Enregistrement du logger auprès des deux stations
parisStation.registerLogger(weatherLogger);
lyonStation.registerLogger(weatherLogger);

// Enregistrement du système d'alerte auprès des deux stations
parisStation.registerAlertSystem(nationalAlertSystem);
lyonStation.registerAlertSystem(nationalAlertSystem);

// Simulation de mesures météorologiques
console.log('\n--- Jour 1: Conditions normales ---');
parisStation.setMeasurements(22.5, 65, 1013, 10, 'SW');
lyonStation.setMeasurements(24, 60, 1012, 5, 'E');

console.log('\n--- Jour 2: Canicule à Paris ---');
parisStation.setMeasurements(36.2, 45, 1010, 8, 'S');
lyonStation.setMeasurements(27, 55, 1009, 10, 'SE');

console.log('\n--- Jour 3: Tempête à Lyon ---');
parisStation.setMeasurements(25, 70, 1000, 20, 'W');
lyonStation.setMeasurements(22, 80, 985, 65, 'SW');

// Affichage des statistiques du logger
console.log(`\nNombre total d'enregistrements: ${weatherLogger.getLogCount()}`);
console.log(
  `Température moyenne à Paris: ${weatherLogger.getAverageTemperature(
    'Paris'
  )}°C`
);
console.log(
  `Température moyenne à Lyon: ${weatherLogger.getAverageTemperature('Lyon')}°C`
);

// Affichage des statistiques d'alerte
console.log(
  `\nNombre total d'alertes déclenchées: ${nationalAlertSystem.getAlertCount()}`
);
console.log(
  `Alertes de température: ${
    nationalAlertSystem.getAlertsByType('temperature').length
  }`
);
console.log(
  `Alertes de vent: ${nationalAlertSystem.getAlertsByType('wind').length}`
);
console.log(
  `Alertes de pression: ${
    nationalAlertSystem.getAlertsByType('pressure').length
  }`
);

// Problèmes avec cette approche:
// 1. Couplage fort - Chaque station doit connaître tous les types de dispositifs
// 2. Logique en cascade - Les alertes sont vérifiées à chaque mise à jour
// 3. Manque de flexibilité - Difficile d'ajouter de nouveaux types de dispositifs
// 4. Duplication - Chaque station répète la même logique de notification
