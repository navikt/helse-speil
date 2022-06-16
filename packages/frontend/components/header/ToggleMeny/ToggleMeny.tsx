import React, { ReactNode } from 'react';
import { Modal } from '@components/Modal';
import { SetterOrUpdater, useRecoilState } from 'recoil';
import {
    toggleHarBeslutterRolle,
    toggleKanBeslutteEgenBeslutteroppgave,
    toggleKanFrigiAndresOppgaver,
    toggleTotrinnsvurderingAktiv,
} from '@state/toggles';

import styles from './ToggleMeny.module.css';

interface SectionProps {
    label: string;
    children: ReactNode | ReactNode[];
}

const Section = ({ label, children }: SectionProps) => {
    return (
        <div className={styles.section}>
            <p className={styles.p}>{label}</p>
            {children}
        </div>
    );
};

interface ToggleProps {
    label: string;
    checked: boolean;
    setValue: SetterOrUpdater<boolean>;
}

const Toggle = ({ label, checked, setValue }: ToggleProps) => {
    return (
        <div className={styles.Toggle}>
            <p>{label}</p>
            <input type="checkbox" checked={checked} onChange={(_) => setValue(!checked)} />
        </div>
    );
};

interface ToggleMenyProps {
    modalOpen: boolean;
    onCloseModal: (event: React.MouseEvent | React.KeyboardEvent) => void;
}

export const ToggleMeny = ({ modalOpen, onCloseModal }: ToggleMenyProps) => {
    const [harBeslutterRolle, setHarBeslutterRolle] = useRecoilState(toggleHarBeslutterRolle);
    const [harTotrinnsvurderingAktiv, setHarTotrinnsvurderingAktiv] = useRecoilState(toggleTotrinnsvurderingAktiv);
    const [kanBeslutteEgenBeslutteroppgave, setKanBeslutteEgenBeslutteroppgave] = useRecoilState(
        toggleKanBeslutteEgenBeslutteroppgave,
    );

    const [kanFrigiAndresOppgaver, setKanFrigiAndresOppgaver] = useRecoilState(toggleKanFrigiAndresOppgaver);

    return (
        <Modal isOpen={modalOpen} onRequestClose={onCloseModal}>
            <Section label="Totrinnsvurdering">
                <Toggle label="Har beslutterrolle" checked={harBeslutterRolle} setValue={setHarBeslutterRolle} />
                <Toggle
                    label="Totrinnsvurdering aktiv"
                    checked={harTotrinnsvurderingAktiv}
                    setValue={setHarTotrinnsvurderingAktiv}
                />
                <Toggle
                    label="Kan beslutte egen beslutteroppgave"
                    checked={kanBeslutteEgenBeslutteroppgave}
                    setValue={setKanBeslutteEgenBeslutteroppgave}
                />
            </Section>

            <Section label="Tildeling">
                <Toggle
                    label="Kan frigi andres oppgaver"
                    checked={kanFrigiAndresOppgaver}
                    setValue={setKanFrigiAndresOppgaver}
                />
            </Section>
        </Modal>
    );
};
