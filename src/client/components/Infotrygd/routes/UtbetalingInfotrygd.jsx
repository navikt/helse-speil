import React, { useContext } from 'react';
import InfotrygdList from '../InfotrygdList';
import InfotrygdListItem from '../InfotrygdListItem';
import { tekster, utbetalingstekster } from '../../../tekster';
import { PersonContext } from '../../../context/PersonContext';
import { toKroner } from '../../../utils/locale';

const UtbetalingInfotrygd = () => {
    const { personTilBehandling } = useContext(PersonContext);

    return (
        <>
            <h2>Utbetaling</h2>
            <span className="Infotrygd__content">
                <InfotrygdList>
                    <InfotrygdListItem label={utbetalingstekster('refusjon')}>
                        {tekster('informasjon ikke tilgjengelig')}
                    </InfotrygdListItem>
                    <InfotrygdListItem label={utbetalingstekster('betaler')}>
                        {personTilBehandling.utbetaling.betalerArbeidsgiverperiode ? 'Ja' : 'Nei'}
                    </InfotrygdListItem>
                    <InfotrygdListItem />
                    <InfotrygdListItem label={utbetalingstekster('sykepengegrunnlag')}>
                        {`${toKroner(personTilBehandling.utbetaling.sykepengegrunnlag)} kr`}
                    </InfotrygdListItem>
                    <InfotrygdListItem label={utbetalingstekster('dagsats')}>
                        {`${toKroner(personTilBehandling.utbetaling.dagsats)} kr`}
                    </InfotrygdListItem>
                    <InfotrygdListItem label={utbetalingstekster('dager')}>
                        {personTilBehandling.utbetaling.antallUtbetalingsdager}
                    </InfotrygdListItem>
                    <InfotrygdListItem label={utbetalingstekster('sykmeldingsgrad')}>
                        {`${personTilBehandling.utbetaling.sykmeldingsgrad}%`}
                    </InfotrygdListItem>
                    <InfotrygdListItem />
                    <InfotrygdListItem label={utbetalingstekster('utbetaling')}>
                        {`${toKroner(personTilBehandling.utbetaling.utbetalingsbeløp)} kr`}
                    </InfotrygdListItem>
                </InfotrygdList>
            </span>
        </>
    );
};

export default UtbetalingInfotrygd;
