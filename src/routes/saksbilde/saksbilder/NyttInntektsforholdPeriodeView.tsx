import { usePathname } from 'next/navigation';
import React, { ReactElement } from 'react';
import { last } from 'remeda';

import { Box } from '@navikt/ds-react/Box';

import { useNavigateOnMount } from '@hooks/useNavigateOnMount';
import { Fane } from '@hooks/useNavigation';
import type { NyttInntektsforholdPeriodeFragment, PersonFragment } from '@io/graphql';
import { TilkommenInntektSkjema } from '@saksbilde/tilkommenInntekt/TilkommenInntektSkjema';
import { isTilkommenInntekt } from '@utils/typeguards';

interface NyttInntektsforholdPeriodeViewProps {
    activePeriod: NyttInntektsforholdPeriodeFragment;
    person: PersonFragment;
}

export const NyttInntektsforholdPeriodeView = ({
    activePeriod,
    person,
}: NyttInntektsforholdPeriodeViewProps): ReactElement => {
    const tab = last(usePathname().split('/'));
    useNavigateOnMount(isTilkommenInntekt(activePeriod) ? Fane.TilkommenInntekt : Fane.Sykepengegrunnlag);

    return (
        <>
            {tab === 'tilkommen-inntekt' && (
                <Box overflowX="scroll">
                    <TilkommenInntektSkjema person={person} periode={activePeriod} />
                </Box>
            )}
        </>
    );
};
