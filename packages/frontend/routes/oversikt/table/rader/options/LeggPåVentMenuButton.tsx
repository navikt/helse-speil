import React, { useState } from 'react';

import { Loader } from '@navikt/ds-react';
import { Dropdown } from '@navikt/ds-react-internal';

import { Personinfo } from '@io/graphql';
import { NotatDTO } from '@io/http';
import { useLeggPåVent } from '@state/oppgaver';
import { useOperationErrorHandler } from '@state/varsler';
import { ignorePromise } from '@utils/promise';

import { NyttNotatModal } from '../notat/NyttNotatModal';

import styles from './OptionsCell.module.css';

interface LeggPåVentMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    oppgavereferanse: string;
    vedtaksperiodeId: string;
    personinfo: Personinfo;
}

export const LeggPåVentMenuButton = ({ oppgavereferanse, vedtaksperiodeId, personinfo }: LeggPåVentMenuButtonProps) => {
    const [visModal, setVisModal] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const errorHandler = useOperationErrorHandler('Legg på vent');

    const leggPåVentMedNotat = useLeggPåVent();

    const åpneModal = () => {
        setVisModal(true);
    };

    const settPåVent = (notattekst: string) => {
        setIsFetching(true);
        ignorePromise(
            leggPåVentMedNotat(oppgavereferanse, { tekst: notattekst, type: 'PaaVent' } as NotatDTO),
            errorHandler,
        );
    };

    return (
        <>
            <Dropdown.Menu.List.Item onClick={åpneModal} className={styles.MenuButton}>
                Legg på vent
                {isFetching && <Loader size="xsmall" />}
            </Dropdown.Menu.List.Item>
            {visModal && (
                <NyttNotatModal
                    onClose={() => setVisModal(false)}
                    personinfo={personinfo}
                    vedtaksperiodeId={vedtaksperiodeId}
                    onSubmitOverride={settPåVent}
                    notattype="PaaVent"
                />
            )}
        </>
    );
};
