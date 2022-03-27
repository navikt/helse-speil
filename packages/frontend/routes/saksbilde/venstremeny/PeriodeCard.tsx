import styled from '@emotion/styled';
import dayjs from 'dayjs';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Flex } from '@components/Flex';
import { LovdataLenke } from '@components/LovdataLenke';
import { Advarselikon } from '@components/ikoner/Advarselikon';
import { Maksdatoikon } from '@components/ikoner/Maksdatoikon';
import { Oppgaveetikett } from '@components/Oppgaveetikett';
import { Skjæringstidspunktikon } from '@components/ikoner/Skjæringstidspunktikon';
import { Sykmeldingsperiodeikon } from '@components/ikoner/Sykmeldingsperiodeikon';
import { SkjæringstidspunktikonInvert } from '@components/ikoner/SkjæringstidspunktikonInvert';
import { BeregnetPeriode, Periodetype } from '@io/graphql';
import { NORSK_DATOFORMAT_KORT } from '@utils/date';
import { getPeriodState } from '@utils/mapping';
import { capitalize } from '@utils/locale';

import { CardTitle } from './CardTitle';

import styles from './PeriodeCard.module.css';

const LovdataLenkeContainer = styled(BodyShort)`
    font-size: 14px;
    margin-left: 0.5rem;
`;

const getTextForPeriodetype = (type: Periodetype | 'REVURDERING'): string | null => {
    switch (type) {
        case 'INFOTRYGDFORLENGELSE':
            return 'FORLENGELSE';
        case 'FORSTEGANGSBEHANDLING':
            return 'FØRSTEGANGSBEHANDLING';
        case 'OVERGANG_FRA_IT':
            return 'FORLENGELSE IT';
        default:
            return type;
    }
};

interface RowProps {
    activePeriod: BeregnetPeriode;
}

const PeriodetypeRow: React.VFC<RowProps> = ({ activePeriod }) => {
    const periodetype = activePeriod.utbetaling.type === 'REVURDERING' ? 'REVURDERING' : activePeriod.periodetype;
    const periodetypeLabel = getTextForPeriodetype(periodetype);
    const periodState = getPeriodState(activePeriod);

    if (!periodetypeLabel) {
        return null;
    }

    return (
        <>
            <div className={styles.IconContainer} data-tip={capitalize(periodetypeLabel)}>
                <Oppgaveetikett type={periodetype} tilstand={periodState} />
            </div>
            <CardTitle className={styles.Title}>{periodetypeLabel}</CardTitle>
        </>
    );
};

const SykmeldingsperiodeRow: React.VFC<RowProps> = ({ activePeriod }) => {
    const fom = dayjs(activePeriod.fom).format(NORSK_DATOFORMAT_KORT);
    const tom = dayjs(activePeriod.tom).format(NORSK_DATOFORMAT_KORT);

    return (
        <>
            <div className={styles.IconContainer} data-tip="Sykmeldingsperiode">
                <Sykmeldingsperiodeikon alt="Sykmeldingsperiode" />
            </div>
            <BodyShort>{`${fom} - ${tom}`}</BodyShort>
        </>
    );
};

const SkjæringstidspunktRow: React.VFC<RowProps> = ({ activePeriod }) => {
    const skjæringstidspunkt = dayjs(activePeriod.skjaeringstidspunkt).format(NORSK_DATOFORMAT_KORT);

    if (activePeriod.periodetype === 'OVERGANG_FRA_IT') {
        return (
            <>
                <div className={styles.IconContainer} data-tip="Skjæringstidspunkt">
                    <SkjæringstidspunktikonInvert alt="Skjæringstidspunkt" />
                </div>
                <BodyShort>Skjæringstidspunkt i Infotrygd/Gosys</BodyShort>
            </>
        );
    } else {
        return (
            <>
                <div className={styles.IconContainer} data-tip="Skjæringstidspunkt">
                    <Skjæringstidspunktikon alt="Skjæringstidspunkt" />
                </div>
                <BodyShort>{skjæringstidspunkt}</BodyShort>
            </>
        );
    }
};

const MaksdatoRow: React.VFC<RowProps> = ({ activePeriod }) => {
    const maksdato = dayjs(activePeriod.maksdato).format(NORSK_DATOFORMAT_KORT);
    const alderVedSisteSykedag = activePeriod.periodevilkar.alder.alderSisteSykedag ?? null;

    return (
        <>
            <div className={styles.IconContainer} data-tip="Maksdato">
                <Maksdatoikon alt="Maksdato" />
            </div>
            <Flex justifyContent="space-between">
                <BodyShort>{`${maksdato} (${
                    activePeriod.gjenstaendeSykedager ?? 'Ukjent antall'
                } dager igjen)`}</BodyShort>
                {alderVedSisteSykedag &&
                    (alderVedSisteSykedag >= 70 ? (
                        <Flex alignItems="center">
                            <div className={styles.IconContainer} data-tip="Over 70 år">
                                <Advarselikon alt="Over 70 år" height={16} width={16} />
                            </div>
                            <LovdataLenkeContainer as="p">
                                <LovdataLenke paragraf="8-3">§ 8-3</LovdataLenke>
                            </LovdataLenkeContainer>
                        </Flex>
                    ) : (
                        alderVedSisteSykedag >= 67 && (
                            <Flex alignItems="center">
                                <div
                                    className={styles.IconContainer}
                                    data-tip="Mellom 67 og 70 år - redusert antall sykepengedager"
                                >
                                    <Advarselikon
                                        alt="Mellom 67 og 70 år - redusert antall sykepengedager"
                                        height={16}
                                        width={16}
                                    />
                                </div>
                                <LovdataLenkeContainer as="p">
                                    <LovdataLenke paragraf="8-51">§ 8-51</LovdataLenke>
                                </LovdataLenkeContainer>
                            </Flex>
                        )
                    ))}
            </Flex>
        </>
    );
};

interface PeriodeCardProps {
    activePeriod: BeregnetPeriode;
}

export const PeriodeCard: React.VFC<PeriodeCardProps> = ({ activePeriod }) => {
    return (
        <section>
            <div className={styles.Grid}>
                <PeriodetypeRow activePeriod={activePeriod} />
                <SykmeldingsperiodeRow activePeriod={activePeriod} />
                <SkjæringstidspunktRow activePeriod={activePeriod} />
                <MaksdatoRow activePeriod={activePeriod} />
            </div>
        </section>
    );
};
