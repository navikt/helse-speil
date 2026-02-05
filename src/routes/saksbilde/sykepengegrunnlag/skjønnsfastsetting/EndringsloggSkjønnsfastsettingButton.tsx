import React, { ReactElement, useRef, useState } from 'react';

import { PersonPencilFillIcon } from '@navikt/aksel-icons';

import { Kilde } from '@components/Kilde';
import { EndringsloggSykepengegrunnlagskjønnsfastsetting } from '@components/endringslogg/EndringsloggSykepengegrunnlagskjønnsfastsetting';
import { SykepengegrunnlagskjonnsfastsettingMedArbeidsgiverInfo } from '@saksbilde/sykepengegrunnlag/skjønnsfastsetting/SkjønnsfastsettingHeader';
import { cn } from '@utils/tw';

import styles from '../inntekt/EndringsloggButton.module.css';

interface EndringsloggSkjønnsfastsettingButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
    endringer: SykepengegrunnlagskjonnsfastsettingMedArbeidsgiverInfo[];
}

export const EndringsloggSkjønnsfastsettingButton = ({
    endringer,
    className,
    ...buttonProps
}: EndringsloggSkjønnsfastsettingButtonProps): ReactElement | null => {
    const [visEndringslogg, setVisEndringslogg] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    if (endringer.length === 0) {
        return null;
    }

    return (
        <>
            <button
                className={cn(styles.button, className)}
                type="button"
                ref={buttonRef}
                {...buttonProps}
                onClick={() => setVisEndringslogg(true)}
            >
                <Kilde type="Saksbehandler">
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
