import React, { ReactElement } from 'react';

import { Maybe } from '@io/graphql';
import { somNorskDato } from '@utils/date';

import { DokumentFragment } from './DokumentFragment';

type BestemmendeFraværsdagProps = {
    førsteFraværsdag: Maybe<string>;
};

export const BestemmendeFraværsdag = ({ førsteFraværsdag }: BestemmendeFraværsdagProps): ReactElement | null => {
    if (!førsteFraværsdag) return null;

    return <DokumentFragment overskrift="Bestemmende fraværsdag">{somNorskDato(førsteFraværsdag)}</DokumentFragment>;
};
