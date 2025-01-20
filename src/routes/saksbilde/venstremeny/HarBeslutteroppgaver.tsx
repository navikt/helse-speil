import React, { ReactElement } from 'react';

import { useHarTotrinnsvurdering } from '@hooks/useHarTotrinnsvurdering';
import { Maybe, PersonFragment } from '@io/graphql';
import { Periodeinformasjon } from '@saksbilde/venstremeny/Periodeinformasjon';
import { usePeriodeTilGodkjenning } from '@state/arbeidsgiver';
import { useSetActivePeriodId } from '@state/periode';

interface HarBeslutteroppgaverProps {
    person: PersonFragment;
}

export const HarBeslutteroppgaver = ({ person }: HarBeslutteroppgaverProps): Maybe<ReactElement> => {
    const setActivePeriodId = useSetActivePeriodId(person);
    const harPeriodeTilGodkjenning = usePeriodeTilGodkjenning(person);
    const harTotrinnsvurdering = useHarTotrinnsvurdering(person);

    if (!harPeriodeTilGodkjenning || !harTotrinnsvurdering) return null;

    const overstyringer = person.arbeidsgivere
        .map(
            (arbeidsgiver): Periodeinformasjon => ({
                arbeidsgivernavn: arbeidsgiver.navn,
                perioder:
                    arbeidsgiver.generasjoner[0]?.perioder
                        .filter((periode) =>
                            arbeidsgiver.overstyringer
                                .filter((overstyring) => !overstyring.ferdigstilt)
                                .some((overstyring) => overstyring.vedtaksperiodeId === periode.vedtaksperiodeId),
                        )
                        .map((periode) => ({
                            id: periode.id,
                            fom: periode.fom,
                            tom: periode.tom,
                        })) ?? [],
            }),
        )
        .filter((overstyring) => overstyring.perioder.length > 0);

    if (overstyringer.length === 0) return null;

    return (
        <Periodeinformasjon
            tittel="Perioder til kontroll"
            periodeinformasjon={overstyringer}
            setAktivPeriode={setActivePeriodId}
        />
    );
};
