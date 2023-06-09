import React, { useState } from 'react';

import { Button, Loader } from '@navikt/ds-react';

import { useInnloggetSaksbehandler } from '@state/authentication';
import { useOpprettTildeling } from '@state/tildeling';

import styles from './IkkeTildelt.module.css';

interface IkkeTildeltProps {
    oppgavereferanse: string;
    width: number;
}

export const IkkeTildelt = ({ oppgavereferanse, width }: IkkeTildeltProps) => {
    const saksbehandler = useInnloggetSaksbehandler();
    const [isFetching, setIsFetching] = useState(false);
    const tildelOppgave = useOpprettTildeling();

    const tildel = (event: React.MouseEvent) => {
        event.stopPropagation();
        setIsFetching(true);
        tildelOppgave(oppgavereferanse).finally(() => setIsFetching(false));
    };

    return (
        <div style={{ width: width }}>
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
        </div>
    );
};
