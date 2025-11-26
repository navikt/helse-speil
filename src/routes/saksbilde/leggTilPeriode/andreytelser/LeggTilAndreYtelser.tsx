'use client';

import React, { ReactElement } from 'react';

import { AndreYtelserSkjema } from '@saksbilde/leggTilPeriode/andreytelser/AndreYtelserSkjema';
import { useFetchPersonQuery } from '@state/person';

export const LeggTilAndreYtelser = (): ReactElement | null => {
    const { data: personData } = useFetchPersonQuery();
    const person = personData?.person ?? null;

    if (!person) {
        return null;
    }

    return <AndreYtelserSkjema person={person} />;
};
