import React, { ReactElement, useState } from 'react';

import { Button } from '@navikt/ds-react';

import { BeregnetPeriodeFragment } from '@io/graphql';

import { AvvisningModal } from './AvvisningModal';

interface AvvisningButtonProps extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'onError' | 'children'> {
    activePeriod: BeregnetPeriodeFragment;
    disabled: boolean;
    size: 'small' | 'medium';
}

export const AvvisningButton = ({
    activePeriod,
    disabled = false,
    size,
    ...buttonProps
}: AvvisningButtonProps): ReactElement => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <Button
                disabled={disabled}
                variant="secondary"
                size={size}
                data-testid="avvisning-button"
                onClick={() => {
                    setShowModal(true);
                }}
                {...buttonProps}
            >
                Kan ikke behandles her
            </Button>
            {showModal && (
                <AvvisningModal
                    closeModal={() => setShowModal(false)}
                    showModal={showModal}
                    activePeriod={activePeriod}
                />
            )}
        </>
    );
};
