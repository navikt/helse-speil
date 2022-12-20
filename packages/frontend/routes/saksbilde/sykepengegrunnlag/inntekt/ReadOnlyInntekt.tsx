import dayjs from 'dayjs';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Bold } from '@components/Bold';
import { Flex } from '@components/Flex';
import { PopoverHjelpetekst } from '@components/PopoverHjelpetekst';
import { SortInfoikon } from '@components/ikoner/SortInfoikon';
import { InntektFraAOrdningen, Inntektskilde, Maybe, OmregnetArsinntekt } from '@io/graphql';
import { getMonthName, somPenger } from '@utils/locale';

import styles from './ReadOnlyInntekt.module.css';

const getSorterteInntekter = (inntekterFraAOrdningen: Array<InntektFraAOrdningen>): Array<InntektFraAOrdningen> => {
    return [...inntekterFraAOrdningen].sort((a, b) =>
        dayjs(a.maned, 'YYYY-MM').isAfter(dayjs(b.maned, 'YYYY-MM')) ? -1 : 1
    );
};

interface InntektFraAordningenProps {
    omregnetÅrsinntekt: OmregnetArsinntekt;
    deaktivert?: Maybe<boolean>;
}

const InntektFraAordningen: React.FC<InntektFraAordningenProps> = ({ omregnetÅrsinntekt, deaktivert }) => {
    return (
        <>
            <Flex alignItems="center">
                <h3 className={styles.Title}>RAPPORTERT SISTE 3 MÅNEDER</h3>
                <PopoverHjelpetekst className={styles.InfoIcon} ikon={<SortInfoikon />}>
                    <p>
                        Ved manglende inntektsmelding legges 3 siste måneders innrapporterte inntekter fra A-ordningen
                        til grunn
                    </p>
                </PopoverHjelpetekst>
            </Flex>
            {omregnetÅrsinntekt.inntektFraAOrdningen && (
                <div className={styles.Grid}>
                    {getSorterteInntekter(omregnetÅrsinntekt.inntektFraAOrdningen).map((inntekt, i) => (
                        <React.Fragment key={i}>
                            <BodyShort> {getMonthName(inntekt.maned)}</BodyShort>
                            <BodyShort>{somPenger(inntekt.sum)}</BodyShort>
                        </React.Fragment>
                    ))}
                </div>
            )}
            <hr className={styles.Divider} />
            <div className={styles.Grid}>
                <BodyShort>Gj.snittlig månedsinntekt</BodyShort>
                <BodyShort>{somPenger(omregnetÅrsinntekt.manedsbelop)}</BodyShort>
                <Bold>Omregnet rapportert årsinntekt</Bold>
                <Bold>{somPenger(omregnetÅrsinntekt.belop)}</Bold>
            </div>
            {!deaktivert && (
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

interface ReadOnlyInntektProps {
    omregnetÅrsinntekt?: Maybe<OmregnetArsinntekt>;
    deaktivert?: Maybe<boolean>;
}

export const ReadOnlyInntekt: React.FC<ReadOnlyInntektProps> = ({ omregnetÅrsinntekt, deaktivert }) => (
    <>
        {omregnetÅrsinntekt?.kilde === Inntektskilde.Aordningen ? (
            <InntektFraAordningen omregnetÅrsinntekt={omregnetÅrsinntekt!} deaktivert={deaktivert} />
        ) : (
            <div className={styles.Grid}>
                <BodyShort>Månedsbeløp</BodyShort>
                <BodyShort>{somPenger(omregnetÅrsinntekt?.manedsbelop)}</BodyShort>
                <BodyShort>
                    {omregnetÅrsinntekt?.kilde === Inntektskilde.Infotrygd
                        ? 'Sykepengegrunnlag før 6G'
                        : 'Omregnet til årsinntekt'}
                </BodyShort>
                <Bold>{somPenger(omregnetÅrsinntekt?.belop)}</Bold>
            </div>
        )}
    </>
);
