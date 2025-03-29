// Système existant - API européenne de prévisions météo
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

// Nouvelle application qui attend les températures en Fahrenheit
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
}

// Utilisation (problématique - incompatibilité d'interfaces)
const meteo = new MeteoEuropeForecast('Paris');
const app = new WeatherApp();

// Conversion manuelle (difficile à maintenir et à réutiliser)
const celsiusTemp = meteo.getTemperatureCelsius();
const fahrenheitTemp = (celsiusTemp * 9) / 5 + 32;

app.displayTemperature(fahrenheitTemp);
app.displayWeatherStatus(fahrenheitTemp, meteo.getHumidityPercentage());

// Problème: à chaque fois que nous voulons utiliser l'API européenne, nous devons
// faire la conversion manuellement, ce qui viole le principe DRY (Don't Repeat Yourself)
