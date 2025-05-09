'use client';

import React, { ReactElement } from 'react';

import { Maybe } from '@io/graphql';
import { PeriodeView } from '@saksbilde/periodeview/PeriodeView';

export default function Page(): Maybe<ReactElement> {
    return <PeriodeView />;
}
