import React from 'react';
import { Modal } from '@components/Modal';
import { useRecoilState } from 'recoil';
import {
    toggleHarBeslutterRolle,
    toggleKanBeslutteEgenBeslutteroppgave,
    toggleKanFrigiAndresOppgaver,
    toggleReadOnly,
    toggleReadOnlyOverride,
    toggleSkalSjekkeIsRevurderingForTotrinn,
    toggleTotrinnsvurderingAktiv,
} from '@state/toggles';
import { Checkbox, CheckboxGroup } from '@navikt/ds-react';

import styles from './ToggleMeny.module.css';

interface ToggleMenyProps {
    modalOpen: boolean;
    onCloseModal: (event: React.MouseEvent | React.KeyboardEvent) => void;
}

export const ToggleMeny = ({ modalOpen, onCloseModal }: ToggleMenyProps) => {
    const [harBeslutterRolle, setHarBeslutterRolle] = useRecoilState(toggleHarBeslutterRolle);
    const [totrinnsvurderingErAktiv, setTotrinnsvurderingErAktiv] = useRecoilState(toggleTotrinnsvurderingAktiv);
    const [kanBeslutteEgenBeslutteroppgave, setKanBeslutteEgenBeslutteroppgave] = useRecoilState(
        toggleKanBeslutteEgenBeslutteroppgave,
    );

    const [kanFrigiAndresOppgaver, setKanFrigiAndresOppgaver] = useRecoilState(toggleKanFrigiAndresOppgaver);

    const [readOnlyOverride, setReadOnlyOverride] = useRecoilState(toggleReadOnlyOverride);
    const [readOnly, setReadOnly] = useRecoilState(toggleReadOnly);

    const [skalSjekkeIsRevurderingForTotrinn, setSkalSjekkeIsRevurderingForTotrinn] = useRecoilState(
        toggleSkalSjekkeIsRevurderingForTotrinn,
    );

    return (
        <Modal isOpen={modalOpen} onRequestClose={onCloseModal}>
            <form className={styles.ToggleMeny}>
                <CheckboxGroup legend="Totrinnsvurdering">
                    <Checkbox
                        checked={harBeslutterRolle}
                        onChange={() => setHarBeslutterRolle((prevState) => !prevState)}
                    >
                        Har beslutterrolle
                    </Checkbox>
                    <Checkbox
                        checked={totrinnsvurderingErAktiv}
                        onChange={() => setTotrinnsvurderingErAktiv((prevState) => !prevState)}
                    >
                        Totrinnsvurdering aktiv
                    </Checkbox>
                    <Checkbox
                        checked={kanBeslutteEgenBeslutteroppgave}
                        onChange={() => setKanBeslutteEgenBeslutteroppgave((prevState) => !prevState)}
                    >
                        Kan beslutte egen beslutteroppgave
                    </Checkbox>
                </CheckboxGroup>

                <CheckboxGroup legend="Tildeling">
                    <Checkbox
                        checked={kanFrigiAndresOppgaver}
                        onChange={() => setKanFrigiAndresOppgaver((prevState) => !prevState)}
                    >
                        Kan frigi andres oppgaver
                    </Checkbox>
                </CheckboxGroup>

                <CheckboxGroup legend="Read only">
                    <Checkbox
                        checked={readOnlyOverride}
                        onChange={() => setReadOnlyOverride((prevState) => !prevState)}
                    >
                        Override read-only
                    </Checkbox>
                    {readOnlyOverride && (
                        <Checkbox checked={readOnly} onChange={() => setReadOnly((prevState) => !prevState)}>
                            Oppgave er read-only
                        </Checkbox>
                    )}
                </CheckboxGroup>

                <CheckboxGroup legend="Revurdering">
                    <Checkbox
                        checked={skalSjekkeIsRevurderingForTotrinn}
                        onChange={() => setSkalSjekkeIsRevurderingForTotrinn((prevState) => !prevState)}
                    >
                        Skal sjekke isRevurdering for totrinn
                    </Checkbox>
                </CheckboxGroup>
            </form>
        </Modal>
    );
};
