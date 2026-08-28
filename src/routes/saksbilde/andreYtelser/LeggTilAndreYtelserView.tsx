'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { ReactElement } from 'react';

import { AndreYtelserSchema } from '@/form-schemas/andreYtelserSchema';
import {
    getGetGraderteAndreYtelserForPersonQueryKey,
    usePostGraderteAndreYtelser,
} from '@io/rest/generated/graderte-andre-ytelser/graderte-andre-ytelser';
import { useGetPerson } from '@io/rest/generated/personer/personer';
import { AndreYtelserSkjema } from '@saksbilde/andreYtelser/skjema/AndreYtelserSkjema';
import { tilGraderteAndreYtelserRequest } from '@saksbilde/andreYtelser/skjema/andreYtelserMapping';
import { useQueryClient } from '@tanstack/react-query';

export function LeggTilAndreYtelserView(): ReactElement {
    const router = useRouter();
    const { personPseudoId } = useParams<{ personPseudoId: string }>();
    const queryClient = useQueryClient();
    const { data: person } = useGetPerson(personPseudoId);

    const { mutate, isPending, isError } = usePostGraderteAndreYtelser({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: getGetGraderteAndreYtelserForPersonQueryKey(personPseudoId),
                });
                router.back();
            },
        },
    });

    function onSubmit(values: AndreYtelserSchema) {
        if (!person) return;
        mutate({ data: tilGraderteAndreYtelserRequest(values, person.identitetsnummer) });
    }

    return (
        <AndreYtelserSkjema
            onSubmit={onSubmit}
            onAvbryt={() => router.back()}
            isPending={isPending}
            isError={isError}
        />
    );
}
