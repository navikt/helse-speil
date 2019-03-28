import React from 'react'
import HeaderBar from './HeaderBar/HeaderBar'
import Applicant from './Applicant/Applicant'
import Search from './Search/Search'
import './App.css'
import 'reset-css'
import Summary from "./Summary/Summary";

import ResultatOk from '../../tests/testdata/ResultatOk'; // MOCK data

const App = () =>  {
   return (
      <div>
         <HeaderBar displayname="Ikke pålogget" />
         <Search />
         <Applicant phone="98765432" fnr="12345678910"/>
         <div className="main">main content</div>
         <Summary result={ResultatOk}/>
      </div>
   )
}

export default App
