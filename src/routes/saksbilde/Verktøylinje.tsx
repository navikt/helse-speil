import React, { useState } from 'react';

import { BriefcaseClockIcon } from '@navikt/aksel-icons';
import { Box, Button, HStack } from '@navikt/ds-react';

import { BeregnetPeriodeFragment, PersonFragment } from '@io/graphql';
import { harPeriodeTilBeslutterFor } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjon/inntektOgRefusjonUtils';
import {
    byPeriodeEier,
    byTimestamp,
} from '@saksbilde/utbetaling/utbetalingstabell/minimumSykdomsgrad/DelperiodeWrapper';
import { MinimumSykdomsgradForm } from '@saksbilde/utbetaling/utbetalingstabell/minimumSykdomsgrad/MinimumSykdomsgradForm';
import { MinimumSykdomsgradVisning } from '@saksbilde/utbetaling/utbetalingstabell/minimumSykdomsgrad/MinimumSykdomsgradVisning';
import {
    getOppkuttedePerioder,
    getOverlappendeArbeidsgivere,
    harPeriodeDagerMedUnder20ProsentTotalGrad,
} from '@saksbilde/utbetaling/utbetalingstabell/minimumSykdomsgrad/minimumSykdomsgrad';
import { finnOverstyringerForAktivInntektskilde } from '@state/arbeidsgiver';
import { getOverlappendePerioder, overlapper } from '@state/selectors/period';
import { ActivePeriod } from '@typer/shared';
import { isBeregnetPeriode, isMinimumSykdomsgradsoverstyring, isUberegnetPeriode } from '@utils/typeguards';

interface VerktøylinjeProps {
    person: PersonFragment;
    aktivPeriode: ActivePeriod;
    initierendeVedtaksperiodeId: string;
}

export const Verktøylinje = ({ person, aktivPeriode, initierendeVedtaksperiodeId }: VerktøylinjeProps) => {
    const [overstyrerMinimumSykdomsgrad, setOverstyrerMinimumSykdomsgrad] = useState(false);
    const overlappendeArbeidsgivere = getOverlappendeArbeidsgivere(person, aktivPeriode);
    const oppkuttedePerioder =
        getOppkuttedePerioder(overlappendeArbeidsgivere, aktivPeriode)?.filter((it) =>
            harPeriodeDagerMedUnder20ProsentTotalGrad(it, person.arbeidsgivere, aktivPeriode.skjaeringstidspunkt),
        ) ?? [];
    const minimumSykdomsgradsoverstyringer = finnOverstyringerForAktivInntektskilde(aktivPeriode, person).filter(
        isMinimumSykdomsgradsoverstyring,
    );
    const harAlleDelperioderBlittVurdertSistIAndreVedtaksperioder: boolean =
        isBeregnetPeriode(aktivPeriode) &&
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
            return matchendePerioder !== aktivPeriode.vedtaksperiodeId;
        }) ??
            false);
    const harPeriodeTilBeslutter = harPeriodeTilBeslutterFor(person, aktivPeriode.skjaeringstidspunkt);
    const overlappendePerioder = getOverlappendePerioder(person, aktivPeriode as BeregnetPeriodeFragment);
    // bestemmende periode er den første/tidligste perioden som inneholder delperiode på person
    const erAktivperiodeBestemmendeForMinstEnDelperiode = oppkuttedePerioder?.some((dp) => {
        if (!isBeregnetPeriode(aktivPeriode) && !isUberegnetPeriode(aktivPeriode)) return;
        return (
            overlappendePerioder
                .filter((it) => overlapper(it)(dp))
                .sort(byPeriodeEier)
                .shift()?.vedtaksperiodeId === aktivPeriode.vedtaksperiodeId
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
                            aktivPeriode={aktivPeriode}
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
