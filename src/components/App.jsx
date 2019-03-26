import React from 'react'
import HeaderBar from './HeaderBar/HeaderBar'
import Applicant from './Applicant/Applicant'
import UserContext from '../state/User'
import './App.css'

export default class App extends React.Component {
   render() {
      return (
         <UserContext.Provider value={{ displayname: 'Ikke pålogget' }}>
            <div>
               <HeaderBar />
               <Applicant />
               <div className="main">main content</div>
            </div>
         </UserContext.Provider>
      )
   }
}
