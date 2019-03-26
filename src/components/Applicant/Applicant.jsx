import React from 'react'
import PropTypes from 'prop-types'
import fnr from './img/id.png'
import phone from './img/phone.png'
import LabelWithIcon from '../LabelWithIcon/LabelWithIcon'
import './Applicant.css'

const Applicant = (props) => {
   return (
      <div className="applicant">
         <h3 className="personName">Søker Søkersen</h3>
         <div className="labels">
            <LabelWithIcon iconSrc={phone} label={props.phone} />
            <LabelWithIcon iconSrc={fnr} label={props.fnr} />
         </div>
      </div>
   )
}

Applicant.propTypes = {
   phone: PropTypes.string,
   fnr: PropTypes.string
}

export default Applicant