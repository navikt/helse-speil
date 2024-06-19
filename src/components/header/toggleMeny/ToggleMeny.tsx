import React from 'react';

import { Checkbox, CheckboxGroup, Heading, Modal } from '@navikt/ds-react';

import { useToggleKanFrigiOppgaver, useToggleReadonly, useTotrinnsvurdering } from '@state/toggles';

import styles from './ToggleMeny.module.css';

type ToggleMenyProps = {
    setShowModal: (visModal: boolean) => void;
    showModal: boolean;
};

export const ToggleMeny = ({ setShowModal, showModal }: ToggleMenyProps) => {
    const [totrinn, toggleTotrinn] = useTotrinnsvurdering();
    const [readOnly, toggleReadonly, toggleOverride] = useToggleReadonly();
    const [kanFrigiOppgaver, toggleKanFrigiOppgaver] = useToggleKanFrigiOppgaver();

    return (
        <Modal
            aria-label="Toggle meny modal"
            portal
            closeOnBackdropClick
            open={showModal}
            onClose={() => setShowModal(false)}
        >
            <Modal.Header>
                <Heading level="1" size="medium">
                    Toggles
                </Heading>
            </Modal.Header>
            <Modal.Body>
                <form className={styles.ToggleMeny}>
                    <CheckboxGroup legend="Totrinnsvurdering">
                        <Checkbox
                            value="Har beslutterrolle"
                            checked={totrinn.harBeslutterrolle}
                            onChange={toggleTotrinn('harBeslutterrolle')}
                        >
                            Har beslutterrolle
                        </Checkbox>
                        <Checkbox
                            value="Totrinnsvurdering aktiv"
                            checked={totrinn.erAktiv}
                            onChange={toggleTotrinn('erAktiv')}
                        >
                            Totrinnsvurdering aktiv
                        </Checkbox>
                        <Checkbox
                            value="Kan beslutte egen beslutteroppgave"
                            checked={totrinn.kanBeslutteEgne}
                            onChange={toggleTotrinn('kanBeslutteEgne')}
                        >
                            Kan beslutte egen beslutteroppgave
                        </Checkbox>
                    </CheckboxGroup>

                    <CheckboxGroup legend="Tildeling">
                        <Checkbox
                            value="Kan frigi andres oppgaver"
                            checked={kanFrigiOppgaver}
                            onChange={toggleKanFrigiOppgaver}
                        >
                            Kan frigi andres oppgaver
                        </Checkbox>
                    </CheckboxGroup>

                    <CheckboxGroup legend="Read only">
                        <Checkbox value="Override readonly" checked={readOnly.override} onChange={toggleOverride}>
                            Override readonly
                        </Checkbox>
                        <Checkbox
                            value="Oppgave er readonly"
                            checked={readOnly.value}
                            onChange={toggleReadonly}
                            disabled={!readOnly.override}
                        >
                            Oppgave er readonly
                        </Checkbox>
                    </CheckboxGroup>
                </form>
            </Modal.Body>
        </Modal>
    );
};
