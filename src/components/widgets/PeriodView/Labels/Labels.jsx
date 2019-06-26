import React from 'react';
import { Undertekst } from 'nav-frontend-typografi';
import { periodType } from '../types';
import './Labels.css';

const Labels = ({ periods }) => (
    <div className="PeriodView__labels">
        {periods.map((period, i) => (
            <Undertekst key={`period-label-${i}`}>{period.label}</Undertekst>
        ))}
    </div>
);

Labels.propTypes = periodType;

export default Labels;
