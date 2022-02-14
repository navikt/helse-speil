import React, { useContext, useState } from 'react';

import { DropdownContext, DropdownMenyknapp } from '@components/dropdown/Dropdown';
import { usePerson } from '@state/person';

import { Annulleringsmodal } from './Annulleringsmodal';
import { ISO_DATOFORMAT } from '@utils/date';

export interface AnnulleringProps {
    utbetaling: Utbetaling;
    aktivPeriode: TidslinjeperiodeMedSykefravær;
}

export const Annullering = ({ utbetaling, aktivPeriode }: AnnulleringProps) => {
    const person = usePerson();
    const { lukk } = useContext(DropdownContext);
    const [showModal, setShowModal] = useState<boolean>(false);

    if (!person) return null;

    return (
        <>
            <DropdownMenyknapp onClick={() => setShowModal(true)}>Annuller</DropdownMenyknapp>
            {showModal && (
                <Annulleringsmodal
                    fødselsnummer={person.fødselsnummer}
                    aktørId={person.aktørId}
                    organisasjonsnummer={aktivPeriode.organisasjonsnummer}
                    fagsystemId={utbetaling.fagsystemId}
                    linjer={utbetaling.linjer.map((it) => ({
                        ...it,
                        fom: it.fom.format(ISO_DATOFORMAT),
                        tom: it.tom.format(ISO_DATOFORMAT),
                        totalbeløp: it.dagsats,
                    }))}
                    onClose={() => {
                        setShowModal(false);
                        lukk();
                    }}
                />
            )}
        </>
    );
};
