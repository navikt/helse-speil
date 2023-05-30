import React, { useState } from 'react';

import { Button, Loader } from '@navikt/ds-react';

import { useInnloggetSaksbehandler } from '@state/authentication';
import { useOpprettTildeling } from '@state/tildeling';

import { CellContent } from './CellContent';

import styles from './IkkeTildelt.module.css';

interface IkkeTildeltProps {
    oppgavereferanse: string;
}

export const IkkeTildelt = ({ oppgavereferanse }: IkkeTildeltProps) => {
    const saksbehandler = useInnloggetSaksbehandler();
    const [isFetching, setIsFetching] = useState(false);
    const tildelOppgave = useOpprettTildeling();

    const tildel = (event: React.MouseEvent) => {
        event.stopPropagation();
        setIsFetching(true);
        tildelOppgave(oppgavereferanse).finally(() => setIsFetching(false));
    };

    return (
        <CellContent width={128}>
            <Button
                className={styles.Tildelingsknapp}
                variant="secondary"
                size="small"
                onClick={tildel}
                disabled={!saksbehandler || isFetching}
            >
                Tildel meg
                {isFetching && <Loader size="xsmall" />}
            </Button>
        </CellContent>
    );
};
