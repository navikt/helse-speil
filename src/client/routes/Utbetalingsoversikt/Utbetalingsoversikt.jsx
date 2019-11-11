import React, { useContext } from 'react';
import IconRow from '../../components/Rows/IconRow';
import Timeline from '../../components/Timeline';
import Navigasjonsknapper from '../../components/NavigationButtons';
import { Panel } from 'nav-frontend-paneler';
import { pages } from '../../hooks/useLinks';
import { Normaltekst } from 'nav-frontend-typografi';
import { PersonContext } from '../../context/PersonContext';
import { utbetalingsoversikttekster } from '../../tekster';
import './Utbetalingsoversikt.less';

const Utbetalingsoversikt = () => {
    const { personTilBehandling: person } = useContext(PersonContext);

    return (
        <Panel className="Utbetalingsoversikt">
            {person.arbeidsgivere ? (
                <>
                    <IconRow label={utbetalingsoversikttekster('dager')} bold />
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
