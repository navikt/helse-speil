'use strict'

export const whoami = async () => {
   const response = await fetch("/me")
   return response.status === 401 ? null : await response.text()
}

export const behandlingerFor = async (aktorId) => {
   const response = await fetch(`/behandlinger/${aktorId}`)
   return response.status !== 200 ? null : await response.json()
}
