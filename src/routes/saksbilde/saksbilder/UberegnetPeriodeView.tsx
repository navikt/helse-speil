import { usePathname } from 'next/navigation';
import React from 'react';
import { last } from 'remeda';

import { Box } from '@navikt/ds-react/Box';

import { useNavigateOnMount } from '@hooks/useNavigateOnMount';
import { Fane } from '@hooks/useNavigation';
import { PersonFragment, TilkommenInntektskilde, UberegnetPeriodeFragment } from '@io/graphql';
import { TilkommenInntektSkjema } from '@saksbilde/tilkommenInntekt/TilkommenInntektSkjema';
import { Utbetaling } from '@saksbilde/utbetaling/Utbetaling';
import { harOverlappendeTilkommenInntekt } from '@saksbilde/utils';

type UberegnetPeriodeViewProps = {
    person: PersonFragment;
    activePeriod: UberegnetPeriodeFragment;
    tilkommeneInntektskilder: TilkommenInntektskilde[];
};

export const UberegnetPeriodeView = ({ person, activePeriod, tilkommeneInntektskilder }: UberegnetPeriodeViewProps) => {
    const tab = last(usePathname().split('/'));
    const harTilkommenInntekt = harOverlappendeTilkommenInntekt(person, activePeriod.fom);
    useNavigateOnMount(
        tab === 'tilkommen-inntekt' && !harTilkommenInntekt
            ? Fane.Utbetaling
            : tab !== 'tilkommen-inntekt' && tab !== 'dagoversikt'
              ? Fane.Utbetaling
              : undefined,
    );

    return (
        <Box overflowX="scroll">
            {tab === 'dagoversikt' && <Utbetaling person={person} periode={activePeriod} />}
            {tab === 'tilkommen-inntekt' && (
                <TilkommenInntektSkjema
                    person={person}
                    periode={activePeriod}
                    tilkommeneInntektskilder={tilkommeneInntektskilder}
                />
            )}
        </Box>
    );
};
