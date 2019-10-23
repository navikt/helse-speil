import React, { useContext } from 'react';
import InfotrygdList from '../InfotrygdList';
import InfotrygdListItem from '../InfotrygdListItem';
import { periodetekster } from '../../../tekster';
import { BehandlingerContext } from '../../../context/BehandlingerContext';

const SykepengeperiodeInfotrygd = () => {
    const { personTilBehandling } = useContext(BehandlingerContext);
    const {
        antallKalenderdager,
        arbeidsgiverperiodeKalenderdager,
        antallVirkedager,
        antallUtbetalingsdager,
        sykmeldingsgrad
    } = personTilBehandling.periode;

    return (
        <>
            <h2>Sykepengeperiode</h2>
            <span className="Infotrygd__content">
                <InfotrygdList>
                    <InfotrygdListItem label={periodetekster('kalenderdager')}>
                        {antallKalenderdager}
                    </InfotrygdListItem>
                    <InfotrygdListItem label={periodetekster('arbeidsgiverperiode')}>
                        {arbeidsgiverperiodeKalenderdager}
                    </InfotrygdListItem>
                    <InfotrygdListItem label={periodetekster('virkedager')}>
                        {antallVirkedager}
                    </InfotrygdListItem>
                    <InfotrygdListItem label={periodetekster('antall_utbetalingsdager')}>
                        {antallUtbetalingsdager}
                    </InfotrygdListItem>
                    <InfotrygdListItem label={periodetekster('sykmeldingsgrad')}>
                        {`${sykmeldingsgrad}%`}
                    </InfotrygdListItem>
                </InfotrygdList>
            </span>
        </>
    );
};

export default SykepengeperiodeInfotrygd;
