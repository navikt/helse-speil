import { Person, Vedtaksperiode, Vedtaksperiodetilstand } from 'internal-types';
import React, { useMemo } from 'react';
import {
    Sykepengeperiode,
    Vedtaksperiodetilstand as TidslinjeVedtaksperiodetilstand,
} from '@navikt/helse-frontend-tidslinje';

export const toSykepengeperiode = (vedtaksperiode: Vedtaksperiode): Sykepengeperiode => ({
    id: vedtaksperiode.id,
    fom: vedtaksperiode.fom.toDate(),
    tom: vedtaksperiode.tom.toDate(),
    status: status(vedtaksperiode.tilstand, vedtaksperiode.automatiskBehandlet),
    disabled: !vedtaksperiode.kanVelges,
});

const status = (tilstand: Vedtaksperiodetilstand, automatiskBehandlet: boolean): TidslinjeVedtaksperiodetilstand => {
    if (automatiskBehandlet) {
        if (tilstand === Vedtaksperiodetilstand.TilUtbetaling)
            return TidslinjeVedtaksperiodetilstand.TilUtbetalingAutomatisk;
        else if (tilstand === Vedtaksperiodetilstand.Utbetalt)
            return TidslinjeVedtaksperiodetilstand.UtbetaltAutomatisk;
    }
    return tilstand;
};

export const useTidslinjerader = (person?: Person): Sykepengeperiode[][] =>
    useMemo(
        () =>
            person?.arbeidsgivere.map((arbeidsgiver) => {
                return arbeidsgiver.vedtaksperioder.map(toSykepengeperiode);
            }) ?? [],
        [person]
    );
