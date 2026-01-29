import React, { ReactElement } from 'react';

import { HStack, Tag } from '@navikt/ds-react';

import styles from './LabelCell.module.css';

const EnArbeidsgiver = (): ReactElement => {
    return (
        <HStack align="center" gap="space-8">
            <Tag data-color="meta-purple" className={styles.tag}>
                EA
            </Tag>
            Én arb. giver
        </HStack>
    );
};

const FlereArbeidsgivere = (): ReactElement => {
    return (
        <HStack align="center" gap="space-8">
            <Tag data-color="meta-purple" className={styles.tag}>
                FA
            </Tag>
            Flere arb. givere
        </HStack>
    );
};

const Førstegangsbehandling = (): ReactElement => {
    return (
        <HStack align="center" gap="space-8">
            <Tag data-color="meta-purple" className={styles.tag}>
                F
            </Tag>
            Førstegangsbeh.
        </HStack>
    );
};

const Forlengelser = (): ReactElement => {
    return (
        <HStack align="center" gap="space-8">
            <Tag data-color="info" className={styles.tag}>
                FL
            </Tag>
            Forlengelser
        </HStack>
    );
};

const ForlengelseInfotrygd = (): ReactElement => {
    return (
        <HStack align="center" gap="space-8">
            <Tag data-color="neutral" className={styles.tag}>
                FI
            </Tag>
            Forlengelse - IT
        </HStack>
    );
};

const Vurderingsoppgaver = (): ReactElement => {
    return (
        <HStack align="center" gap="space-8">
            <Tag data-color="brand-beige" className={styles.tag}>
                QA
            </Tag>
            Vurderingsoppgaver
        </HStack>
    );
};

const FortroligAdresse = (): ReactElement => {
    return (
        <HStack align="center" gap="space-8">
            <Tag data-color="brand-magenta" className={styles.tag}>
                FA
            </Tag>
            Fortrolig adresse
        </HStack>
    );
};

const Stikkprøver = (): ReactElement => {
    return (
        <HStack align="center" gap="space-8">
            <Tag data-color="brand-magenta" className={styles.tag}>
                S
            </Tag>
            Stikkprøver
        </HStack>
    );
};

const Revurdering = (): ReactElement => {
    return (
        <HStack align="center" gap="space-8">
            <Tag data-color="brand-beige" className={styles.tag}>
                R
            </Tag>
            Revurdering
        </HStack>
    );
};

const Beslutter = (): ReactElement => {
    return (
        <HStack align="center" gap="space-8">
            <Tag data-color="brand-beige" className={styles.tag}>
                B
            </Tag>
            Beslutter
        </HStack>
    );
};

const EgenAnsatt = (): ReactElement => {
    return (
        <HStack align="center" gap="space-8">
            <Tag data-color="brand-beige" className={styles.tag}>
                E
            </Tag>
            Egen ansatt
        </HStack>
    );
};
const Søknad = (): ReactElement => {
    return (
        <HStack align="center" gap="space-8">
            <Tag data-color="brand-beige" className={styles.tag}>
                SØ
            </Tag>
            Søknad
        </HStack>
    );
};

export const LabelCell = {
    EnArbeidsgiver,
    FlereArbeidsgivere,
    Førstegangsbehandling,
    Forlengelser,
    ForlengelseInfotrygd,
    Vurderingsoppgaver,
    FortroligAdresse,
    Stikkprøver,
    Revurdering,
    Beslutter,
    EgenAnsatt,
    Søknad,
};
