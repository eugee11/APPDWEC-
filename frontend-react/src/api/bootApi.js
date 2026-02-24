import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:4000/api/v1/boots',
})

export const getBoots = (params) => api.get('/get/all', { params })
export const getBootById = (id) => api.get(`/get/${id}`)
export const createBoot = (payload) => api.post('/post', payload)
export const updateBoot = (id, payload) => api.put(`/update/${id}`, payload)
export const deleteBoot = (id) => api.delete(`/delete/${id}`)
