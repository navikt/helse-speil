const behandlingerFor = (aktorId) => {
   return fetch(`${process.env.API_URL}/${aktorId}`)
      .then(response => {
         if (!response.ok) {
            throw new Error(`Couldn't retrieve data, got ${response.status} for ${aktorId}`)
         }
         return response.json()
      })
}

export default behandlingerFor