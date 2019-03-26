import React from 'react'
import HeaderBar from './HeaderBar/HeaderBar'
import Applicant from './Applicant/Applicant'
import Search from './Search/Search'
import './App.css'
import 'reset-css'

const App = () =>  {
   return (
      <div>
         <HeaderBar displayname="Ikke pålogget" />
         <Search />
         <Applicant phone="98765432" fnr="12345678910"/>
         <div className="main">main content</div>
      </div>
   )
}

export default App
