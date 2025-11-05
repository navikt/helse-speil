import React, { ReactElement } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Button, TextField } from '@navikt/ds-react';

import { DagoverstyringSchema, lagDagoverstyringSchema } from '@/form-schemas/dagoverstyringSkjema';
import { zodResolver } from '@hookform/resolvers/zod';
import { OverstyrbarDagtype } from '@saksbilde/utbetaling/utbetalingstabell/endringForm/endringFormUtils';
import { Utbetalingstabelldag } from '@typer/utbetalingstabell';

interface DagoverstyringFormProps {
    alleDager: Utbetalingstabelldag[];
}

export const DagoverstyringForm = ({ alleDager }: DagoverstyringFormProps): ReactElement => {
    const form = useForm<DagoverstyringSchema>({
        resolver: zodResolver(lagDagoverstyringSchema()),
        defaultValues: {
            dager: alleDager,
            valgteDager: [],
            endring: {
                dagtype: OverstyrbarDagtype.Syk,
                grad: 100,
            },
            nyeDager: {
                dagtype: OverstyrbarDagtype.Syk,
                grad: 100,
                tom: '',
                fom: '',
            },
        },
    });

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit((data) => console.log(data))}>
                <LeggTilDagerFormNy />
                <EndreDagerFormNy />
                <TextField label="Notat til beslutter" />
                <Button type="submit">Ferdig</Button>
            </form>
        </FormProvider>
    );
};

function LeggTilDagerFormNy(): ReactElement {
    return <></>;
}

function EndreDagerFormNy(): ReactElement {
    return <></>;
}
