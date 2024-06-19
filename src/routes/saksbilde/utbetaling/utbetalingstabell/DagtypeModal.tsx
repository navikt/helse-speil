import React from 'react';

import { BodyShort, Heading } from '@navikt/ds-react';

import { Bold } from '@components/Bold';
import { GammelModal } from '@components/Modal';
import { Key, useKeyboard } from '@hooks/useKeyboard';

import styles from './DagtypeModal.module.css';

interface TastaturModalProps {
    isOpen: boolean;
    onSetVisModal: (open: boolean) => void;
}

export const DagtypeModal = ({ isOpen, onSetVisModal }: TastaturModalProps) => {
    useKeyboard([
        {
            key: Key.D,
            action: () => onSetVisModal(!isOpen),
            ignoreIfModifiers: false,
            modifier: Key.Alt,
        },
    ]);

    return (
        <GammelModal
            isOpen={isOpen}
            onRequestClose={() => onSetVisModal(false)}
            aria-labelledby="modal-heading"
            title={
                <Heading as="h2" size="small">
                    Dagtyper
                </Heading>
            }
        >
            <div className={styles.dagtypeliste}>
                <Bold>Syk (NAV)</Bold>
                <BodyShort>NAV skal betale alle eller noen av de første 16 dagene</BodyShort>
                <Bold>Ferie</Bold>
                <BodyShort>Bruker tok ferie i sykmeldingsperioden</BodyShort>
                <Bold>Arbeid ikke gjenopptatt</Bold>
                <BodyShort>
                    Bruker tok ferie uten sykmelding
                    <br />
                    Bruker tok turnusfri
                    <br />
                    Brukers stillingsandel ikke fullt gjenopptatt
                </BodyShort>
                <Bold>Egenmelding</Bold>
                <BodyShort>Bruker hadde egenmeldt sykefravær</BodyShort>
                <Bold>Permisjon</Bold>
                <BodyShort>Bruker hadde permisjon</BodyShort>
                <Bold>Arbeid</Bold>
                <BodyShort>Bruker var i arbeid</BodyShort>
            </div>
        </GammelModal>
    );
};
