import React from 'react';
import NavigationButtons from '../../components/NavigationButtons';
import { Panel } from 'nav-frontend-paneler';
import { Normaltekst } from 'nav-frontend-typografi';
import { pages } from '../../hooks/useLinks';

const Fordeling = () => {
    return (
        <Panel>
            <Normaltekst>Ingen data</Normaltekst>
            <NavigationButtons
                previous={pages.SYKEPENGEGRUNNLAG}
                next={pages.UTBETALINGSOVERSIKT}
            />
        </Panel>
    );
};

export default Fordeling;
