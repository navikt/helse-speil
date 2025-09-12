import React, { ReactElement } from 'react';

import { BodyShort, HStack } from '@navikt/ds-react';

import { Endringstrekant } from '@components/Endringstrekant';
import { Kilde } from '@components/Kilde';
import { Inntektoverstyring, Inntektskilde, OmregnetArsinntekt } from '@io/graphql';
import { kildeForkortelse } from '@utils/inntektskilde';
import { somPenger } from '@utils/locale';

import { EndringsloggButton } from '../EndringsloggButton';

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
        <HStack gap="8" style={{ padding: '4px 0' }}>
            <BodyShort>{harInntektskildeAOrdningen ? 'Gj.snittlig månedsinntekt' : 'Månedsbeløp'}</BodyShort>
            <HStack align="center" gap="2">
                <div>
                    {(endret || lokaltMånedsbeløp) && (
                        <Endringstrekant text="Endringene vil oppdateres og kalkuleres etter du har trykket på kalkuler" />
                    )}
                    <BodyShort>{somPenger(lokaltMånedsbeløp || omregnetÅrsinntekt?.manedsbelop)}</BodyShort>
                </div>
                {endret || lokaltMånedsbeløp || omregnetÅrsinntekt?.kilde === Inntektskilde.Saksbehandler ? (
                    <EndringsloggButton endringer={inntektsendringer} />
                ) : (
                    <Kilde type={omregnetÅrsinntekt?.kilde}>{kildeForkortelse(omregnetÅrsinntekt?.kilde)}</Kilde>
                )}
            </HStack>
        </HStack>
    );
};
