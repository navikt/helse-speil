import React from 'react';
import { Panel } from 'nav-frontend-paneler';
import { Undertittel, Normaltekst } from 'nav-frontend-typografi';
import { inntektskildertekster as tekster } from '../../tekster';
import NavigationButtons from '../../components/NavigationButtons/NavigationButtons';

const Inntektskilder = () => {
    return (
        <Panel>
            <Undertittel className="panel-tittel">{tekster(`tittel`)}</Undertittel>

            <Normaltekst>Ingen data</Normaltekst>

            <NavigationButtons previous="/inngangsvilkår" next="/sykepengegrunnlag" />
        </Panel>
    );
};

export default Inntektskilder;
