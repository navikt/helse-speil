import React, { useState } from 'react';

import { Dropdown } from '@navikt/ds-react-internal';

import { Personinfo } from '@io/graphql';
import { NotatDTO } from '@io/http';
import { useLeggPåVent } from '@state/oppgaver';

import { NyttNotatModal } from '../notat/NyttNotatModal';

import styles from './OptionsCell.module.css';

interface LeggPåVentMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    oppgavereferanse: string;
    vedtaksperiodeId: string;
    personinfo: Personinfo;
}

export const LeggPåVentMenuButton = ({ oppgavereferanse, vedtaksperiodeId, personinfo }: LeggPåVentMenuButtonProps) => {
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
                    personinfo={personinfo}
                    vedtaksperiodeId={vedtaksperiodeId}
                    onSubmitOverride={settPåVent}
                    errorOverride={error}
                    notattype="PaaVent"
                />
            )}
        </>
    );
};
