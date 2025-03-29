// Système existant - API européenne de prévisions météo (inchangé)
class MeteoEuropeForecast {
  constructor(city) {
    this.city = city;
  }

  getTemperatureCelsius() {
    // Simulation de récupération de données depuis une API externe
    return 22; // 22°C
  }

  getHumidityPercentage() {
    return 60; // 60%
  }

  getPressureHectoPascal() {
    return 1013; // 1013 hPa
  }
}

// Interface attendue par notre application
class WeatherForecast {
  getTemperatureFahrenheit() {
    throw new Error('Cette méthode doit être implémentée');
  }

  getHumidity() {
    throw new Error('Cette méthode doit être implémentée');
  }

  getPressureInchesOfMercury() {
    throw new Error('Cette méthode doit être implémentée');
  }
}

// Adaptateur qui convertit l'API européenne en l'interface attendue
class EuropeanWeatherAdapter extends WeatherForecast {
  constructor(europeanForecast) {
    super();
    this.europeanForecast = europeanForecast;
  }

  getTemperatureFahrenheit() {
    // Conversion de Celsius en Fahrenheit
    const celsius = this.europeanForecast.getTemperatureCelsius();
    return (celsius * 9) / 5 + 32;
  }

  getHumidity() {
    // Pas besoin de conversion pour l'humidité
    return this.europeanForecast.getHumidityPercentage();
  }

  getPressureInchesOfMercury() {
    // Conversion de hPa à inHg (pouces de mercure)
    const hPa = this.europeanForecast.getPressureHectoPascal();
    return hPa * 0.02953; // Facteur de conversion approximatif
  }
}

// Application qui utilise l'interface WeatherForecast (inchangée)
class WeatherApp {
  constructor() {
    this.minAcceptableTemp = 60; // 60°F
    this.maxAcceptableTemp = 90; // 90°F
  }

  displayTemperature(tempFahrenheit) {
    console.log(`La température actuelle est de ${tempFahrenheit}°F`);
  }

  isTemperatureInRange(tempFahrenheit) {
    return (
      tempFahrenheit >= this.minAcceptableTemp &&
      tempFahrenheit <= this.maxAcceptableTemp
    );
  }

  displayWeatherStatus(tempFahrenheit, humidity) {
    if (this.isTemperatureInRange(tempFahrenheit)) {
      console.log('La température est dans la plage acceptable.');
    } else {
      console.log('Attention: Température hors plage!');
    }
    console.log(`Humidité: ${humidity}%`);
  }

  // Nouvelle méthode qui utilise directement l'interface WeatherForecast
  displayWeather(weatherForecast) {
    const temp = weatherForecast.getTemperatureFahrenheit();
    const humidity = weatherForecast.getHumidity();
    const pressure = weatherForecast.getPressureInchesOfMercury();

    this.displayTemperature(temp);
    this.displayWeatherStatus(temp, humidity);
    console.log(`Pression atmosphérique: ${pressure.toFixed(2)} inHg`);
  }
}

// Utilisation avec l'Adapter Pattern
const europeanForecast = new MeteoEuropeForecast('Paris');
const weatherAdapter = new EuropeanWeatherAdapter(europeanForecast);
const app = new WeatherApp();

// Utilisation simple sans conversions manuelles
app.displayWeather(weatherAdapter);

// On pourrait facilement ajouter d'autres adaptateurs pour d'autres sources de données
// Par exemple: class USWeatherAdapter, class JapaneseWeatherAdapter, etc.
