import React from 'react';
import Modal from 'nav-frontend-modal';
import PropTypes from 'prop-types';
import { Element, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { toKroner } from '../../../utils/locale';
import './SykepengegrunnlagModal.less';
import ListeSeparator from '../../widgets/ListeSeparator';

document && document.getElementById('#root') && Modal.setAppElement('#root');

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
                <Element>Beregningsperioden</Element>
                <Normaltekst className="periodeforklaring">
                    Inkluderer kun inntekter fra den ene arbeidsgiveren
                </Normaltekst>
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
                    <Element>Totalt i beregningsperioden</Element>
                    <Element>{toKroner(totaltIBeregningsperioden)} kr</Element>
                </div>
                <ListeSeparator type="dotted" />
                <Element>Sammenligningsgrunnlag</Element>
                <Normaltekst className="periodeforklaring">
                    Inkluderer alle inntekter, som ytelser
                </Normaltekst>
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
                    <Element>Totalt i sammenligningsgrunnlaget</Element>
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
