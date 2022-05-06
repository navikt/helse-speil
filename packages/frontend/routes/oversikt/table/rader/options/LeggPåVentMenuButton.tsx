import styled from '@emotion/styled';
import React, { useRef, useState } from 'react';

import { Button as NavButton, Loader } from '@navikt/ds-react';

import { useLeggPåVent } from '@state/oppgaver';
import { useOperationErrorHandler } from '@state/varsler';
import { ignorePromise } from '@utils/promise';

import { NyttNotatModal } from '../notat/NyttNotatModal';
import { convertToGraphQLPersoninfo } from '@utils/mapping';

const Button = styled(NavButton)`
    all: unset;
    height: 30px;
    min-width: 180px;
    font-size: 1rem;
    white-space: nowrap;
    text-align: left;
    padding: 0.25rem 1rem;
    width: 100%;
    box-sizing: border-box;

    &:hover,
    &:focus {
        background: var(--speil-light-hover);
        color: var(--navds-semantic-color-text);
        cursor: pointer;
    }

    &:disabled {
        &,
        &:hover {
            background-color: transparent;
            color: var(--navds-semantic-color-text-muted);
        }
    }
`;

interface LeggPåVentMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    oppgavereferanse: string;
    vedtaksperiodeId: string;
    personinfo: Personinfo;
}

export const LeggPåVentMenuButton = ({ oppgavereferanse, vedtaksperiodeId, personinfo }: LeggPåVentMenuButtonProps) => {
    const containerRef = useRef<HTMLSpanElement>(null);
    const [visModal, setVisModal] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const errorHandler = useOperationErrorHandler('Legg på vent');

    const leggPåVent = useLeggPåVent();

    const åpneModal = async (event: React.MouseEvent) => {
        event.stopPropagation();
        setVisModal(true);
    };

    const settPåVent = () => {
        setIsFetching(true);
        ignorePromise(leggPåVent({ oppgavereferanse }), errorHandler);
    };

    return (
        <span ref={containerRef}>
            <Button as="button" onClick={(e) => åpneModal(e)}>
                Legg på vent
                {isFetching && <Loader size="xsmall" />}
            </Button>
            {visModal && (
                <NyttNotatModal
                    onClose={() => setVisModal(false)}
                    personinfo={convertToGraphQLPersoninfo(personinfo)}
                    vedtaksperiodeId={vedtaksperiodeId}
                    onPostNotat={settPåVent}
                />
            )}
        </span>
    );
};
