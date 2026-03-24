import React, { ReactElement } from 'react';

import { Dropdown } from '@navikt/ds-react';

import {
    getGetAntallOppgaverQueryKey,
    getGetOppgaverQueryKey,
    useDeletePåVent,
} from '@io/rest/generated/oppgaver/oppgaver';
import { useQueryClient } from '@tanstack/react-query';

import styles from './OptionsCell.module.css';

interface PåVentMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    oppgavereferanse: string;
    erPåVent: boolean;
    showModal: () => void;
}

export const PåVentMenuButton = ({ oppgavereferanse, erPåVent, showModal }: PåVentMenuButtonProps): ReactElement => {
    const queryClient = useQueryClient();
    const { mutate: fjernPåVent } = useDeletePåVent();

    const fjernFraPåVent = async () => {
        fjernPåVent(
            {
                oppgaveId: Number.parseInt(oppgavereferanse),
            },
            {
                onSuccess: async () => {
                    await Promise.all([
                        queryClient.invalidateQueries({ queryKey: getGetOppgaverQueryKey() }),
                        queryClient.invalidateQueries({ queryKey: getGetAntallOppgaverQueryKey() }),
                    ]);
                },
            },
        );
    };

    return (
        <>
            {!erPåVent ? (
                <Dropdown.Menu.List.Item onClick={showModal} className={styles.MenuButton}>
                    Legg på vent
                </Dropdown.Menu.List.Item>
            ) : (
                <Dropdown.Menu.List.Item onClick={fjernFraPåVent} className={styles.MenuButton}>
                    Fjern fra på vent
                </Dropdown.Menu.List.Item>
            )}
        </>
    );
};
