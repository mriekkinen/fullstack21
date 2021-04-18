import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Weather = ({ weather }) => {
  const curr = weather.current
  return (
    <div>
      <div>
        <b>temperature:</b> {curr.temperature} Celcius
      </div>
      <div>
        {curr.weather_icons.map(iconUrl =>
          <img
            key={iconUrl}
            src={iconUrl}
            width='50'
            alt='weather icon' />
        )}
      </div>
      <div>
        <b>wind:</b> {curr.wind_speed} mph direction {curr.wind_dir}
      </div>
    </div>
  )
}

const CountriesList = ({ filteredCountries, setFilter }) => (
  <div>
    {filteredCountries.map(country =>
      <div key={country.name}>
        {country.name}
        <button onClick={() => setFilter(country.name)}>
          show
        </button>
      </div>
    )}
  </div>
)

const CountryInfo = ({ country, weather }) => (
  <div>
    <h2>{country.name}</h2>
    <div>
      <div>capital {country.capital}</div>
      <div>population {country.population}</div>
      <h3>languages</h3>
      <ul>
        {country.languages.map(language =>
          <li key={language.name}>
            {language.name}
          </li>
        )}
      </ul>
      <img
        src={country.flag}
        width='100'
        alt='national flag' />
      <h3>Weather in {country.capital}</h3>
      {weather.current &&
        <Weather weather={weather} />
      }
    </div>
  </div>
)

const Countries = ({ filteredCountries, setFilter, weather }) => {
  if (filteredCountries.length > 10) {
    return <div>Too many matches, specify another filter</div>
  }

  if (filteredCountries.length > 1) {
    return (
      <CountriesList
        filteredCountries={filteredCountries}
        setFilter={setFilter} />
    )
  }

  if (filteredCountries.length === 1) {
    return (
      <CountryInfo
        country={filteredCountries[0]}
        weather={weather} />
    )
  }

  return null
}

const App = () => {
  const [ countries, setCountries ] = useState([])
  const [ filter, setFilter ] = useState('')
  const [ filteredCountries, setFilteredCountries ] = useState([])
  const [ weather, setWeather ] = useState({})

  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  useEffect(() => {
    const filtered = countries.filter(country =>
      country.name.toLowerCase().includes(filter.toLowerCase()))
    setFilteredCountries(filtered)

    if (filtered.length === 1) {
      const params = {
        access_key: process.env.REACT_APP_API_KEY,
        query: filtered[0].capital,
        units: 'm'
      }
      axios
        .get('http://api.weatherstack.com/current', { params })
        .then(response => {
          setWeather(response.data)
        })
    }
  }, [countries, filter])

  const handleFilterChange = e => {
    setFilter(e.target.value)
  }

  return (
    <div>
      <div>
        find countries:
        <input
          value={filter}
          onChange={handleFilterChange} />
      </div>
      <Countries
        filteredCountries={filteredCountries}
        setFilter={setFilter}
        weather={weather} />
    </div>
  )
}

export default App
