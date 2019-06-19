import React from 'react';
import PropTypes from 'prop-types';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';
import './Arbeidsforhold.css';

const Arbeidsforhold = ({ employer, start, end, percentage }) => (
    <div className="Arbeidsforhold">
        <Undertekst>{employer}</Undertekst>
        <Normaltekst className="Arbeidsforhold__period">
            {start} - {end}
        </Normaltekst>
        <Undertekst>{percentage}%</Undertekst>
    </div>
);

Arbeidsforhold.propTypes = {
    employer: PropTypes.string.isRequired,
    start: PropTypes.string.isRequired,
    end: PropTypes.string.isRequired,
    percentage: PropTypes.number.isRequired
};

export default Arbeidsforhold;
