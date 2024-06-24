import React, { ReactElement } from 'react';

import { Button } from '@navikt/ds-react';

import { useInnloggetSaksbehandler } from '@state/authentication';
import { useOpprettTildeling } from '@state/tildeling';

import styles from './IkkeTildelt.module.css';

interface IkkeTildeltProps {
    oppgavereferanse: string;
    width: number;
}

export const IkkeTildelt = ({ oppgavereferanse, width }: IkkeTildeltProps): ReactElement => {
    const saksbehandler = useInnloggetSaksbehandler();
    const [tildelOppgave, { loading }] = useOpprettTildeling();

    const tildel = (event: React.MouseEvent) => {
        event.stopPropagation();
        void tildelOppgave(oppgavereferanse);
    };

    return (
        <div style={{ width: width }}>
            <Button
                className={styles.Tildelingsknapp}
                variant="secondary"
                size="small"
                onClick={tildel}
                disabled={!saksbehandler}
                loading={loading}
            >
                Tildel meg
            </Button>
        </div>
    );
};
