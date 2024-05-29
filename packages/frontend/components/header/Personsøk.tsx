import React, { FormEvent, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { Search } from '@navikt/ds-react';

import { useApolloClient, useLazyQuery } from '@apollo/client';
import styles from '@components/header/Header.module.css';
import { useLoadingToast } from '@hooks/useLoadingToast';
import { FetchPersonDocument } from '@io/graphql';
import { validFødselsnummer } from '@io/graphql/common';
import { useAddVarsel, useRapporterGraphQLErrors } from '@state/varsler';
import { SpeilError } from '@utils/error';

const erGyldigPersonId = (value: string) => value.match(/^\d{1,13}$/) !== null;

export const Personsøk: React.FC = () => {
    const addVarsel = useAddVarsel();
    const navigate = useNavigate();
    const rapporterError = useRapporterGraphQLErrors();
    const client = useApolloClient();
    const [hentPerson, { loading }] = useLazyQuery(FetchPersonDocument, {
        onCompleted: (data) => {
            client.writeQuery({
                query: FetchPersonDocument,
                variables: { aktorId: data.person?.aktorId },
                data: {
                    __typename: 'Query',
                    person: data.person,
                },
            });
        },
        onError: (error) => {
            rapporterError(error.graphQLErrors);
        },
    });

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
            navigate('/');
            addVarsel(new SpeilError(`"${personId}" er ikke en gyldig aktør-ID/fødselsnummer.`));
        } else {
            const variables: { aktorId?: string; fnr?: string } = validFødselsnummer(personId)
                ? { fnr: personId }
                : { aktorId: personId };
            hentPerson({
                variables: variables,
            }).then(({ data, error }) => {
                if ((data?.person?.arbeidsgivere.length ?? 0) === 0) {
                    navigate('/');
                    if (error?.graphQLErrors) rapporterError(error.graphQLErrors);
                    return;
                }
                if (data?.person) {
                    navigate(`/person/${data.person.aktorId}/dagoversikt`);
                }
            });
        }
    };

    return (
        <form className={styles.SearchForm} onSubmit={søkOppPerson}>
            <Search label="Søk" size="small" variant="secondary" placeholder="Søk" ref={searchRef} />
        </form>
    );
};
