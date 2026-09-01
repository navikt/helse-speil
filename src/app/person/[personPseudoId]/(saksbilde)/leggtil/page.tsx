import React, { ReactElement } from 'react';

import { LeggTilPeriodeView } from '@saksbilde/leggTil/LeggTilPeriodeView';
import { LeggTilTilkommenInntektView } from '@saksbilde/leggTil/LeggTilTilkommenInntektView';
import { skalBrukeNyttTilkommenInntektSkjema } from '@utils/featureToggles';

export default function Page(): ReactElement | null {
    return skalBrukeNyttTilkommenInntektSkjema() ? <LeggTilPeriodeView /> : <LeggTilTilkommenInntektView />;
}
