import React, { useState } from 'react';

import { Dropdown } from '@navikt/ds-react-internal';

import { Personnavn } from '@io/graphql';
import { NotatDTO } from '@io/http';
import { useLeggPåVent } from '@state/oppgaver';

import { NyttNotatModal } from '../notat/NyttNotatModal';

import styles from './OptionsCell.module.css';

interface LeggPåVentMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    oppgavereferanse: string;
    vedtaksperiodeId: string;
    navn: Personnavn;
}

export const LeggPåVentMenuButton = ({ oppgavereferanse, vedtaksperiodeId, navn }: LeggPåVentMenuButtonProps) => {
    const [visModal, setVisModal] = useState(false);
    const [error, setError] = useState<string | undefined>();

    const leggPåVentMedNotat = useLeggPåVent();

    const åpneModal = () => {
        setVisModal(true);
    };

    const settPåVent = (notattekst: string) =>
        leggPåVentMedNotat(oppgavereferanse, { tekst: notattekst, type: 'PaaVent' } as NotatDTO).catch(() =>
            setError('Kunne ikke lagre notat'),
        );

    return (
        <>
            <Dropdown.Menu.List.Item onClick={åpneModal} className={styles.MenuButton}>
                Legg på vent
            </Dropdown.Menu.List.Item>
            {visModal && (
                <NyttNotatModal
                    onClose={() => setVisModal(false)}
                    navn={navn}
                    vedtaksperiodeId={vedtaksperiodeId}
                    onSubmitOverride={settPåVent}
                    errorOverride={error}
                    notattype="PaaVent"
                />
            )}
        </>
    );
};
