import { usePathname } from 'next/navigation';
import React from 'react';
import { last } from 'remeda';

import { Box } from '@navikt/ds-react/Box';

import { useNavigateOnMount } from '@hooks/useNavigateOnMount';
import { Fane } from '@hooks/useNavigation';
import { PersonFragment, UberegnetPeriodeFragment } from '@io/graphql';
import { TilkommenInntekt } from '@saksbilde/tilkommenInntekt/TilkommenInntekt';
import { Utbetaling } from '@saksbilde/utbetaling/Utbetaling';
import { harOverlappendeTilkommenInntekt } from '@saksbilde/utils';

type UberegnetPeriodeViewProps = {
    person: PersonFragment;
    activePeriod: UberegnetPeriodeFragment;
};

export const UberegnetPeriodeView = ({ person, activePeriod }: UberegnetPeriodeViewProps) => {
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
            {tab === 'tilkommen-inntekt' && <TilkommenInntekt person={person} aktivPeriode={activePeriod} />}
        </Box>
    );
};
