import axios from "axios";

let baseURL ='https://openholidaysapi.org'

const api = axios.create({
    baseURL: baseURL,
})

export const COUNTRY_ENDPOINT = '/Countries';
export const PUBLIC_HOLIDAYS_ENDPOINT = '/PublicHolidays';

export default api