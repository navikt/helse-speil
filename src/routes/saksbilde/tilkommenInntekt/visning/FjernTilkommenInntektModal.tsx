import React, { ReactElement, useState } from 'react';

import { BodyLong, Button, Modal, Textarea, VStack } from '@navikt/ds-react';

import { useMutation } from '@apollo/client';
import { RestPostTilkommenInntektFjernDocument, TilkommenInntekt } from '@io/graphql';
import { useTilkommenInntektMedOrganisasjonsnummer } from '@state/tilkommenInntekt';
import { somNorskDato } from '@utils/date';

interface FjernTilkommenInntektModalProps {
    tilkommenInntekt: TilkommenInntekt;
    aktørId?: string;
    onClose: () => void;
}

export const FjernTilkommenInntektModal = ({
    tilkommenInntekt,
    aktørId,
    onClose,
}: FjernTilkommenInntektModalProps): ReactElement => {
    const [fjerningBegrunnelse, setFjerningBegrunnelse] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const [fjernTilkommenInntekt] = useMutation(RestPostTilkommenInntektFjernDocument);

    const { tilkommenInntektRefetch } = useTilkommenInntektMedOrganisasjonsnummer(
        tilkommenInntekt.tilkommenInntektId,
        aktørId,
    );

    const handleFjern = async () => {
        if (fjerningBegrunnelse.trim().length === 0) {
            setError('Begrunnelse må fylles ut');
        } else {
            setError(undefined);
            setIsSubmitting(true);
            await fjernTilkommenInntekt({
                variables: {
                    tilkommenInntektId: tilkommenInntekt.tilkommenInntektId,
                    input: {
                        notatTilBeslutter: fjerningBegrunnelse,
                    },
                },
                onCompleted: () => tilkommenInntektRefetch().then(() => onClose()),
                onError: () => {
                    setError('Klarte ikke fjerne perioden. Prøv igjen senere, eller kontakt en coach.');
                    setIsSubmitting(false);
                },
            });
        }
    };

    return (
        <Modal
            header={{ heading: 'Fjern periode', closeButton: !isSubmitting }}
            closeOnBackdropClick={!isSubmitting}
            open={true}
            onClose={onClose}
        >
            <Modal.Body>
                <VStack gap="4">
                    <BodyLong>
                        Vil du fjerne perioden {somNorskDato(tilkommenInntekt.periode.fom)} –{' '}
                        {somNorskDato(tilkommenInntekt.periode.tom)}?
                    </BodyLong>
                    <Textarea
                        label="Begrunn hvorfor perioden fjernes"
                        description="Teksten blir ikke vist til den sykmeldte, med mindre hen ber om innsyn."
                        value={fjerningBegrunnelse}
                        error={error}
                        onChange={(event) => setFjerningBegrunnelse(event.target.value)}
                    />
                </VStack>
            </Modal.Body>
            <Modal.Footer>
                <Button type="button" onClick={handleFjern} loading={isSubmitting}>
                    Ja
                </Button>
                <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
                    Nei
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
