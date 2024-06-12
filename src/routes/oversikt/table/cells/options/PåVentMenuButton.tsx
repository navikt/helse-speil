import React, { useState } from 'react';

import { Dropdown } from '@navikt/ds-react';

import { Personnavn, Tildeling } from '@io/graphql';
import { useFjernPåVent } from '@state/påvent';
import { Maybe } from '@utils/ts';

import { PåVentNotatModal } from '../notat/PåVentNotatModal';

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
}: PåVentMenuButtonProps) => {
    const [visModal, setVisModal] = useState(false);

    const [fjernPåVent] = useFjernPåVent();

    const åpneModal = () => {
        setVisModal(true);
    };

    const fjernFraPåVent = async () => {
        await fjernPåVent(oppgavereferanse);
    };

    return (
        <>
            {!erPåVent ? (
                <Dropdown.Menu.List.Item onClick={åpneModal} className={styles.MenuButton}>
                    Legg på vent
                </Dropdown.Menu.List.Item>
            ) : (
                <Dropdown.Menu.List.Item onClick={fjernFraPåVent} className={styles.MenuButton}>
                    Fjern fra på vent
                </Dropdown.Menu.List.Item>
            )}
            {visModal && (
                <PåVentNotatModal
                    onClose={() => setVisModal(false)}
                    navn={navn}
                    vedtaksperiodeId={vedtaksperiodeId}
                    tildeling={tildeling}
                    oppgaveId={oppgavereferanse}
                />
            )}
        </>
    );
};
