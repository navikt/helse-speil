import { usePathname } from 'next/navigation';
import React, { ReactElement } from 'react';
import { last } from 'remeda';

import { Box } from '@navikt/ds-react/Box';

import { useNavigateOnMount } from '@hooks/useNavigateOnMount';
import { Fane } from '@hooks/useNavigation';
import type { NyttInntektsforholdPeriodeFragment, PersonFragment, TilkommenInntektskilde } from '@io/graphql';
import { TilkommenInntekt } from '@saksbilde/tilkommenInntekt/TilkommenInntekt';
import { isTilkommenInntekt } from '@utils/typeguards';

interface NyttInntektsforholdPeriodeViewProps {
    activePeriod: NyttInntektsforholdPeriodeFragment;
    person: PersonFragment;
    tilkommeneInntektskilder: TilkommenInntektskilde[];
}

export const NyttInntektsforholdPeriodeView = ({
    activePeriod,
    person,
    tilkommeneInntektskilder,
}: NyttInntektsforholdPeriodeViewProps): ReactElement => {
    const tab = last(usePathname().split('/'));
    useNavigateOnMount(isTilkommenInntekt(activePeriod) ? Fane.TilkommenInntekt : Fane.Sykepengegrunnlag);

    return (
        <>
            {tab === 'tilkommen-inntekt' && (
                <Box overflowX="scroll">
                    <TilkommenInntekt
                        person={person}
                        periode={activePeriod}
                        tilkommeneInntektskilder={tilkommeneInntektskilder}
                    />
                </Box>
            )}
        </>
    );
};
