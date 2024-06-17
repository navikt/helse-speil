import dayjs from 'dayjs';
import React, { ReactElement } from 'react';

import { Maybe } from '@io/graphql';
import { ISO_DATOFORMAT, NORSK_DATOFORMAT } from '@utils/date';

import { DokumentFragment } from './DokumentFragment';

type BestemmendeFraværsdagProps = {
    førsteFraværsdag: Maybe<string>;
};

export const BestemmendeFraværsdag = ({ førsteFraværsdag }: BestemmendeFraværsdagProps): Maybe<ReactElement> => {
    if (!førsteFraværsdag) return null;

    return (
        <DokumentFragment overskrift="Bestemmende fraværsdag">
            {dayjs(førsteFraværsdag, ISO_DATOFORMAT).format(NORSK_DATOFORMAT)}
        </DokumentFragment>
    );
};
