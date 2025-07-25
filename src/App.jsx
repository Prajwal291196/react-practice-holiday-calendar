import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'
import api, { COUNTRY_ENDPOINT, PUBLIC_HOLIDAYS_ENDPOINT } from './api'

function App() {
  const [selectedCountry, setSelectedCountry] = useState('Netherlands (the)')
  const [countryOptions, setCountryOptions] = useState([])

  useEffect(() => {
    console.log(`a`)
    const fetchOpenHolidays = async () => {
      try {
        const res = await api.get(COUNTRY_ENDPOINT)
        //const data = await response.json()
        console.log(res)
        console.log(res.data)

        const allCountyName = []

        res.data.forEach((country) => {
          country.name.forEach((item) => {
            allCountyName.push({
              text: item.text,
              language: item.language,
              isoCode: country.isoCode
            });
          });
        });
        console.log(`All country Names`, allCountyName)

        const unique = Array.from(
          new Map(
            allCountyName.map(item => {
              return [
                `${item.text}`, item,
              ]
            })
          ).values()
        ).sort((a, b) => a.text.localeCompare(b.text))
        setCountryOptions(unique)

      }
      catch (error) {
        console.error("Error fetching countries:", error);
      }
    }
    fetchOpenHolidays();
  }, [])
  console.log(`countryOptions`, countryOptions)

  // useEffect(() => {
  //   const fetchedCalendar = async () => {
  //     try {
  //       const res = api.get(PUBLIC_HOLIDAYS_ENDPOINT)
  //       console.log(`Fetchec Calendar`, res)
  //     }
  //     catch (error) {
  //       console.log(`Error Fetching calendar:`, error);
  //     }
  //   }
  //   fetchedCalendar();
  // }, [selectedCountry])

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value)
  }

  return (
    <>
      <h2>Country Selector</h2>
      <select name="select country" value={selectedCountry} onChange={handleCountryChange}>
        {
          countryOptions.map((option, index) => (
            <option key={index} value={option.text}>{option.text}</option>
          )
          )
        }
      </select>
    </>
  )
}

export default App
