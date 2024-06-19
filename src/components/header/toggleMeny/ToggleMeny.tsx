import React from 'react';

import { Checkbox, CheckboxGroup } from '@navikt/ds-react';

import { GammelModal } from '@components/Modal';
import { useToggleKanFrigiOppgaver, useToggleReadonly, useTotrinnsvurdering } from '@state/toggles';

import styles from './ToggleMeny.module.css';

interface ToggleMenyProps {
    modalOpen: boolean;
    onCloseModal: (event: React.MouseEvent | React.KeyboardEvent) => void;
}

export const ToggleMeny = ({ modalOpen, onCloseModal }: ToggleMenyProps) => {
    const [totrinn, toggleTotrinn] = useTotrinnsvurdering();
    const [readOnly, toggleReadonly, toggleOverride] = useToggleReadonly();
    const [kanFrigiOppgaver, toggleKanFrigiOppgaver] = useToggleKanFrigiOppgaver();

    return (
        <GammelModal isOpen={modalOpen} onRequestClose={onCloseModal}>
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
        </GammelModal>
    );
};
