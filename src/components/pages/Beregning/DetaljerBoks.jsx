import React from 'react';
import Lukknapp from 'nav-frontend-lukknapp';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import { toKronerOgØre } from '../../../utils/locale';
import './DetaljerBoks.less';

const DetaljerBoks = ({
    beregningsperioden,
    sammenligningsperiode,
    onClose
}) => {
    const totaltIBeregningsperioden = toKronerOgØre(
        beregningsperioden.reduce((acc, periode) => acc + periode.beløp, 0)
    );
    const totaltISammenligningsperioden = toKronerOgØre(
        sammenligningsperiode.reduce((acc, periode) => acc + periode.beløp, 0)
    );
    return (
        <div className="DetaljerBoks">
            <Lukknapp onClick={onClose} />
            <Element className="tittel">Innrapportert til A-Ordningen</Element>
            <div className="periodeliste">
                {beregningsperioden.map(periode => (
                    <div className="periode">
                        <Normaltekst>{periode.utbetalingsperiode}</Normaltekst>
                        <Normaltekst>{periode.beløp} kr</Normaltekst>
                    </div>
                ))}
                <div className="periode sum-linje">
                    <Element>Beregningsperioden</Element>
                    <Element>{totaltIBeregningsperioden} kr</Element>
                </div>
                {sammenligningsperiode.map(periode => (
                    <div className="periode">
                        <Normaltekst>{periode.utbetalingsperiode}</Normaltekst>
                        <Normaltekst>{periode.beløp} kr</Normaltekst>
                    </div>
                ))}
                <div className="periode">
                    <Element>Sammenligningsgrunnlag</Element>
                    <Element>{totaltISammenligningsperioden}</Element>
                </div>
            </div>
        </div>
    );
};

DetaljerBoks.propTypes = {
    onClose: PropTypes.func.isRequired,
    beregningsperioden: PropTypes.arrayOf(
        PropTypes.shape({
            utbetalingsperiode: PropTypes.string.isRequired,
            beløp: PropTypes.number.isRequired
        })
    ).isRequired,
    sammenligningsperiode: PropTypes.arrayOf(
        PropTypes.shape({
            utbetalingsperiode: PropTypes.string.isRequired,
            beløp: PropTypes.number.isRequired
        })
    ).isRequired
};

export default DetaljerBoks;
