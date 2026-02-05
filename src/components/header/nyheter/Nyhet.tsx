import React, { useState } from 'react';

import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, HStack, Heading, Link, VStack } from '@navikt/ds-react';

import { NyhetModal } from '@components/header/nyheter/NyhetModal';
import { NyhetType } from '@external/sanity';
import { PortableText, PortableTextComponents } from '@portabletext/react';
import { getFormattedDateString } from '@utils/date';
import { cn } from '@utils/tw';

import styles from './Nyhet.module.scss';

interface NyhetProps {
    nyhet: NyhetType;
}

export const Nyhet = ({ nyhet }: NyhetProps) => {
    const [showModal, setShowModal] = useState(false);
    const nyhetIderForLukkedeTvungeneModaler = localStorage.getItem('nyhetIderForLukkedeTvungeneModaler');
    ryddOppLocalStorage(nyhet, nyhetIderForLukkedeTvungeneModaler);

    return (
        <VStack className={styles.nyhet} as="li" gap="space-8">
            <BodyShort className={styles.dato} size="small">
                {getFormattedDateString(nyhet.dato)}
            </BodyShort>
            <Heading level="2" size="xsmall">
                {nyhet.tittel}
            </Heading>
            <PortableText value={nyhet.beskrivelse} components={components} />
            <HStack justify="space-between" gap="space-12 space-0">
                {nyhet.modal.antallSlides > 0 && (
                    <Button
                        className={styles.button}
                        variant="secondary"
                        size="small"
                        onClick={() => setShowModal(true)}
                    >
                        Se hvordan
                    </Button>
                )}
                {nyhet.lenke && (
                    <Link href={nyhet.lenke.lenkeUrl} target="_blank" rel="noopener noreferrer">
                        {nyhet.lenke.lenkeTekst}
                        <ExternalLinkIcon />
                    </Link>
                )}
            </HStack>
            {skalViseModal(showModal, nyhet, nyhetIderForLukkedeTvungeneModaler) && (
                <NyhetModal
                    nyhetModal={nyhet.modal}
                    closeModal={() => {
                        setShowModal(false);
                        if (nyhet.modal.tvungenModal) {
                            lagreTvungenModalLukket(nyhet._id);
                        }
                    }}
                    showModal={skalViseModal(showModal, nyhet, nyhetIderForLukkedeTvungeneModaler)}
                />
            )}
        </VStack>
    );
};

const skalViseModal = (showModal: boolean, nyhet: NyhetType, ider: string | null): boolean => {
    if (showModal) return true;
    if (ider) {
        const idListe: string[] = JSON.parse(ider);
        if (idListe.includes(nyhet._id)) return false;
    }
    return nyhet.modal.tvungenModal;
};

const lagreTvungenModalLukket = (id: string): void => {
    const ting = localStorage.getItem('nyhetIderForLukkedeTvungeneModaler');
    if (ting) {
        localStorage.setItem('nyhetIderForLukkedeTvungeneModaler', JSON.stringify([...JSON.parse(ting), id]));
    } else {
        localStorage.setItem('nyhetIderForLukkedeTvungeneModaler', JSON.stringify([id]));
    }
};

const ryddOppLocalStorage = (nyhet: NyhetType, iderFraLocalStorage: string | null) => {
    if (iderFraLocalStorage && !nyhet.modal.tvungenModal) {
        const idListe: string[] = JSON.parse(iderFraLocalStorage);
        localStorage.setItem(
            'nyhetIderForLukkedeTvungeneModaler',
            JSON.stringify(idListe.filter((id) => id !== nyhet._id)),
        );
    }
};

export const components: PortableTextComponents = {
    block: {
        normal: ({ children }) => <BodyShort>{children}</BodyShort>,
    },
    list: {
        bullet: ({ children }) => <ul className={cn(styles.list, styles.unorderedlist)}>{children}</ul>,
        number: ({ children }) => <ol className={styles.list}>{children}</ol>,
    },
    marks: {
        link: ({ value, children }) => (
            <a href={value?.href} target="_blank" rel="noopener noreferrer">
                {children}
            </a>
        ),
    },
};
