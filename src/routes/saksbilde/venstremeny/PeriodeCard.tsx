import classNames from 'classnames';
import dayjs from 'dayjs';
import React, { ReactElement } from 'react';

import { ClockDashedIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Tag, Tooltip } from '@navikt/ds-react';

import { EgenskaperTags } from '@components/EgenskaperTags';
import { LoadingShimmer } from '@components/LoadingShimmer';
import { LovdataLenke } from '@components/LovdataLenke';
import { Advarselikon } from '@components/ikoner/Advarselikon';
import { Maksdatoikon } from '@components/ikoner/Maksdatoikon';
import { Skjæringstidspunktikon } from '@components/ikoner/Skjæringstidspunktikon';
import { Sykmeldingsperiodeikon } from '@components/ikoner/Sykmeldingsperiodeikon';
import {
    Arbeidsforhold,
    ArbeidsgiverFragment,
    BeregnetPeriodeFragment,
    Egenskap,
    Kategori,
    Periodetilstand,
    Periodetype,
    UberegnetPeriodeFragment,
} from '@io/graphql';
import { ActivePeriod, DatePeriod, DateString } from '@typer/shared';
import { ISO_DATOFORMAT, NORSK_DATOFORMAT } from '@utils/date';

import { ArbeidsgiverRow } from './ArbeidsgiverRow';
import { CardTitle } from './CardTitle';

import styles from './PeriodeCard.module.scss';

const VentepølseRow = (): ReactElement => (
    <>
        <Tooltip content="Sykmeldingsperiode">
            <div className={styles.iconContainer} style={{ width: '20px' }}>
                <ClockDashedIcon title="Avventer system" fontSize="1.5rem" />
            </div>
        </Tooltip>
        <CardTitle className={styles.title}>VENTER</CardTitle>
    </>
);

interface SykmeldingsperiodeRowProps {
    periode: DatePeriod;
}

const SykmeldingsperiodeRow = ({ periode }: SykmeldingsperiodeRowProps): ReactElement => {
    const fom = dayjs(periode.fom).format(NORSK_DATOFORMAT);
    const tom = dayjs(periode.tom).format(NORSK_DATOFORMAT);

    return (
        <>
            <Tooltip content="Sykmeldingsperiode">
                <div className={styles.iconContainer}>
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

const SkjæringstidspunktRow = ({ periodetype, skjæringstidspunkt }: SkjæringstidspunktRowProps): ReactElement => {
    return (
        <>
            <Tooltip content="Skjæringstidspunkt">
                <div className={styles.iconContainer}>
                    <Skjæringstidspunktikon alt="Skjæringstidspunkt" />
                </div>
            </Tooltip>
            {periodetype === Periodetype.OvergangFraIt ? (
                <BodyShort>Skjæringstidspunkt i Infotrygd/Gosys</BodyShort>
            ) : (
                <BodyShort>{dayjs(skjæringstidspunkt).format(NORSK_DATOFORMAT)}</BodyShort>
            )}
        </>
    );
};

const harRedusertAntallSykepengedager = (periode: BeregnetPeriodeFragment): boolean => {
    const { forbrukteSykedager, gjenstaendeSykedager } = periode.periodevilkar.sykepengedager;
    return (
        typeof forbrukteSykedager === 'number' &&
        typeof gjenstaendeSykedager === 'number' &&
        forbrukteSykedager + gjenstaendeSykedager < 248
    );
};

interface MaksdatoRowProps {
    activePeriod: BeregnetPeriodeFragment;
}

const MaksdatoRow = ({ activePeriod }: MaksdatoRowProps): ReactElement => {
    const maksdatoDayjs = dayjs(activePeriod.maksdato);
    const maksdatotekst = maksdatoDayjs.isValid()
        ? `${maksdatoDayjs.format(NORSK_DATOFORMAT)} (${activePeriod.gjenstaendeSykedager ?? 'Ukjent antall'} dager igjen)`
        : '-';
    const alderVedSisteSykedag = activePeriod.periodevilkar.alder.alderSisteSykedag ?? null;

    return (
        <>
            <Tooltip content="Maksdato">
                <div className={styles.iconContainer}>
                    <Maksdatoikon alt="Maksdato" />
                </div>
            </Tooltip>
            <div className={styles.maksdato}>
                <BodyShort className={styles.noWrap}>{maksdatotekst}</BodyShort>
                {!!alderVedSisteSykedag &&
                    (alderVedSisteSykedag >= 70 ? (
                        <div className={styles.over70}>
                            <Tooltip content="Over 70 år">
                                <div className={styles.iconContainer}>
                                    <Advarselikon alt="Over 70 år" height={16} width={16} />
                                </div>
                            </Tooltip>
                            <BodyShort size="small">
                                <LovdataLenke paragraf="8-3">§ 8-3</LovdataLenke>
                            </BodyShort>
                        </div>
                    ) : (
                        harRedusertAntallSykepengedager(activePeriod) && (
                            <div className={styles.over67}>
                                <Tooltip content="Over 67 år - redusert antall sykepengedager">
                                    <Tag className={styles.tag} variant="info" size="small">
                                        Over 67 år
                                    </Tag>
                                </Tooltip>
                            </div>
                        )
                    ))}
            </div>
        </>
    );
};

const ArbeidsforholdOpphørt = ({
    arbeidsforhold,
    periode,
}: {
    arbeidsforhold: Arbeidsforhold[];
    periode: ActivePeriod;
}) => {
    const erAlleArbeidsforholdPåArbeidsgiverOpphørt = [...arbeidsforhold].every(
        (it) => it.sluttdato !== null && dayjs(it.sluttdato, ISO_DATOFORMAT).isSameOrBefore(periode.tom),
    );
    const sisteOpphørteArbeidsforhold =
        [...arbeidsforhold].sort((a, b) => (dayjs(a.sluttdato, ISO_DATOFORMAT).isBefore(b.sluttdato) ? -1 : 1))?.[0]
            ?.sluttdato ?? null;

    return (
        <>
            {erAlleArbeidsforholdPåArbeidsgiverOpphørt && sisteOpphørteArbeidsforhold && (
                <Box marginBlock="0 4">
                    <Tag variant="info-moderate" style={{ fontSize: 16 }} size="small">
                        Opphørt {dayjs(sisteOpphørteArbeidsforhold, ISO_DATOFORMAT).format(NORSK_DATOFORMAT)}
                    </Tag>
                </Box>
            )}
        </>
    );
};

interface PeriodeCardUberegnetProps {
    periode: UberegnetPeriodeFragment;
    arbeidsgiver: ArbeidsgiverFragment;
    månedsbeløp?: number;
}

const PeriodeCardUberegnet = ({ periode, arbeidsgiver, månedsbeløp }: PeriodeCardUberegnetProps): ReactElement => {
    return (
        <div>
            <ArbeidsforholdOpphørt arbeidsforhold={arbeidsgiver.arbeidsforhold} periode={periode} />
            <section className={styles.grid}>
                {[Periodetilstand.UtbetaltVenterPaEnAnnenPeriode, Periodetilstand.VenterPaEnAnnenPeriode].includes(
                    periode.periodetilstand,
                ) ? (
                    <VentepølseRow />
                ) : (
                    <>
                        <span className={styles.egenskaper}>
                            <EgenskaperTags
                                egenskaper={[
                                    {
                                        __typename: 'Oppgaveegenskap',
                                        egenskap:
                                            periode.periodetype === Periodetype.Forlengelse
                                                ? Egenskap.Forlengelse
                                                : Egenskap.Forstegangsbehandling,
                                        kategori: Kategori.Periodetype,
                                    },
                                ]}
                            />
                        </span>
                        <span />
                    </>
                )}
                <SykmeldingsperiodeRow periode={periode} />
                <SkjæringstidspunktRow
                    periodetype={periode.periodetype}
                    skjæringstidspunkt={periode.skjaeringstidspunkt}
                />
                <ArbeidsgiverRow.Uberegnet
                    navn={arbeidsgiver.navn}
                    organisasjonsnummer={arbeidsgiver.organisasjonsnummer}
                    arbeidsforhold={arbeidsgiver.arbeidsforhold}
                    månedsbeløp={månedsbeløp}
                />
            </section>
        </div>
    );
};

interface PeriodeCardBeregnetProps {
    periode: BeregnetPeriodeFragment;
    arbeidsgiver: ArbeidsgiverFragment;
    månedsbeløp: number | undefined;
}

const PeriodeCardBeregnet = ({ periode, arbeidsgiver, månedsbeløp }: PeriodeCardBeregnetProps): ReactElement => {
    const egenskaperForVisning = periode.egenskaper.filter(
        (it) => it.kategori !== Kategori.Mottaker && it.kategori !== Kategori.Inntektskilde,
    );
    return (
        <div>
            <ArbeidsforholdOpphørt arbeidsforhold={arbeidsgiver.arbeidsforhold} periode={periode} />
            <span className={styles.egenskaper}>
                {[Periodetilstand.UtbetaltVenterPaEnAnnenPeriode, Periodetilstand.VenterPaEnAnnenPeriode].includes(
                    periode.periodetilstand,
                ) ? (
                    <VentepølseRow />
                ) : (
                    <EgenskaperTags egenskaper={egenskaperForVisning} />
                )}
            </span>
            <section className={styles.grid}>
                <SykmeldingsperiodeRow periode={periode} />
                <SkjæringstidspunktRow
                    periodetype={periode.periodetype}
                    skjæringstidspunkt={periode.skjaeringstidspunkt}
                />
                <MaksdatoRow activePeriod={periode} />
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
    arbeidsgiver: ArbeidsgiverFragment;
}

const PeriodeCardGhost = ({ arbeidsgiver }: PeriodeCardGhostProps): ReactElement => {
    return (
        <section className={styles.grid}>
            <ArbeidsgiverRow.Ghost
                navn={arbeidsgiver.navn}
                organisasjonsnummer={arbeidsgiver.organisasjonsnummer}
                arbeidsforhold={arbeidsgiver.arbeidsforhold}
            />
        </section>
    );
};

interface PeriodeCardTilkommenProps {
    arbeidsgiver: ArbeidsgiverFragment;
}

const PeriodeCardTilkommen = ({ arbeidsgiver }: PeriodeCardTilkommenProps): ReactElement => {
    return (
        <section className={styles.grid}>
            <ArbeidsgiverRow.Tilkommen
                navn={arbeidsgiver.navn}
                organisasjonsnummer={arbeidsgiver.organisasjonsnummer}
                arbeidsforhold={arbeidsgiver.arbeidsforhold}
            />
        </section>
    );
};

const PeriodeCardSkeleton = (): ReactElement => {
    return (
        <section className={classNames(styles.skeleton, styles.grid)}>
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
    Tilkommen: PeriodeCardTilkommen,
    Skeleton: PeriodeCardSkeleton,
};
