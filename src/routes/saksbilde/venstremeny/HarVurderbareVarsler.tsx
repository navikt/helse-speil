import React, { ReactElement } from 'react';

import { PersonFragment } from '@io/graphql';
import { Periodeinformasjon } from '@saksbilde/venstremeny/Periodeinformasjon';
import { finnPeriodeTilGodkjenning } from '@state/arbeidsgiver';

interface HarVurderbareVarslerProps {
    person: PersonFragment;
}

export const HarVurderbareVarsler = ({ person }: HarVurderbareVarslerProps): ReactElement | null => {
    const harPeriodeTilGodkjenning = finnPeriodeTilGodkjenning(person);

    if (!harPeriodeTilGodkjenning) return null;

    const arbeidsgivereMedVurderbareVarsler = person.arbeidsgivere
        .map(
            (arbeidsgiver): Periodeinformasjon => ({
                arbeidsgiverIdentifikator: arbeidsgiver.organisasjonsnummer,
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
        />
    );
};
