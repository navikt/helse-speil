import React from 'react';
import Navigasjonsknapper from '../../components/NavigationButtons';
import { Panel } from 'nav-frontend-paneler';
import { Undertittel, Normaltekst } from 'nav-frontend-typografi';
import { sykepengegrunnlagstekster } from '../../tekster';

const Sykepengegrunnlag = () => {
    return (
        <Panel className="Sykepengegrunnlag">
            <Undertittel className="panel-tittel">
                {sykepengegrunnlagstekster('tittel')}
            </Undertittel>
            <Normaltekst>Ingen data</Normaltekst>
            <Navigasjonsknapper previous="/inntektskilder" next="/utbetaling" />
        </Panel>
    );
};

export default Sykepengegrunnlag;
