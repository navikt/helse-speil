import React, { ReactElement } from 'react';

import { LeggTilTilkommenInntektEllerAndreYtelserView } from '@saksbilde/tilkommenInntekt/saksbilde/LeggTilTilkommenInntektEllerAndreYtelserView';
import { LeggTilTilkommenInntektView } from '@saksbilde/tilkommenInntekt/saksbilde/LeggTilTilkommenInntektView';
import { skalBrukeNyttTilkommenInntektSkjema } from '@utils/featureToggles';

export default function Page(): ReactElement | null {
    return skalBrukeNyttTilkommenInntektSkjema() ? (
        <LeggTilTilkommenInntektEllerAndreYtelserView />
    ) : (
        <LeggTilTilkommenInntektView />
    );
}
