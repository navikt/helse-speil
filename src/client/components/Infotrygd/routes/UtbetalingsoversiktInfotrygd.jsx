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
        <div className="UtbetalingsoversiktInfotrygd">
            <InfotrygdList>
                <InfotrygdListItem label={utbetalingsoversikttekster('dager')} status="OK" />
            </InfotrygdList>
            <div className="UtbetalingsoversiktInfotrygd__timeline">
                <Timeline person={person} showDagsats={true} />
            </div>
        </div>
    );
};

export default UtbetalingsoversiktInfotrygd;
