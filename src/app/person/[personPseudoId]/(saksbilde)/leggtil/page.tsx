'use client';

import React, { ReactElement } from 'react';

import { browserEnv } from '@/env';
import { useHarGraderteAndreYtelserTilgang } from '@hooks/brukerrolleHooks';
import { LeggTilPeriodeView } from '@saksbilde/leggTil/LeggTilPeriodeView';
import { LeggTilTilkommenInntektView } from '@saksbilde/leggTil/LeggTilTilkommenInntektView';

export default function Page(): ReactElement | null {
    const harBrukerTilgangTilFeaturen = useHarGraderteAndreYtelserTilgang();
    const erFeaturenAktivert = browserEnv.NEXT_PUBLIC_GRADERTE_ANDRE_YTELSER_ER_AKTIVERT;

    return erFeaturenAktivert && harBrukerTilgangTilFeaturen ? <LeggTilPeriodeView /> : <LeggTilTilkommenInntektView />;
}
