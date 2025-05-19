import { ReactElement } from 'react';

import { BodyLong, Button, Modal } from '@navikt/ds-react';

import { TilkommenInntekt } from '@io/graphql';
import { somNorskDato } from '@utils/date';

interface FjernTilkommenInntektModalProps {
    tilkommenInntekt: TilkommenInntekt;
    onConfirm: () => void;
    onCancel: () => void;
}

export const FjernTilkommenInntektModal = ({
    tilkommenInntekt,
    onConfirm,
    onCancel,
}: FjernTilkommenInntektModalProps): ReactElement => {
    return (
        <Modal header={{ heading: 'Fjern periode' }} closeOnBackdropClick open={true} onClose={onCancel}>
            <Modal.Body>
                <BodyLong>
                    Vil du fjerne perioden {somNorskDato(tilkommenInntekt.periode.fom)} –{' '}
                    {somNorskDato(tilkommenInntekt.periode.tom)}?
                </BodyLong>
            </Modal.Body>
            <Modal.Footer>
                <Button type="button" variant="secondary" onClick={onCancel}>
                    Nei
                </Button>
                <Button type="button" onClick={onConfirm}>
                    Ja
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
