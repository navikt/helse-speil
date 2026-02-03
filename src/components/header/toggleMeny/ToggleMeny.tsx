import React from 'react';

import { Checkbox, CheckboxGroup, Heading, Modal } from '@navikt/ds-react';

import { TotrinnsvurderingState, useTotrinnsvurdering } from '@state/toggles';

type ToggleMenyProps = {
    closeModal: () => void;
    showModal: boolean;
};

export const ToggleMeny = ({ closeModal, showModal }: ToggleMenyProps) => {
    const [totrinn, toggleTotrinn] = useTotrinnsvurdering();

    return (
        <Modal aria-label="Toggle meny modal" closeOnBackdropClick open={showModal} onClose={closeModal}>
            <Modal.Header>
                <Heading level="1" size="medium">
                    Toggles
                </Heading>
            </Modal.Header>
            <Modal.Body>
                <form>
                    <CheckboxGroup legend="Totrinnsvurdering" value={totrinnsvurderingStateToCheckboxValue(totrinn)}>
                        <Checkbox value="kanBeslutteEgne" onChange={toggleTotrinn('kanBeslutteEgne')}>
                            Kan beslutte egen beslutteroppgave
                        </Checkbox>
                    </CheckboxGroup>
                </form>
            </Modal.Body>
        </Modal>
    );
};

const totrinnsvurderingStateToCheckboxValue = (totrinn: TotrinnsvurderingState): string[] => {
    const array: string[] = [];
    if (totrinn.kanBeslutteEgne) array.push('kanBeslutteEgne');
    return array;
};
