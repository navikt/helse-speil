import dayjs from 'dayjs';
import React from 'react';
import { useFormContext } from 'react-hook-form';

import { BeregnetPeriodeFragment, MinimumSykdomsgradOverstyring, PersonFragment } from '@io/graphql';
import { Delperiode } from '@saksbilde/utbetaling/utbetalingstabell/minimumSykdomsgrad/Delperiode';
import { finnOverstyringerForAktivInntektsforhold } from '@state/selectors/arbeidsgiver';
import { getOverlappendePerioder, overlapper } from '@state/selectors/period';
import { ActivePeriod, DatePeriod } from '@typer/shared';
import { ISO_DATOFORMAT, ISO_TIDSPUNKTFORMAT } from '@utils/date';
import { isBeregnetPeriode, isMinimumSykdomsgradsoverstyring } from '@utils/typeguards';

interface Props {
    person: PersonFragment;
    aktivPeriode: ActivePeriod;
    delperiode: DatePeriod;
}

export const DelperiodeWrapper = ({ person, aktivPeriode, delperiode }: Props) => {
    const { register, clearErrors, formState } = useFormContext();
    const minimumSykdomsgradoverstyringer = finnOverstyringerForAktivInntektsforhold(aktivPeriode, person).filter(
        isMinimumSykdomsgradsoverstyring,
    );
    const harError =
        formState.errors.merEnn20periode &&
        (Object.entries(formState.errors.merEnn20periode).find(
            (errorPeriode) => errorPeriode[0] === delperiode.fom,
        )?.[1]?.message as string);

    const sisteOverstyring = minimumSykdomsgradoverstyringer
        ?.filter((overstyring) =>
            [
                ...overstyring.minimumSykdomsgrad.perioderVurdertIkkeOk,
                ...overstyring.minimumSykdomsgrad.perioderVurdertOk,
            ].some((vurdering) => vurdering.fom === delperiode.fom && vurdering.tom === delperiode.tom),
        )
        .sort(byTimestamp)?.[0];
    const defaultValue =
        sisteOverstyring !== undefined
            ? sisteOverstyring.minimumSykdomsgrad.perioderVurdertOk.some(
                  (vurdertOk) => vurdertOk.fom === delperiode.fom,
              )
                ? 'Ja'
                : 'Nei'
            : undefined;

    const overlappendePerioder = getOverlappendePerioder(person, aktivPeriode as BeregnetPeriodeFragment);
    const erAktivPeriodeIkkeBestemmendeForDelperioden =
        isBeregnetPeriode(aktivPeriode) &&
        overlappendePerioder
            .filter((it) => overlapper(it)(delperiode))
            .sort(byPeriodeEier)
            .shift()?.vedtaksperiodeId !== aktivPeriode.vedtaksperiodeId;

    const erReadOnly =
        defaultValue !== undefined &&
        isBeregnetPeriode(aktivPeriode) &&
        sisteOverstyring?.minimumSykdomsgrad.initierendeVedtaksperiodeId !== aktivPeriode.vedtaksperiodeId &&
        erAktivPeriodeIkkeBestemmendeForDelperioden;

    const fieldName = `merEnn20periode.${delperiode.fom}`;
    const field =
        !erReadOnly && !erAktivPeriodeIkkeBestemmendeForDelperioden
            ? register(fieldName, {
                  required: 'Du må velge en vurdering',
                  onChange: () => clearErrors(fieldName),
              })
            : undefined;

    return (
        <Delperiode
            delperiode={delperiode}
            field={field}
            erReadOnly={erReadOnly}
            erAktivPeriodeIkkeBestemmendeForDelperioden={erAktivPeriodeIkkeBestemmendeForDelperioden}
            defaultValue={defaultValue}
            error={harError}
            visHjelpetekst={erReadOnly || erAktivPeriodeIkkeBestemmendeForDelperioden}
        />
    );
};

export const byTimestamp = (a: MinimumSykdomsgradOverstyring, b: MinimumSykdomsgradOverstyring): number => {
    return dayjs(a.timestamp, ISO_TIDSPUNKTFORMAT).isAfter(dayjs(b.timestamp, ISO_TIDSPUNKTFORMAT)) ? -1 : 1;
};

export const byPeriodeEier = (a: BeregnetPeriodeFragment, b: BeregnetPeriodeFragment): number => {
    return dayjs(a.fom, ISO_DATOFORMAT).isSameOrAfter(b.fom)
        ? a.fom === b.fom && dayjs(a.tom, ISO_DATOFORMAT).isBefore(b.tom)
            ? -1
            : 0
        : -1;
};
