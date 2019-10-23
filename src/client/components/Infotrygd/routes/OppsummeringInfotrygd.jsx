import React, { useContext } from 'react';
import InfotrygdList from '../InfotrygdList';
import InfotrygdListItem from '../InfotrygdListItem';
import { BehandlingerContext } from '../../../context/BehandlingerContext';
import { oppsummeringstekster, tekster } from '../../../tekster';
import { toKroner } from '../../../utils/locale';

const OppsummeringInfotrygd = () => {
    const { personTilBehandling } = useContext(BehandlingerContext);

    return (
        <>
            <h2>Oppsummering</h2>
            <span className="Infotrygd__content">
                <span className="Infotrygd__content--left">
                    <InfotrygdList>
                        <InfotrygdListItem label={oppsummeringstekster('sykdomsvilkår')}>
                            {personTilBehandling.oppsummering.sykdomsvilkårErOppfylt}
                        </InfotrygdListItem>
                        <InfotrygdListItem />
                        <InfotrygdListItem label={oppsummeringstekster('inngangsvilkår')}>
                            {personTilBehandling.oppsummering.inngangsvilkårErOppfylt}
                        </InfotrygdListItem>
                        <InfotrygdListItem />
                        <InfotrygdListItem label={oppsummeringstekster('arbeidsgiver')}>
                            {personTilBehandling.oppsummering.arbeidsgiver.navn}
                        </InfotrygdListItem>
                        <InfotrygdListItem label={oppsummeringstekster('orgnr')}>
                            {personTilBehandling.oppsummering.arbeidsgiver.orgnummer}
                        </InfotrygdListItem>
                        <InfotrygdListItem label={oppsummeringstekster('refusjon')}>
                            {tekster('informasjon ikke tilgjengelig')}
                        </InfotrygdListItem>
                        <InfotrygdListItem label={oppsummeringstekster('betaler')}>
                            {personTilBehandling.oppsummering.betalerArbeidsgiverperiode
                                ? 'Nei'
                                : 'Ja'}
                        </InfotrygdListItem>
                        <InfotrygdListItem label={oppsummeringstekster('fordeling')}>
                            {`${personTilBehandling.oppsummering.fordeling}%`}
                        </InfotrygdListItem>
                        <InfotrygdListItem />
                        <InfotrygdListItem label={oppsummeringstekster('sykepengegrunnlag')}>
                            {`${toKroner(personTilBehandling.oppsummering.sykepengegrunnlag)} kr`}
                        </InfotrygdListItem>
                        <InfotrygdListItem label={oppsummeringstekster('månedsbeløp')}>
                            {`${toKroner(personTilBehandling.oppsummering.månedsbeløp)} kr`}
                        </InfotrygdListItem>
                        <InfotrygdListItem label={oppsummeringstekster('dagsats')}>
                            {`${toKroner(personTilBehandling.oppsummering.dagsats)} kr`}
                        </InfotrygdListItem>
                    </InfotrygdList>
                </span>
                <span className="Infotrygd__content--right">
                    <InfotrygdList>
                        <InfotrygdListItem label={oppsummeringstekster('antall_utbetalingsdager')}>
                            {personTilBehandling.oppsummering.antallUtbetalingsdager}
                        </InfotrygdListItem>
                        <InfotrygdListItem label={oppsummeringstekster('fom')}>
                            {personTilBehandling.oppsummering.sykmeldtFraOgMed}
                        </InfotrygdListItem>
                        <InfotrygdListItem label={oppsummeringstekster('tom')}>
                            {personTilBehandling.oppsummering.sykmeldtTilOgMed}
                        </InfotrygdListItem>
                        <InfotrygdListItem label={oppsummeringstekster('sykmeldingsgrad')}>
                            {personTilBehandling.oppsummering.sykmeldingsgrad}
                        </InfotrygdListItem>
                        <InfotrygdListItem />
                        <InfotrygdListItem label={oppsummeringstekster('utbetalesFom')}>
                            {personTilBehandling.oppsummering.utbetalesFom}
                        </InfotrygdListItem>
                        <InfotrygdListItem label={oppsummeringstekster('utbetalesTom')}>
                            {personTilBehandling.oppsummering.utbetalesTom}
                        </InfotrygdListItem>
                        <InfotrygdListItem label={oppsummeringstekster('utbetaling')}>
                            {personTilBehandling.oppsummering.utbetaling}
                        </InfotrygdListItem>
                    </InfotrygdList>
                </span>
            </span>
        </>
    );
};

export default OppsummeringInfotrygd;
