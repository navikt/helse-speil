import dayjs from 'dayjs';
import React from 'react';
import { useFormContext } from 'react-hook-form';

import { MinimumSykdomsgradOverstyring, PersonFragment } from '@io/graphql';
import { Delperiode } from '@saksbilde/utbetaling/utbetalingstabell/minimumSykdomsgrad/Delperiode';
import { useCurrentArbeidsgiver } from '@state/arbeidsgiver';
import { ActivePeriod, DatePeriod } from '@typer/shared';
import { ISO_TIDSPUNKTFORMAT } from '@utils/date';
import { isBeregnetPeriode, isMinimumSykdomsgradsoverstyring } from '@utils/typeguards';

interface Props {
    person: PersonFragment;
    aktivPeriode: ActivePeriod;
    delperiode: DatePeriod;
}

export const DelperiodeWrapper = ({ person, aktivPeriode, delperiode }: Props) => {
    const { register, clearErrors, formState } = useFormContext();
    const arbeidsgiver = useCurrentArbeidsgiver(person);
    const minimumSykdomsgradoverstyringer = arbeidsgiver?.overstyringer.filter(isMinimumSykdomsgradsoverstyring);
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
    const erReadOnly =
        defaultValue !== undefined &&
        isBeregnetPeriode(aktivPeriode) &&
        sisteOverstyring?.minimumSykdomsgrad.initierendeVedtaksperiodeId !== aktivPeriode.vedtaksperiodeId;

    const fieldName = `merEnn20periode.${delperiode.fom}`;
    const field = !erReadOnly
        ? register(fieldName, {
              required: 'Du må velge en vurdering',
              onChange: () => clearErrors(fieldName),
          })
        : undefined;

    return (
        <Delperiode
            delperiode={delperiode}
            field={field}
            disabled={erReadOnly}
            defaultValue={defaultValue}
            error={harError}
            visHjelpetekst={erReadOnly}
        />
    );
};

export const byTimestamp = (a: MinimumSykdomsgradOverstyring, b: MinimumSykdomsgradOverstyring): number => {
    return dayjs(a.timestamp, ISO_TIDSPUNKTFORMAT).isAfter(dayjs(b.timestamp, ISO_TIDSPUNKTFORMAT)) ? -1 : 1;
};
