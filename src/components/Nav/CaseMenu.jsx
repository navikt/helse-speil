import React from 'react';
import PropTypes from 'prop-types';
import CasePicker from './CasePicker';
import { Panel } from 'nav-frontend-paneler';
import { Normaltekst } from 'nav-frontend-typografi';
import './CaseMenu.less';
import { toDate } from '../../utils/date';

const CaseMenu = ({ behandlinger, behandling, setValgtBehandling }) => {
    const { arbeidsgiver, fom, tom } = behandling.originalSøknad;
    const { sykmeldingsgrad } = behandling.periode;
    const behandlingMapper = behandling => ({
        behandlingsId: behandling.behandlingsId,
        fom: behandling.originalSøknad.fom,
        tom: behandling.originalSøknad.tom
    });
    const items = behandlinger.map(behandling => behandlingMapper(behandling));
    const currentItem = behandlingMapper(behandling);
    const itemLabel = item => `${toDate(item.fom)} - ${toDate(item.tom)}`;

    return (
        <Panel className="CaseMenu">
            <div className="CaseMenu__top">
                <CasePicker
                    items={items}
                    currentItem={currentItem}
                    onChange={setValgtBehandling}
                    itemLabel={itemLabel}
                />
            </div>
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
    behandlinger: PropTypes.arrayOf(PropTypes.any).isRequired,
    behandling: PropTypes.any,
    setValgtBehandling: PropTypes.func.isRequired
};

export default CaseMenu;
