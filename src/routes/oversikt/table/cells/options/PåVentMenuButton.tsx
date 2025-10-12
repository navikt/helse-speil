import React, { ReactElement, useState } from 'react';

import { Dropdown } from '@navikt/ds-react';

import { LeggPåVentModal } from '@components/påvent/PåVentModaler';
import { Personnavn, Tildeling } from '@io/rest/generated/spesialist.schemas';
import { useFjernPåVentFraOppgaveoversikt } from '@state/påvent';

import styles from './OptionsCell.module.css';

interface PåVentMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    oppgavereferanse: string;
    tildeling: Tildeling | null;
    navn: Personnavn;
    erPåVent: boolean;
}

export const PåVentMenuButton = ({
    oppgavereferanse,
    tildeling,
    navn,
    erPåVent,
}: PåVentMenuButtonProps): ReactElement => {
    const [fjernPåVent] = useFjernPåVentFraOppgaveoversikt();
    const [showModal, setShowModal] = useState(false);

    const fjernFraPåVent = async () => {
        await fjernPåVent(oppgavereferanse);
    };

    return (
        <>
            {!erPåVent ? (
                <Dropdown.Menu.List.Item onClick={() => setShowModal(true)} className={styles.MenuButton}>
                    Legg på vent
                </Dropdown.Menu.List.Item>
            ) : (
                <Dropdown.Menu.List.Item onClick={fjernFraPåVent} className={styles.MenuButton}>
                    Fjern fra på vent
                </Dropdown.Menu.List.Item>
            )}
            {showModal && (
                <LeggPåVentModal
                    oppgaveId={oppgavereferanse}
                    navn={navn}
                    utgangspunktTildeling={tildeling}
                    onClose={() => setShowModal(false)}
                />
            )}
        </>
    );
};
