import React, { ReactElement } from 'react';

import { EndreDagerArbeidstakerForm } from '@saksbilde/utbetaling/utbetalingstabell/endringForm/EndreDagerArbeidstakerForm';
import { EndreDagerSelvstendigForm } from '@saksbilde/utbetaling/utbetalingstabell/endringForm/EndreDagerSelvstendigForm';
import { Utbetalingstabelldag } from '@typer/utbetalingstabell';

interface EndreDagerFormProps {
    markerteDager: Map<string, Utbetalingstabelldag>;
    onSubmitEndring: (endring: Partial<Utbetalingstabelldag>) => void;
    erSelvstendig: boolean;
}

export const EndreDagerForm = ({
    markerteDager,
    onSubmitEndring,
    erSelvstendig,
}: EndreDagerFormProps): ReactElement => {
    return erSelvstendig ? (
        <EndreDagerSelvstendigForm markerteDager={markerteDager} onSubmitEndring={onSubmitEndring} />
    ) : (
        <EndreDagerArbeidstakerForm markerteDager={markerteDager} onSubmitEndring={onSubmitEndring} />
    );
};
