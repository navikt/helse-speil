import React from 'react';

import { Button, HStack, Textarea, VStack } from '@navikt/ds-react';

interface Props {
    fjerningBegrunnelse: string;
    setFjerningBegrunnelse: (value: string) => void;
    visFjernModal: () => void;
    skjulFjernPeriode: () => void;
}

export const TilkommenInntektFjernPeriode = ({
    fjerningBegrunnelse,
    setFjerningBegrunnelse,
    visFjernModal,
    skjulFjernPeriode,
}: Props) => (
    <VStack gap="4" paddingInline="8">
        <Textarea
            label="Begrunn hvorfor perioden fjernes"
            description="Teksten blir ikke vist til den sykmeldte, med mindre hen ber om innsyn."
            value={fjerningBegrunnelse}
            onChange={(event) => setFjerningBegrunnelse(event.target.value)}
        />
        <HStack gap="4">
            <Button
                variant="primary"
                size="small"
                onClick={() => {
                    visFjernModal();
                }}
            >
                Lagre
            </Button>
            <Button variant="tertiary" size="small" onClick={() => skjulFjernPeriode()}>
                Avbryt
            </Button>
        </HStack>
    </VStack>
);
