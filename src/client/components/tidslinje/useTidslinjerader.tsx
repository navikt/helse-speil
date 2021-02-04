import { Dagtype, Person, UfullstendigVedtaksperiode, Vedtaksperiode, Vedtaksperiodetilstand } from 'internal-types';
import React, { useMemo } from 'react';
import {
    Sykepengeperiode,
    Vedtaksperiodetilstand as TidslinjeVedtaksperiodetilstand,
} from '@navikt/helse-frontend-tidslinje';
import { HoverInfo } from './HoverInfo';

const harDagtyper = (dagtyper: Dagtype[], periode: Vedtaksperiode | UfullstendigVedtaksperiode): boolean =>
    !!periode.utbetalingstidslinje?.find((it) => dagtyper.includes(it.type));

const skalViseInfoPin = (vedtaksperiode: Vedtaksperiode): boolean =>
    harDagtyper([Dagtype.Ferie, Dagtype.Arbeidsgiverperiode], vedtaksperiode);

export const toSykepengeperiode = (vedtaksperiode: Vedtaksperiode): Sykepengeperiode => ({
    id: vedtaksperiode.id,
    fom: vedtaksperiode.fom.toDate(),
    tom: vedtaksperiode.tom.toDate(),
    status: status(vedtaksperiode.tilstand, vedtaksperiode.automatiskBehandlet),
    disabled: false,
    hoverLabel: <HoverInfo vedtaksperiode={vedtaksperiode} />,
    infoPin: skalViseInfoPin(vedtaksperiode),
});

const status = (tilstand: Vedtaksperiodetilstand, automatiskBehandlet: boolean): TidslinjeVedtaksperiodetilstand =>
    automatiskBehandlet && tilstand === Vedtaksperiodetilstand.TilUtbetaling
        ? TidslinjeVedtaksperiodetilstand.TilUtbetalingAutomatisk
        : automatiskBehandlet && tilstand === Vedtaksperiodetilstand.Utbetalt
        ? TidslinjeVedtaksperiodetilstand.UtbetaltAutomatisk
        : tilstand;

export const useTidslinjerader = (person?: Person): Sykepengeperiode[][] =>
    useMemo(
        () => person?.arbeidsgivere.map((arbeidsgiver) => arbeidsgiver.vedtaksperioder.map(toSykepengeperiode)) ?? [],
        [person]
    );
