import React from 'react';
import PropTypes from 'prop-types';
import { Panel } from 'nav-frontend-paneler';
import { Normaltekst } from 'nav-frontend-typografi';
import './CaseMenu.less';
import { toDate } from '../../utils/date';
import Picker from '../widgets/Picker';

const CaseMenu = ({ behandlinger, behandling, setValgtBehandling }) => {
    const { arbeidsgiver, fom, tom } = behandling.originalSøknad;
    const { sykmeldingsgrad } = behandling.periode;
    const behandlingMapper = behandling => ({
        behandlingsId: behandling.behandlingsId,
        fom: behandling.originalSøknad.fom,
        tom: behandling.originalSøknad.tom
    });
    const cases = behandlinger.map(behandling => behandlingMapper(behandling));
    const currentCase = behandlingMapper(behandling);
    const caseLabel = item => `${toDate(item.fom)} - ${toDate(item.tom)}`;

    return (
        <Panel className="CaseMenu">
            <div className="CaseMenu__top">
                <Picker
                    className="CasePicker"
                    items={cases}
                    currentItem={currentCase}
                    onChange={setValgtBehandling}
                    itemLabel={caseLabel}
                />
            </div>
            <div className="CaseMenu__info">
                <span className="CaseMenu__employer" />
                <Normaltekst>{arbeidsgiver.navn}</Normaltekst>
                <Normaltekst>
                    {toDate(fom)} - {toDate(tom)}
                </Normaltekst>
                <Normaltekst>{sykmeldingsgrad}%</Normaltekst>
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
