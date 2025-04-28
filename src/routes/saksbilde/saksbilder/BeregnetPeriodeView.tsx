import { usePathname } from 'next/navigation';
import React, { ReactElement } from 'react';
import { last } from 'remeda';

import { Box } from '@navikt/ds-react/Box';

import { BeregnetPeriodeFragment, PersonFragment, TilkommenInntektskilde } from '@io/graphql';
import { Sykepengegrunnlag } from '@saksbilde/sykepengegrunnlag/Sykepengegrunnlag';
import { TilkommenInntektSkjema } from '@saksbilde/tilkommenInntekt/TilkommenInntektSkjema';
import { Utbetaling } from '@saksbilde/utbetaling/Utbetaling';
import { Inngangsvilkår } from '@saksbilde/vilkår/Inngangsvilkår';
import { Vurderingsmomenter } from '@saksbilde/vurderingsmomenter/Vurderingsmomenter';

interface BeregnetPeriodeViewProps {
    period: BeregnetPeriodeFragment;
    person: PersonFragment;
    tilkommeneInntektskilder: TilkommenInntektskilde[];
}

export const BeregnetPeriodeView = ({
    period,
    person,
    tilkommeneInntektskilder,
}: BeregnetPeriodeViewProps): ReactElement => {
    const tab = last(usePathname().split('/'));

    return (
        <Box overflowX="scroll">
            {tab === 'dagoversikt' && <Utbetaling person={person} periode={period} />}
            {decodeURI(tab ?? '') === 'inngangsvilkår' && <Inngangsvilkår person={person} periode={period} />}
            {tab === 'sykepengegrunnlag' && <Sykepengegrunnlag person={person} periode={period} />}
            {tab === 'vurderingsmomenter' && <Vurderingsmomenter periode={period} />}
            {tab === 'tilkommen-inntekt' && (
                <TilkommenInntektSkjema
                    person={person}
                    periode={period}
                    tilkommeneInntektskilder={tilkommeneInntektskilder}
                />
            )}
        </Box>
    );
};
