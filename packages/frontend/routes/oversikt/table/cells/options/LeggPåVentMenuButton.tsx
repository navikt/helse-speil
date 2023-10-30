import React, { useState } from 'react';

import { Dropdown } from '@navikt/ds-react-internal';

import { NotatType, Personnavn } from '@io/graphql';
import { NotatDTO } from '@io/http';
import { useLeggPåVent } from '@state/tildeling';

import { NyttNotatModal } from '../notat/NyttNotatModal';

import styles from './OptionsCell.module.css';

interface LeggPåVentMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    oppgavereferanse: string;
    vedtaksperiodeId: string;
    navn: Personnavn;
}

export const LeggPåVentMenuButton = ({ oppgavereferanse, vedtaksperiodeId, navn }: LeggPåVentMenuButtonProps) => {
    const [visModal, setVisModal] = useState(false);

    const [leggPåVentMedNotat, data] = useLeggPåVent();

    const åpneModal = () => {
        setVisModal(true);
    };

    const settPåVent = (notattekst: string) =>
        leggPåVentMedNotat(oppgavereferanse, { tekst: notattekst, type: 'PaaVent' } as NotatDTO, vedtaksperiodeId);

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
                    errorOverride={data.error ? 'Kunne ikke lagre notat' : undefined}
                    notattype={NotatType.PaaVent}
                />
            )}
        </>
    );
};
