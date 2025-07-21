import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'

function App() {

  useEffect(() => {
    console.log(`a`)
    const fetchOpenHolidays = async () => {
      const response = await axios.get('https://openholidaysapi.org/Countries')
      //const data = await response.json()
      console.log(response.data)
    }
    fetchOpenHolidays();
  }, [])


  return (
    <>

    </>
  )
}

export default App
