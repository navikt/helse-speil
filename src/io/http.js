export const behandlingerFor = async (aktorId) => {
   const response = await fetch(`/behandlinger/${aktorId}`)
   const json = await response.json()
   return json
}

export const whoami = async () => {
   console.log('about to fetch')
   const response = await fetch("/me")
   if (response.status === 401) {
      return null;
   } else {
      const text = await response.text()
      return text
   }
}
