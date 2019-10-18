import React, { useContext } from 'react';
import InfotrygdList from '../InfotrygdList';
import InfotrygdListItem from '../InfotrygdListItem';
import { tekster, utbetalingstekster } from '../../../tekster';
import { BehandlingerContext } from '../../../context/BehandlingerContext';
import { toKroner } from '../../../utils/locale';

const UtbetalingInfotrygd = () => {
    const { valgtBehandling } = useContext(BehandlingerContext);

    return (
        <>
            <h2>Utbetaling</h2>
            <span className="Infotrygd__content">
                <InfotrygdList>
                    <InfotrygdListItem label={utbetalingstekster('refusjon')}>
                        {tekster('informasjon ikke tilgjengelig')}
                    </InfotrygdListItem>
                    <InfotrygdListItem label={utbetalingstekster('betaler')}>
                        {valgtBehandling.utbetaling.betalerArbeidsgiverperiode ? 'Ja' : 'Nei'}
                    </InfotrygdListItem>
                    <InfotrygdListItem />
                    <InfotrygdListItem label={utbetalingstekster('sykepengegrunnlag')}>
                        {`${toKroner(valgtBehandling.utbetaling.sykepengegrunnlag)} kr`}
                    </InfotrygdListItem>
                    <InfotrygdListItem label={utbetalingstekster('dagsats')}>
                        {`${toKroner(valgtBehandling.utbetaling.dagsats)} kr`}
                    </InfotrygdListItem>
                    <InfotrygdListItem label={utbetalingstekster('dager')}>
                        {valgtBehandling.utbetaling.antallUtbetalingsdager}
                    </InfotrygdListItem>
                    <InfotrygdListItem label={utbetalingstekster('sykmeldingsgrad')}>
                        {`${valgtBehandling.utbetaling.sykmeldingsgrad}%`}
                    </InfotrygdListItem>
                    <InfotrygdListItem />
                    <InfotrygdListItem label={utbetalingstekster('utbetaling')}>
                        {`${toKroner(valgtBehandling.utbetaling.utbetalingsbeløp)} kr`}
                    </InfotrygdListItem>
                </InfotrygdList>
            </span>
        </>
    );
};

export default UtbetalingInfotrygd;
