import React, { ReactElement, useState } from 'react';

import { PersonPencilFillIcon } from '@navikt/aksel-icons';

import { Kilde } from '@components/Kilde';
import { EndringsloggTilkommenInntekt } from '@components/endringslogg/EndringsloggTilkommenInntekt';
import { ApiTilkommenInntekt } from '@io/rest/generated/spesialist.schemas';
import styles from '@saksbilde/sykepengegrunnlag/inntekt/EndringsloggButton.module.css';
import { cn } from '@utils/tw';

export const EndringsloggTilkommenInntektButton = ({
    tilkommenInntekt,
}: {
    tilkommenInntekt: ApiTilkommenInntekt;
}): ReactElement => {
    const [visEndringslogg, setVisEndringslogg] = useState(false);

    return (
        <>
            <button
                className={cn(styles.button)}
                style={{ marginLeft: 'var(--ax-space-8)' }}
                type="button"
                onClick={() => setVisEndringslogg(true)}
            >
                <Kilde type="Saksbehandler">
                    <PersonPencilFillIcon title="Vis endringslogg" />
                </Kilde>
            </button>
            {visEndringslogg && (
                <EndringsloggTilkommenInntekt
                    tilkommenInntekt={tilkommenInntekt}
                    closeModal={() => setVisEndringslogg(false)}
                    showModal={visEndringslogg}
                />
            )}
        </>
    );
};
