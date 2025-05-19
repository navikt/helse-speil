import classNames from 'classnames';
import React, { ReactElement, useState } from 'react';

import { PersonPencilFillIcon } from '@navikt/aksel-icons';

import { Kilde } from '@components/Kilde';
import { EndringsloggTilkommenInntekt } from '@components/endringslogg/EndringsloggTilkommenInntekt';
import { TilkommenInntekt } from '@io/graphql';
import styles from '@routes/saksbilde/sykepengegrunnlag/inntekt/EndringsloggButton.module.css';

export const EndringsloggTilkommenInntektButton = ({
    tilkommenInntekt,
}: {
    tilkommenInntekt: TilkommenInntekt;
}): ReactElement => {
    const [visEndringslogg, setVisEndringslogg] = useState(false);

    return (
        <>
            <button
                className={classNames(styles.button)}
                style={{ marginLeft: 'var(--a-spacing-2)' }}
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
