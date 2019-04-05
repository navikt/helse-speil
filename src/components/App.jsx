import React, { useState } from 'react'
import HeaderBar from './HeaderBar/HeaderBar'
import Applicant from './Applicant/Applicant'
import Search from './Search/Search'
import './App.css'
import 'reset-css'
import Summary from './Summary/Summary'
import AuthContext from '../context/AuthContext'
import ApplicantContext from '../context/ApplicantContext'
import SingleSelectionList from './SingleSelectionList/SingleSelectionList'

import ResultatOk from '../../tests/testdata/ResultatOk' // MOCK data

const App = () => {

   const [authState, setAuthState] = useState({
      name: "Ikke Pålogget",
   })

   const [appliantState, setAppliantState] = useState({
      name: "Søker Søkolainen",
      fnr: "12345678910",
      phone: "98765432"
   })

   return (
      <AuthContext.Provider value={{state: authState, setState: setAuthState}}>
            <HeaderBar />
            <Search />
            <ApplicantContext.Provider value={{state: appliantState, setState: setAppliantState}}>
            <Applicant />
            <SingleSelectionList heading="&#x2696; VILKÅR" 
               items={["Medlemskap", "Opptjening", "Inntekt", "Søknadsfrist", "Andre ytelser"]} />
            <SingleSelectionList heading="&#x1f4b0; BEREGNING" 
               items={["Grunnlag", "Antall dager", "Sykemeldingsgrad"]} />
            <Summary result={ResultatOk} />
         </ApplicantContext.Provider>
      </AuthContext.Provider>
   )
}

export default App
