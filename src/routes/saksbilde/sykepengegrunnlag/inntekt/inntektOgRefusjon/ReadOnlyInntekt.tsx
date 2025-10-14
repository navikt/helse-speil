import React, { ReactElement } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Endringstrekant } from '@components/Endringstrekant';
import { Kilde } from '@components/Kilde';
import { Inntektoverstyring, Inntektskilde, OmregnetArsinntekt } from '@io/graphql';
import { kildeForkortelse } from '@utils/inntektskilde';
import { somPenger } from '@utils/locale';

import { EndringsloggButton } from '../EndringsloggButton';

import styles from './ReadOnlyInntekt.module.css';

interface ReadOnlyInntektProps {
    omregnetÅrsinntekt?: OmregnetArsinntekt | null;
    lokaltMånedsbeløp: number | null;
    endret: boolean;
    inntektsendringer: Inntektoverstyring[];
}

export const ReadOnlyInntekt = ({
    omregnetÅrsinntekt,
    lokaltMånedsbeløp = null,
    endret,
    inntektsendringer,
}: ReadOnlyInntektProps): ReactElement => {
    const harInntektskildeAOrdningen = omregnetÅrsinntekt?.kilde === Inntektskilde.Aordningen;

    return (
        <>
            <div className={styles.BeregnetGrid}>
                <BodyShort>{harInntektskildeAOrdningen ? 'Gj.snittlig månedsinntekt' : 'Månedsbeløp'}</BodyShort>
                <div className={styles.månedsbeløp}>
                    <div style={{ position: 'relative', paddingLeft: '1rem' }}>
                        {(endret || lokaltMånedsbeløp) && (
                            <Endringstrekant text="Endringene vil oppdateres og kalkuleres etter du har trykket på kalkuler" />
                        )}
                        <BodyShort>{somPenger(lokaltMånedsbeløp || omregnetÅrsinntekt?.manedsbelop)}</BodyShort>
                    </div>
                </div>
                <div style={{ paddingLeft: '0.5rem' }}>
                    {endret || lokaltMånedsbeløp || omregnetÅrsinntekt?.kilde === Inntektskilde.Saksbehandler ? (
                        <EndringsloggButton endringer={inntektsendringer} />
                    ) : (
                        <Kilde type={omregnetÅrsinntekt?.kilde}>{kildeForkortelse(omregnetÅrsinntekt?.kilde)}</Kilde>
                    )}
                </div>
            </div>
        </>
    );
};
