import { Person, Vedtaksperiode } from '../../context/types.internal';
import {
    EnkelSykepengetidslinje,
    Sykepengeperiode
} from '@navikt/helse-frontend-tidslinje/dist/components/sykepengetidslinje/Sykepengetidslinje';
import { useMemo } from 'react';

export const toSykepengeperiode = (vedtaksperiode: Vedtaksperiode): Sykepengeperiode => ({
    id: vedtaksperiode.id,
    fom: vedtaksperiode.fom.toDate(),
    tom: vedtaksperiode.tom.toDate(),
    status: vedtaksperiode.tilstand,
    disabled: !vedtaksperiode.kanVelges
});

export const useTidslinjerader = (person?: Person, aktivVedtaksperiode?: Vedtaksperiode): EnkelSykepengetidslinje[] =>
    useMemo(
        () =>
            person?.arbeidsgivere.map(arbeidsgiver => ({
                perioder: arbeidsgiver.vedtaksperioder.map((periode: Vedtaksperiode) => ({
                    ...toSykepengeperiode(periode),
                    active:
                        aktivVedtaksperiode &&
                        periode.fom.isSame(aktivVedtaksperiode.fom) &&
                        periode.tom.isSame(aktivVedtaksperiode.tom)
                }))
            })) ?? [],
        [person, aktivVedtaksperiode]
    );
