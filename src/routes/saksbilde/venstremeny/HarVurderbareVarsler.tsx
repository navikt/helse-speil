import React, { ReactElement } from 'react';

import { PersonFragment } from '@io/graphql';
import type { PeriodeinformasjonInnslag } from '@saksbilde/venstremeny/PeriodeinformasjonInnslag';
import { Periodeinformasjon } from '@saksbilde/venstremeny/PeriodeinformasjonInnslag';
import {
    finnAlleInntektsforhold,
    finnPeriodeTilGodkjenning,
    tilReferanse,
} from '@state/inntektsforhold/inntektsforhold';

interface HarVurderbareVarslerProps {
    person: PersonFragment;
}

export const HarVurderbareVarsler = ({ person }: HarVurderbareVarslerProps): ReactElement | null => {
    const harPeriodeTilGodkjenning = finnPeriodeTilGodkjenning(person);

    if (!harPeriodeTilGodkjenning) return null;

    const inntektsforholdMedVurderbareVarsler = finnAlleInntektsforhold(person)
        .map(
            (inntektsforhold): PeriodeinformasjonInnslag => ({
                inntektsforholdReferanse: tilReferanse(inntektsforhold),
                perioder: inntektsforhold.generasjoner
                    .flatMap((generasjon) =>
                        generasjon.perioder.filter((periode) =>
                            periode.varsler.some(
                                (varsel) => varsel.vurdering === null || varsel.vurdering?.status === 'AKTIV',
                            ),
                        ),
                    )
                    .map((periode) => ({ id: periode.id, fom: periode.fom, tom: periode.tom })),
            }),
        )
        .filter((it) => it.perioder.length > 0);

    if (inntektsforholdMedVurderbareVarsler.length === 0) return null;

    return (
        <Periodeinformasjon
            tittel="Perioder med varsler som må vurderes"
            periodeinformasjon={inntektsforholdMedVurderbareVarsler}
        />
    );
};
