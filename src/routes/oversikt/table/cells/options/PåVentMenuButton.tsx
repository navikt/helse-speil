import React, { ReactElement, useState } from 'react';

import { Dropdown } from '@navikt/ds-react';

import { Maybe, Personnavn, Tildeling } from '@io/graphql';
import { PåVentNotatModal } from '@oversikt/table/cells/notat/PåVentNotatModal';
import { useFjernPåVent } from '@state/påvent';

import styles from './OptionsCell.module.css';

interface PåVentMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    oppgavereferanse: string;
    vedtaksperiodeId: string;
    tildeling: Maybe<Tildeling>;
    navn: Personnavn;
    erPåVent: boolean;
}

export const PåVentMenuButton = ({
    oppgavereferanse,
    vedtaksperiodeId,
    tildeling,
    navn,
    erPåVent,
}: PåVentMenuButtonProps): ReactElement => {
    const [fjernPåVent] = useFjernPåVent();
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
                    setShowModal={(visModal) => setShowModal(visModal)}
                    showModal={showModal}
                    navn={navn}
                    vedtaksperiodeId={vedtaksperiodeId}
                    tildeling={tildeling}
                    oppgaveId={oppgavereferanse}
                />
            )}
        </>
    );
};
