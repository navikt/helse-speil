import { Person, Vedtaksperiode } from 'internal-types';
import React, { useMemo } from 'react';
import { Sykepengeperiode } from '@navikt/helse-frontend-tidslinje/lib';

export const toSykepengeperiode = (vedtaksperiode: Vedtaksperiode): Sykepengeperiode => ({
    id: vedtaksperiode.id,
    fom: vedtaksperiode.fom.toDate(),
    tom: vedtaksperiode.tom.toDate(),
    status: vedtaksperiode.tilstand,
    disabled: !vedtaksperiode.kanVelges,
});

export const useTidslinjerader = (person?: Person): Sykepengeperiode[][] =>
    useMemo(
        () =>
            person?.arbeidsgivere.map((arbeidsgiver) => {
                return arbeidsgiver.vedtaksperioder.map(toSykepengeperiode);
            }) ?? [],
        [person]
    );
