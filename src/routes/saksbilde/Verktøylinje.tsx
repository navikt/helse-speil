import React, { useState } from 'react';

import { BriefcaseClockIcon } from '@navikt/aksel-icons';
import { Box, Button } from '@navikt/ds-react';

import { PersonFragment } from '@io/graphql';
import { MinimumSykdomsgradForm } from '@saksbilde/utbetaling/utbetalingstabell/minimumSykdomsgrad/MinimumSykdomsgradForm';
import { ActivePeriod } from '@typer/shared';

interface VerktøylinjeProps {
    person: PersonFragment;
    periode: ActivePeriod;
    initierendeVedtaksperiodeId: string;
}

export const Verktøylinje = ({ person, periode, initierendeVedtaksperiodeId }: VerktøylinjeProps) => {
    const [overstyrerMinimumSykdomsgrad, setOverstyrerMinimumSykdomsgrad] = useState(false);

    return (
        <Box background="surface-subtle" padding="2">
            {overstyrerMinimumSykdomsgrad ? (
                <MinimumSykdomsgradForm
                    person={person}
                    periode={periode}
                    initierendeVedtaksperiodeId={initierendeVedtaksperiodeId}
                    setOverstyrerMinimumSykdomsgrad={setOverstyrerMinimumSykdomsgrad}
                />
            ) : (
                <Button
                    size="xsmall"
                    variant="secondary"
                    onClick={() => setOverstyrerMinimumSykdomsgrad(true)}
                    icon={<BriefcaseClockIcon fontSize="1.5rem" />}
                >
                    Vurder arbeidstid
                </Button>
            )}
        </Box>
    );
};
