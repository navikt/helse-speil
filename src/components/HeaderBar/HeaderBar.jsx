import React, { useContext } from 'react'
import navLogoSrc from './img/navlogo.svg'
import rettskildeneSrc from './img/rettskildene.svg'
import systemrutineSrc from './img/systemrutine.svg'
import navAnsattSrc from './img/navansatt.svg'
import ImageLink from '../ImageLink/ImageLink'
import AuthContext from '../../context/AuthContext'
import './HeaderBar.css'

const HeaderBar = () => {
   const authCtx = useContext(AuthContext)

   return (
      <header className="topbar">
         <div className="leftElements">
            <ImageLink
               ariaLabel="Test Img"
               imgSrc={navLogoSrc.toString()}
               href="/"
            />
            <div className="header_divider" />
            <div className="header_title item">
               <h2>Sykepenger</h2>
            </div>
         </div>

         <div className="rightElements">
            <ImageLink
               ariaLabel="Systemrutine"
               imgSrc={systemrutineSrc.toString()}
               href="https://www.nav.no"
            />
            <ImageLink
               ariaLabel="Rettskildene"
               imgSrc={rettskildeneSrc.toString()}
               href="https://www.nav.no"
            />
            <div className="header_divider" />
            <ImageLink
               ariaLabel="Saksbehandler"
               imgSrc={navAnsattSrc.toString()}
               href="https://www.nav.no"
            />
            <div id="bruker" className="brukernavn">
               { (authCtx.state && authCtx.state.name)  ? authCtx.state.name : 'Ikke Pålogget' }
            </div>
         </div>
      </header>
   )
}

export default HeaderBar
