import React from 'react';
import {
    useToggleKanFrigiOppgaver,
    useToggleReadonly,
    useToggleReadonlyOverride,
    useToggleSkalSjekkeRevurderingForTotrinn,
    useToggleTotrinnsvurdering,
    useTotrinnsvurdering,
} from '@state/toggles';
import { Checkbox, CheckboxGroup } from '@navikt/ds-react';

import { Modal } from '@components/Modal';

import styles from './ToggleMeny.module.css';

interface ToggleMenyProps {
    modalOpen: boolean;
    onCloseModal: (event: React.MouseEvent | React.KeyboardEvent) => void;
}

export const ToggleMeny = ({ modalOpen, onCloseModal }: ToggleMenyProps) => {
    const totrinn = useTotrinnsvurdering();
    const toggleTotrinn = useToggleTotrinnsvurdering();

    const [kanFrigiOppgaver, toggleKanFrigiOppgaver] = useToggleKanFrigiOppgaver();

    const [readonlyOverride, toggleReadonlyOverride] = useToggleReadonlyOverride();
    const [readOnly, toggleReadonly] = useToggleReadonly();

    const [skalSjekkeRevurdering, toggleSkalSjekkeRevurdering] = useToggleSkalSjekkeRevurderingForTotrinn();

    return (
        <Modal isOpen={modalOpen} onRequestClose={onCloseModal}>
            <form className={styles.ToggleMeny}>
                <CheckboxGroup legend="Totrinnsvurdering">
                    <Checkbox checked={totrinn.harBeslutterrolle} onChange={toggleTotrinn('harBeslutterrolle')}>
                        Har beslutterrolle
                    </Checkbox>
                    <Checkbox checked={totrinn.erAktiv} onChange={toggleTotrinn('erAktiv')}>
                        Totrinnsvurdering aktiv
                    </Checkbox>
                    <Checkbox checked={totrinn.kanBeslutteEgne} onChange={toggleTotrinn('kanBeslutteEgne')}>
                        Kan beslutte egen beslutteroppgave
                    </Checkbox>
                </CheckboxGroup>

                <CheckboxGroup legend="Tildeling">
                    <Checkbox checked={kanFrigiOppgaver} onChange={toggleKanFrigiOppgaver}>
                        Kan frigi andres oppgaver
                    </Checkbox>
                </CheckboxGroup>

                <CheckboxGroup legend="Read only">
                    <Checkbox checked={readonlyOverride} onChange={toggleReadonlyOverride}>
                        Override read-only
                    </Checkbox>
                    {readonlyOverride && (
                        <Checkbox checked={readOnly} onChange={toggleReadonly}>
                            Oppgave er read-only
                        </Checkbox>
                    )}
                </CheckboxGroup>

                <CheckboxGroup legend="Revurdering">
                    <Checkbox checked={skalSjekkeRevurdering} onChange={toggleSkalSjekkeRevurdering}>
                        Skal sjekke isRevurdering for totrinn
                    </Checkbox>
                </CheckboxGroup>

                <CheckboxGroup legend="Theme">
                    <Checkbox checked={theme === 'dark'} onChange={toggleTheme}>
                        Dark mode
                    </Checkbox>
                </CheckboxGroup>
            </form>
        </Modal>
    );
};
