import classNames from 'classnames';
import React, { useState } from 'react';

import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, HStack, Heading, Link, VStack } from '@navikt/ds-react';

import { NyhetModal } from '@components/header/nyheter/NyhetModal';
import { NyhetType } from '@external/sanity';
import { PortableText, PortableTextComponents } from '@portabletext/react';
import { getFormattedDateString } from '@utils/date';

import styles from './Nyhet.module.scss';

interface NyhetProps {
    nyhet: NyhetType;
}

export const Nyhet = ({ nyhet }: NyhetProps) => {
    const [showModal, setShowModal] = useState(false);
    return (
        <VStack className={styles.nyhet} as="li" gap="2">
            <BodyShort className={styles.dato} size="small">
                {getFormattedDateString(nyhet.dato)}
            </BodyShort>
            <Heading level="2" size="xsmall">
                {nyhet.tittel}
            </Heading>
            <PortableText value={nyhet.beskrivelse} components={components} />
            <HStack justify="space-between">
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
                    <Link href={nyhet.lenke.lenkeUrl} target="_blank">
                        {nyhet.lenke.lenkeTekst}
                        <ExternalLinkIcon />
                    </Link>
                )}
            </HStack>
            {showModal && (
                <NyhetModal nyhetModal={nyhet.modal} onClose={() => setShowModal(false)} showModal={showModal} />
            )}
        </VStack>
    );
};

export const components: PortableTextComponents = {
    block: {
        normal: ({ children }) => <BodyShort>{children}</BodyShort>,
    },
    list: {
        bullet: ({ children }) => <ul className={classNames(styles.list, styles.unorderedlist)}>{children}</ul>,
        number: ({ children }) => <ol className={styles.list}>{children}</ol>,
    },
};
