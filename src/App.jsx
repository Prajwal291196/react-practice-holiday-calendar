import { useEffect, useState, useCallback } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'
import api, { COUNTRY_ENDPOINT, PUBLIC_HOLIDAYS_ENDPOINT } from './api'
import { ModuleRegistry } from 'ag-grid-community';
import { ClientSideRowModelModule } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
ModuleRegistry.registerModules([ClientSideRowModelModule]);
import {
  Container,
  Typography,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
  Paper,
} from '@mui/material';


function App() {
  const [selectedCountry, setSelectedCountry] = useState({ isoCode: 'NL', language: 'NL' })
  const [countryOptions, setCountryOptions] = useState([])
  const [publicHolidays, setPublicHolidays] = useState([])
  const [columnDefs] = useState([
    { headerName: 'Holiday', field: 'holiday', flex: 1 },
    { headerName: 'Language', field: 'language', flex: 1 },
    { headerName: 'Start Date', field: 'startDate', flex: 1, valueFormatter: (params) => formatDate(params.value), },
    { headerName: 'End Date', field: 'endDate', flex: 1, valueFormatter: (params) => formatDate(params.value), },
  ]);

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).replace(/ /g, ' - '); // replaces spaces with dashes
  };

  useEffect(() => {
    console.log(`a`)
    const fetchOpenHolidays = async () => {
      try {
        const res = await api.get(COUNTRY_ENDPOINT)
        //const data = await response.json()
        console.log(res)
        console.log(res.data)

        const allCountryName = []

        res.data.forEach((country) => {
          country.name.forEach((item) => {
            allCountryName.push({
              text: item.text,
              language: item.language,
              isoCode: country.isoCode
            });
          });
        });
        console.log(`All country Names`, allCountryName)

        const unique = Array.from(
          new Map(
            allCountryName.map(item => {
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
    fetchedCalendar(selectedCountry.isoCode, selectedCountry.language)
  }, [])
  console.log(`countryOptions`, countryOptions)


  const fetchedCalendar = useCallback(async (isoCode, language) => {
    try {
      const currentYear = new Date().getFullYear();
      const validFrom = `${currentYear}-01-01`;
      const validTo = `${currentYear}-12-31`;

      const res = await api.get(`${PUBLIC_HOLIDAYS_ENDPOINT}?countryIsoCode=${isoCode}&validFrom=${validFrom}&validTo=${validTo}&languageIsoCode=${language}`)
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
  }, [])

  console.log('publicHolidays', publicHolidays)
  const handleCountryChange = (e) => {
    const [selectedIsoCode, selectedLanguage] = e.target.value.split('-');
    setSelectedCountry({ isoCode: selectedIsoCode, language: selectedLanguage })
    fetchedCalendar(selectedIsoCode, selectedLanguage)
  }


  return (
    <Container maxWidth="lg" sx={{
      backgroundColor: '#f5f5f5', // light gray or choose any other color
      padding: 3,                // spacing inside the container
      borderRadius: 2,
    }}>
      <Typography variant="h4" gutterBottom>
        Country Holiday Calendar
      </Typography>
      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel id="country-select-label">Select Country</InputLabel>
          <Select
            labelId="country-select-label"
            id="country-select"
            value={`${selectedCountry.isoCode}-${selectedCountry.language}`}
            label="Select Country"
            onChange={handleCountryChange}
          >
            {
              countryOptions.map((option, index) => (
                <MenuItem key={index} value={`${option.isoCode}-${option.language}`}>{option.text} ({option.language})</MenuItem>
              ))
            }
          </Select>
        </FormControl>
      </Box>
      <Box
        sx={{
          width: '100%',         // full width of the page or container
          overflowX: 'auto',     // optional: allows horizontal scroll if needed
        }}
      >
        <Typography variant="h6" gutterBottom>
          Public Holidays
        </Typography>
        <Paper elevation={3} sx={{ p: 2 }}>
          <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
            <AgGridReact
              rowData={publicHolidays}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              getRowId={(params) => params.data.id}
              rowModelType="clientSide"
              pagination={true}
              paginationPageSize={5}
              domLayout="autoHeight"
              suppressCellFocus={true}
            />
          </div>
        </Paper>
      </Box>
      {/* {publicHolidays.map((option) => (
        <div key={option.id}>
          <span>{option.startDate}</span> - <span>{option.holiday}</span> - <span>{option.endDate}</span>
        </div>)
      )
      } */}


    </Container>
  )
}

export default App
