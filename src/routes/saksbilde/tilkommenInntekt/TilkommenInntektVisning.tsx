import { ReactElement } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { useHentTilkommenInntektQuery } from '@state/tilkommenInntekt';

interface TilkommenInntektVisningProps {
    fødselsnummer: string;
    tilkommenInntektId: string;
}

export const TilkommenInntektVisning = ({
    fødselsnummer,
    tilkommenInntektId,
}: TilkommenInntektVisningProps): ReactElement => {
    const { data } = useHentTilkommenInntektQuery(fødselsnummer);
    const tilkommenInntekt = data?.tilkomneInntektskilderV2
        ?.flatMap((tilkommenInntektskilde) => tilkommenInntektskilde.inntekter)
        .find((tilkommenInntekt) => tilkommenInntekt.tilkommenInntektId === tilkommenInntektId);
    return <BodyShort>Tilkommen inntekt: {tilkommenInntekt?.tilkommenInntektId}</BodyShort>;
};
