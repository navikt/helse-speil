import { usePathname } from 'next/navigation';
import React from 'react';
import { last } from 'remeda';

import { Box } from '@navikt/ds-react/Box';

import { useNavigateOnMount } from '@hooks/useNavigateOnMount';
import { Fane } from '@hooks/useNavigation';
import { PersonFragment, UberegnetPeriodeFragment } from '@io/graphql';
import { Utbetaling } from '@saksbilde/utbetaling/Utbetaling';

type UberegnetPeriodeViewProps = {
    person: PersonFragment;
    activePeriod: UberegnetPeriodeFragment;
};

export const UberegnetPeriodeView = ({ person, activePeriod }: UberegnetPeriodeViewProps) => {
    const tab = last(usePathname().split('/'));
    useNavigateOnMount(Fane.Utbetaling);

    return (
        <Box overflowX="scroll">{tab === 'dagoversikt' && <Utbetaling person={person} periode={activePeriod} />}</Box>
    );
};
