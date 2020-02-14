import React, { useContext } from 'react';
import Navigasjonsknapper from '../components/NavigationButtons';
import { Panel } from 'nav-frontend-paneler';
import { pages } from '../hooks/useLinks';
import { Normaltekst } from 'nav-frontend-typografi';
import { PersonContext } from '../context/PersonContext';
import { useTranslation } from 'react-i18next';
import Utbetalingstidslinje from '../components/Utbetalingstidslinje/Utbetalingstidslinje';

const Utbetalingsoversikt = () => {
    const { aktivVedtaksperiode } = useContext(PersonContext);
    const { t } = useTranslation();

    return (
        <Panel className="Utbetalingsoversikt">
            {aktivVedtaksperiode ? (
                <Utbetalingstidslinje vedtaksperiode={aktivVedtaksperiode} showDagsats={true} />
            ) : (
                <Normaltekst>Ingen data</Normaltekst>
            )}

            <Navigasjonsknapper previous={pages.SYKEPENGEGRUNNLAG} next={pages.OPPSUMMERING} />
        </Panel>
    );
};

export default Utbetalingsoversikt;
