'use client';

import { useRouter } from 'next/navigation';
import React, { ReactElement, useEffect } from 'react';

import { Alert, HStack, Loader } from '@navikt/ds-react';

import { HttpError } from '@app/fetch/fetchClient';
import { postPersonSok } from '@io/rest/generated/personer/personer';
import { søkISpoogle } from '@io/rest/spoogle';
import { PageNotFound } from '@routes/PageNotFound';
import { useNullstillSaksbildeTab } from '@state/tab';
import { useQuery } from '@tanstack/react-query';
import { lagPeriodeUrl } from '@utils/undersider';

async function finnPeriodeUrl(id: string): Promise<string> {
    const { fødselsnummer, vedtaksperiodeId, behandlingId } = await søkISpoogle(id);
    const { personPseudoId } = await postPersonSok({ identitetsnummer: fødselsnummer });
    return vedtaksperiodeId
        ? lagPeriodeUrl(personPseudoId, { periodeId: vedtaksperiodeId, behandlingId })
        : `/person/${personPseudoId}`;
}

/**
 * Slår opp personen bak en vedtaksperiodeId eller behandlingId via Spoogle og Spesialist, og sender saksbehandleren
 * videre til perioden i saksbildet.
 */
export function Dyplenke({ id }: { id: string }): ReactElement {
    const router = useRouter();
    const nullstillSaksbildeTab = useNullstillSaksbildeTab();
    const { data: periodeUrl, error } = useQuery<string, HttpError>({
        queryKey: ['dyplenke', id],
        queryFn: () => finnPeriodeUrl(id),
        retry: false,
        gcTime: 0,
    });

    useEffect(() => {
        if (!periodeUrl) return;
        nullstillSaksbildeTab();
        router.replace(periodeUrl);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [periodeUrl]);

    if (error) {
        if (error.status !== undefined && error.status >= 400 && error.status < 500) return <PageNotFound />;
        return (
            <Alert variant="error" size="small" style={{ margin: '1rem' }}>
                Kunne ikke slå opp {id}. Prøv igjen senere.
            </Alert>
        );
    }

    return (
        <HStack justify="center" padding="space-32">
            <Loader size="xlarge" title="Henter person" />
        </HStack>
    );
}
