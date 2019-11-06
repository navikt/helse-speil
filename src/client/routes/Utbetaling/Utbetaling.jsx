import React, { useContext } from 'react';
import IconRow from '../../components/Rows/IconRow';
import Navigasjonsknapper from '../../components/NavigationButtons';
import { Panel } from 'nav-frontend-paneler';
import { Undertittel, Normaltekst } from 'nav-frontend-typografi';
import { utbetalingstekster } from '../../tekster';
import { PersonContext } from '../../context/PersonContext';
import Timeline from '../../components/Timeline';
import './Utbetaling.less';

const Utbetaling = () => {
    const { personTilBehandling: person } = useContext(PersonContext);

    return (
        <Panel className="Utbetaling">
            <Undertittel className="panel-tittel">{utbetalingstekster('tittel')}</Undertittel>
            {person.arbeidsgivere ? (
                <>
                    <IconRow label={utbetalingstekster('dager')} bold />
                    <Timeline person={person} showDagsats={true} />
                </>
            ) : (
                <Normaltekst>Ingen data</Normaltekst>
            )}

            <Navigasjonsknapper previous="/periode" next="/oppsummering" />
        </Panel>
    );
};

export default Utbetaling;
