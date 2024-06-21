import React, { ReactElement, useState } from 'react';

import { Button } from '@navikt/ds-react';

import { ErrorMessage } from '@components/ErrorMessage';
import { BeregnetPeriodeFragment, Handling, Maybe, Periodehandling } from '@io/graphql';

import { AvvisningModal } from './AvvisningModal';

interface AvvisningButtonProps extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'onError' | 'children'> {
    activePeriod: BeregnetPeriodeFragment;
    disabled: boolean;
}

const finnKanAvvises = ({ handlinger }: BeregnetPeriodeFragment): Maybe<Handling> =>
    handlinger.find((handling) => handling.type === Periodehandling.Avvise) as Handling;

export const AvvisningButton = ({
    activePeriod,
    disabled = false,
    ...buttonProps
}: AvvisningButtonProps): ReactElement => {
    const [showModal, setShowModal] = useState(false);
    const [kanIkkeAvvisesMelding, setKanIkkeAvvisesMelding] = useState<Maybe<string>>();
    const kanAvvises = finnKanAvvises(activePeriod);

    return (
        <>
            <Button
                disabled={disabled}
                variant="secondary"
                size="small"
                data-testid="avvisning-button"
                onClick={() =>
                    kanAvvises?.tillatt
                        ? setShowModal(true)
                        : setKanIkkeAvvisesMelding('Denne saken er det noe krøll med. Du må annullere saken')
                }
                {...buttonProps}
            >
                Kan ikke behandles her
            </Button>
            {kanIkkeAvvisesMelding ? (
                <ErrorMessage>{kanIkkeAvvisesMelding}</ErrorMessage>
            ) : (
                showModal && (
                    <AvvisningModal
                        onClose={() => setShowModal(false)}
                        showModal={showModal}
                        activePeriod={activePeriod}
                    />
                )
            )}
        </>
    );
};
