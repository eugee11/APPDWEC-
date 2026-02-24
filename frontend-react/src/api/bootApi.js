import axios from 'axios'

const resolvedApiBaseUrl =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) ||
  (typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:4000/api/v1/boots'
    : '/api/v1/boots')

const api = axios.create({
  baseURL: resolvedApiBaseUrl,
})

export const getBoots = (params) => api.get('/get/all', { params })
export const getBootById = (id) => api.get(`/get/${id}`)
export const createBoot = (payload) => api.post('/post', payload)
export const updateBoot = (id, payload) => api.put(`/update/${id}`, payload)
export const deleteBoot = (id) => api.delete(`/delete/${id}`)
