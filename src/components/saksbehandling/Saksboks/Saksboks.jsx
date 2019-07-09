import React from 'react';
import Saksvelger from './Saksvelger';
import Progresjonsbar from '../Progresjonsbar/Progresjonsbar';
import Icon, { IconType } from '../Icon/Icon';
import { Panel } from 'nav-frontend-paneler';
import { Normaltekst } from 'nav-frontend-typografi';
import { EtikettInfo } from 'nav-frontend-etiketter';
import './Saksboks.less';

const Saksboks = () => {
    // Dummy-data som skal fjernes etterhvert
    const sak = {
        arbeidsgiver: 'Sykepleierhuset AS',
        fom: '27.01.19',
        tom: '28.02.19',
        sykmeldingsgrad: 100,
        sykmelder: 'Nasse Nøff / Fjellet Legesenter',
        foerstegang: true
    };

    return (
        <Panel className="Saksboks">
            <div className="Saksboks__sakslinje">
                <Saksvelger />
                {sak.foerstegang && <EtikettInfo>Førstegangsbeh.</EtikettInfo>}
            </div>
            <div className="Saksboks__info">
                <Normaltekst>
                    <Icon type={IconType.ARBEIDSGIVER_GRÅ} />
                    {sak.arbeidsgiver} / {sak.fom} - {sak.tom} /{' '}
                    {`${sak.sykmeldingsgrad}%`}
                </Normaltekst>
                <Normaltekst>
                    <Icon type={IconType.SYKMELDER} />
                    {sak.sykmelder}
                </Normaltekst>
            </div>
            <Progresjonsbar current={1} total={1} />
        </Panel>
    );
};

export default Saksboks;
