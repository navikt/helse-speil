import React from 'react';
import Modal from 'nav-frontend-modal';
import PropTypes from 'prop-types';
import { Element, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { toKroner } from '../../../utils/locale';
import './DetaljerBoks.less';

Modal.setAppElement('#root');

const periodePropType = PropTypes.arrayOf(
    PropTypes.shape({
        utbetalingsperiode: PropTypes.string.isRequired,
        beløp: PropTypes.number.isRequired
    })
).isRequired;

const Detaljer = ({ items, label }) => {
    const sum = items.reduce((acc, periode) => acc + periode.beløp, 0);
    return (
        <>
            {items.map(item => (
                <div className="periode">
                    <Normaltekst>{item.utbetalingsperiode}</Normaltekst>
                    <Normaltekst>{toKroner(item.beløp)} kr</Normaltekst>
                </div>
            ))}
            <div className="periode sum-linje">
                <Element>{label}</Element>
                <Element>{toKroner(sum)} kr</Element>
            </div>
        </>
    );
};

Detaljer.propTypes = {
    items: periodePropType,
    label: PropTypes.string.isRequired
};

const DetaljerBoks = ({
    beregningsperioden,
    sammenligningsperiode,
    onClose
}) => {
    return (
        <Modal
            className="DetaljerBoks"
            isOpen={true}
            contentLabel="Innrapportert til A-Ordningen"
            onRequestClose={onClose}
        >
            <Undertittel>Innrapportert til A-Ordningen</Undertittel>
            <div className="periodeliste">
                <Detaljer
                    label="Beregningsperioden"
                    items={beregningsperioden}
                />
                <Detaljer
                    label="Sammenligningsgrunnlag"
                    items={sammenligningsperiode}
                />
            </div>
        </Modal>
    );
};

DetaljerBoks.propTypes = {
    beregningsperioden: periodePropType,
    sammenligningsperiode: periodePropType,
    onClose: PropTypes.func.isRequired
};

export default DetaljerBoks;
