import React, { ReactElement } from 'react';

import { somNorskDato } from '@utils/date';

import { DokumentFragment } from './DokumentFragment';

type InntektsdatoProps = {
    inntektsdato: string | null;
};

export const Inntektsdato = ({ inntektsdato }: InntektsdatoProps): ReactElement | null => {
    if (!inntektsdato) return null;

    return <DokumentFragment overskrift="Inntektsdato">{somNorskDato(inntektsdato)}</DokumentFragment>;
};
