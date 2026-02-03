import React, { ReactElement } from 'react';

import { Dropdown } from '@navikt/ds-react';

import { useFjernPåVentFraOppgaveoversikt } from '@state/påvent';

import styles from './OptionsCell.module.css';

interface PåVentMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    oppgavereferanse: string;
    erPåVent: boolean;
    showModal: () => void;
}

export const PåVentMenuButton = ({ oppgavereferanse, erPåVent, showModal }: PåVentMenuButtonProps): ReactElement => {
    const [fjernPåVent] = useFjernPåVentFraOppgaveoversikt();

    const fjernFraPåVent = async () => {
        await fjernPåVent(oppgavereferanse);
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
