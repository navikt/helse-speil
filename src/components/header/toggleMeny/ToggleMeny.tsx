import React from 'react';

import { Checkbox, CheckboxGroup, Heading, Modal } from '@navikt/ds-react';

import { ToggleState, useToggle } from '@state/toggles';

type ToggleMenyProps = {
    closeModal: () => void;
    showModal: boolean;
};

export const ToggleMeny = ({ closeModal, showModal }: ToggleMenyProps) => {
    const { value, toggle } = useToggle();

    return (
        <Modal aria-label="Toggle meny modal" closeOnBackdropClick open={showModal} onClose={closeModal}>
            <Modal.Header>
                <Heading level="1" size="medium">
                    Toggles
                </Heading>
            </Modal.Header>
            <Modal.Body>
                <form>
                    <CheckboxGroup legend="Toggles" hideLegend value={toggleStateToCheckboxValue(value)}>
                        <Checkbox value="kanBeslutteEgne" onChange={toggle('kanBeslutteEgne')}>
                            Kan beslutte egen beslutteroppgave
                        </Checkbox>
                        <Checkbox value="nyInngangsvilkår" onChange={toggle('nyInngangsvilkår')}>
                            Bruk ny versjon av inngangsvilkår
                        </Checkbox>
                    </CheckboxGroup>
                </form>
            </Modal.Body>
        </Modal>
    );
};

const toggleStateToCheckboxValue = (state: ToggleState): string[] => {
    const array: string[] = [];
    if (state.kanBeslutteEgne) array.push('kanBeslutteEgne');
    if (state.nyInngangsvilkår) array.push('nyInngangsvilkår');
    return array;
};
