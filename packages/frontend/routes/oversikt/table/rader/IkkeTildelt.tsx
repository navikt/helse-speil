import styled from '@emotion/styled';
import React, { useState } from 'react';

import { Button, Loader } from '@navikt/ds-react';

import { useInnloggetSaksbehandler } from '@state/authentication';
import { useTildelOppgave } from '@state/oppgaver';

import { CellContent } from './CellContent';

const Tildelingsknapp = styled(Button)`
    min-height: 0;
    height: 1.5rem;
    padding: 0 0.75rem;
    box-sizing: border-box;
    font-size: var(--navds-font-size-xs);

    > svg {
        margin-left: 0.5rem;
    }
`;

interface IkkeTildeltProps {
    oppgavereferanse: string;
}

export const IkkeTildelt = ({ oppgavereferanse }: IkkeTildeltProps) => {
    const saksbehandler = useInnloggetSaksbehandler();
    const [isFetching, setIsFetching] = useState(false);
    const tildelOppgave = useTildelOppgave();

    const tildel = (event: React.MouseEvent) => {
        event.stopPropagation();
        if (!saksbehandler || isFetching) return;
        setIsFetching(true);
        tildelOppgave({ oppgavereferanse }, saksbehandler).catch(() => setIsFetching(false));
    };

    return (
        <CellContent width={128}>
            <Tildelingsknapp as="button" variant="secondary" size="small" onClick={tildel}>
                Tildel meg
                {isFetching && <Loader size="xsmall" />}
            </Tildelingsknapp>
        </CellContent>
    );
};
