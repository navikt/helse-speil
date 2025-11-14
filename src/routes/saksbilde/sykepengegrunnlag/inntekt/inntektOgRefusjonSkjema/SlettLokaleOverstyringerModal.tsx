import React, { ReactElement } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { SlettLokaleEndringerModal } from '@components/SlettLokaleEndringerModal';
import { DateString } from '@typer/shared';

type EditableInntektSlettLokaleOverstyringerModalProps = {
    showModal: boolean;
    onApprove: () => void;
    onClose: () => void;
    skjæringstidspunkt: DateString;
    overstyrtSkjæringstidspunkt: DateString | null;
};

export const SlettLokaleOverstyringerModal = ({
    showModal,
    onApprove,
    onClose,
    skjæringstidspunkt,
    overstyrtSkjæringstidspunkt,
}: EditableInntektSlettLokaleOverstyringerModalProps): ReactElement => (
    <SlettLokaleEndringerModal
        heading="Er du sikker på at du vil fortsette?"
        showModal={showModal}
        onApprove={onApprove}
        closeModal={onClose}
    >
        <BodyShort>
            Ved å trykke ja lagrer du disse nye endringene for skjæringstidspunkt:{' '}
            <BodyShort as="span" weight="semibold">
                {skjæringstidspunkt}
            </BodyShort>
            , <br /> og vil dermed overskrive lokale overstyringer lagret på skjæringstidspunkt:{' '}
            <BodyShort as="span" weight="semibold">
                {overstyrtSkjæringstidspunkt ?? ''}
            </BodyShort>
        </BodyShort>
    </SlettLokaleEndringerModal>
);
