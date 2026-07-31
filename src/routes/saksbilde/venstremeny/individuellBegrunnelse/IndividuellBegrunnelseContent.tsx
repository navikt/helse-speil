import React, { Dispatch, ReactElement, SetStateAction, useState } from 'react';

import { ExpandIcon, NotePencilIcon } from '@navikt/aksel-icons';
import { Box, Button, Link, VStack } from '@navikt/ds-react';

import { AnimatedExpandableDiv } from '@components/AnimatedExpandableDiv';
import { VisesIVedtakTag } from '@components/tags/VisesIVedtakTag';
import { ReadOnlyIndividuellBegrunnelse } from '@saksbilde/venstremeny/ReadOnlyIndividuellBegrunnelse';
import { BegrunnelseInput } from '@saksbilde/venstremeny/individuellBegrunnelse/BegrunnelseInput';

interface IndividuellBegrunnelseContentProps {
    erReadOnly: boolean;
    erBeslutteroppgave: boolean;
    vedtakBegrunnelseTekst: string;
    setVedtakBegrunnelseTekst: Dispatch<SetStateAction<string>>;
    defaultÅpen: boolean;
    åpneModal: () => void;
}

export function IndividuellBegrunnelseContent({
    erReadOnly,
    erBeslutteroppgave,
    vedtakBegrunnelseTekst,
    setVedtakBegrunnelseTekst,
    defaultÅpen,
    åpneModal,
}: IndividuellBegrunnelseContentProps): ReactElement {
    const [expanded, setExpanded] = useState(defaultÅpen);

    return (
        <Box marginBlock="space-0 space-16" paddingBlock="space-16 space-0">
            {!erReadOnly && !erBeslutteroppgave && (
                <Box
                    position="relative"
                    paddingBlock="space-16"
                    paddingInline="space-16"
                    className="w-full bg-ax-bg-neutral-soft shadow-[inset_6px_0_0_0] shadow-ax-border-meta-lime-strong"
                >
                    <VStack gap="space-12" align="start" className="mb-2">
                        <Link
                            as="button"
                            type="button"
                            onClick={() => setExpanded((prev) => !prev)}
                            aria-expanded={expanded}
                            underline={false}
                            className="cursor-pointer"
                        >
                            <NotePencilIcon aria-hidden />
                            Individuell begrunnelse
                        </Link>
                        <VisesIVedtakTag />
                    </VStack>
                    <AnimatedExpandableDiv expanded={expanded}>
                        <Button
                            onClick={åpneModal}
                            icon={<ExpandIcon title="åpne i modal" />}
                            size="xsmall"
                            variant="tertiary-neutral"
                            style={{ position: 'absolute', top: 0, right: 0 }}
                        />
                        <BegrunnelseInput
                            vedtakBegrunnelseTekst={vedtakBegrunnelseTekst}
                            setVedtakBegrunnelseTekst={setVedtakBegrunnelseTekst}
                            minRows={4}
                        />
                    </AnimatedExpandableDiv>
                </Box>
            )}

            {vedtakBegrunnelseTekst !== '' && (erBeslutteroppgave || erReadOnly) && (
                <Box
                    paddingBlock="space-16"
                    paddingInline="space-16"
                    className="w-full bg-ax-bg-neutral-soft shadow-[inset_6px_0_0_0] shadow-ax-border-meta-lime-strong"
                >
                    <ReadOnlyIndividuellBegrunnelse vedtakBegrunnelseTekst={vedtakBegrunnelseTekst} />
                </Box>
            )}
        </Box>
    );
}
