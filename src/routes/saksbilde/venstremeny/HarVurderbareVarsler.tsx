import React, { ReactElement } from 'react';

import { Maybe, PersonFragment } from '@io/graphql';
import { Periodeinformasjon } from '@saksbilde/venstremeny/Periodeinformasjon';
import { usePeriodeTilGodkjenning } from '@state/arbeidsgiver';
import { useSetActivePeriodId } from '@state/periode';

interface HarVurderbareVarslerProps {
    person: PersonFragment;
}

export const HarVurderbareVarsler = ({ person }: HarVurderbareVarslerProps): Maybe<ReactElement> => {
    const setActivePeriodId = useSetActivePeriodId(person);
    const harPeriodeTilGodkjenning = usePeriodeTilGodkjenning(person);

    if (!harPeriodeTilGodkjenning) return null;

    const arbeidsgivereMedVurderbareVarsler = person.arbeidsgivere
        .map(
            (arbeidsgiver): Periodeinformasjon => ({
                arbeidsgivernavn: arbeidsgiver.navn,
                perioder: arbeidsgiver.generasjoner
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

    if (arbeidsgivereMedVurderbareVarsler.length === 0) return null;

    return (
        <Periodeinformasjon
            tittel="Perioder med varsler som må vurderes"
            periodeinformasjon={arbeidsgivereMedVurderbareVarsler}
            setAktivPeriode={setActivePeriodId}
        />
    );
};
