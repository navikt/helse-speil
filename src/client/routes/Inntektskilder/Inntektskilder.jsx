import React from 'react';
import { Panel } from 'nav-frontend-paneler';
import { Normaltekst } from 'nav-frontend-typografi';
import NavigationButtons from '../../components/NavigationButtons/NavigationButtons';
import { pages } from '../../hooks/useLinks';

const Inntektskilder = () => {
    return (
        <Panel>
            <Normaltekst>Ingen data</Normaltekst>

            <NavigationButtons previous={pages.INNGANGSVILKÅR} next={pages.SYKEPENGEGRUNNLAG} />
        </Panel>
    );
};

export default Inntektskilder;
