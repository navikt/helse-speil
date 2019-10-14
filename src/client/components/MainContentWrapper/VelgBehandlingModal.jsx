import Modal from 'nav-frontend-modal';
import React from 'react';
import PropTypes from 'prop-types';
import { Knapp } from 'nav-frontend-knapper';
import { toDate } from '../../utils/date';
import { Normaltekst, Element, Undertittel } from 'nav-frontend-typografi';
import './VelgBehandlingModal.less';

Modal.setAppElement('#root');

const VelgBehandlingModal = ({ onRequestClose, behandlinger, onSelectItem }) => (
    <Modal onRequestClose={onRequestClose} contentLabel="Velg behandling" isOpen={true}>
        <div className="VelgBehandlingModal">
            <Undertittel>Velg sak</Undertittel>
            <Normaltekst>Denne brukeren har flere saker. Velg den saken du vil se på.</Normaltekst>
            <div className="list-header">
                <Element>Søknad fom</Element>
                <Element>Søknad tom</Element>
            </div>
            <ul>
                {behandlinger.map(behandling => (
                    <li key={behandling.behandlingsId}>
                        <Normaltekst>{toDate(behandling.originalSøknad.fom)}</Normaltekst>
                        <Normaltekst>{toDate(behandling.originalSøknad.tom)}</Normaltekst>
                        <Knapp onClick={() => onSelectItem(behandling)}>Velg</Knapp>
                    </li>
                ))}
            </ul>
        </div>
    </Modal>
);

VelgBehandlingModal.propTypes = {
    behandlinger: PropTypes.arrayOf(PropTypes.any).isRequired,
    onSelectItem: PropTypes.func.isRequired,
    onRequestClose: PropTypes.func.isRequired
};

export default VelgBehandlingModal;
