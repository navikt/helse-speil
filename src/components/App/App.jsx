import React, { useState, useEffect } from 'react'
import HeaderBar from '../HeaderBar/HeaderBar'
import MainContentWrapper from '../MainContentWrapper/MainContentWrapper'
import { whoami } from '../../io/http'
import AuthContext from '../../context/AuthContext'
import BehandlingerContext from '../../context/BehandlingerContext'
import './App.css'
import 'reset-css'

const App = () => {

   const [authState, setAuthState] = useState({})
   const [behandlinger, setBehandlinger] = useState({behandlinger: []})

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
         <BehandlingerContext.Provider value={{state: behandlinger, setBehandlinger: setBehandlinger}}>
            <HeaderBar />
            <MainContentWrapper />
         </BehandlingerContext.Provider>
      </AuthContext.Provider>
   )
}

export default App
