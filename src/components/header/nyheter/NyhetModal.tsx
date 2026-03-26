import Image from 'next/image';
import React, { ReactElement, useState } from 'react';

import { ChevronLeftIcon, ChevronRightIcon } from '@navikt/aksel-icons';
import { Button, Dialog, HStack, Heading } from '@navikt/ds-react';

import { components } from '@components/header/nyheter/Nyhet';
import { NyhetModalType } from '@external/sanity';
import { PortableText } from '@portabletext/react';
import { cn } from '@utils/tw';

interface NyhetDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    nyhetModal: NyhetModalType;
}

export function NyhetDialog({ open, onOpenChange, nyhetModal }: NyhetDialogProps): ReactElement {
    const slides = [nyhetModal.modalSlide1, nyhetModal.modalSlide2, nyhetModal.modalSlide3].filter(
        (slide) => slide !== null,
    );
    const [slideIndex, setSlideIndex] = useState(0);

    return (
        <Dialog open={open} onOpenChange={onOpenChange} aria-label="Nyhet modal">
            <Dialog.Popup width="large">
                <Dialog.Header>
                    <Dialog.Title>{nyhetModal.modalOverskrift}</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body className="flex min-h-40 flex-col gap-4">
                    <Heading level="2" size="small">
                        {slides[slideIndex]?.slideOverskrift}
                    </Heading>
                    {slides[slideIndex]?.slideBeskrivelse && (
                        <PortableText value={slides[slideIndex]?.slideBeskrivelse} components={components} />
                    )}
                    {slides[slideIndex]?.bildeUrl && (
                        <div className="flex max-h-87.5 w-full justify-center overflow-hidden">
                            <Image
                                className="relative! h-auto! w-auto! object-contain"
                                src={slides[slideIndex]?.bildeUrl}
                                alt={slides[slideIndex]?.altTekst}
                                fill
                                unoptimized
                            />
                        </div>
                    )}
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
                                    <span
                                        className={cn(
                                            'h-3 w-3 rounded-full bg-ax-bg-accent-moderate-hover',
                                            slideIndex === index && 'bg-ax-text-accent-subtle',
                                        )}
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
                </Dialog.Body>
            </Dialog.Popup>
        </Dialog>
    );
}
