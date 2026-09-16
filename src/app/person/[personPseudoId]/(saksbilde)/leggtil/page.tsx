'use client';

import React, { ReactElement } from 'react';

import { LeggTilPeriodeView } from '@saksbilde/leggTil/LeggTilPeriodeView';
import { LeggTilTilkommenInntektView } from '@saksbilde/leggTil/LeggTilTilkommenInntektView';
import { useSkalSeGraderteAndreYtelser } from '@utils/featureToggles';

export default function Page(): ReactElement | null {
    return useSkalSeGraderteAndreYtelser() ? <LeggTilPeriodeView /> : <LeggTilTilkommenInntektView />;
}
