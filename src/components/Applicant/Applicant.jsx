import React, { useContext } from 'react'
import fnr from './img/id.png'
import phone from './img/phone.png'
import LabelWithIcon from '../LabelWithIcon/LabelWithIcon'
import ApplicantContext from '../../context/ApplicantContext'
import './Applicant.css'

const Applicant = () => {
   const applicantCtx = useContext(ApplicantContext)
   
   return (
      <div className="applicant">
         <h3 className="personName">{applicantCtx.state.name}</h3>
         <div className="labels">
            <LabelWithIcon iconSrc={phone} label={applicantCtx.state.phone} />
            <LabelWithIcon iconSrc={fnr} label={applicantCtx.state.fnr} />
         </div>
      </div>
   )
}

export default Applicant