import dayjs from 'dayjs';
import React, { ReactElement } from 'react';

import { ISO_DATOFORMAT, NORSK_DATOFORMAT } from '@utils/date';
import { Maybe } from '@utils/ts';

import { DokumentFragment } from './DokumentFragment';

type BestemmendeFraværsdagProps = {
    inntektsdato: Maybe<string>;
    førsteFraværsdag: Maybe<string>;
};

export const BestemmendeFraværsdag = ({
    inntektsdato,
    førsteFraværsdag,
}: BestemmendeFraværsdagProps): ReactElement | null => {
    if (!inntektsdato && !førsteFraværsdag) return null;

    return (
        <DokumentFragment overskrift="Bestemmende fraværsdag">
            {dayjs(inntektsdato ?? førsteFraværsdag, ISO_DATOFORMAT).format(NORSK_DATOFORMAT)}
        </DokumentFragment>
    );
};
