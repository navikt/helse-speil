import dayjs from 'dayjs';
import React, { useState } from 'react';

import { Dropdown } from '@navikt/ds-react-internal';

import { NotatType, Personnavn } from '@io/graphql';
import { useFjernPåVent, useLeggPåVent } from '@state/påvent';
import { ISO_DATOFORMAT, NORSK_DATOFORMAT } from '@utils/date';

import { NyttNotatModal } from '../notat/NyttNotatModal';

import styles from './OptionsCell.module.css';

interface PåVentMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    oppgavereferanse: string;
    vedtaksperiodeId: string;
    navn: Personnavn;
    erPåVent: boolean;
}

export const PåVentMenuButton = ({ oppgavereferanse, vedtaksperiodeId, navn, erPåVent }: PåVentMenuButtonProps) => {
    const [visModal, setVisModal] = useState(false);

    const [leggPåVentMedNotat, data] = useLeggPåVent();
    const [fjernPåVent] = useFjernPåVent();

    const åpneModal = () => {
        setVisModal(true);
    };

    const settPåVent = async (notattekst: string, frist?: Maybe<string>, begrunnelse?: Maybe<string>) => {
        const fristVerdi = frist ? dayjs(frist, NORSK_DATOFORMAT).format(ISO_DATOFORMAT) : null;
        const begrunnelseVerdi = begrunnelse ?? null;

        await leggPåVentMedNotat(oppgavereferanse, fristVerdi, begrunnelseVerdi, notattekst, vedtaksperiodeId);
        setVisModal(false);
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
