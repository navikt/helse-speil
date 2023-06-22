import React from 'react';

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
    const [foo, { loading }] = useOpprettTildeling();

    const tildel = (event: React.MouseEvent) => {
        event.stopPropagation();
        foo(oppgavereferanse);
    };

    return (
        <div style={{ width: width }}>
            <Button
                className={styles.Tildelingsknapp}
                variant="secondary"
                size="small"
                onClick={tildel}
                disabled={!saksbehandler || loading}
            >
                Tildel meg
                {loading && <Loader size="xsmall" />}
            </Button>
        </div>
    );
};
