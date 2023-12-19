import dayjs from 'dayjs';
import React from 'react';

import { ISO_DATOFORMAT, NORSK_DATOFORMAT } from '@utils/date';

import { DokumentFragment } from './DokumentFragment';

type BestemmendeFraværsdagProps = {
    inntektsdato: Maybe<string>;
    førsteFraværsdag: Maybe<string>;
};

export const BestemmendeFraværsdag: React.FC<BestemmendeFraværsdagProps> = ({ inntektsdato, førsteFraværsdag }) => {
    if (!inntektsdato && !førsteFraværsdag) return;

    return (
        <DokumentFragment overskrift="Bestemmende fraværsdag (skjæringstidspunkt)">
            {dayjs(inntektsdato ?? førsteFraværsdag, ISO_DATOFORMAT).format(NORSK_DATOFORMAT)}
        </DokumentFragment>
    );
};
