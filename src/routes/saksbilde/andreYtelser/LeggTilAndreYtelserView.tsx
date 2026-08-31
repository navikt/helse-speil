'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { ReactElement } from 'react';

import { AndreYtelserSchema } from '@/form-schemas/andreYtelserSchema';
import {
    getGetGraderteAndreYtelserForPersonQueryKey,
    usePostGraderteAndreYtelser,
} from '@io/rest/generated/graderte-andre-ytelser/graderte-andre-ytelser';
import { useGetPerson } from '@io/rest/generated/personer/personer';
import { AndreYtelserSkjema, tomtAndreYtelserSkjema } from '@saksbilde/andreYtelser/skjema/AndreYtelserSkjema';
import { tilGraderteAndreYtelserRequest } from '@saksbilde/andreYtelser/skjema/andreYtelserMapping';
import { useSistValgtePeriode } from '@state/periode';
import { useFetchPersonQuery } from '@state/person';
import { useQueryClient } from '@tanstack/react-query';
import { somNorskDato } from '@utils/date';

export function LeggTilAndreYtelserView(): ReactElement {
    const router = useRouter();
    const { personPseudoId } = useParams<{ personPseudoId: string }>();
    const queryClient = useQueryClient();
    const { data: person } = useGetPerson(personPseudoId);
    const { data: personData } = useFetchPersonQuery();

    const aktivPeriode = useSistValgtePeriode(personData?.person ?? null);

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

    // foreslår sist valgte periode fra tidslinjen som startverdi
    const defaultValues = {
        ...tomtAndreYtelserSkjema,
        perioder: [{ fom: somNorskDato(aktivPeriode?.fom) ?? '', tom: somNorskDato(aktivPeriode?.tom) ?? '' }],
    };

    return (
        <AndreYtelserSkjema
            defaultValues={defaultValues}
            onSubmit={onSubmit}
            onAvbryt={() => router.back()}
            isPending={isPending}
            isError={isError}
        />
    );
}

