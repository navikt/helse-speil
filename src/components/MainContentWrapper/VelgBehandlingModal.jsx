import Modal from 'nav-frontend-modal';
import { Normaltekst, Element, Undertittel } from 'nav-frontend-typografi';
import { Knapp } from 'nav-frontend-knapper';
import React from 'react';
import PropTypes from 'prop-types';
import './VelgBehandlingModal.less';
import { toDate } from '../../utils/date';

Modal.setAppElement('#root');

const VelgBehandlingModal = ({ setModalOpen, behandlinger, velgBehandling }) => (
    <Modal onRequestClose={() => setModalOpen(false)} contentLabel="Velg behandling" isOpen={true}>
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
                        <Knapp onClick={() => velgBehandling(behandling)}>Velg</Knapp>
                    </li>
                ))}
            </ul>
        </div>
    </Modal>
);

VelgBehandlingModal.propTypes = {
    behandlinger: PropTypes.arrayOf(PropTypes.any).isRequired,
    velgBehandling: PropTypes.func.isRequired,
    setModalOpen: PropTypes.func.isRequired
};

export default VelgBehandlingModal;
