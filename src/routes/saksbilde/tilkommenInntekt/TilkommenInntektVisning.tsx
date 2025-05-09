import { ReactElement } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { useFetchPersonQuery } from '@state/person';
import { useHentTilkommenInntektQuery } from '@state/tilkommenInntekt';

interface TilkommenInntektVisningProps {
    tilkommenInntektId: string;
}

export const TilkommenInntektVisning = ({ tilkommenInntektId }: TilkommenInntektVisningProps): ReactElement => {
    const { data: personData } = useFetchPersonQuery();
    const person = personData?.person ?? null;
    const { data: tilkommenInntektData } = useHentTilkommenInntektQuery(person?.fodselsnummer);
    const tilkommenInntekt = tilkommenInntektData?.tilkomneInntektskilderV2
        ?.flatMap((tilkommenInntektskilde) => tilkommenInntektskilde.inntekter)
        .find((tilkommenInntekt) => tilkommenInntekt.tilkommenInntektId === tilkommenInntektId);
    return <BodyShort>Tilkommen inntekt: {tilkommenInntekt?.tilkommenInntektId}</BodyShort>;
};
