import React, { useState } from 'react';

import { BriefcaseClockIcon } from '@navikt/aksel-icons';
import { Box, Button, HStack } from '@navikt/ds-react';

import { VisHvisSkrivetilgang } from '@components/VisHvisSkrivetilgang';
import { BeregnetPeriodeFragment, PersonFragment } from '@io/graphql';
import { harPeriodeTilBeslutterFor } from '@saksbilde/sykepengegrunnlag/inntekt/inntektOgRefusjon/inntektOgRefusjonUtils';
import { ArbeidstidsvurderingForm } from '@saksbilde/utbetaling/utbetalingstabell/arbeidstidsvurdering/ArbeidstidsvurderingForm';
import { ArbeidstidsvurderingVisning } from '@saksbilde/utbetaling/utbetalingstabell/arbeidstidsvurdering/ArbeidstidsvurderingVisning';
import {
    byPeriodeEier,
    byTimestamp,
} from '@saksbilde/utbetaling/utbetalingstabell/arbeidstidsvurdering/DelperiodeWrapper';
import {
    getOppkuttedePerioder,
    getOverlappendeArbeidsgivere,
    harPeriodeDagerMedUnder20ProsentTotalGrad,
} from '@saksbilde/utbetaling/utbetalingstabell/arbeidstidsvurdering/arbeidstidsvurdering';
import {
    finnAlleInntektsforhold,
    finnOverstyringerForAktivInntektsforhold,
} from '@state/inntektsforhold/inntektsforhold';
import { getOverlappendePerioder, overlapper } from '@state/selectors/period';
import { ActivePeriod } from '@typer/shared';
import { isBeregnetPeriode, isMinimumSykdomsgradsoverstyring, isUberegnetPeriode } from '@utils/typeguards';

interface VerktøylinjeProps {
    person: PersonFragment;
    aktivPeriode: ActivePeriod;
    initierendeVedtaksperiodeId: string;
}

export const Verktøylinje = ({ person, aktivPeriode, initierendeVedtaksperiodeId }: VerktøylinjeProps) => {
    const [vurdererArbeidstid, setVurdererArbeidstid] = useState(false);
    const overlappendeArbeidsgivere = getOverlappendeArbeidsgivere(person, aktivPeriode);
    const oppkuttedePerioder =
        getOppkuttedePerioder(overlappendeArbeidsgivere, aktivPeriode)?.filter((it) =>
            harPeriodeDagerMedUnder20ProsentTotalGrad(
                it,
                finnAlleInntektsforhold(person),
                aktivPeriode.skjaeringstidspunkt,
            ),
        ) ?? [];
    const minimumSykdomsgradsoverstyringer = finnOverstyringerForAktivInntektsforhold(aktivPeriode, person).filter(
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
        <Box background="neutral-soft" padding="space-8" borderWidth="0 0 1 0" borderColor="neutral-subtle">
            {harPeriodeTilBeslutter ||
            (harAlleDelperioderBlittVurdertSistIAndreVedtaksperioder &&
                !erAktivperiodeBestemmendeForMinstEnDelperiode) ? (
                <ArbeidstidsvurderingVisning
                    oppkuttedePerioder={oppkuttedePerioder}
                    minimumSykdomsgradsoverstyringer={minimumSykdomsgradsoverstyringer}
                />
            ) : (
                <VisHvisSkrivetilgang>
                    <HStack align="center">
                        {vurdererArbeidstid ? (
                            <ArbeidstidsvurderingForm
                                person={person}
                                aktivPeriode={aktivPeriode}
                                oppkuttedePerioder={oppkuttedePerioder}
                                overlappendeArbeidsgivere={overlappendeArbeidsgivere}
                                initierendeVedtaksperiodeId={initierendeVedtaksperiodeId}
                                setVurdererArbeidstid={setVurdererArbeidstid}
                            />
                        ) : (
                            <Button
                                size="small"
                                variant="secondary"
                                onClick={() => setVurdererArbeidstid(true)}
                                icon={<BriefcaseClockIcon fontSize="1.5rem" />}
                            >
                                Vurder arbeidstid
                            </Button>
                        )}
                    </HStack>
                </VisHvisSkrivetilgang>
            )}
        </Box>
    );
};
