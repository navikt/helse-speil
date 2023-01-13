import { SisteTreMånedersInntekt } from './SisteTreMånedersInntekt';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Bold } from '@components/Bold';
import { Inntektskilde, Maybe, OmregnetArsinntekt } from '@io/graphql';
import { somPenger } from '@utils/locale';

import styles from './ReadOnlyInntekt.module.css';

interface OmregnetÅrsinntektProps {
    omregnetÅrsinntekt: OmregnetArsinntekt;
    deaktivert?: Maybe<boolean>;
}

const OmregnetÅrsinntekt: React.FC<OmregnetÅrsinntektProps> = ({ omregnetÅrsinntekt, deaktivert }) => {
    return (
        <>
            {omregnetÅrsinntekt.inntektFraAOrdningen && (
                <SisteTreMånedersInntekt
                    inntektFraAOrdningen={omregnetÅrsinntekt.inntektFraAOrdningen}
                    visHjelpetekst={omregnetÅrsinntekt.kilde === Inntektskilde.Aordningen}
                />
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

export const ReadOnlyInntekt: React.FC<ReadOnlyInntektProps> = ({ omregnetÅrsinntekt, deaktivert }) => {
    return (
        <>
            {omregnetÅrsinntekt?.kilde === Inntektskilde.Aordningen ? (
                <OmregnetÅrsinntekt omregnetÅrsinntekt={omregnetÅrsinntekt!} deaktivert={deaktivert} />
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
};
