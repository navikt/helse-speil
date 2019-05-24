import React, { useState } from 'react'
import HeaderBar from './HeaderBar/HeaderBar'
import Search from './Search/Search'
import './App.css'
import 'reset-css'
import AuthContext from '../context/AuthContext'

const App = () => {

   const [authState, setAuthState] = useState({
      name: "Ikke Pålogget",
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
