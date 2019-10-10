import React from 'react';
import PropTypes from 'prop-types';
import { Normaltekst } from 'nav-frontend-typografi';
import { oppsummeringstekster } from '../../tekster';

const Uenigheter = ({ uenigheter }) => {
    return (
        <>
            <Normaltekst className="Innrapportering__category">Uenigheter</Normaltekst>
            {uenigheter.length === 0 && (
                <Normaltekst>{oppsummeringstekster('ingen_uenigheter')}</Normaltekst>
            )}
            {uenigheter.map((uenighet, i) => (
                <Normaltekst key={`uenighet-${i}`} className="Innrapportering__uenighet">
                    <span>{uenighet.label}:</span>
                    <span>{uenighet.value}</span>
                    {!uenighet.value && (
                        <span className="skjemaelement__feilmelding">
                            {oppsummeringstekster('oppgi_årsak')}
                        </span>
                    )}
                </Normaltekst>
            ))}
        </>
    );
};

Uenigheter.propTypes = {
    uenigheter: PropTypes.arrayOf(PropTypes.any)
};

export default Uenigheter;
