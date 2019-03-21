import React from 'react';
import fnr from './img/id.png';
import phone from './img/phone.png';
import LabelWithIcon from '../LabelWithIcon/LabelWithIcon';
import './Applicant.css';

export default class Applicant extends React.Component {
   render() {
      return (
         <div className="applicant">
            <h3 className="personName">Søker Søkersen</h3>
            <div className="labels">
               <LabelWithIcon iconSrc={phone} label="98765432" />
               <LabelWithIcon iconSrc={fnr} label="12345678910" />
            </div>
         </div>
      );
   }
}
