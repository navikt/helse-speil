import React from 'react';

import { Checkbox, CheckboxGroup, Heading, Modal } from '@navikt/ds-react';

import { TotrinnsvurderingState, useToggleKanFrigiOppgaver, useTotrinnsvurdering } from '@state/toggles';

import styles from './ToggleMeny.module.css';

type ToggleMenyProps = {
    onClose: () => void;
    showModal: boolean;
};

export const ToggleMeny = ({ onClose, showModal }: ToggleMenyProps) => {
    const [totrinn, toggleTotrinn] = useTotrinnsvurdering();
    const [kanFrigiOppgaver, toggleKanFrigiOppgaver] = useToggleKanFrigiOppgaver();

    return (
        <Modal aria-label="Toggle meny modal" portal closeOnBackdropClick open={showModal} onClose={onClose}>
            <Modal.Header>
                <Heading level="1" size="medium">
                    Toggles
                </Heading>
            </Modal.Header>
            <Modal.Body>
                <form className={styles.ToggleMeny}>
                    <CheckboxGroup legend="Totrinnsvurdering" value={totrinnsvurderingStateToCheckboxValue(totrinn)}>
                        <Checkbox value="harBeslutterrolle" onChange={toggleTotrinn('harBeslutterrolle')}>
                            Har beslutterrolle
                        </Checkbox>
                        <Checkbox value="erAktiv" onChange={toggleTotrinn('erAktiv')}>
                            Totrinnsvurdering aktiv
                        </Checkbox>
                        <Checkbox value="kanBeslutteEgne" onChange={toggleTotrinn('kanBeslutteEgne')}>
                            Kan beslutte egen beslutteroppgave
                        </Checkbox>
                    </CheckboxGroup>

                    <CheckboxGroup legend="Tildeling" value={kanFrigiOppgaverStateToCheckboxValue(kanFrigiOppgaver)}>
                        <Checkbox value="kanFrigiOppgaver" onChange={toggleKanFrigiOppgaver}>
                            Kan frigi andres oppgaver
                        </Checkbox>
                    </CheckboxGroup>
                </form>
            </Modal.Body>
        </Modal>
    );
};

const totrinnsvurderingStateToCheckboxValue = (totrinn: TotrinnsvurderingState): string[] => {
    const array: string[] = [];
    if (totrinn.erAktiv) array.push('erAktiv');
    if (totrinn.harBeslutterrolle) array.push('harBeslutterrolle');
    if (totrinn.kanBeslutteEgne) array.push('kanBeslutteEgne');
    return array;
};

const kanFrigiOppgaverStateToCheckboxValue = (kanFrigiOppgaver: boolean): string[] =>
    kanFrigiOppgaver ? ['kanFrigiOppgaver'] : [];
