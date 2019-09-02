import React from 'react';
import Modal from 'nav-frontend-modal';
import PropTypes from 'prop-types';
import { Element, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { toKroner } from '../../../utils/locale';
import './SykepengegrunnlagModal.less';

Modal.setAppElement('#root');

const SykepengegrunnlagModal = ({
    perioder,
    beregningsperioden,
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
                {perioder.slice(0, 3).map(item => (
                    <div className="periode" key={item.join('-')}>
                        <Normaltekst>{item[0]}</Normaltekst>
                        <Normaltekst>{toKroner(item[1])} kr</Normaltekst>
                    </div>
                ))}
                <div className="periode sum-linje">
                    <Element>Beregningsperioden</Element>
                    <Element>{toKroner(beregningsperioden)} kr</Element>
                </div>
                {perioder.slice(3).map(item => (
                    <div className="periode" key={item.join('-')}>
                        <Normaltekst>{item[0]}</Normaltekst>
                        <Normaltekst>{toKroner(item[1])} kr</Normaltekst>
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
    perioder: PropTypes.arrayOf(PropTypes.any).isRequired,
    beregningsperioden: PropTypes.number.isRequired,
    sammenligningsgrunnlag: PropTypes.number.isRequired,
    onClose: PropTypes.func.isRequired
};

export default SykepengegrunnlagModal;
