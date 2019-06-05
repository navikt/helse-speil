import React, { useState, useEffect } from 'react'
import HeaderBar from '../HeaderBar/HeaderBar'
import MainContentWrapper from '../MainContentWrapper/MainContentWrapper'
import { whoami } from '../../io/http'
import AuthContext from '../../context/AuthContext'
import './App.css'
import 'reset-css'

const App = () => {

   const [authState, setAuthState] = useState({})

   useEffect(() => {
      if (!authState.name) {
         try {
            whoami().then((data) => {
               if (data) {
                  setAuthState({name: data})
               } else {
                  window.location.assign('/login')
               }
            })    
         } catch (err) {
            console.log(err)
         }
      }
   })

   return (
      <AuthContext.Provider value={{state: authState, setState: setAuthState}}>
            <HeaderBar />
            <MainContentWrapper />
      </AuthContext.Provider>
   )
}

export default App
