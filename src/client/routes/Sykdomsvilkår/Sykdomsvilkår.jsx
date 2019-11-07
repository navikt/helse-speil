import React from 'react';
import Navigasjonsknapper from '../../components/NavigationButtons';
import { Panel } from 'nav-frontend-paneler';
import { Normaltekst } from 'nav-frontend-typografi';
import { pages } from '../../hooks/useLinks';

const Sykdomsvilkår = () => {
    return (
        <Panel className="Sykdomsvilkår">
            <Normaltekst>Ingen data</Normaltekst>
            <Navigasjonsknapper previous={pages.SYKMELDINGSPERIODE} next={pages.INNGANGSVILKÅR} />
        </Panel>
    );
};

export default Sykdomsvilkår;
