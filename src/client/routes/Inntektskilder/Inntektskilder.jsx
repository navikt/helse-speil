import React from 'react';
import { Panel } from 'nav-frontend-paneler';
import { Normaltekst } from 'nav-frontend-typografi';
import NavigationButtons from '../../components/NavigationButtons/NavigationButtons';

const Inntektskilder = () => {
    return (
        <Panel>
            <Normaltekst>Ingen data</Normaltekst>

            <NavigationButtons previous="/inngangsvilkår" next="/sykepengegrunnlag" />
        </Panel>
    );
};

export default Inntektskilder;
