import React from 'react';

import { LeggTilDagerArbeidstakerForm } from '@saksbilde/utbetaling/utbetalingstabell/LeggTilDagerArbeidstakerForm';
import { LeggTilDagerSelvstendigForm } from '@saksbilde/utbetaling/utbetalingstabell/LeggTilDagerSelvstendigForm';
import { DateString } from '@typer/shared';
import { Utbetalingstabelldag } from '@typer/utbetalingstabell';

interface LeggTilDagerFormProps {
    periodeFom: DateString;
    onSubmitPølsestrekk: (nyeDager: Map<string, Utbetalingstabelldag>) => void;
    erSelvstendig: boolean;
}

export const LeggTilDagerForm = ({ periodeFom, onSubmitPølsestrekk, erSelvstendig }: LeggTilDagerFormProps) => {
    return erSelvstendig ? (
        <LeggTilDagerSelvstendigForm periodeFom={periodeFom} onSubmitPølsestrekk={onSubmitPølsestrekk} />
    ) : (
        <LeggTilDagerArbeidstakerForm periodeFom={periodeFom} onSubmitPølsestrekk={onSubmitPølsestrekk} />
    );
};
