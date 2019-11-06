import React from 'react';
import Navigasjonsknapper from '../../components/NavigationButtons';
import { Panel } from 'nav-frontend-paneler';
import { Normaltekst } from 'nav-frontend-typografi';

const Sykepengegrunnlag = () => {
    return (
        <Panel className="Sykepengegrunnlag">
            <Normaltekst>Ingen data</Normaltekst>
            <Navigasjonsknapper previous="/inntektskilder" next="/utbetaling" />
        </Panel>
    );
};

export default Sykepengegrunnlag;
