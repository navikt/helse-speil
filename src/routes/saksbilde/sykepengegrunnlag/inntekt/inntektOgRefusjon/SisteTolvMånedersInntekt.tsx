import classNames from 'classnames';
import dayjs from 'dayjs';
import React from 'react';

import { BodyShort, Detail, HStack } from '@navikt/ds-react';

import { Kilde } from '@components/Kilde';
import { InntektFraAOrdningen, Inntektskilde, Maybe } from '@io/graphql';
import { DateString } from '@typer/shared';
import { ISO_DATOFORMAT } from '@utils/date';
import { kildeForkortelse } from '@utils/inntektskilde';
import { getMonthName, somPenger } from '@utils/locale';

import styles from './SisteTolvMånedersInntekt.module.css';

const getSorterteInntekter = (inntekterFraAOrdningen: Array<InntektFraAOrdningen>): Array<InntektFraAOrdningen> => {
    return [...inntekterFraAOrdningen].sort((a, b) =>
        dayjs(a.maned, 'YYYY-MM').isAfter(dayjs(b.maned, 'YYYY-MM')) ? -1 : 1,
    );
};

const leggInnIkkeRapporterteMåneder = (
    skjæringstidspunkt: DateString,
    inntekterFraAordningen: Array<InntektFraAOrdningen>,
    antallMåneder: number = 12,
) =>
    [...Array(antallMåneder)].map((m, i) => {
        const aktuellMnd = dayjs(skjæringstidspunkt, ISO_DATOFORMAT)
            .subtract(i + 1, 'month')
            .format('YYYY-MM');
        return (
            inntekterFraAordningen.find((d) => dayjs(d.maned, 'YYYY-MM').isSame(aktuellMnd)) || {
                maned: aktuellMnd,
                sum: null,
            }
        );
    });

const visningSammenligningsgrunnlag = (
    inntekterForSammenligningsgrunnlag: Array<InntektFraAOrdningen>,
    maned: string,
) => {
    const inntekt = inntekterForSammenligningsgrunnlag.filter((d) => dayjs(d.maned, 'YYYY-MM').isSame(maned));
    const sum = inntekt.reduce((summert, { sum }) => summert + (sum ?? 0), 0);
    return inntekt.length !== 0 ? somPenger(sum) : 'Ikke rapportert';
};

type InntektFraAOrdningenProps = {
    skjæringstidspunkt: string;
    inntektFraAOrdningen?: Array<InntektFraAOrdningen>;
    erAktivGhost?: Maybe<boolean>;
    inntekterForSammenligningsgrunnlag?: Array<InntektFraAOrdningen>;
};

export const SisteTolvMånedersInntekt = ({
    skjæringstidspunkt,
    inntektFraAOrdningen,
    erAktivGhost = false,
    inntekterForSammenligningsgrunnlag = [],
}: InntektFraAOrdningenProps) => {
    if (!inntektFraAOrdningen) {
        return;
    }
    const harInntekterForSammenligningsgrunnlag = inntekterForSammenligningsgrunnlag.length !== 0;
    const antallMåneder = !harInntekterForSammenligningsgrunnlag ? 3 : 12;
    const sisteXmåneder = leggInnIkkeRapporterteMåneder(
        skjæringstidspunkt,
        getSorterteInntekter(inntektFraAOrdningen),
        antallMåneder,
    );

    return (
        <>
            <HStack gap="2" align="center">
                <Detail as="h2" className={styles.title} uppercase weight="semibold" textColor="subtle">
                    RAPPORTERT SISTE {antallMåneder} MÅNEDER
                </Detail>
                <Kilde type={Inntektskilde.Aordningen}>{kildeForkortelse(Inntektskilde.Aordningen)}</Kilde>
            </HStack>
            <div
                className={classNames(styles.grid, harInntekterForSammenligningsgrunnlag && styles.sammenligningsgrid)}
            >
                <ParagrafOverskrift harInntekterForSammenligningsgrunnlag={harInntekterForSammenligningsgrunnlag} />
                <Gjennomsnitt3Mnd
                    siste3mndInntekter828={sisteXmåneder.slice(0, 3)}
                    siste3mndInntekter830={inntekterForSammenligningsgrunnlag?.filter((it) =>
                        sisteXmåneder.slice(0, 3).some((siste3mnd) => siste3mnd.maned === it.maned),
                    )}
                    harInntekterForSammenligningsgrunnlag={harInntekterForSammenligningsgrunnlag}
                />
                {sisteXmåneder.map((inntekt, i) => (
                    <React.Fragment key={i}>
                        <BodyShort className={styles.bold}>
                            {getMonthName(inntekt.maned)} {inntekt.maned.split('-')[0]}
                        </BodyShort>
                        <BodyShort>{inntekt.sum !== null ? somPenger(inntekt.sum) : 'Ikke rapportert'}</BodyShort>
                        {harInntekterForSammenligningsgrunnlag && (
                            <BodyShort>
                                {visningSammenligningsgrunnlag(inntekterForSammenligningsgrunnlag, inntekt.maned)}
                            </BodyShort>
                        )}
                    </React.Fragment>
                ))}
            </div>
            {erAktivGhost && (
                <div className={styles.arbeidsforholdInfoText}>
                    <p>
                        Arbeidsforholdet er tatt med i beregningsgrunnlaget fordi det er <br />
                        innrapportert inntekt og/eller fordi arbeidsforholdet har startdato i <br />
                        løpet av de to siste månedene før skjæringstidspunktet.
                    </p>
                </div>
            )}
        </>
    );
};

const ParagrafOverskrift = ({
    harInntekterForSammenligningsgrunnlag,
}: {
    harInntekterForSammenligningsgrunnlag: boolean;
}) => (
    <>
        <div />
        <BodyShort className={styles.bold}>§ 8-28</BodyShort>
        {harInntekterForSammenligningsgrunnlag && <BodyShort className={styles.bold}>§ 8-30</BodyShort>}
    </>
);

const Gjennomsnitt3Mnd = ({
    siste3mndInntekter828,
    siste3mndInntekter830,
    harInntekterForSammenligningsgrunnlag,
}: {
    siste3mndInntekter828: (InntektFraAOrdningen | { maned: string; sum: null })[];
    siste3mndInntekter830: (InntektFraAOrdningen | { maned: string; sum: null })[];
    harInntekterForSammenligningsgrunnlag: boolean;
}) => {
    const gjennomsnittSiste3Mnd828 =
        siste3mndInntekter828.filter((it) => it.sum !== null).reduce((acc, obj) => acc + (obj?.sum ?? 0), 0) / 3;

    const harSiste3Mnd830 = siste3mndInntekter830.length > 0;
    const gjennomsnittSiste3Mnd830 = harSiste3Mnd830
        ? siste3mndInntekter830.reduce((acc, obj) => acc + (obj?.sum ?? 0), 0) / 3
        : 0;

    return (
        <>
            <BodyShort className={classNames(styles.bold, styles.gjennomsnitt)}>Gjennomsnitt siste 3 mnd</BodyShort>
            <BodyShort className={styles.gjennomsnitt}>{somPenger(gjennomsnittSiste3Mnd828)}</BodyShort>
            {harInntekterForSammenligningsgrunnlag && (
                <BodyShort className={styles.gjennomsnitt}>
                    {somPenger(harSiste3Mnd830 ? gjennomsnittSiste3Mnd830 : 0)}
                </BodyShort>
            )}
        </>
    );
};
