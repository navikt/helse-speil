import React, { useContext } from 'react';
import Timeline from '../../Timeline';
import InfotrygdList from '../InfotrygdList';
import InfotrygdListItem from '../InfotrygdListItem';
import { PersonContext } from '../../../context/PersonContext';
import { utbetalingsoversikttekster } from '../../../tekster';
import './UtbetalingsoversiktInfotrygd.less';

const UtbetalingsoversiktInfotrygd = () => {
    const { personTilBehandling: person } = useContext(PersonContext);

    return (
        <>
            <h2>Utbetaling</h2>
            <InfotrygdList>
                <InfotrygdListItem label={utbetalingsoversikttekster('dager')} status="OK" />
            </InfotrygdList>
            <span className="Infotrygd__content UtbetalingsoversiktInfotrygd">
                <Timeline person={person} showDagsats={true} />
            </span>
        </>
    );
};

export default UtbetalingsoversiktInfotrygd;
