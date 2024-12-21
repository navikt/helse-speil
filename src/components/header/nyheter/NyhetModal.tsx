import classNames from 'classnames';
import Image from 'next/image';
import React, { ReactElement, useState } from 'react';

import { ChevronLeftIcon, ChevronRightIcon } from '@navikt/aksel-icons';
import { Button, HStack, Heading, Modal } from '@navikt/ds-react';

import { components } from '@components/header/nyheter/Nyhet';
import { NyhetModalType } from '@external/sanity';
import { PortableText } from '@portabletext/react';

import styles from './NyhetModal.module.scss';

interface NyhetModalProps {
    onClose: () => void;
    showModal: boolean;
    nyhetModal: NyhetModalType;
}

export const NyhetModal = ({ onClose, showModal, nyhetModal }: NyhetModalProps): ReactElement => {
    const slides = [nyhetModal.modalSlide1, nyhetModal.modalSlide2, nyhetModal.modalSlide3].filter(
        (slide) => slide !== null,
    );
    const [slideIndex, setSlideIndex] = useState(0);

    return (
        <Modal aria-label="Nyhet modal" width="800px" portal closeOnBackdropClick open={showModal} onClose={onClose}>
            <Modal.Header>
                <Heading level="1" size="medium">
                    {nyhetModal.modalOverskrift}
                </Heading>
            </Modal.Header>
            <Modal.Body className={styles.body}>
                <Heading level="2" size="small">
                    {slides[slideIndex]?.slideOverskrift}
                </Heading>
                {slides[slideIndex]?.slideBeskrivelse && (
                    <PortableText value={slides[slideIndex]?.slideBeskrivelse} components={components} />
                )}
                {slides[slideIndex]?.bildeUrl && (
                    <Image
                        className={styles.bilde}
                        src={slides[slideIndex]?.bildeUrl}
                        alt={slides[slideIndex]?.altTekst}
                        height={400}
                        width={730}
                        unoptimized
                    />
                )}
            </Modal.Body>
            {slides.length > 1 && (
                <HStack gap="16" justify="center" align="center" paddingBlock="4 6" paddingInline="6 6">
                    <Button
                        variant="tertiary"
                        icon={<ChevronLeftIcon />}
                        onClick={() => setSlideIndex(slideIndex - 1)}
                        disabled={slideIndex === 0}
                    >
                        Forrige
                    </Button>
                    <HStack gap="3">
                        {slides.map((_, index) => (
                            <span
                                className={classNames(styles.step, slideIndex === index && styles.activestep)}
                                key={index}
                            />
                        ))}
                    </HStack>
                    <Button
                        variant="tertiary"
                        icon={<ChevronRightIcon />}
                        iconPosition="right"
                        onClick={() => setSlideIndex(slideIndex + 1)}
                        disabled={slideIndex === slides.length - 1}
                    >
                        Neste
                    </Button>
                </HStack>
            )}
        </Modal>
    );
};
