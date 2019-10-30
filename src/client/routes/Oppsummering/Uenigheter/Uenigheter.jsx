import React, { useContext } from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import { oppsummeringstekster } from '../../../tekster';
import { InnrapporteringContext } from '../../../context/InnrapporteringContext';
import './Uenigheter.less';
import EditableUenighet from './EditableUenighet';

const Uenigheter = () => {
    const { uenigheter } = useContext(InnrapporteringContext);
    return (
        <span className="Uenigheter">
            <Normaltekst className="Uenigheter__label">Uenigheter</Normaltekst>
            {uenigheter.length === 0 && (
                <Normaltekst>{oppsummeringstekster('ingen_uenigheter')}</Normaltekst>
            )}
            <span className="Uenigheter__grid">
                {uenigheter.map(uenighet => (
                    <EditableUenighet key={uenighet.label + uenighet.value} uenighet={uenighet} />
                ))}
            </span>
        </span>
    );
};

export default Uenigheter;
