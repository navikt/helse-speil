import React, { useContext } from 'react';
import InfotrygdList from '../InfotrygdList';
import InfotrygdListItem from '../InfotrygdListItem';
import { BehandlingerContext } from '../../../context/BehandlingerContext';
import { oppsummeringstekster, tekster } from '../../../tekster';
import { toKroner } from '../../../utils/locale';

const OppsummeringInfotrygd = () => {
    const { valgtBehandling } = useContext(BehandlingerContext);

    return (
        <>
            <h2>Oppsummering</h2>
            <span className="Infotrygd__content">
                <span className="Infotrygd__content--left">
                    <InfotrygdList>
                        <InfotrygdListItem label={oppsummeringstekster('sykdomsvilkår')}>
                            {valgtBehandling.oppsummering.sykdomsvilkårErOppfylt}
                        </InfotrygdListItem>
                        <InfotrygdListItem />
                        <InfotrygdListItem label={oppsummeringstekster('inngangsvilkår')}>
                            {valgtBehandling.oppsummering.inngangsvilkårErOppfylt}
                        </InfotrygdListItem>
                        <InfotrygdListItem />
                        <InfotrygdListItem label={oppsummeringstekster('arbeidsgiver')}>
                            {valgtBehandling.oppsummering.arbeidsgiver.navn}
                        </InfotrygdListItem>
                        <InfotrygdListItem label={oppsummeringstekster('orgnr')}>
                            {valgtBehandling.oppsummering.arbeidsgiver.orgnummer}
                        </InfotrygdListItem>
                        <InfotrygdListItem label={oppsummeringstekster('refusjon')}>
                            {tekster('informasjon ikke tilgjengelig')}
                        </InfotrygdListItem>
                        <InfotrygdListItem label={oppsummeringstekster('betaler')}>
                            {valgtBehandling.oppsummering.betalerArbeidsgiverperiode ? 'Nei' : 'Ja'}
                        </InfotrygdListItem>
                        <InfotrygdListItem label={oppsummeringstekster('fordeling')}>
                            {`${valgtBehandling.oppsummering.fordeling}%`}
                        </InfotrygdListItem>
                        <InfotrygdListItem />
                        <InfotrygdListItem label={oppsummeringstekster('sykepengegrunnlag')}>
                            {`${toKroner(valgtBehandling.oppsummering.sykepengegrunnlag)} kr`}
                        </InfotrygdListItem>
                        <InfotrygdListItem label={oppsummeringstekster('månedsbeløp')}>
                            {`${toKroner(valgtBehandling.oppsummering.månedsbeløp)} kr`}
                        </InfotrygdListItem>
                        <InfotrygdListItem label={oppsummeringstekster('dagsats')}>
                            {`${toKroner(valgtBehandling.oppsummering.dagsats)} kr`}
                        </InfotrygdListItem>
                    </InfotrygdList>
                </span>
                <span className="Infotrygd__content--right">
                    <InfotrygdList>
                        <InfotrygdListItem label={oppsummeringstekster('antall_utbetalingsdager')}>
                            {valgtBehandling.oppsummering.antallUtbetalingsdager}
                        </InfotrygdListItem>
                        <InfotrygdListItem label={oppsummeringstekster('fom')}>
                            {valgtBehandling.oppsummering.sykmeldtFraOgMed}
                        </InfotrygdListItem>
                        <InfotrygdListItem label={oppsummeringstekster('tom')}>
                            {valgtBehandling.oppsummering.sykmeldtTilOgMed}
                        </InfotrygdListItem>
                        <InfotrygdListItem label={oppsummeringstekster('sykmeldingsgrad')}>
                            {valgtBehandling.oppsummering.sykmeldingsgrad}
                        </InfotrygdListItem>
                        <InfotrygdListItem />
                        <InfotrygdListItem label={oppsummeringstekster('utbetalesFom')}>
                            {valgtBehandling.oppsummering.utbetalesFom}
                        </InfotrygdListItem>
                        <InfotrygdListItem label={oppsummeringstekster('utbetalesTom')}>
                            {valgtBehandling.oppsummering.utbetalesTom}
                        </InfotrygdListItem>
                        <InfotrygdListItem label={oppsummeringstekster('utbetaling')}>
                            {valgtBehandling.oppsummering.utbetaling}
                        </InfotrygdListItem>
                    </InfotrygdList>
                </span>
            </span>
        </>
    );
};

export default OppsummeringInfotrygd;
