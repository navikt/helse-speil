import React from 'react'
import './Applicant.css'
import fnr from './img/id.png'
import phone from './img/phone.png'

export default class Applicant extends React.Component {
   render() {
      return (
         <div className='applicant'>
            <h3 className='personName'>Søker Søkersen</h3>
            <div className='labels'>
               <div className='labelWithIcon'><img className='icon' src={phone} /><span className='label'>98765432</span></div>
               <div className='labelWithIcon'><img className='icon' src={fnr} /><span className='label'>12345678910</span></div>
            </div>
         </div>
      )
   }
}
