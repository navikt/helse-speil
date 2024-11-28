import React, { ReactElement, useState } from 'react';

import { Dropdown } from '@navikt/ds-react';

import { Maybe, Personnavn, Tildeling } from '@io/graphql';
import { PåVentNotatModal } from '@oversikt/table/cells/notat/PåVentNotatModal';
import { useFjernPåVentFraOppgaveoversikt } from '@state/påvent';

import styles from './OptionsCell.module.css';

interface PåVentMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    oppgavereferanse: string;
    tildeling: Maybe<Tildeling>;
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
                <PåVentNotatModal
                    onClose={() => setShowModal(false)}
                    showModal={showModal}
                    navn={navn}
                    tildeling={tildeling}
                    oppgaveId={oppgavereferanse}
                />
            )}
        </>
    );
};
