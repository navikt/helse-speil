import React, { ReactElement } from 'react';

import { EndreDagerFormArbeidstaker } from '@saksbilde/utbetaling/utbetalingstabell/endringForm/EndreDagerFormArbeidstaker';
import { EndreDagerFormSelvstendig } from '@saksbilde/utbetaling/utbetalingstabell/endringForm/EndreDagerFormSelvstendig';
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
        <EndreDagerFormSelvstendig markerteDager={markerteDager} onSubmitEndring={onSubmitEndring} />
    ) : (
        <EndreDagerFormArbeidstaker markerteDager={markerteDager} onSubmitEndring={onSubmitEndring} />
    );
};
