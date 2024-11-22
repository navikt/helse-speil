import React, { useState } from 'react';

import { BriefcaseClockIcon } from '@navikt/aksel-icons';
import { Box, Button, HStack } from '@navikt/ds-react';

import { PersonFragment } from '@io/graphql';
import { harPeriodeTilBeslutterFor } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjon/inntektOgRefusjonUtils';
import { byTimestamp } from '@saksbilde/utbetaling/utbetalingstabell/minimumSykdomsgrad/DelperiodeWrapper';
import { MinimumSykdomsgradForm } from '@saksbilde/utbetaling/utbetalingstabell/minimumSykdomsgrad/MinimumSykdomsgradForm';
import { MinimumSykdomsgradVisning } from '@saksbilde/utbetaling/utbetalingstabell/minimumSykdomsgrad/MinimumSykdomsgradVisning';
import {
    getOppkuttedePerioder,
    getOverlappendeArbeidsgivere,
} from '@saksbilde/utbetaling/utbetalingstabell/minimumSykdomsgrad/minimumSykdomsgrad';
import { useCurrentArbeidsgiver } from '@state/arbeidsgiver';
import { ActivePeriod } from '@typer/shared';
import { isBeregnetPeriode, isMinimumSykdomsgradsoverstyring } from '@utils/typeguards';

interface VerktøylinjeProps {
    person: PersonFragment;
    periode: ActivePeriod;
    initierendeVedtaksperiodeId: string;
}

export const Verktøylinje = ({ person, periode, initierendeVedtaksperiodeId }: VerktøylinjeProps) => {
    const [overstyrerMinimumSykdomsgrad, setOverstyrerMinimumSykdomsgrad] = useState(false);
    const aktivArbeidsgiver = useCurrentArbeidsgiver(person);
    const minimumSykdomsgradsoverstyringer =
        aktivArbeidsgiver?.overstyringer.filter(isMinimumSykdomsgradsoverstyring) ?? [];
    const overlappendeArbeidsgivere = getOverlappendeArbeidsgivere(person, periode);
    const oppkuttedePerioder = getOppkuttedePerioder(overlappendeArbeidsgivere, periode);
    const harAlleDelperioderBlittVurdertSistIAndreVedtaksperioder: boolean =
        oppkuttedePerioder?.every(
            (dp) =>
                isBeregnetPeriode(periode) &&
                minimumSykdomsgradsoverstyringer
                    .sort(byTimestamp)
                    .map((overstyring) => ({
                        perioder: [
                            ...overstyring.minimumSykdomsgrad.perioderVurdertIkkeOk,
                            ...overstyring.minimumSykdomsgrad.perioderVurdertOk,
                        ],
                        initierendeVedtaksperiodeId: overstyring.minimumSykdomsgrad.initierendeVedtaksperiodeId,
                    }))
                    .find((overstyringperiode) =>
                        overstyringperiode.perioder.some((op) => dp.fom === op.fom && dp.tom === op.tom),
                    )?.initierendeVedtaksperiodeId !== periode.vedtaksperiodeId,
        ) ?? false;
    const harPeriodeTilBeslutter = harPeriodeTilBeslutterFor(person, periode.skjaeringstidspunkt);

    return (
        <Box background="surface-subtle" padding="2" borderWidth="0 0 1 0" borderColor="border-divider">
            {harPeriodeTilBeslutter || harAlleDelperioderBlittVurdertSistIAndreVedtaksperioder ? (
                <MinimumSykdomsgradVisning
                    person={person}
                    periode={periode}
                    minimumSykdomsgradsoverstyringer={minimumSykdomsgradsoverstyringer}
                />
            ) : (
                <HStack align="center">
                    {overstyrerMinimumSykdomsgrad ? (
                        <MinimumSykdomsgradForm
                            person={person}
                            periode={periode}
                            initierendeVedtaksperiodeId={initierendeVedtaksperiodeId}
                            setOverstyrerMinimumSykdomsgrad={setOverstyrerMinimumSykdomsgrad}
                        />
                    ) : (
                        <Button
                            size="small"
                            variant="secondary"
                            onClick={() => setOverstyrerMinimumSykdomsgrad(true)}
                            icon={<BriefcaseClockIcon fontSize="1.5rem" />}
                        >
                            Vurder arbeidstid
                        </Button>
                    )}
                </HStack>
            )}
        </Box>
    );
};
