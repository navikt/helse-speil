'use client';

import React, { ReactElement } from 'react';

import { Box } from '@navikt/ds-react/Box';

import { Maybe } from '@io/graphql';
import { TilkommenInntektSkjema } from '@saksbilde/tilkommenInntekt/TilkommenInntektSkjema';
import { useFetchPersonQuery } from '@state/person';
import { useHentTilkommenInntektQuery } from '@state/tilkommenInntekt';

export const LeggTilTilkommenInntektView = (): Maybe<ReactElement> => {
    const { data } = useFetchPersonQuery();
    const person = data?.person ?? null;
    const { data: tilkommenInntektData } = useHentTilkommenInntektQuery(person?.fodselsnummer);
    const tilkomneInntektskilder = tilkommenInntektData?.tilkomneInntektskilderV2;

    if (!person || !tilkomneInntektskilder) {
        return null;
    }

    return (
        <Box overflowX="scroll">
            <TilkommenInntektSkjema person={person} tilkommeneInntektskilder={tilkomneInntektskilder} />
        </Box>
    );
};
