import React, { ReactElement } from 'react';

import { EndringsloggKildeButton } from '@components/endringslogg/EndringsloggKildeButton';
import { EndringsloggTilkommenInntekt } from '@components/endringslogg/EndringsloggTilkommenInntekt';
import { ApiTilkommenInntekt } from '@io/rest/generated/spesialist.schemas';

export function EndringsloggTilkommenInntektButton({
    tilkommenInntekt,
}: {
    tilkommenInntekt: ApiTilkommenInntekt;
}): ReactElement {
    return (
        <EndringsloggKildeButton
            className="ml-2"
            renderEndringslogg={(onOpenChange) => (
                <EndringsloggTilkommenInntekt tilkommenInntekt={tilkommenInntekt} onOpenChange={onOpenChange} />
            )}
        />
    );
}
