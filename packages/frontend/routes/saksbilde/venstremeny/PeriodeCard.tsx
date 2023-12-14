import classNames from 'classnames';
import dayjs from 'dayjs';
import React from 'react';

import { BodyShort, Tag, Tooltip } from '@navikt/ds-react';

import { EgenskaperTags } from '@components/EgenskaperTags';
import { Flex } from '@components/Flex';
import { LoadingShimmer } from '@components/LoadingShimmer';
import { LovdataLenke } from '@components/LovdataLenke';
import { Oppgaveetikett } from '@components/Oppgaveetikett';
import { Advarselikon } from '@components/ikoner/Advarselikon';
import { Maksdatoikon } from '@components/ikoner/Maksdatoikon';
import { Skjæringstidspunktikon } from '@components/ikoner/Skjæringstidspunktikon';
import { Sykmeldingsperiodeikon } from '@components/ikoner/Sykmeldingsperiodeikon';
import { Arbeidsgiver, Kategori, Oppgavetype, Periodetilstand, Periodetype, UberegnetPeriode } from '@io/graphql';
import { NORSK_DATOFORMAT_KORT } from '@utils/date';
import { capitalize } from '@utils/locale';

import { ArbeidsgiverRow } from './ArbeidsgiverRow';
import { CardTitle } from './CardTitle';

import styles from './PeriodeCard.module.css';

const getTextForPeriodetype = (type: Periodetype): string => {
    switch (type) {
        case Periodetype.Forlengelse:
        case Periodetype.Infotrygdforlengelse:
            return 'FORLENGELSE';
        case Periodetype.Forstegangsbehandling:
            return 'FØRSTEGANGSBEHANDLING';
        case Periodetype.OvergangFraIt:
            return 'FORLENGELSE IT';
    }
};

interface PeriodetypeRowProps {
    type: Periodetype | Oppgavetype;
    tilstand: Periodetilstand;
    label: string;
}

const PeriodetypeRow: React.FC<PeriodetypeRowProps> = ({ type, tilstand, label }) => {
    return (
        <>
            <Tooltip content={capitalize(label)}>
                <div className={styles.IconContainer}>
                    <Oppgaveetikett type={type} tilstand={tilstand} />
                </div>
            </Tooltip>
            <CardTitle className={styles.Title}>{label}</CardTitle>
        </>
    );
};

interface SykmeldingsperiodeRowProps {
    periode: DatePeriod;
}

const SykmeldingsperiodeRow: React.FC<SykmeldingsperiodeRowProps> = ({ periode }) => {
    const fom = dayjs(periode.fom).format(NORSK_DATOFORMAT_KORT);
    const tom = dayjs(periode.tom).format(NORSK_DATOFORMAT_KORT);

    return (
        <>
            <Tooltip content="Sykmeldingsperiode">
                <div className={styles.IconContainer}>
                    <Sykmeldingsperiodeikon alt="Sykmeldingsperiode" />
                </div>
            </Tooltip>
            <BodyShort>{`${fom} - ${tom}`}</BodyShort>
        </>
    );
};

interface SkjæringstidspunktRowProps {
    periodetype: Periodetype;
    skjæringstidspunkt: DateString;
}

const SkjæringstidspunktRow: React.FC<SkjæringstidspunktRowProps> = ({ periodetype, skjæringstidspunkt }) => {
    return (
        <>
            <Tooltip content="Skjæringstidspunkt">
                <div className={styles.IconContainer}>
                    <Skjæringstidspunktikon alt="Skjæringstidspunkt" />
                </div>
            </Tooltip>
            {periodetype === Periodetype.OvergangFraIt ? (
                <BodyShort>Skjæringstidspunkt i Infotrygd/Gosys</BodyShort>
            ) : (
                <BodyShort>{dayjs(skjæringstidspunkt).format(NORSK_DATOFORMAT_KORT)}</BodyShort>
            )}
        </>
    );
};

const harRedusertAntallSykepengedager = (periode: FetchedBeregnetPeriode): boolean => {
    const { forbrukteSykedager, gjenstaendeSykedager } = periode.periodevilkar.sykepengedager;
    return (
        typeof forbrukteSykedager === 'number' &&
        typeof gjenstaendeSykedager === 'number' &&
        forbrukteSykedager + gjenstaendeSykedager < 248
    );
};

interface MaksdatoRowProps {
    activePeriod: FetchedBeregnetPeriode;
    gjenståendeSykedager: number | null;
}

const MaksdatoRow: React.FC<MaksdatoRowProps> = ({ activePeriod, gjenståendeSykedager }) => {
    const maksdato = dayjs(activePeriod.maksdato).format(NORSK_DATOFORMAT_KORT);
    const alderVedSisteSykedag = activePeriod.periodevilkar.alder.alderSisteSykedag ?? null;

    return (
        <>
            <Tooltip content="Maksdato">
                <div className={styles.IconContainer}>
                    <Maksdatoikon alt="Maksdato" />
                </div>
            </Tooltip>
            <Flex gap="10px">
                <BodyShort className={styles.NoWrap}>{`${maksdato} (${
                    gjenståendeSykedager ?? activePeriod.gjenstaendeSykedager ?? 'Ukjent antall'
                } dager igjen)`}</BodyShort>
                {alderVedSisteSykedag &&
                    (alderVedSisteSykedag >= 70 ? (
                        <Flex alignItems="center" gap="8px">
                            <Tooltip content="Over 70 år">
                                <div className={styles.IconContainer}>
                                    <Advarselikon alt="Over 70 år" height={16} width={16} />
                                </div>
                            </Tooltip>
                            <BodyShort size="small">
                                <LovdataLenke paragraf="8-3">§ 8-3</LovdataLenke>
                            </BodyShort>
                        </Flex>
                    ) : (
                        harRedusertAntallSykepengedager(activePeriod) && (
                            <Flex alignItems="center">
                                <Tooltip content="Over 67 år - redusert antall sykepengedager">
                                    <Tag className={styles.Tag} variant="info" size="small">
                                        Over 67 år
                                    </Tag>
                                </Tooltip>
                            </Flex>
                        )
                    ))}
            </Flex>
        </>
    );
};

interface PeriodeCardUberegnetProps {
    periode: UberegnetPeriode | UberegnetVilkarsprovdPeriode;
    arbeidsgiver: Arbeidsgiver;
    månedsbeløp?: number;
}

const PeriodeCardUberegnet: React.FC<PeriodeCardUberegnetProps> = ({ periode, arbeidsgiver, månedsbeløp }) => {
    return (
        <section className={styles.Grid}>
            <PeriodetypeRow
                type={periode.periodetype}
                tilstand={periode.periodetilstand}
                label={getTextForPeriodetype(periode.periodetype)}
            />
            <SykmeldingsperiodeRow periode={periode} />
            <SkjæringstidspunktRow periodetype={periode.periodetype} skjæringstidspunkt={periode.skjaeringstidspunkt} />
            <ArbeidsgiverRow.Uberegnet
                navn={arbeidsgiver.navn}
                organisasjonsnummer={arbeidsgiver.organisasjonsnummer}
                arbeidsforhold={arbeidsgiver.arbeidsforhold}
                månedsbeløp={månedsbeløp}
            />
        </section>
    );
};

interface PeriodeCardBeregnetProps {
    periode: FetchedBeregnetPeriode;
    arbeidsgiver: Arbeidsgiver;
    månedsbeløp: number | undefined;
    gjenståendeSykedager: number | null;
}

const PeriodeCardBeregnet: React.FC<PeriodeCardBeregnetProps> = ({
    periode,
    arbeidsgiver,
    månedsbeløp,
    gjenståendeSykedager,
}) => {
    const egenskaperForVisning = periode.egenskaper.filter(
        (it) => it.kategori !== Kategori.Mottaker && it.kategori !== Kategori.Inntektskilde,
    );
    return (
        <div>
            <span className={styles.egenskaper}>
                <EgenskaperTags egenskaper={egenskaperForVisning} />
            </span>
            <section className={styles.Grid}>
                <SykmeldingsperiodeRow periode={periode} />
                <SkjæringstidspunktRow
                    periodetype={periode.periodetype}
                    skjæringstidspunkt={periode.skjaeringstidspunkt}
                />
                <MaksdatoRow activePeriod={periode} gjenståendeSykedager={gjenståendeSykedager} />
                <ArbeidsgiverRow.Beregnet
                    navn={arbeidsgiver.navn}
                    organisasjonsnummer={arbeidsgiver.organisasjonsnummer}
                    arbeidsforhold={arbeidsgiver.arbeidsforhold}
                    månedsbeløp={månedsbeløp}
                />
            </section>
        </div>
    );
};

interface PeriodeCardGhostProps {
    arbeidsgiver: Arbeidsgiver;
}

const PeriodeCardGhost: React.FC<PeriodeCardGhostProps> = ({ arbeidsgiver }) => {
    return (
        <section className={styles.Grid}>
            <ArbeidsgiverRow.Ghost
                navn={arbeidsgiver.navn}
                organisasjonsnummer={arbeidsgiver.organisasjonsnummer}
                arbeidsforhold={arbeidsgiver.arbeidsforhold}
            />
        </section>
    );
};

const PeriodeCardSkeleton: React.FC = () => {
    return (
        <section className={classNames(styles.Skeleton, styles.Grid)}>
            <LoadingShimmer />
            <LoadingShimmer />
            <LoadingShimmer />
            <LoadingShimmer />
            <LoadingShimmer />
            <LoadingShimmer />
            <LoadingShimmer />
            <LoadingShimmer />
            <LoadingShimmer />
            <LoadingShimmer />
        </section>
    );
};

export const PeriodeCard = {
    Beregnet: PeriodeCardBeregnet,
    Uberegnet: PeriodeCardUberegnet,
    Ghost: PeriodeCardGhost,
    Skeleton: PeriodeCardSkeleton,
};
