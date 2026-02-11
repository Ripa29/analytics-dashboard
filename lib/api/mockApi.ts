import axios from 'axios'


const API_BASE = 'http://localhost:3001'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000, // 10 seconds,
})

export interface ApiResponse<T> {
  data: T
  timestamp: string
}

export const mockApi = {
  async getStats() {
    const { data } = await api.get('/stats')
    return data
  },

  async getRevenue() {
    const { data } = await api.get('/revenue')
    return data
  },

  async getOrders() {
    const { data } = await api.get('/orders')
    return data
  },

  async getUsers() {
    const { data } = await api.get('/users')
    return data
  },

  async getTraffic() {
    const { data } = await api.get('/traffic')
    return data
  },

  async getLogs() {
    const { data } = await api.get('/logs')
    return data
  }
}

export default mockApi