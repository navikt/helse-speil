import Image from 'next/image';
import React, { ReactElement, useState } from 'react';

import { ChevronLeftIcon, ChevronRightIcon } from '@navikt/aksel-icons';
import { Button, HStack, Heading, Modal } from '@navikt/ds-react';

import { components } from '@components/header/nyheter/Nyhet';
import { NyhetModalType } from '@external/sanity';
import { PortableText } from '@portabletext/react';
import { cn } from '@utils/tw';

import styles from './NyhetModal.module.scss';

interface NyhetModalProps {
    closeModal: () => void;
    showModal: boolean;
    nyhetModal: NyhetModalType;
}

export const NyhetModal = ({ closeModal, showModal, nyhetModal }: NyhetModalProps): ReactElement => {
    const slides = [nyhetModal.modalSlide1, nyhetModal.modalSlide2, nyhetModal.modalSlide3].filter(
        (slide) => slide !== null,
    );
    const [slideIndex, setSlideIndex] = useState(0);

    return (
        <Modal aria-label="Nyhet modal" width="800px" portal closeOnBackdropClick open={showModal} onClose={closeModal}>
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
                    <div className={styles.bildecontainer}>
                        <Image
                            className={styles.bilde}
                            src={slides[slideIndex]?.bildeUrl}
                            alt={slides[slideIndex]?.altTekst}
                            fill
                            unoptimized
                        />
                    </div>
                )}
            </Modal.Body>
            {slides.length > 1 && (
                <HStack
                    gap="space-64"
                    justify="center"
                    align="center"
                    paddingBlock="space-16 space-24"
                    paddingInline="space-24 space-24"
                >
                    <Button
                        variant="tertiary"
                        icon={<ChevronLeftIcon />}
                        onClick={() => setSlideIndex(slideIndex - 1)}
                        disabled={slideIndex === 0}
                    >
                        Forrige
                    </Button>
                    <HStack gap="space-12">
                        {slides.map((_, index) => (
                            <span className={cn(styles.step, slideIndex === index && styles.activestep)} key={index} />
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
