import React, { useContext } from 'react';
import Timeline from '../../Timeline';
import InfotrygdList from '../InfotrygdList';
import InfotrygdListItem from '../InfotrygdListItem';
import { PersonContext } from '../../../context/PersonContext';
import './UtbetalingsoversiktInfotrygd.less';
import { useTranslation } from 'react-i18next';

const UtbetalingsoversiktInfotrygd = () => {
    const { personTilBehandling: person } = useContext(PersonContext);
    const { t } = useTranslation();

    return (
        <div className="UtbetalingsoversiktInfotrygd">
            <InfotrygdList>
                <InfotrygdListItem label={t('utbetalingsoversikt.dager')} status="OK" />
            </InfotrygdList>
            <div className="UtbetalingsoversiktInfotrygd__timeline">
                <Timeline person={person!} showDagsats={true} />
            </div>
        </div>
    );
};

export default UtbetalingsoversiktInfotrygd;
