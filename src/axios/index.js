import axios from 'axios'

const instance = axios.create({
  baseURL: '/api',
  timeout: 0
})

export default instance
