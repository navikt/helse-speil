import React, { useState, useEffect } from 'react'
import HeaderBar from './HeaderBar/HeaderBar'
import Search from './Search/Search'
import { whoami } from '../io/http'
import './App.css'
import 'reset-css'
import AuthContext from '../context/AuthContext'

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
            <Search />
            <div>main content</div>
      </AuthContext.Provider>
   )
}

export default App
