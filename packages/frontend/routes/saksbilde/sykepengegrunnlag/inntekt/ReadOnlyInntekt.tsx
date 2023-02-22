import { SisteTreMånedersInntekt } from './SisteTreMånedersInntekt';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Bold } from '@components/Bold';
import { Kilde } from '@components/Kilde';
import { Inntektoverstyring, Inntektskilde, Maybe, OmregnetArsinntekt } from '@io/graphql';
import { kildeForkortelse } from '@utils/inntektskilde';
import { somPenger } from '@utils/locale';

import { EndringsloggButton } from './EndringsloggButton';

import styles from './ReadOnlyInntekt.module.css';

interface OmregnetÅrsinntektProps {
    omregnetÅrsinntekt: OmregnetArsinntekt;
    deaktivert?: Maybe<boolean>;
    lokaltMånedsbeløp: Maybe<number>;
    endret: boolean;
    inntektsendringer: Inntektoverstyring[];
}

const OmregnetÅrsinntekt: React.FC<OmregnetÅrsinntektProps> = ({
    omregnetÅrsinntekt,
    deaktivert,
    lokaltMånedsbeløp = null,
    endret,
    inntektsendringer,
}) => {
    return (
        <>
            <div className={styles.BeregnetGrid}>
                <BodyShort>Gj.snittlig månedsinntekt</BodyShort>
                <BodyShort>{somPenger(omregnetÅrsinntekt.manedsbelop)}</BodyShort>
                <div>
                    {endret || lokaltMånedsbeløp || omregnetÅrsinntekt?.kilde === Inntektskilde.Saksbehandler ? (
                        <EndringsloggButton endringer={inntektsendringer} />
                    ) : (
                        <Kilde type={omregnetÅrsinntekt?.kilde} className={styles.Kildeikon}>
                            {kildeForkortelse(omregnetÅrsinntekt?.kilde)}
                        </Kilde>
                    )}
                </div>
                <Bold>Omregnet rapportert årsinntekt</Bold>
                <Bold>{somPenger(omregnetÅrsinntekt.belop)}</Bold>
            </div>
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
    return (
        <>
            {omregnetÅrsinntekt?.kilde === Inntektskilde.Aordningen ? (
                <OmregnetÅrsinntekt
                    omregnetÅrsinntekt={omregnetÅrsinntekt!}
                    deaktivert={deaktivert}
                    lokaltMånedsbeløp={lokaltMånedsbeløp}
                    endret={endret}
                    inntektsendringer={inntektsendringer}
                />
            ) : (
                <div className={styles.BeregnetGrid}>
                    <BodyShort>Månedsbeløp</BodyShort>
                    <BodyShort>{somPenger(lokaltMånedsbeløp || omregnetÅrsinntekt?.manedsbelop)}</BodyShort>
                    <div>
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
                            : 'Omregnet til årsinntekt'}
                    </BodyShort>
                    <Bold>{somPenger(omregnetÅrsinntekt?.belop)}</Bold>
                </div>
            )}
        </>
    );
};
