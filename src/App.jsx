import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'
import api, { COUNTRY_ENDPOINT, PUBLIC_HOLIDAYS_ENDPOINT } from './api'

function App() {
  const [selectedCountry, setSelectedCountry] = useState({isoCode:'NL',language:'NL'})
  const [countryOptions, setCountryOptions] = useState([])
  const [publicHolidays, setPublicHolidays] = useState([])


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
                `${item.text}-${item.language}`, item,
              ]
            })
          ).values()
        ).sort((a, b) => a.text.localeCompare(b.text))
        console.log(`unoique`, unique)
        setCountryOptions(unique)

      }
      catch (error) {
        console.error("Error fetching countries:", error);
      }
    }
    fetchOpenHolidays();
    fetchedCalendar('NL', 'NL')
  }, [])
  console.log(`countryOptions`, countryOptions)


  const fetchedCalendar = async (isoCode, language) => {
    try {
      const res = await api.get(`${PUBLIC_HOLIDAYS_ENDPOINT}?countryIsoCode=${isoCode}&validFrom=2023-01-01&validTo=2023-12-31&languageIsoCode=${language}`)
      console.log(`Fetchec Calendar`, res.data)

      const holidaysFetched = []

      res.data.forEach((item) => {
        item.name.forEach((holiday) => {
          holidaysFetched.push({
            language: holiday.language,
            holiday: holiday.text,
            startDate: item.startDate,
            endDate: item.endDate,
            id: item.id
          })
        })
      })

      console.log('holidaysFetched', holidaysFetched)
      setPublicHolidays(holidaysFetched)

    }
    catch (error) {
      console.log(`Error Fetching calendar:`, error);
    }
  }
  console.log('publicHolidays', publicHolidays)
  const handleCountryChange = (e) => {
    const [selectedIsoCode, selectedLanguage] = e.target.value.split('-');
    setSelectedCountry({ isoCode: selectedIsoCode, language: selectedLanguage })
    fetchedCalendar(selectedIsoCode, selectedLanguage)
  }


  return (
    <>
      <h2>Country Selector</h2>
      <select name="select country" value={`${selectedCountry.isoCode}-${selectedCountry.language}`} onChange={handleCountryChange}>
        {
          countryOptions.map((option, index) => (
            <option key={index} value={`${option.isoCode}-${option.language}`}>{option.text} ({option.language})</option>
          )
          )
        }
      </select>
      <br />
      <br />
      <h3>Public Holidays</h3>
      {publicHolidays.map((option) => (
        <div key={option.id}>
          <span>{option.startDate}</span> - <span>{option.holiday}</span> - <span>{option.endDate}</span>
        </div>)
      )
      }


    </>
  )
}

export default App
