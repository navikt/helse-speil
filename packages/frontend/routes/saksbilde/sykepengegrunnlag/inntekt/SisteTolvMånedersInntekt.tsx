import dayjs from 'dayjs';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Flex } from '@components/Flex';
import { Kilde } from '@components/Kilde';
import { PopoverHjelpetekst } from '@components/PopoverHjelpetekst';
import { SortInfoikon } from '@components/ikoner/SortInfoikon';
import { InntektFraAOrdningen, Inntektskilde } from '@io/graphql';
import { kildeForkortelse } from '@utils/inntektskilde';
import { getMonthName, somPenger } from '@utils/locale';

import styles from './ReadOnlyInntekt.module.css';

const getSorterteInntekter = (inntekterFraAOrdningen: Array<InntektFraAOrdningen>): Array<InntektFraAOrdningen> => {
    return [...inntekterFraAOrdningen].sort((a, b) =>
        dayjs(a.maned, 'YYYY-MM').isAfter(dayjs(b.maned, 'YYYY-MM')) ? -1 : 1,
    );
};

type InntektFraAOrdningenProps = {
    inntektFraAOrdningen?: Array<InntektFraAOrdningen>;
    visHjelpetekst?: boolean;
    erAktivGhost?: Maybe<boolean>;
};

export const SisteTolvMånedersInntekt = ({
    inntektFraAOrdningen,
    visHjelpetekst = false,
    erAktivGhost = false,
}: InntektFraAOrdningenProps) => {
    if (!inntektFraAOrdningen) {
        return;
    }
    return (
        <>
            <Flex alignItems="center" className={styles.SisteTolvMndInntekt}>
                <h3 className={styles.Title}>
                    RAPPORTERT SISTE {inntektFraAOrdningen.length > 3 ? '12' : '3'} MÅNEDER
                </h3>
                {visHjelpetekst ? (
                    <PopoverHjelpetekst className={styles.InfoIcon} ikon={<SortInfoikon />}>
                        <p>
                            Ved manglende inntektsmelding legges 3 siste måneders innrapporterte inntekter fra
                            A-ordningen til grunn
                        </p>
                    </PopoverHjelpetekst>
                ) : (
                    <Kilde type={Inntektskilde.Aordningen} className={styles.Kildeikon}>
                        {kildeForkortelse(Inntektskilde.Aordningen)}
                    </Kilde>
                )}
            </Flex>
            <div className={styles.Grid}>
                {getSorterteInntekter(inntektFraAOrdningen).map((inntekt, i) => (
                    <React.Fragment key={i}>
                        <BodyShort> {getMonthName(inntekt.maned)}</BodyShort>
                        <BodyShort>{somPenger(inntekt.sum)}</BodyShort>
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
