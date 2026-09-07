'use client';

import React, { ReactElement } from 'react';

import { useHarGraderteAndreYtelserTilgang } from '@hooks/brukerrolleHooks';
import { LeggTilPeriodeView } from '@saksbilde/leggTil/LeggTilPeriodeView';
import { LeggTilTilkommenInntektView } from '@saksbilde/leggTil/LeggTilTilkommenInntektView';

export default function Page(): ReactElement | null {
    return useHarGraderteAndreYtelserTilgang() ? <LeggTilPeriodeView /> : <LeggTilTilkommenInntektView />;
}
