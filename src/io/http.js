'use strict'

export const whoami = async () => {
   const response = await fetch("/me")
   if (response.status === 401) {
      return null;
   } else {
      const text = await response.text()
      return text
   }
}

export const behandlingerFor = async (aktorId) => {
   const response = await fetch(`/behandlinger/${aktorId}`)
   if (response.status !== 200) {
      return null;
   } else {
      const text = await response.text()
      return text
   }
}
