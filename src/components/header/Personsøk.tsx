import { useRouter } from 'next/navigation';
import React, { FormEvent, ReactElement, useRef } from 'react';

import { Search } from '@navikt/ds-react';

import { ApolloError, useLazyQuery } from '@apollo/client';
import { useLoadingToast } from '@hooks/useLoadingToast';
import { FetchPersonDocument, Maybe } from '@io/graphql';
import { validFødselsnummer } from '@io/graphql/common';
import { BadRequestError } from '@io/graphql/errors';
import { usePersonKlargjøres } from '@state/personSomKlargjøres';
import { finnAlleInntektsforhold } from '@state/selectors/arbeidsgiver';
import { useAddVarsel, useRapporterGraphQLErrors } from '@state/varsler';
import { apolloExtensionValue } from '@utils/error';

import styles from './Personsøk.module.css';

const erGyldigPersonId = (value: string) => value.match(/^\d{13}$/) || value.match(/^\d{11}$/);

export const Personsøk = (): ReactElement => {
    const addVarsel = useAddVarsel();
    const router = useRouter();
    const rapporterError = useRapporterGraphQLErrors();
    const [hentPerson, { loading }] = useLazyQuery(FetchPersonDocument);
    const { venterPåKlargjøring } = usePersonKlargjøres();

    useLoadingToast({ isLoading: loading, message: 'Henter person' });

    const searchRef = useRef<HTMLInputElement>(null);

    const søkOppPerson = async (event: FormEvent) => {
        event.preventDefault();
        const rawPersonId = searchRef.current?.value;
        const personId = rawPersonId?.replace(/\s/g, '');

        if (!personId || loading) {
            return;
        }

        if (!erGyldigPersonId(personId)) {
            router.push('/');
            addVarsel(new BadRequestError(personId));
        } else {
            const variables: { aktorId?: string; fnr?: string } = validFødselsnummer(personId)
                ? { fnr: personId }
                : { aktorId: personId };
            hentPerson({
                variables: variables,
            }).then(({ data, error }) => {
                if ((finnAlleInntektsforhold(data?.person ?? null).length ?? 0) === 0) {
                    router.push('/');
                    if (error?.graphQLErrors) {
                        if (personenKlargjøres(error)) {
                            const aktørId: Maybe<string> = apolloExtensionValue(error, 'persondata_hentes_for');
                            if (aktørId) venterPåKlargjøring(aktørId);
                        } else {
                            rapporterError(error?.graphQLErrors, personId);
                        }
                    }
                    return;
                }
                if (data?.person) {
                    router.push(`/person/${data.person.aktorId}/dagoversikt`);
                }
            });
        }
    };

    return (
        <form className={styles.searchForm} onSubmit={søkOppPerson} autoComplete="off">
            <Search label="Søk" size="small" variant="secondary" placeholder="Søk" ref={searchRef} />
        </form>
    );
};

const personenKlargjøres = (error: ApolloError) => {
    const aktørId: Maybe<string> = apolloExtensionValue(error, 'persondata_hentes_for');
    return aktørId != null;
};
