import React from 'react';
import NavigationButtons from '../../components/NavigationButtons';
import { Panel } from 'nav-frontend-paneler';
import { Normaltekst } from 'nav-frontend-typografi';
import { pages } from '../../hooks/useLinks';

const Periode = () => {
    return (
        <Panel className="Periode">
            <Normaltekst>Ingen data</Normaltekst>
            <NavigationButtons previous={pages.SYKEPENGEGRUNNLAG} next={pages.UTBETALING} />
        </Panel>
    );
};

export default Periode;
