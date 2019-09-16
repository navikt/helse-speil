import React from 'react';
import PropTypes from 'prop-types';
import CasePicker from './CasePicker';
import { Panel } from 'nav-frontend-paneler';
import { Normaltekst } from 'nav-frontend-typografi';
import './CaseMenu.less';

const CaseMenu = ({ behandling }) => {
    const { behandlingsId } = behandling;
    const { arbeidsgiver, fom, tom } = behandling.originalSøknad;
    const { sykmeldingsgrad } = behandling.periode;

    return (
        <Panel className="CaseMenu">
            <div className="CaseMenu__top">
                <CasePicker cases={[behandlingsId]} />
            </div>
            <Normaltekst>Førstegangs.</Normaltekst>
            <div className="CaseMenu__info">
                <Normaltekst>
                    <span className="CaseMenu__employer" />
                    {`${arbeidsgiver.navn} / ${fom} - ${tom} / ${sykmeldingsgrad}%`}
                </Normaltekst>
            </div>
        </Panel>
    );
};

CaseMenu.propTypes = {
    behandling: PropTypes.any
};

export default CaseMenu;
