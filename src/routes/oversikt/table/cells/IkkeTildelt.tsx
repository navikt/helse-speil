import React, { ReactElement } from 'react';

import { Button } from '@navikt/ds-react';

import { VisHvisSkrivetilgang } from '@components/VisHvisSkrivetilgang';
import { getGetAntallOppgaverQueryKey, getGetOppgaverQueryKey } from '@io/rest/generated/oppgaver/oppgaver';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { useTildel } from '@state/tildeling';
import { useQueryClient } from '@tanstack/react-query';

import styles from './IkkeTildelt.module.css';

interface IkkeTildeltProps {
    personPseudoId: string;
    width: number;
}

export const IkkeTildelt = ({ personPseudoId, width }: IkkeTildeltProps): ReactElement => {
    const queryClient = useQueryClient();
    const saksbehandler = useInnloggetSaksbehandler();
    const [tildelOppgave, { loading }] = useTildel();

    const tildel = async (event: React.MouseEvent) => {
        event.stopPropagation();
        await tildelOppgave(personPseudoId, async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: getGetOppgaverQueryKey() }),
                queryClient.invalidateQueries({ queryKey: getGetAntallOppgaverQueryKey() }),
            ]);
        });
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
