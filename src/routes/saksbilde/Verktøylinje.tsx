import dayjs from 'dayjs';
import React, { useState } from 'react';

import { BriefcaseClockIcon } from '@navikt/aksel-icons';
import { Box, Button, HStack } from '@navikt/ds-react';

import { BeregnetPeriodeFragment, PersonFragment } from '@io/graphql';
import { harPeriodeTilBeslutterFor } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjon/inntektOgRefusjonUtils';
import { byTimestamp } from '@saksbilde/utbetaling/utbetalingstabell/minimumSykdomsgrad/DelperiodeWrapper';
import { MinimumSykdomsgradForm } from '@saksbilde/utbetaling/utbetalingstabell/minimumSykdomsgrad/MinimumSykdomsgradForm';
import { MinimumSykdomsgradVisning } from '@saksbilde/utbetaling/utbetalingstabell/minimumSykdomsgrad/MinimumSykdomsgradVisning';
import {
    getOppkuttedePerioder,
    getOverlappendeArbeidsgivere,
    harPeriodeDagerMedUnder20ProsentTotalGrad,
} from '@saksbilde/utbetaling/utbetalingstabell/minimumSykdomsgrad/minimumSykdomsgrad';
import { useCurrentArbeidsgiver } from '@state/arbeidsgiver';
import { getOverlappendePerioder, overlapper } from '@state/selectors/period';
import { ActivePeriod } from '@typer/shared';
import { ISO_DATOFORMAT } from '@utils/date';
import { isBeregnetPeriode, isMinimumSykdomsgradsoverstyring, isUberegnetPeriode } from '@utils/typeguards';

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
    const oppkuttedePerioder =
        getOppkuttedePerioder(overlappendeArbeidsgivere, periode)?.filter((it) =>
            harPeriodeDagerMedUnder20ProsentTotalGrad(it, person.arbeidsgivere, periode.skjaeringstidspunkt),
        ) ?? [];
    const harAlleDelperioderBlittVurdertSistIAndreVedtaksperioder: boolean =
        isBeregnetPeriode(periode) &&
        (oppkuttedePerioder?.every((dp) => {
            const matchendePerioder = minimumSykdomsgradsoverstyringer
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
                )?.initierendeVedtaksperiodeId;
            if (matchendePerioder === undefined) {
                return false;
            }
            return matchendePerioder !== periode.vedtaksperiodeId;
        }) ??
            false);
    const harPeriodeTilBeslutter = harPeriodeTilBeslutterFor(person, periode.skjaeringstidspunkt);
    const overlappendePerioder = getOverlappendePerioder(person, periode as BeregnetPeriodeFragment);
    // bestemmende periode er den første/tidligste perioden som inneholder delperiode på person
    const erAktivperiodeBestemmendeForMinstEnDelperiode = oppkuttedePerioder?.some((dp) => {
        if (!isBeregnetPeriode(periode) && !isUberegnetPeriode(periode)) return;
        return (
            overlappendePerioder
                .filter((it) => overlapper(it)(dp))
                .sort((a, b) => (dayjs(a.fom, ISO_DATOFORMAT).isSameOrAfter(b.fom) ? 0 : -1))
                .shift()?.vedtaksperiodeId === periode.vedtaksperiodeId
        );
    });

    return (
        <Box background="surface-subtle" padding="2" borderWidth="0 0 1 0" borderColor="border-divider">
            {harPeriodeTilBeslutter ||
            (harAlleDelperioderBlittVurdertSistIAndreVedtaksperioder &&
                !erAktivperiodeBestemmendeForMinstEnDelperiode) ? (
                <MinimumSykdomsgradVisning
                    oppkuttedePerioder={oppkuttedePerioder}
                    minimumSykdomsgradsoverstyringer={minimumSykdomsgradsoverstyringer}
                />
            ) : (
                <HStack align="center">
                    {overstyrerMinimumSykdomsgrad ? (
                        <MinimumSykdomsgradForm
                            person={person}
                            periode={periode}
                            oppkuttedePerioder={oppkuttedePerioder}
                            overlappendeArbeidsgivere={overlappendeArbeidsgivere}
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
