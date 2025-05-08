import { useQuery } from '@apollo/client';
import { HentOrganisasjonDocument } from '@io/graphql';

export const useOrganisasjonQuery = (organisasjonsnummer: string) =>
    useQuery(HentOrganisasjonDocument, {
        variables: {
            organisasjonsnummer: organisasjonsnummer,
        },
        skip: organisasjonsnummer.length !== 9 || isNaN(Number(organisasjonsnummer)),
    });
