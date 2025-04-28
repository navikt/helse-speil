import { usePathname } from 'next/navigation';
import React, { ReactElement } from 'react';
import { last } from 'remeda';

import { Box } from '@navikt/ds-react/Box';

import { useNavigateOnMount } from '@hooks/useNavigateOnMount';
import { Fane } from '@hooks/useNavigation';
import type { GhostPeriodeFragment, PersonFragment } from '@io/graphql';
import { Sykepengegrunnlag } from '@saksbilde/sykepengegrunnlag/Sykepengegrunnlag';
import { TilkommenInntektSkjema } from '@saksbilde/tilkommenInntekt/TilkommenInntektSkjema';
import { isTilkommenInntekt } from '@utils/typeguards';

interface GhostPeriodeViewProps {
    activePeriod: GhostPeriodeFragment;
    person: PersonFragment;
}

export const GhostPeriodeView = ({ activePeriod, person }: GhostPeriodeViewProps): ReactElement => {
    const tab = last(usePathname().split('/'));
    useNavigateOnMount(isTilkommenInntekt(activePeriod) ? Fane.TilkommenInntekt : Fane.Sykepengegrunnlag);

    return (
        <>
            {tab === 'sykepengegrunnlag' && (
                <Box overflowX="scroll">
                    <Sykepengegrunnlag person={person} periode={activePeriod} />
                </Box>
            )}
            {tab === 'tilkommen-inntekt' && (
                <Box overflowX="scroll">
                    <TilkommenInntektSkjema person={person} periode={activePeriod} />
                </Box>
            )}
        </>
    );
};
