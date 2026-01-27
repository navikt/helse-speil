import dayjs from 'dayjs';
import React from 'react';

import { Detail, HStack } from '@navikt/ds-react';

import { Kilde } from '@components/Kilde';
import { InntektFraAOrdningen, Inntektskilde } from '@io/graphql';
import { SisteTolvMånederTabell } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjon/SisteTolvMånederTabell';
import { DateString } from '@typer/shared';
import { ISO_DATOFORMAT } from '@utils/date';
import { kildeForkortelse } from '@utils/inntektskilde';

import styles from './SisteTolvMånedersInntekt.module.css';

const getSorterteInntekter = (inntekterFraAOrdningen: InntektFraAOrdningen[]): InntektFraAOrdningen[] => {
    return [...inntekterFraAOrdningen].sort((a, b) =>
        dayjs(a.maned, 'YYYY-MM').isAfter(dayjs(b.maned, 'YYYY-MM')) ? -1 : 1,
    );
};

const leggInnIkkeRapporterteMåneder = (
    skjæringstidspunkt: DateString,
    inntekterFraAordningen: InntektFraAOrdningen[],
    antallMåneder: number = 12,
) =>
    [...Array(antallMåneder)].map((_, i) => {
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
    inntektFraAOrdningen?: InntektFraAOrdningen[];
    erAktivGhost?: boolean | null;
    inntekterForSammenligningsgrunnlag?: InntektFraAOrdningen[];
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
            <HStack gap="space-8" align="center">
                <Detail as="h2" uppercase weight="semibold" textColor="subtle">
                    RAPPORTERT SISTE {antallMåneder} MÅNEDER
                </Detail>
                <Kilde type={Inntektskilde.Aordningen}>{kildeForkortelse(Inntektskilde.Aordningen)}</Kilde>
            </HStack>
            <SisteTolvMånederTabell
                sisteXmåneder={sisteXmåneder}
                harInntekterForSammenligningsgrunnlag={harInntekterForSammenligningsgrunnlag}
                inntekterForSammenligningsgrunnlag={inntekterForSammenligningsgrunnlag}
            />
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
