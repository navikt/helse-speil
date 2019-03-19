import React from 'react';
import PropTypes from 'prop-types'
import './HeaderBar.css';
import navLogoSrc from './img/navlogo.svg';
import rettskildeneSrc from './img/rettskildene.svg';
import systemrutineSrc from './img/systemrutine.svg';
import navAnsattSrc from './img/navansatt.svg';

export default class HeaderBar extends React.Component {

   render() {
      return (
         <header className='topbar'>
            <div className='leftElements'>
               <div className='imgitem'>
                  <a href='/'>
                     <img src={navLogoSrc} className='header_img' />
                  </a>
               </div>
               <div className='header_divider' />
               <div className='header_title item'>
                  <h2>Sykepenger</h2>
               </div>
            </div>

            <div className='rightElements'>
               <div className='imgitem'>
                  <a href='https://www.nav.no'>
                     <img src={systemrutineSrc} className='header_img' />
                  </a>
               </div>
               <div className='imgitem'>
                  <a href='https://www.nav.no'>
                     <img src={rettskildeneSrc} className='header_img' />
                  </a>
               </div>
               <div className='header_divider' />
               <div className='imgitem'>
                  <img src={navAnsattSrc} className='header_img' />
               </div>
               <div id='bruker' className='brukernavn'>
                  {this.props.displayname}
               </div>
            </div>
         </header>
      );
   }
}

HeaderBar.propTypes = {
   displayname: PropTypes.string
}

HeaderBar.defaultProps = {
   displayname: "Ukjent Ukjentsen"
}
