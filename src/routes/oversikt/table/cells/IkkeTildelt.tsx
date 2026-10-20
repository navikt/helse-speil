import React, { ReactElement } from 'react';

import { Button } from '@navikt/ds-react';

import { VisHvisSkrivetilgang } from '@components/VisHvisSkrivetilgang';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { useTildel } from '@state/tildeling';

import styles from './IkkeTildelt.module.css';

interface IkkeTildeltProps {
    personPseudoId: string;
    width: number;
}

export const IkkeTildelt = ({ personPseudoId, width }: IkkeTildeltProps): ReactElement => {
    const saksbehandler = useInnloggetSaksbehandler();
    const [tildelOppgave, { loading }] = useTildel();

    const tildel = async (event: React.MouseEvent) => {
        event.stopPropagation();
        await tildelOppgave(personPseudoId);
    };

    return (
        <div style={{ width: width }} className={styles.IkkeTildelt}>
            <VisHvisSkrivetilgang>
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
            </VisHvisSkrivetilgang>
        </div>
    );
};
