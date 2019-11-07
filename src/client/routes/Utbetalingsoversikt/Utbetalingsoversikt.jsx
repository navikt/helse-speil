import React, { useContext } from 'react';
import IconRow from '../../components/Rows/IconRow';
import Navigasjonsknapper from '../../components/NavigationButtons';
import { Panel } from 'nav-frontend-paneler';
import { Normaltekst } from 'nav-frontend-typografi';
import { utbetalingstekster } from '../../tekster';
import { PersonContext } from '../../context/PersonContext';
import Timeline from '../../components/Timeline';
import './Utbetalingsoversikt.less';
import { pages } from '../../hooks/useLinks';

const Utbetalingsoversikt = () => {
    const { personTilBehandling: person } = useContext(PersonContext);

    return (
        <Panel className="Utbetalingsoversikt">
            {person.arbeidsgivere ? (
                <>
                    <IconRow label={utbetalingstekster('dager')} bold />
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
