import dayjs from 'dayjs';
import React, { ReactElement } from 'react';

import { SleepIcon, XMarkIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Tag, Tooltip } from '@navikt/ds-react';

import { EgenskaperTags } from '@components/EgenskaperTags';
import { LoadingShimmer } from '@components/LoadingShimmer';
import { LovdataLenke } from '@components/LovdataLenke';
import { Advarselikon } from '@components/ikoner/Advarselikon';
import { Maksdatoikon } from '@components/ikoner/Maksdatoikon';
import { Skjæringstidspunktikon } from '@components/ikoner/Skjæringstidspunktikon';
import { Sykmeldingsperiodeikon } from '@components/ikoner/Sykmeldingsperiodeikon';
import {
    ApiArbeidsforhold,
    ApiArbeidsgiver,
    ApiBeregnetPeriode,
    ApiEgenskap,
    ApiKategori,
    ApiPeriodetilstand,
    ApiPeriodetype,
    ApiUberegnetPeriode,
} from '@io/rest/generated/spesialist.schemas';
import { Inntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import { isForkastet } from '@state/selectors/period';
import { ActivePeriod, DatePeriod, DateString } from '@typer/shared';
import { ISO_DATOFORMAT, NORSK_DATOFORMAT, somNorskDato } from '@utils/date';
import { cn } from '@utils/tw';
import { isArbeidsgiver } from '@utils/typeguards';

import { CardTitle } from './CardTitle';
import { InntektsforholdRow } from './InntektsforholdRow';

import styles from './PeriodeCard.module.scss';

const VentepølseRow = (): ReactElement => (
    <>
        <Tooltip content="Avventer system">
            <div role="img" className={styles.iconContainer} style={{ width: '20px' }}>
                <SleepIcon aria-hidden fontSize="1.5rem" />
            </div>
        </Tooltip>
        <CardTitle className={styles.title}>VENTER</CardTitle>
    </>
);

interface SykmeldingsperiodeRowProps {
    periode: DatePeriod;
}

const SykmeldingsperiodeRow = ({ periode }: SykmeldingsperiodeRowProps): ReactElement => {
    const fom = somNorskDato(periode.fom);
    const tom = somNorskDato(periode.tom);

    return (
        <>
            <Tooltip content="Sykmeldingsperiode">
                <div role="img" className={styles.iconContainer}>
                    <Sykmeldingsperiodeikon />
                </div>
            </Tooltip>
            <BodyShort>{`${fom} - ${tom}`}</BodyShort>
        </>
    );
};

interface SkjæringstidspunktRowProps {
    periodetype: ApiPeriodetype;
    skjæringstidspunkt: DateString;
}

const SkjæringstidspunktRow = ({ periodetype, skjæringstidspunkt }: SkjæringstidspunktRowProps): ReactElement => {
    return (
        <>
            <Tooltip content="Skjæringstidspunkt">
                <div role="img" className={styles.iconContainer}>
                    <Skjæringstidspunktikon />
                </div>
            </Tooltip>
            {periodetype === ApiPeriodetype.OVERGANG_FRA_IT ? (
                <BodyShort>Skjæringstidspunkt i Infotrygd/Gosys</BodyShort>
            ) : (
                <BodyShort>{somNorskDato(skjæringstidspunkt)}</BodyShort>
            )}
        </>
    );
};

const harRedusertAntallSykepengedager = (periode: ApiBeregnetPeriode): boolean => {
    const { forbrukteSykedager, gjenstaendeSykedager } = periode.periodevilkar.sykepengedager;
    return (
        typeof forbrukteSykedager === 'number' &&
        typeof gjenstaendeSykedager === 'number' &&
        forbrukteSykedager + gjenstaendeSykedager < 248
    );
};

interface MaksdatoRowProps {
    activePeriod: ApiBeregnetPeriode;
    dødsdato?: DateString;
}

const MaksdatoRow = ({ activePeriod, dødsdato }: MaksdatoRowProps): ReactElement => {
    const maksdatoDayjs = dayjs(activePeriod.maksdato);
    const maksdatotekst = maksdatoDayjs.isValid()
        ? `${maksdatoDayjs.format(NORSK_DATOFORMAT)} (${activePeriod.gjenstaendeSykedager ?? 'Ukjent antall'} dager igjen)`
        : '-';
    const alderVedSisteSykedag = activePeriod.periodevilkar.alder.alderSisteSykedag ?? null;

    return (
        <>
            <Tooltip content="Maksdato">
                <div role="img" className={styles.iconContainer}>
                    <Maksdatoikon />
                </div>
            </Tooltip>
            <div className={styles.maksdato}>
                <BodyShort className={styles.noWrap}>{maksdatotekst}</BodyShort>
                {!!alderVedSisteSykedag && maksdatoToolTip(alderVedSisteSykedag, activePeriod, dødsdato)}
            </div>
        </>
    );
};

function maksdatoToolTip(alderVedSisteSykedag: number, activePeriod: ApiBeregnetPeriode, dødsdato: string | undefined) {
    if (dødsdato) {
        return (
            <Tooltip content={`Personen døde ${dayjs(dødsdato)?.format(NORSK_DATOFORMAT)}`} describesChild>
                <Tag variant="neutral-filled" size="small">
                    Død
                </Tag>
            </Tooltip>
        );
    } else if (alderVedSisteSykedag >= 70) {
        return (
            <div className={styles.over70}>
                <Tooltip content="Over 70 år">
                    <div role="img" className={styles.iconContainer}>
                        <Advarselikon height={16} width={16} />
                    </div>
                </Tooltip>
                <BodyShort size="small">
                    <LovdataLenke paragraf="8-3">§ 8-3</LovdataLenke>
                </BodyShort>
            </div>
        );
    } else if (harRedusertAntallSykepengedager(activePeriod) && alderVedSisteSykedag >= 67) {
        return (
            <div className={styles.over67}>
                <Tooltip content="Over 67 år - redusert antall sykepengedager" describesChild>
                    <Tag className={styles.tag} variant="info" size="small">
                        Over 67 år
                    </Tag>
                </Tooltip>
            </div>
        );
    }
    return null;
}

const ArbeidsforholdOpphørt = ({
    arbeidsforhold,
    periode,
}: {
    arbeidsforhold: ApiArbeidsforhold[];
    periode: ActivePeriod;
}) => {
    const erAlleArbeidsforholdPåArbeidsgiverOpphørt = [...arbeidsforhold].every(
        (it) => it.sluttdato !== null && dayjs(it.sluttdato, ISO_DATOFORMAT).isSameOrBefore(periode.tom),
    );
    const sisteOpphørteArbeidsforhold =
        [...arbeidsforhold].sort((a, b) => (dayjs(a.sluttdato, ISO_DATOFORMAT).isBefore(b.sluttdato) ? 1 : -1))?.[0]
            ?.sluttdato ?? null;

    return (
        <>
            {erAlleArbeidsforholdPåArbeidsgiverOpphørt && sisteOpphørteArbeidsforhold && (
                <Box marginBlock="space-0 space-16">
                    <Tag variant="strong" data-color="info" style={{ fontSize: 16 }} size="small">
                        Arbeidsforhold opphørt {somNorskDato(sisteOpphørteArbeidsforhold)}
                    </Tag>
                </Box>
            )}
        </>
    );
};

interface PeriodeCardUberegnetProps {
    periode: ApiUberegnetPeriode;
    inntektsforhold: Inntektsforhold;
    månedsbeløp?: number;
}

const PeriodeCardUberegnet = ({ periode, inntektsforhold }: PeriodeCardUberegnetProps): ReactElement => {
    const arbeidsforhold = isArbeidsgiver(inntektsforhold) ? inntektsforhold.arbeidsforhold : [];
    const erVenteperiode = (
        [
            ApiPeriodetilstand.UtbetaltVenterPaEnAnnenPeriode,
            ApiPeriodetilstand.VenterPaEnAnnenPeriode,
        ] as ApiPeriodetilstand[]
    ).includes(periode.periodetilstand);
    return (
        <div>
            {isForkastet(periode) && (
                <Box paddingBlock="space-0 space-8">
                    <Tag variant="strong" data-color="danger" size="small" icon={<XMarkIcon aria-hidden />}>
                        Tatt ut av speil
                    </Tag>
                </Box>
            )}
            <ArbeidsforholdOpphørt arbeidsforhold={arbeidsforhold} periode={periode} />
            <section className={styles.grid}>
                {erVenteperiode ? (
                    <VentepølseRow />
                ) : (
                    <>
                        <span className={styles.egenskaper}>
                            <EgenskaperTags
                                egenskaper={[
                                    periode.periodetype === ApiPeriodetype.FORLENGELSE
                                        ? ApiEgenskap.FORLENGELSE
                                        : ApiEgenskap.FORSTEGANGSBEHANDLING,
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
                <InntektsforholdRow arbeidsforhold={arbeidsforhold} inntektsforhold={inntektsforhold} />
            </section>
        </div>
    );
};

interface PeriodeCardBeregnetProps {
    periode: ApiBeregnetPeriode;
    arbeidsforhold: ApiArbeidsforhold[];
    inntektsforhold: Inntektsforhold;
    dødsdato?: DateString;
}

const PeriodeCardBeregnet = ({
    periode,
    arbeidsforhold,
    inntektsforhold,
    dødsdato,
}: PeriodeCardBeregnetProps): ReactElement => {
    const egenskaper = periode.egenskaper.map((it) => it.egenskap);
    const jordbrukerReindrift = egenskaper.includes(ApiEgenskap.JORDBRUKER_REINDRIFT);

    const egenskaperForVisning = periode.egenskaper
        .filter((it) => {
            const erMottaker = it.kategori === ApiKategori.Mottaker;
            const erInntektskilde = it.kategori === ApiKategori.Inntektskilde;
            const erForsikring = it.egenskap === ApiEgenskap.FORSIKRING;
            const erJordbrukerReindrift =
                jordbrukerReindrift && it.egenskap === ApiEgenskap.SELVSTENDIG_NAERINGSDRIVENDE;

            return !erMottaker && !erInntektskilde && !erForsikring && !erJordbrukerReindrift;
        })
        .map((it) => it.egenskap);

    const erVenteperiode = (
        [
            ApiPeriodetilstand.UtbetaltVenterPaEnAnnenPeriode,
            ApiPeriodetilstand.VenterPaEnAnnenPeriode,
        ] as ApiPeriodetilstand[]
    ).includes(periode.periodetilstand);

    return (
        <div>
            <ArbeidsforholdOpphørt arbeidsforhold={arbeidsforhold} periode={periode} />
            <span className={styles.egenskaper}>
                {erVenteperiode ? <VentepølseRow /> : <EgenskaperTags egenskaper={egenskaperForVisning} />}
            </span>
            <section className={styles.grid}>
                <SykmeldingsperiodeRow periode={periode} />
                <SkjæringstidspunktRow
                    periodetype={periode.periodetype}
                    skjæringstidspunkt={periode.skjaeringstidspunkt}
                />
                <MaksdatoRow activePeriod={periode} dødsdato={dødsdato} />
                <InntektsforholdRow arbeidsforhold={arbeidsforhold} inntektsforhold={inntektsforhold} />
            </section>
        </div>
    );
};

interface PeriodeCardGhostProps {
    arbeidsgiver: ApiArbeidsgiver;
    inntektsforhold: Inntektsforhold;
}

const PeriodeCardGhost = ({ arbeidsgiver, inntektsforhold }: PeriodeCardGhostProps): ReactElement => {
    return (
        <section className={styles.grid}>
            <InntektsforholdRow arbeidsforhold={arbeidsgiver.arbeidsforhold} inntektsforhold={inntektsforhold} />
        </section>
    );
};

interface PeriodeCardTilkommenProps {
    arbeidsgiver: ApiArbeidsgiver;
    inntektsforhold: Inntektsforhold;
}

const PeriodeCardTilkommen = ({ arbeidsgiver, inntektsforhold }: PeriodeCardTilkommenProps): ReactElement => {
    return (
        <section className={styles.grid}>
            <InntektsforholdRow arbeidsforhold={arbeidsgiver.arbeidsforhold} inntektsforhold={inntektsforhold} />
        </section>
    );
};

const PeriodeCardSkeleton = (): ReactElement => {
    return (
        <section className={cn(styles.skeleton, styles.grid)}>
            {Array.from({ length: 10 }, (_, index) => (
                <LoadingShimmer key={index} />
            ))}
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
