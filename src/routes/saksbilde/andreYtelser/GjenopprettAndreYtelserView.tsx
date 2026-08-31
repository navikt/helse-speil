'use client';

import { useRouter } from 'next/navigation';
import React, { ReactElement } from 'react';

import { AndreYtelserSchema } from '@/form-schemas/andreYtelserSchema';
import { usePostGjenopprettGraderteAndreYtelser } from '@io/rest/generated/graderte-andre-ytelser/graderte-andre-ytelser';
import { AndreYtelserSkjema } from '@saksbilde/andreYtelser/skjema/AndreYtelserSkjema';
import { AndreYtelserSkjemaRamme } from '@saksbilde/andreYtelser/skjema/AndreYtelserSkjemaRamme';
import {
    tilAndreYtelserSkjemaverdier,
    tilGjenopprettGraderteAndreYtelserRequest,
} from '@saksbilde/andreYtelser/skjema/andreYtelserMapping';
import { useGraderteAndreYtelser } from '@saksbilde/andreYtelser/useGraderteAndreYtelser';

export function GjenopprettAndreYtelserView({ andreYtelserId }: { andreYtelserId: string }): ReactElement | null {
    const router = useRouter();
    const { ytelse, invaliderGraderteAndreYtelser } = useGraderteAndreYtelser(andreYtelserId);

    const { mutate, isPending, isError } = usePostGjenopprettGraderteAndreYtelser({
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
            data: tilGjenopprettGraderteAndreYtelserRequest(values),
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
                feilmelding="Klarte ikke gjenopprette ytelsen. Prøv igjen senere, eller kontakt en coach."
            />
        </AndreYtelserSkjemaRamme>
    );
}
