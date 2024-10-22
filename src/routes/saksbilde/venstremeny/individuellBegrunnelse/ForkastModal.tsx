import React, { Dispatch, SetStateAction } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { SlettLokaleEndringerModal } from '@components/SlettLokaleEndringerModal';
import { AvslagInput, Avslagshandling, Maybe } from '@io/graphql';

interface ForkastModalProps {
    harLagretAvslag: boolean;
    setAvslag: Dispatch<SetStateAction<Maybe<AvslagInput>>>;
    lukkBegrunnelseModal: () => void;
    lukkForkastModal: () => void;
    lukkIndividuellBegrunnelse: () => void;
}

export const ForkastModal = ({
    harLagretAvslag,
    setAvslag,
    lukkBegrunnelseModal,
    lukkForkastModal,
    lukkIndividuellBegrunnelse,
}: ForkastModalProps) => (
    <SlettLokaleEndringerModal
        heading="Er du sikker på at du vil forkaste endringene?"
        showModal={true}
        onApprove={() => {
            if (harLagretAvslag) {
                setAvslag({ handling: Avslagshandling.Invalider });
            } else {
                setAvslag(null);
                lukkBegrunnelseModal();
            }
            lukkForkastModal();
            lukkIndividuellBegrunnelse();
        }}
        onClose={() => lukkForkastModal()}
    >
        <BodyShort>
            Ved å trykke <span style={{ fontWeight: 'bold' }}>Ja</span> vil den individuelle begrunnelsen ikke bli
            lagret.
        </BodyShort>
    </SlettLokaleEndringerModal>
);
