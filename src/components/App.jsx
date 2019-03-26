import React from 'react'
import HeaderBar from './HeaderBar/HeaderBar'
import Applicant from './Applicant/Applicant'
import './App.css'

const App = () =>  {
   return (
      <div>
         <HeaderBar displayname="Ikke pålogget" />
         <Applicant phone="98765432" fnr="12345678910"/>
         <div className="main">main content</div>
      </div>
   )
}

export default App
