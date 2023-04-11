import { SisteTreMånedersInntekt } from './SisteTreMånedersInntekt';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Bold } from '@components/Bold';
import { Endringstrekant } from '@components/Endringstrekant';
import { Flex } from '@components/Flex';
import { Kilde } from '@components/Kilde';
import { Inntektoverstyring, Inntektskilde, Maybe, OmregnetArsinntekt } from '@io/graphql';
import { kildeForkortelse } from '@utils/inntektskilde';
import { somPenger } from '@utils/locale';

import { EndringsloggButton } from './EndringsloggButton';

import styles from './ReadOnlyInntekt.module.css';

interface OmregnetÅrsinntektProps {
    omregnetÅrsinntekt: OmregnetArsinntekt;
    deaktivert?: Maybe<boolean>;
}

const GhostInntektsinformasjon: React.FC<OmregnetÅrsinntektProps> = ({ omregnetÅrsinntekt, deaktivert }) => {
    return (
        <>
            {omregnetÅrsinntekt.inntektFraAOrdningen && (
                <SisteTreMånedersInntekt
                    inntektFraAOrdningen={omregnetÅrsinntekt.inntektFraAOrdningen}
                    visHjelpetekst={omregnetÅrsinntekt.kilde === Inntektskilde.Aordningen}
                />
            )}
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
    lokaltMånedsbeløp: Maybe<number>;
    endret: boolean;
    inntektsendringer: Inntektoverstyring[];
}

export const ReadOnlyInntekt: React.FC<ReadOnlyInntektProps> = ({
    omregnetÅrsinntekt,
    deaktivert,
    lokaltMånedsbeløp = null,
    endret,
    inntektsendringer,
}) => {
    const harInntektskildeAOrdningen = omregnetÅrsinntekt?.kilde === Inntektskilde.Aordningen;

    return (
        <>
            <div className={styles.BeregnetGrid}>
                <BodyShort>{harInntektskildeAOrdningen ? 'Gj.snittlig månedsinntekt' : 'Månedsbeløp'}</BodyShort>
                <Flex style={{ justifyContent: 'right' }}>
                    <div style={{ position: 'relative', paddingLeft: '1rem' }}>
                        {(endret || lokaltMånedsbeløp) && (
                            <Endringstrekant text="Endringene vil oppdateres og kalkuleres etter du har trykket på kalkuler" />
                        )}
                        <BodyShort>{somPenger(lokaltMånedsbeløp || omregnetÅrsinntekt?.manedsbelop)}</BodyShort>
                    </div>
                </Flex>
                <div style={{ position: 'relative' }}>
                    {endret || lokaltMånedsbeløp || omregnetÅrsinntekt?.kilde === Inntektskilde.Saksbehandler ? (
                        <EndringsloggButton endringer={inntektsendringer} />
                    ) : (
                        <Kilde type={omregnetÅrsinntekt?.kilde} className={styles.Kildeikon}>
                            {kildeForkortelse(omregnetÅrsinntekt?.kilde)}
                        </Kilde>
                    )}
                </div>
                <BodyShort>
                    {omregnetÅrsinntekt?.kilde === Inntektskilde.Infotrygd
                        ? 'Sykepengegrunnlag før 6G'
                        : harInntektskildeAOrdningen
                        ? 'Omregnet rapportert årsinntekt'
                        : 'Omregnet til årsinntekt'}
                </BodyShort>
                <Bold>{somPenger(omregnetÅrsinntekt?.belop)}</Bold>
            </div>
            {harInntektskildeAOrdningen && (
                <GhostInntektsinformasjon omregnetÅrsinntekt={omregnetÅrsinntekt!} deaktivert={deaktivert} />
            )}
        </>
    );
};
