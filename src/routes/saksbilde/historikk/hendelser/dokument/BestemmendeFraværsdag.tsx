import React, { ReactElement } from 'react';

import { somNorskDato } from '@utils/date';

import { DokumentFragment } from './DokumentFragment';

type BestemmendeFraværsdagProps = {
    førsteFraværsdag: string | null;
};

export const BestemmendeFraværsdag = ({ førsteFraværsdag }: BestemmendeFraværsdagProps): ReactElement | null => {
    if (!førsteFraværsdag) return null;

    return <DokumentFragment overskrift="Bestemmende fraværsdag">{somNorskDato(førsteFraværsdag)}</DokumentFragment>;
};
