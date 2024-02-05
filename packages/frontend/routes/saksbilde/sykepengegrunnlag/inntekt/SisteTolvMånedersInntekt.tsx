import classNames from 'classnames';
import dayjs from 'dayjs';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Flex } from '@components/Flex';
import { Kilde } from '@components/Kilde';
import { InntektFraAOrdningen, Inntektskilde } from '@io/graphql';
import { ISO_DATOFORMAT } from '@utils/date';
import { kildeForkortelse } from '@utils/inntektskilde';
import { getMonthName, somPenger } from '@utils/locale';

import styles from './ReadOnlyInntekt.module.css';

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
    const gjennomsnittSiste3Mnd =
        sisteXmåneder
            .slice(0, 3)
            .filter((it) => it.sum !== null)
            .reduce((acc, obj) => acc + (obj?.sum ?? 0), 0) / 3;

    return (
        <>
            <Flex alignItems="center" className={styles.SisteTolvMndInntekt}>
                <h3 className={styles.Title}>RAPPORTERT SISTE {antallMåneder} MÅNEDER</h3>
                <Kilde type={Inntektskilde.Aordningen} className={styles.Kildeikon}>
                    {kildeForkortelse(Inntektskilde.Aordningen)}
                </Kilde>
            </Flex>
            <div
                className={classNames(styles.Grid, harInntekterForSammenligningsgrunnlag && styles.sammenligningsgrid)}
            >
                <>
                    <div />
                    <BodyShort className={styles.bold}>§ 8-28</BodyShort>
                    {harInntekterForSammenligningsgrunnlag && <BodyShort className={styles.bold}>§ 8-30</BodyShort>}
                </>
                <>
                    <BodyShort className={classNames(styles.bold, styles.gjennomsnitt)}>
                        Gjennomsnitt siste 3 mnd
                    </BodyShort>
                    <BodyShort className={styles.gjennomsnitt}>{somPenger(gjennomsnittSiste3Mnd)}</BodyShort>
                    {harInntekterForSammenligningsgrunnlag && <div className={styles.gjennomsnitt} />}
                </>
                {sisteXmåneder.map((inntekt, i) => (
                    <React.Fragment key={i}>
                        <BodyShort>
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
                <div className={styles.ArbeidsforholdInfoText}>
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
