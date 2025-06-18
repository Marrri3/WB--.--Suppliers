// src/api/endpoints/ordersendpoint.ts
const BASE_URL = 'http://localhost:3001/api'; 

export const ENDPOINTS = {
  shipments: {
    list: `${BASE_URL}/shipments`,
    detail: (id: number) => `${BASE_URL}/shipments/${id}`,
  },
  users: {
    register: `${BASE_URL}/auth/register`, //POST /auth/register
    login: `${BASE_URL}/auth/login`,     //POST /auth/login
    me: `${BASE_URL}/auth/me`,           //GET /auth/me
  },
};