'use client';

import { useRouter } from 'next/navigation';
import React, { ReactElement } from 'react';

import { AndreYtelserSchema } from '@/form-schemas/andreYtelserSchema';
import { usePatchEndreGraderteAndreYtelser } from '@io/rest/generated/graderte-andre-ytelser/graderte-andre-ytelser';
import { AndreYtelserSkjema } from '@saksbilde/andreYtelser/skjema/AndreYtelserSkjema';
import { AndreYtelserSkjemaRamme } from '@saksbilde/andreYtelser/skjema/AndreYtelserSkjemaRamme';
import {
    tilAndreYtelserSkjemaverdier,
    tilEndreGraderteAndreYtelserRequest,
} from '@saksbilde/andreYtelser/skjema/andreYtelserMapping';
import { useGraderteAndreYtelser } from '@saksbilde/andreYtelser/useGraderteAndreYtelser';

export function EndreAndreYtelserView({ andreYtelserId }: { andreYtelserId: string }): ReactElement | null {
    const router = useRouter();
    const { ytelse, invaliderGraderteAndreYtelser } = useGraderteAndreYtelser(andreYtelserId);

    const { mutate, isPending, isError } = usePatchEndreGraderteAndreYtelser({
        mutation: {
            onSuccess: async () => {
                await invaliderGraderteAndreYtelser();
                router.back();
            },
        },
    });

    if (!ytelse) return null;

    function onSubmit(values: AndreYtelserSchema) {
        mutate({
            graderteAndreYtelserId: andreYtelserId,
            data: tilEndreGraderteAndreYtelserRequest(values, andreYtelserId),
        });
    }

    return (
        <AndreYtelserSkjemaRamme onAvbryt={() => router.back()} isPending={isPending}>
            <AndreYtelserSkjema
                defaultValues={tilAndreYtelserSkjemaverdier(ytelse)}
                gjeldendeAndreYtelserId={andreYtelserId}
                onSubmit={onSubmit}
                onAvbryt={() => router.back()}
                isPending={isPending}
                isError={isError}
                feilmelding="Klarte ikke endre ytelsen. Prøv igjen senere, eller kontakt en coach."
            />
        </AndreYtelserSkjemaRamme>
    );
}
