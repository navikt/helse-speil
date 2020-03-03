import React, { useContext } from 'react';
import Navigasjonsknapper from '../components/NavigationButtons';
import { Panel } from 'nav-frontend-paneler';
import { pages } from '../hooks/useLinks';
import { Normaltekst } from 'nav-frontend-typografi';
import { PersonContext } from '../context/PersonContext';
import { utbetalingstidslinje } from '../context/mapping/dagmapper';
import { Utbetalingstabell } from '@navikt/helse-frontend-tabell';

const Utbetalingsoversikt = () => {
    const { aktivVedtaksperiode } = useContext(PersonContext);
    const dager = utbetalingstidslinje(aktivVedtaksperiode);

    return (
        <Panel className="Utbetalingsoversikt">
            {dager ? <Utbetalingstabell dager={dager} /> : <Normaltekst>Ingen data</Normaltekst>}
            <Navigasjonsknapper previous={pages.SYKEPENGEGRUNNLAG} next={pages.OPPSUMMERING} />
        </Panel>
    );
};

export default Utbetalingsoversikt;
