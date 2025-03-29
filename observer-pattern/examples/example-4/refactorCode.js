// Implémentation avec le Pattern Observer
// Exemple: Système de surveillance météorologique

// Interface Observable (Sujet)
class Subject {
  constructor() {
    this.observers = [];
  }

  registerObserver(observer) {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
    }
  }

  removeObserver(observer) {
    const index = this.observers.indexOf(observer);
    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  }

  notifyObservers() {
    // Cette méthode sera implémentée par les classes concrètes
  }
}

// Interface Observer (Observateur)
class Observer {
  update(data) {
    // Cette méthode sera implémentée par les classes concrètes
  }
}

// Interface pour l'affichage des données
class DisplayElement {
  display() {
    // Cette méthode sera implémentée par les classes concrètes
  }
}

// Station météo (Sujet concret)
class WeatherStation extends Subject {
  constructor(location) {
    super();
    this.location = location;
    this.weatherData = {
      temperature: 0,
      humidity: 0,
      pressure: 0,
      windSpeed: 0,
      windDirection: 'N',
      location: location,
      timestamp: new Date(),
    };
  }

  // Simule l'arrivée de nouvelles mesures depuis les capteurs
  setMeasurements(temperature, humidity, pressure, windSpeed, windDirection) {
    // Stockage des anciennes valeurs pour détection de changements significatifs
    const oldData = { ...this.weatherData };

    // Mise à jour des données
    this.weatherData = {
      temperature,
      humidity,
      pressure,
      windSpeed,
      windDirection,
      location: this.location,
      timestamp: new Date(),
    };

    console.log(
      `\n[Station ${this.location}] Nouvelles mesures: ${temperature}°C, ${humidity}% d'humidité, ${pressure} hPa, vent ${windSpeed} km/h direction ${windDirection}`
    );

    // Notification des observateurs
    this.notifyObservers();
  }

  notifyObservers() {
    for (const observer of this.observers) {
      observer.update(this.weatherData);
    }
  }

  getWeatherData() {
    return { ...this.weatherData }; // Retourne une copie pour éviter les modifications directes
  }
}

// Centrale météorologique (agrège plusieurs stations)
class WeatherCenter {
  constructor(name) {
    this.name = name;
    this.stations = [];
  }

  addStation(station) {
    this.stations.push(station);
    console.log(
      `Station ${station.location} ajoutée à la centrale ${this.name}`
    );
  }

  removeStation(stationLocation) {
    const index = this.stations.findIndex(
      (s) => s.location === stationLocation
    );
    if (index !== -1) {
      const station = this.stations[index];
      this.stations.splice(index, 1);
      console.log(
        `Station ${station.location} retirée de la centrale ${this.name}`
      );
    }
  }

  getStation(location) {
    return this.stations.find((s) => s.location === location);
  }

  getAllStations() {
    return [...this.stations]; // Retourne une copie
  }
}

// Affichage météo (Observateur concret + Élément d'affichage)
class CurrentConditionsDisplay extends Observer {
  constructor(name) {
    super();
    this.name = name;
    this.temperature = 0;
    this.humidity = 0;
    this.pressure = 0;
    this.windSpeed = 0;
    this.windDirection = 'N';
    this.location = '';
    this.timestamp = null;
  }

  // Implémentation de la méthode update de l'interface Observer
  update(weatherData) {
    this.temperature = weatherData.temperature;
    this.humidity = weatherData.humidity;
    this.pressure = weatherData.pressure;
    this.windSpeed = weatherData.windSpeed;
    this.windDirection = weatherData.windDirection;
    this.location = weatherData.location;
    this.timestamp = weatherData.timestamp;

    this.display();
  }

  // Implémentation de la méthode display de l'interface DisplayElement
  display() {
    const time = this.timestamp.toLocaleTimeString();
    console.log(`[Affichage ${this.name}] ${this.location} à ${time}:`);
    console.log(
      `[Affichage ${this.name}] Conditions actuelles: ${this.temperature}°C, ${this.humidity}% d'humidité`
    );
    console.log(
      `[Affichage ${this.name}] Pression: ${this.pressure} hPa, Vent: ${this.windSpeed} km/h ${this.windDirection}`
    );
  }

  // Méthode pour s'abonner à une station
  subscribe(weatherStation) {
    weatherStation.registerObserver(this);
    console.log(
      `[Affichage ${this.name}] Abonné à la station ${weatherStation.location}`
    );
  }

  // Méthode pour se désabonner d'une station
  unsubscribe(weatherStation) {
    weatherStation.removeObserver(this);
    console.log(
      `[Affichage ${this.name}] Désabonné de la station ${weatherStation.location}`
    );
  }
}

// Affichage de statistiques météo (un autre Observateur)
class StatisticsDisplay extends Observer {
  constructor(name) {
    super();
    this.name = name;
    this.temperatureReadings = {};
    this.minTemperature = {};
    this.maxTemperature = {};
    this.temperatureSum = {};
    this.readingCount = {};
  }

  update(weatherData) {
    const location = weatherData.location;
    const temperature = weatherData.temperature;

    // Initialiser les statistiques pour cette location si c'est la première fois
    if (!this.temperatureReadings[location]) {
      this.temperatureReadings[location] = [];
      this.minTemperature[location] = temperature;
      this.maxTemperature[location] = temperature;
      this.temperatureSum[location] = 0;
      this.readingCount[location] = 0;
    }

    // Mettre à jour les statistiques
    this.temperatureReadings[location].push(temperature);
    this.minTemperature[location] = Math.min(
      this.minTemperature[location],
      temperature
    );
    this.maxTemperature[location] = Math.max(
      this.maxTemperature[location],
      temperature
    );
    this.temperatureSum[location] += temperature;
    this.readingCount[location]++;

    this.display();
  }

  display() {
    console.log(`\n[Statistiques ${this.name}]`);

    for (const location in this.readingCount) {
      const avg = this.temperatureSum[location] / this.readingCount[location];

      console.log(`  ${location}:`);
      console.log(
        `  - Température min/max/moy: ${this.minTemperature[location]}°C / ${
          this.maxTemperature[location]
        }°C / ${avg.toFixed(1)}°C`
      );
      console.log(`  - Nombre de relevés: ${this.readingCount[location]}`);
    }
  }

  subscribe(weatherStation) {
    weatherStation.registerObserver(this);
    console.log(
      `[Statistiques ${this.name}] Abonné à la station ${weatherStation.location}`
    );
  }

  unsubscribe(weatherStation) {
    weatherStation.removeObserver(this);
    console.log(
      `[Statistiques ${this.name}] Désabonné de la station ${weatherStation.location}`
    );
  }

  getAverageTemperature(location) {
    if (!this.readingCount[location] || this.readingCount[location] === 0) {
      return null;
    }
    return this.temperatureSum[location] / this.readingCount[location];
  }
}

// Système de journalisation (Observateur)
class WeatherLogger extends Observer {
  constructor() {
    super();
    this.logEntries = [];
  }

  update(weatherData) {
    this.logWeatherData(weatherData);
  }

  logWeatherData(weatherData) {
    const entry = {
      timestamp: weatherData.timestamp,
      location: weatherData.location,
      temperature: weatherData.temperature,
      humidity: weatherData.humidity,
      pressure: weatherData.pressure,
      windSpeed: weatherData.windSpeed,
      windDirection: weatherData.windDirection,
    };

    this.logEntries.push(entry);
    console.log(
      `[Logger] Enregistrement des données pour ${
        weatherData.location
      } à ${weatherData.timestamp.toLocaleTimeString()}`
    );
  }

  subscribe(weatherStation) {
    weatherStation.registerObserver(this);
    console.log(`[Logger] Abonné à la station ${weatherStation.location}`);
  }

  unsubscribe(weatherStation) {
    weatherStation.removeObserver(this);
    console.log(`[Logger] Désabonné de la station ${weatherStation.location}`);
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

// Système d'alerte météo (Observateur)
class WeatherAlertSystem extends Observer {
  constructor(name) {
    super();
    this.name = name;
    this.alertsTriggered = [];
    this.alertThresholds = {
      highTemperature: 35,
      lowTemperature: -10,
      highWindSpeed: 50,
      lowPressure: 970,
    };
  }

  update(weatherData) {
    // Vérification des seuils d'alerte
    const { temperature, pressure, windSpeed, windDirection, location } =
      weatherData;

    // Alerte de température
    if (
      temperature >= this.alertThresholds.highTemperature ||
      temperature <= this.alertThresholds.lowTemperature
    ) {
      this.temperatureAlert(location, temperature);
    }

    // Alerte de vent fort
    if (windSpeed >= this.alertThresholds.highWindSpeed) {
      this.strongWindAlert(location, windSpeed, windDirection);
    }

    // Alerte de basse pression
    if (pressure <= this.alertThresholds.lowPressure) {
      this.lowPressureAlert(location, pressure);
    }
  }

  temperatureAlert(location, temperature) {
    const alertType =
      temperature > this.alertThresholds.highTemperature
        ? 'chaleur extrême'
        : 'froid extrême';
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

  setAlertThreshold(type, value) {
    if (type in this.alertThresholds) {
      this.alertThresholds[type] = value;
      console.log(
        `[Système d'alerte ${this.name}] Seuil '${type}' mis à jour à ${value}`
      );
    }
  }

  subscribe(weatherStation) {
    weatherStation.registerObserver(this);
    console.log(
      `[Système d'alerte ${this.name}] Abonné à la station ${weatherStation.location}`
    );
  }

  unsubscribe(weatherStation) {
    weatherStation.removeObserver(this);
    console.log(
      `[Système d'alerte ${this.name}] Désabonné de la station ${weatherStation.location}`
    );
  }

  getAlertCount() {
    return this.alertsTriggered.length;
  }

  getAlertsByType(type) {
    return this.alertsTriggered.filter((alert) => alert.type === type);
  }
}

// Application principale
console.log('=== SYSTÈME MÉTÉO AVEC PATTERN OBSERVER ===\n');

// Création de la centrale météo
const weatherCenter = new WeatherCenter('Centre National Météo');

// Création des stations météo
const parisStation = new WeatherStation('Paris');
const lyonStation = new WeatherStation('Lyon');

// Ajout des stations à la centrale
weatherCenter.addStation(parisStation);
weatherCenter.addStation(lyonStation);

// Création des affichages
const displayMairie = new CurrentConditionsDisplay('Mairie');
const displayAeroport = new CurrentConditionsDisplay('Aéroport');
const displayCentreville = new CurrentConditionsDisplay('Centre-ville');

// Création d'un affichage de statistiques
const statsDisplay = new StatisticsDisplay('National');

// Création d'un système de journalisation
const weatherLogger = new WeatherLogger();

// Création d'un système d'alerte
const nationalAlertSystem = new WeatherAlertSystem('Alerte Nationale');

// Abonnement des affichages aux stations appropriées
displayMairie.subscribe(parisStation);
displayCentreville.subscribe(parisStation);
displayAeroport.subscribe(lyonStation);

// Abonnement du système de statistiques aux deux stations
statsDisplay.subscribe(parisStation);
statsDisplay.subscribe(lyonStation);

// Abonnement du logger aux deux stations
weatherLogger.subscribe(parisStation);
weatherLogger.subscribe(lyonStation);

// Abonnement du système d'alerte aux deux stations
nationalAlertSystem.subscribe(parisStation);
nationalAlertSystem.subscribe(lyonStation);

// Simulation de mesures météorologiques
console.log('\n--- Jour 1: Conditions normales ---');
parisStation.setMeasurements(22.5, 65, 1013, 10, 'SW');
lyonStation.setMeasurements(24, 60, 1012, 5, 'E');

// Modification du seuil d'alerte pour les fortes chaleurs
nationalAlertSystem.setAlertThreshold('highTemperature', 30);

console.log("\n--- Jour 2: Canicule à Paris (avec nouveau seuil d'alerte) ---");
parisStation.setMeasurements(32.2, 45, 1010, 8, 'S'); // Déclenche une alerte avec le nouveau seuil
lyonStation.setMeasurements(27, 55, 1009, 10, 'SE');

console.log('\n--- Jour 3: Tempête à Lyon ---');
parisStation.setMeasurements(25, 70, 1000, 20, 'W');
lyonStation.setMeasurements(22, 80, 985, 65, 'SW');

// Affichage des statistiques
statsDisplay.display();

// Affichage des statistiques du logger
console.log(`\nNombre total d'enregistrements: ${weatherLogger.getLogCount()}`);
console.log(
  `Température moyenne à Paris: ${weatherLogger
    .getAverageTemperature('Paris')
    .toFixed(1)}°C`
);
console.log(
  `Température moyenne à Lyon: ${weatherLogger
    .getAverageTemperature('Lyon')
    .toFixed(1)}°C`
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

// Désabonnement d'un affichage
console.log("\n--- Désabonnement de l'affichage Aéroport ---");
displayAeroport.unsubscribe(lyonStation);

// Une dernière mesure pour montrer que l'affichage ne reçoit plus les mises à jour
lyonStation.setMeasurements(21, 82, 990, 50, 'SW');

// Avantages de cette approche:
// 1. Découplage - Les stations météo ne connaissent pas les détails des observateurs
// 2. Extensibilité - Facile d'ajouter de nouveaux types d'observateurs sans modifier les stations
// 3. Réutilisation - Les observateurs peuvent s'abonner à plusieurs stations
// 4. Flexibilité - Les observateurs peuvent modifier les seuils d'alerte sans affecter les stations
// 5. Dynamisme - Les observateurs peuvent s'abonner/désabonner à n'importe quel moment
