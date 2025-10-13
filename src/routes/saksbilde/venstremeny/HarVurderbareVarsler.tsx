import React, { ReactElement } from 'react';

import { PersonFragment } from '@io/graphql';
import { Periodeinformasjon } from '@saksbilde/venstremeny/Periodeinformasjon';
import { finnAlleInntektsforhold, finnPeriodeTilGodkjenning } from '@state/inntektsforhold/inntektsforhold';
import { isArbeidsgiver } from '@utils/typeguards';

interface HarVurderbareVarslerProps {
    person: PersonFragment;
}

export const HarVurderbareVarsler = ({ person }: HarVurderbareVarslerProps): ReactElement | null => {
    const harPeriodeTilGodkjenning = finnPeriodeTilGodkjenning(person);

    if (!harPeriodeTilGodkjenning) return null;

    const arbeidsgivereMedVurderbareVarsler = finnAlleInntektsforhold(person)
        .map(
            (inntektsforhold): Periodeinformasjon => ({
                arbeidsgiverIdentifikator: isArbeidsgiver(inntektsforhold)
                    ? inntektsforhold.organisasjonsnummer
                    : 'SELVSTENDIG',
                arbeidsgivernavn: isArbeidsgiver(inntektsforhold) ? inntektsforhold.navn : 'SELVSTENDIG',
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

    if (arbeidsgivereMedVurderbareVarsler.length === 0) return null;

    return (
        <Periodeinformasjon
            tittel="Perioder med varsler som må vurderes"
            periodeinformasjon={arbeidsgivereMedVurderbareVarsler}
        />
    );
};
