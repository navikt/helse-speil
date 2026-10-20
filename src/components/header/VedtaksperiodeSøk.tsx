import { useRouter } from 'next/navigation';
import React, { FormEvent, ReactElement, useRef } from 'react';
import { validate as validateUuid } from 'uuid';

import { Search } from '@navikt/ds-react';
import { teamLogger } from '@navikt/next-logger/team-log';

import { useLoadingToast } from '@hooks/useLoadingToast';
import {
    FetchError,
    NotFoundError,
    UgyldigIdentifikatorError,
    VedtaksperiodeIkkeFunnetError,
} from '@io/graphql/errors';
import { usePostPersonSok } from '@io/rest/generated/personer/personer';
import { useFinnFødselsnummerForVedtaksperiode } from '@io/rest/spoogle';
import { useNullstillSaksbildeTab } from '@state/tab';
import { useAddVarsel } from '@state/varsler';

export const VedtaksperiodeSøk = (): ReactElement => {
    const addVarsel = useAddVarsel();
    const router = useRouter();
    const nullstillSaksbildeTab = useNullstillSaksbildeTab();
    const { mutate: finnFødselsnummer, isPending: henterFødselsnummer } = useFinnFødselsnummerForVedtaksperiode();
    const { mutate: søkPerson, isPending: henterPerson } = usePostPersonSok();
    const loading = henterFødselsnummer || henterPerson;

    useLoadingToast({ isLoading: loading, message: 'Henter person' });

    const searchRef = useRef<HTMLInputElement>(null);

    const søkOppVedtaksperiode = (event: FormEvent) => {
        event.preventDefault();
        const vedtaksperiodeId = searchRef.current?.value?.replace(/\s/g, '');

        if (!vedtaksperiodeId || loading) {
            return;
        }
        if (!validateUuid(vedtaksperiodeId)) {
            addVarsel(new UgyldigIdentifikatorError(vedtaksperiodeId));
            return;
        }

        finnFødselsnummer(vedtaksperiodeId, {
            onSuccess: (fødselsnummer) =>
                søkPerson(
                    { data: { identitetsnummer: fødselsnummer } },
                    {
                        onSuccess: (data) => {
                            nullstillSaksbildeTab();
                            router.push(`/person/${data.personPseudoId}`);
                        },
                        onError: (error) => {
                            if (error.status !== undefined && error.status >= 400 && error.status < 500) {
                                addVarsel(new NotFoundError());
                            } else {
                                teamLogger.error(error, 'Fikk feil fra søk etter person funnet via vedtaksperiode');
                                addVarsel(new FetchError());
                            }
                        },
                    },
                ),
            onError: (error) => {
                if (error.status === 404) {
                    addVarsel(new VedtaksperiodeIkkeFunnetError(vedtaksperiodeId));
                } else {
                    teamLogger.error(error, 'Fikk feil fra spoogle ved søk etter vedtaksperiode');
                    addVarsel(new FetchError());
                }
            },
        });
    };

    return (
        <form onSubmit={søkOppVedtaksperiode} autoComplete="off">
            <Search
                label="Søk på vedtaksperiode-ID"
                size="small"
                variant="secondary"
                placeholder="Vedtaksperiode-ID"
                ref={searchRef}
            />
        </form>
    );
};
