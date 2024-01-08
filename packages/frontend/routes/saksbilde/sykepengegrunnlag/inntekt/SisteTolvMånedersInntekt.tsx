import dayjs from 'dayjs';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Flex } from '@components/Flex';
import { Kilde } from '@components/Kilde';
import { PopoverHjelpetekst } from '@components/PopoverHjelpetekst';
import { SortInfoikon } from '@components/ikoner/SortInfoikon';
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

type InntektFraAOrdningenProps = {
    skjæringstidspunkt: string;
    inntektFraAOrdningen?: Array<InntektFraAOrdningen>;
    erInntektskildeAordningen?: boolean;
    erAktivGhost?: Maybe<boolean>;
};

export const SisteTolvMånedersInntekt = ({
    skjæringstidspunkt,
    inntektFraAOrdningen,
    erInntektskildeAordningen = false,
    erAktivGhost = false,
}: InntektFraAOrdningenProps) => {
    if (!inntektFraAOrdningen) {
        return;
    }
    const antallMåneder = erInntektskildeAordningen && inntektFraAOrdningen.length <= 3 ? 3 : 12;
    return (
        <>
            <Flex alignItems="center" className={styles.SisteTolvMndInntekt}>
                <h3 className={styles.Title}>RAPPORTERT SISTE {antallMåneder} MÅNEDER</h3>
                <Kilde type={Inntektskilde.Aordningen} className={styles.Kildeikon}>
                    {kildeForkortelse(Inntektskilde.Aordningen)}
                </Kilde>
                <PopoverHjelpetekst className={styles.InfoIcon} ikon={<SortInfoikon />}>
                    <p>
                        {erInntektskildeAordningen
                            ? 'Ved manglende inntektsmelding legges 3 siste måneders innrapporterte inntekter fra A-ordningen til grunn'
                            : 'Inntektene er hentet fra a-ordningen §8-28'}
                    </p>
                </PopoverHjelpetekst>
            </Flex>
            <div className={styles.Grid}>
                {leggInnIkkeRapporterteMåneder(
                    skjæringstidspunkt,
                    getSorterteInntekter(inntektFraAOrdningen),
                    antallMåneder,
                ).map((inntekt, i) => (
                    <React.Fragment key={i}>
                        <BodyShort>
                            {getMonthName(inntekt.maned)} {inntekt.maned.split('-')[0]}
                        </BodyShort>
                        <BodyShort>{inntekt.sum !== null ? somPenger(inntekt.sum) : 'Ikke rapportert'}</BodyShort>
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
