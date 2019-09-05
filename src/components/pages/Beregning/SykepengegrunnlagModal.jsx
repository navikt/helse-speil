import React from 'react';
import Modal from 'nav-frontend-modal';
import PropTypes from 'prop-types';
import { Element, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { toKroner } from '../../../utils/locale';
import './SykepengegrunnlagModal.less';

Modal.setAppElement('#root');

const SykepengegrunnlagModal = ({
    beregningsperioden,
    sammenligningsperioden,
    totaltIBeregningsperioden,
    sammenligningsgrunnlag,
    onClose
}) => {
    return (
        <Modal
            className="SykepengegrunnlagModal"
            isOpen={true}
            contentLabel="Innrapportert til A-Ordningen"
            onRequestClose={onClose}
        >
            <Undertittel>Innrapportert til A-Ordningen</Undertittel>
            <div className="periodeliste">
                {beregningsperioden.map(periode => (
                    <div
                        className="periode"
                        key={`beregningsperiode-${periode.utbetalingsperiode}-${periode.beløp}`}
                    >
                        <Normaltekst>{periode.utbetalingsperiode}</Normaltekst>
                        <Normaltekst>{toKroner(periode.beløp)} kr</Normaltekst>
                    </div>
                ))}
                <div className="periode sum-linje">
                    <Element>Beregningsperioden</Element>
                    <Element>{toKroner(totaltIBeregningsperioden)} kr</Element>
                </div>
                {sammenligningsperioden.map(periode => (
                    <div
                        className="periode"
                        key={`sammenligningsperiode-${periode.utbetalingsperiode}-${periode.beløp}`}
                    >
                        <Normaltekst>{periode.utbetalingsperiode}</Normaltekst>
                        <Normaltekst>{toKroner(periode.beløp)} kr</Normaltekst>
                    </div>
                ))}
                <div className="periode sum-linje">
                    <Element>Sammenligningsgrunnlag</Element>
                    <Element>{toKroner(sammenligningsgrunnlag)} kr</Element>
                </div>
            </div>
        </Modal>
    );
};

SykepengegrunnlagModal.propTypes = {
    sammenligningsperioden: PropTypes.arrayOf(PropTypes.any).isRequired,
    totaltIBeregningsperioden: PropTypes.number.isRequired,
    beregningsperioden: PropTypes.arrayOf(PropTypes.any).isRequired,
    sammenligningsgrunnlag: PropTypes.number.isRequired,
    onClose: PropTypes.func.isRequired
};

export default SykepengegrunnlagModal;
