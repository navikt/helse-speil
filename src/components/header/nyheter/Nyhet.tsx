import React, { ReactElement, useEffect, useState } from 'react';

import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, HStack, Heading, Link, VStack } from '@navikt/ds-react';

import { NyhetDialog } from '@components/header/nyheter/NyhetDialog';
import { portableTextComponents } from '@components/header/nyheter/portableTextComponents';
import { NyhetType } from '@external/sanity';
import { PortableText } from '@portabletext/react';
import { getFormattedDateString } from '@utils/date';

const LUKKEDE_TVUNGNE_MODALER_KEY = 'nyhetIderForLukkedeTvungneModaler';

interface NyhetProps {
    nyhet: NyhetType;
}

export function Nyhet({ nyhet }: NyhetProps): ReactElement {
    const [showModal, setShowModal] = useState(false);
    const [tvungenModalLukket, setTvungenModalLukket] = useState(false);

    useEffect(() => {
        ryddOppLocalStorage(nyhet);
    }, [nyhet]);

    const visModal = showModal || (!tvungenModalLukket && skalViseTvungenModal(nyhet));

    return (
        <VStack className="py-4" as="li" gap="space-8">
            <BodyShort className="text-ax-text-neutral-subtle" size="small">
                {getFormattedDateString(nyhet.dato)}
            </BodyShort>
            <Heading level="2" size="xsmall">
                {nyhet.tittel}
            </Heading>
            <PortableText value={nyhet.beskrivelse} components={portableTextComponents} />
            <HStack justify="space-between" gap="space-12 space-0">
                {nyhet.modal.antallSlides > 0 && (
                    <Button variant="secondary" size="small" onClick={() => setShowModal(true)}>
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
            {visModal && (
                <NyhetDialog
                    nyhetModal={nyhet.modal}
                    open
                    onOpenChange={(nextOpen) => {
                        if (!nextOpen) {
                            setShowModal(false);
                            if (nyhet.modal.tvungenModal) {
                                setTvungenModalLukket(true);
                                lagreTvungenModalLukket(nyhet._id);
                            }
                        }
                    }}
                />
            )}
        </VStack>
    );
}

const hentLukkedeModalIder = (): string[] => {
    const raw = localStorage.getItem(LUKKEDE_TVUNGNE_MODALER_KEY);
    return raw ? JSON.parse(raw) : [];
};

const skalViseTvungenModal = (nyhet: NyhetType): boolean => {
    if (!nyhet.modal.tvungenModal) return false;
    const lagrede = hentLukkedeModalIder();
    return !lagrede.includes(nyhet._id);
};

const lagreTvungenModalLukket = (id: string): void => {
    const eksisterende = hentLukkedeModalIder();
    localStorage.setItem(LUKKEDE_TVUNGNE_MODALER_KEY, JSON.stringify([...eksisterende, id]));
};

const ryddOppLocalStorage = (nyhet: NyhetType) => {
    if (nyhet.modal.tvungenModal) return;
    const eksisterende = hentLukkedeModalIder();
    if (eksisterende.includes(nyhet._id)) {
        localStorage.setItem(
            LUKKEDE_TVUNGNE_MODALER_KEY,
            JSON.stringify(eksisterende.filter((id) => id !== nyhet._id)),
        );
    }
};
