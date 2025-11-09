import { describeWeatherCode, fetchWeatherBundle } from "@/lib/weather";

function formatHour(timestamp: string) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("pl-PL", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(timestamp: string) {
  const date = new Date(timestamp + "T00:00:00");
  return date.toLocaleDateString("pl-PL", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function cardinalFromDegrees(degrees: number) {
  const directions = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];
  const index = Math.round((degrees % 360) / 22.5) % 16;
  return directions[index];
}

export default async function Page() {
  const weather = await fetchWeatherBundle();

  const currentObservation = new Date(weather.current.observationTime);
  const observationTime = currentObservation.toLocaleString("pl-PL", {
    hour: "2-digit",
    minute: "2-digit",
    day: "numeric",
    month: "long",
  });

  return (
    <main className="app-container">
      <header className="header">
        <div className="chips">
          <span className="chip">
            {weather.location.name}, {weather.location.country}
          </span>
          <span className="chip">
            współrzędne: {weather.location.latitude.toFixed(2)}°
            {weather.location.latitude >= 0 ? "N" : "S"},{" "}
            {weather.location.longitude.toFixed(2)}°
            {weather.location.longitude >= 0 ? "E" : "W"}
          </span>
          <span className="chip">
            aktualizacja: {new Date(weather.generatedAt).toLocaleString("pl-PL")}
          </span>
        </div>
        <h1 className="header-title">Pogoda w Przedwojowie</h1>
        <p className="header-subtitle">
          Prognoza na podstawie danych z Open-Meteo: aktualne warunki, najbliższe
          godziny oraz tydzień do przodu.
        </p>
      </header>

      <section className="section current-weather">
        <div>
          <p className="header-subtitle">Teraz</p>
          <p className="current-temp">
            {Math.round(weather.current.temperature)}°C
          </p>
          <p>{describeWeatherCode(weather.current.weatherCode)}</p>
        </div>
        <div className="current-meta">
          <div className="current-meta-item">
            <span className="meta-icon">🌬</span>
            <span>
              Wiatr: {Math.round(weather.current.windSpeed)} km/h (
              {cardinalFromDegrees(weather.current.windDirection)})
            </span>
          </div>
          <div className="current-meta-item">
            <span className="meta-icon">🕒</span>
            <span>Odczyt z godz. {observationTime}</span>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Nadchodzące godziny</h2>
        <p className="header-subtitle" style={{ marginTop: "0.5rem" }}>
          Prognoza na kolejne 12 godzin
        </p>
        <div className="forecast-grid" style={{ marginTop: "1.25rem" }}>
          {weather.hourly.map((hour) => (
            <article key={hour.time} className="forecast-card">
              <span className="forecast-day">{formatHour(hour.time)}</span>
              <span className="forecast-temp">
                {Math.round(hour.temperature)}°C
              </span>
              <div className="forecast-details">
                <span>{describeWeatherCode(hour.weatherCode)}</span>
                {hour.precipitationProbability !== null ? (
                  <span>
                    Szansa opadów: {hour.precipitationProbability.toFixed(0)}%
                  </span>
                ) : (
                  <span>Brak danych o opadach</span>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Prognoza na 7 dni</h2>
        <p className="header-subtitle" style={{ marginTop: "0.5rem" }}>
          Dzienne maksimum i minimum
        </p>
        <div className="forecast-grid" style={{ marginTop: "1.25rem" }}>
          {weather.daily.map((day) => (
            <article key={day.date} className="forecast-card">
              <span className="forecast-day">{formatDate(day.date)}</span>
              <span className="forecast-temp">
                {Math.round(day.maxTemp)}° / {Math.round(day.minTemp)}°C
              </span>
              <div className="forecast-details">
                <span>{describeWeatherCode(day.weatherCode)}</span>
                {day.precipitationProbability !== null ? (
                  <span>
                    Szansa opadów: {day.precipitationProbability.toFixed(0)}%
                  </span>
                ) : (
                  <span>Brak danych o opadach</span>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="footer">
        <span>
          Dane pogodowe:{" "}
          <a href="https://open-meteo.com" target="_blank" rel="noreferrer">
            Open-Meteo
          </a>
        </span>
        <span>
          Aplikacja wygenerowana {new Date(weather.generatedAt).toLocaleString(
            "pl-PL",
          )}
        </span>
      </footer>
    </main>
  );
}
