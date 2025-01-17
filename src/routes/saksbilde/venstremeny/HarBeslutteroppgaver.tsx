import React, { ReactElement } from 'react';

import { Maybe, PersonFragment } from '@io/graphql';
import { Periodeinformasjon } from '@saksbilde/venstremeny/Periodeinformasjon';
import { usePeriodeTilGodkjenning } from '@state/arbeidsgiver';
import { useSetActivePeriodId } from '@state/periode';
import { isBeregnetPeriode } from '@utils/typeguards';

interface HarBeslutteroppgaverProps {
    person: PersonFragment;
}

export const HarBeslutteroppgaver = ({ person }: HarBeslutteroppgaverProps): Maybe<ReactElement> => {
    const setActivePeriodId = useSetActivePeriodId(person);
    const harPeriodeTilGodkjenning = usePeriodeTilGodkjenning(person);

    if (!harPeriodeTilGodkjenning) return null;

    const harBeslutteroppgave = person.arbeidsgivere
        .flatMap((arbeidsgiver) => arbeidsgiver.generasjoner)
        .flatMap((generasjon) => generasjon.perioder)
        .some((periode) => isBeregnetPeriode(periode) && periode.totrinnsvurdering?.erBeslutteroppgave);

    if (!harBeslutteroppgave) return null;

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
