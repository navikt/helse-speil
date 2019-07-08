import React from 'react';
import { Undertekst } from 'nav-frontend-typografi';
import { periodType } from '../types';
import './Radnavn.css';

const Radnavn = ({ periods }) => (
    <div className="Tidslinje__radnavn">
        {periods.map((period, i) => (
            <Undertekst key={`period-label-${i}`}>{period.label}</Undertekst>
        ))}
    </div>
);

Radnavn.propTypes = periodType;

export default Radnavn;
