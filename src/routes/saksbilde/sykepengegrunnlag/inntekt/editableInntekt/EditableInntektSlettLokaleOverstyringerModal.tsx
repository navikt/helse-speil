import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Maybe } from '@io/graphql';
import { SlettLokaleEndringerModal } from '@saksbilde/varsler/KalkulerEndringerVarsel';
import { DateString } from '@typer/shared';

import styles from './EditableInntekt.module.css';

interface EditableInntektSlettLokaleOverstyringerModalProps {
    onApprove: () => void;
    onClose: () => void;
    skjæringstidspunkt: DateString;
    overstyrtSkjæringstidspunkt: Maybe<DateString>;
}

export const EditableInntektSlettLokaleOverstyringerModal = ({
    onApprove,
    onClose,
    skjæringstidspunkt,
    overstyrtSkjæringstidspunkt,
}: EditableInntektSlettLokaleOverstyringerModalProps) => (
    <SlettLokaleEndringerModal
        onApprove={onApprove}
        onClose={onClose}
        heading="Er du sikker på at du vil fortsette?"
        tekst={
            <div>
                <BodyShort>
                    Ved å trykke ja lagrer du disse nye endringene for skjæringstidspunkt:{' '}
                    <span className={styles.Skjæringstidspunkt}>{skjæringstidspunkt}</span>,
                </BodyShort>
                <BodyShort>
                    og vil dermed overskrive lokale overstyringer lagret på skjæringstidspunkt:{' '}
                    <span className={styles.Skjæringstidspunkt}>{overstyrtSkjæringstidspunkt ?? ''}</span>
                </BodyShort>
            </div>
        }
    />
);
