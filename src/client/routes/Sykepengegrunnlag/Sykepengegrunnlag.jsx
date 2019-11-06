import React from 'react';
import Navigasjonsknapper from '../../components/NavigationButtons';
import { Panel } from 'nav-frontend-paneler';
import { Normaltekst } from 'nav-frontend-typografi';
import { pages } from '../../hooks/useLinks';

const Sykepengegrunnlag = () => {
    return (
        <Panel className="Sykepengegrunnlag">
            <Normaltekst>Ingen data</Normaltekst>
            <Navigasjonsknapper previous={pages.INNTEKTSKILDER} next={pages.UTBETALING} />
        </Panel>
    );
};

export default Sykepengegrunnlag;
