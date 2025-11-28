import axios from 'axios'

export const axiosPlain = axios.create({
    baseURL: '/',
    withCredentials: true,
    headers: { 'X-Requested-With': 'XMLHttpRequest' }
})
