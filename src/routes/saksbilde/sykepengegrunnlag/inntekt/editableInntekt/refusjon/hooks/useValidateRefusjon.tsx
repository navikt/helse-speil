import dayjs from 'dayjs';
import { FormEvent } from 'react';
import { useFormContext } from 'react-hook-form';

import { Maybe } from '@io/graphql';
import type { Refusjonsopplysning } from '@typer/overstyring';
import { ActivePeriod } from '@typer/shared';
import { ISO_DATOFORMAT, NORSK_DATOFORMAT } from '@utils/date';
import { isGhostPeriode } from '@utils/typeguards';

export const useValidateRefusjon = (
    period: Maybe<ActivePeriod>,
    fraRefusjonsopplysninger: Refusjonsopplysning[],
    omregnetÅrsinntektBeløp: number,
    setHarIkkeSkjemaEndringer: (harEndringer: boolean) => void,
    førstePeriodeForSkjæringstidspunktFom?: string,
) => {
    const { handleSubmit, setError, getValues } = useFormContext();

    const values = getValues();

    return (e: FormEvent, confirmChanges: () => void) => {
        if (isGhostPeriode(period)) {
            handleSubmit(confirmChanges);
            return;
        }

        const refusjonsopplysninger =
            values?.refusjonsopplysninger &&
            [...values.refusjonsopplysninger].sort(
                (a: Refusjonsopplysning, b: Refusjonsopplysning) =>
                    new Date(b.fom).getTime() - new Date(a.fom).getTime(),
            );

        const harEndretRefusjonsopplysninger =
            JSON.stringify(refusjonsopplysninger) !== JSON.stringify(fraRefusjonsopplysninger);
        const harEndretMånedsbeløp =
            omregnetÅrsinntektBeløp !== Number(values?.manedsbelop) && !stringIsNaN(values?.manedsbelop);

        if (!harEndretMånedsbeløp && !harEndretRefusjonsopplysninger) {
            e.preventDefault();
            setHarIkkeSkjemaEndringer(true);
            return;
        } else if (harEndretMånedsbeløp && !harEndretRefusjonsopplysninger) {
            handleSubmit(confirmChanges);
            return;
        } else {
            setHarIkkeSkjemaEndringer(false);
        }

        const sisteTomErFørPeriodensTom: boolean =
            refusjonsopplysninger?.[0]?.tom === null
                ? false
                : (dayjs(refusjonsopplysninger?.[0]?.tom, ISO_DATOFORMAT).isBefore(period?.tom) ?? true);

        const førsteFomErEtterFørstePeriodesFom: boolean = dayjs(
            refusjonsopplysninger?.[refusjonsopplysninger.length - 1]?.fom,
            ISO_DATOFORMAT,
        ).isAfter(førstePeriodeForSkjæringstidspunktFom);

        const erGapIDatoer: boolean = refusjonsopplysninger?.some(
            (refusjonsopplysning: Refusjonsopplysning, index: number) => {
                const isNotLast = index < refusjonsopplysninger.length - 1;
                const currentFom = dayjs(refusjonsopplysning.fom, ISO_DATOFORMAT);
                const previousTom = dayjs(refusjonsopplysninger[index + 1]?.tom ?? '1970-01-01', ISO_DATOFORMAT);
                return isNotLast && currentFom.subtract(1, 'day').diff(previousTom) !== 0;
            },
        );

        const manglerRefusjonsopplysninger: boolean = refusjonsopplysninger.length === 0;

        sisteTomErFørPeriodensTom &&
            setError('refusjonsopplysninger', {
                type: 'custom',
                message: 'Siste til og med dato kan ikke være før periodens til og med dato.',
            });

        førsteFomErEtterFørstePeriodesFom &&
            setError('refusjonsopplysninger', {
                type: 'custom',
                message: `Tidligste fra og med dato for refusjon må være lik eller før ${dayjs(
                    førstePeriodeForSkjæringstidspunktFom,
                    ISO_DATOFORMAT,
                ).format(NORSK_DATOFORMAT)}`,
            });

        erGapIDatoer &&
            setError('refusjonsopplysninger', {
                type: 'custom',
                message: 'Refusjonsdatoene må være sammenhengende.',
            });

        manglerRefusjonsopplysninger &&
            setError('refusjonsopplysninger', { type: 'custom', message: 'Mangler refusjonsopplysninger' });

        if (
            !sisteTomErFørPeriodensTom &&
            !førsteFomErEtterFørstePeriodesFom &&
            !erGapIDatoer &&
            !manglerRefusjonsopplysninger
        ) {
            handleSubmit(confirmChanges);
        }
    };
};

const stringIsNaN = (value: string | undefined): boolean => Number.isNaN(Number.parseFloat(value ?? 'NaN'));
