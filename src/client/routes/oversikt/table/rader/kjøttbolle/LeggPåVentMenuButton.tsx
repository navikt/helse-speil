import styled from '@emotion/styled';
import { Personinfo } from 'internal-types';
import React, { useRef, useState } from 'react';

import { Knapp, KnappBaseProps } from 'nav-frontend-knapper';
import NavFrontendSpinner from 'nav-frontend-spinner';

import { useLeggPåVent } from '../../../../../state/oppgaver';
import { useOperationErrorHandler } from '../../../../../state/varsler';
import { ignorePromise } from '../../../../../utils/promise';

import { NyttNotatModal } from '../notat/NyttNotatModal';

const Button = styled(Knapp)`
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
        color: var(--navds-primary-text);
        cursor: pointer;
    }

    &:disabled {
        &,
        &:hover {
            background-color: transparent;
            color: var(--navds-color-text-disabled);
        }
    }
`;

interface LeggPåVentMenuButtonProps extends KnappBaseProps {
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
            <Button onClick={(e) => åpneModal(e)}>
                Legg på vent
                {isFetching && <NavFrontendSpinner type="XXS" />}
            </Button>
            {visModal && (
                <NyttNotatModal
                    lukkModal={() => setVisModal(false)}
                    personinfo={personinfo}
                    vedtaksperiodeId={vedtaksperiodeId}
                    leggSakPåVent={settPåVent}
                />
            )}
        </span>
    );
};
