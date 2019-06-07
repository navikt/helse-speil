'use strict'

const baseUrl = process.env.NODE_ENV === 'development'
   ? 'http://localhost:3000'
   : '';

export const whoami = async () => {
   const response = await fetch(baseUrl + "/whoami")
   return response.status === 401 ? null : await response.json()
}

export const behandlingerFor = async (aktorId) => {
   const response = await fetch(baseUrl + `/behandlinger/${aktorId}`)
   return response.status !== 200 ? null : await response.json()
}
