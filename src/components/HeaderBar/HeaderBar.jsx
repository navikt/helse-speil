import React from 'react'
import PropTypes from 'prop-types'
import navLogoSrc from './img/navlogo.svg'
import rettskildeneSrc from './img/rettskildene.svg'
import systemrutineSrc from './img/systemrutine.svg'
import navAnsattSrc from './img/navansatt.svg'
import './HeaderBar.css'
import ImageLink from '../ImageLink/ImageLink'

const HeaderBar = (props) => {
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
               {props.displayname}
            </div>
         </div>
      </header>
   )
}

HeaderBar.propTypes = {
   displayname: PropTypes.string
 }

export default HeaderBar
