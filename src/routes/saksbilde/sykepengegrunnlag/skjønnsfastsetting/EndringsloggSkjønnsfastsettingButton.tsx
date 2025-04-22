import classNames from 'classnames';
import React, { ReactElement, useRef, useState } from 'react';

import { PersonPencilFillIcon } from '@navikt/aksel-icons';

import { Kilde } from '@components/Kilde';
import { EndringsloggSykepengegrunnlagskjønnsfastsetting } from '@components/endringslogg/EndringsloggSykepengegrunnlagskjønnsfastsetting';
import { Maybe } from '@io/graphql';
import { SykepengegrunnlagskjonnsfastsettingMedArbeidsgivernavn } from '@saksbilde/sykepengegrunnlag/skjønnsfastsetting/SkjønnsfastsettingHeader';

import styles from '../inntekt/EndringsloggButton.module.css';

interface EndringsloggSkjønnsfastsettingButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
    endringer: SykepengegrunnlagskjonnsfastsettingMedArbeidsgivernavn[];
}

export const EndringsloggSkjønnsfastsettingButton = ({
    endringer,
    className,
    ...buttonProps
}: EndringsloggSkjønnsfastsettingButtonProps): Maybe<ReactElement> => {
    const [visEndringslogg, setVisEndringslogg] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    if (endringer.length === 0) {
        return null;
    }

    return (
        <>
            <button
                className={classNames(styles.button, className)}
                type="button"
                ref={buttonRef}
                {...buttonProps}
                onClick={() => setVisEndringslogg(true)}
            >
                <Kilde type={'Saksbehandler'}>
                    <PersonPencilFillIcon title="Saksbehandler ikon" />
                </Kilde>
            </button>
            {visEndringslogg && (
                <EndringsloggSykepengegrunnlagskjønnsfastsetting
                    endringer={endringer}
                    closeModal={() => setVisEndringslogg(false)}
                    showModal={visEndringslogg}
                />
            )}
        </>
    );
};
