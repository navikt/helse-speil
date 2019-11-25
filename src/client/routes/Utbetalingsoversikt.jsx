import React, { useContext } from 'react';
import Timeline from '../components/Timeline';
import Subheader from '../components/Subheader';
import Navigasjonsknapper from '../components/NavigationButtons';
import { Panel } from 'nav-frontend-paneler';
import { pages } from '../hooks/useLinks';
import { Normaltekst } from 'nav-frontend-typografi';
import { PersonContext } from '../context/PersonContext';
import { utbetalingsoversikttekster } from '../tekster';

const Utbetalingsoversikt = () => {
    const { personTilBehandling: person } = useContext(PersonContext);

    return (
        <Panel className="Utbetalingsoversikt">
            {person.arbeidsgivere ? (
                <>
                    <Subheader label={utbetalingsoversikttekster('dager')} iconType="ok" />
                    <Timeline person={person} showDagsats={true} />
                </>
            ) : (
                <Normaltekst>Ingen data</Normaltekst>
            )}

            <Navigasjonsknapper previous={pages.SYKEPENGEGRUNNLAG} next={pages.OPPSUMMERING} />
        </Panel>
    );
};

export default Utbetalingsoversikt;
