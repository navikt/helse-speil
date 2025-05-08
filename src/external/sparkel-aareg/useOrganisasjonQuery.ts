import { gql, useQuery } from '@apollo/client';

type OrganisasjonQueryResult = {
    organisasjon: {
        organisasjonsnummer: string;
        navn: string;
    };
};

type OrganisasjonVariables = {
    organisasjonsnummer: string;
};

export const useOrganisasjonQuery = (organisasjonsnummer: string) =>
    useQuery<OrganisasjonQueryResult, OrganisasjonVariables>(
        gql`
            query HentOrganisasjon($organisasjonsnummer: String!) {
                organisasjon(organisasjonsnummer: $organisasjonsnummer)
                    @rest(
                        type: "Organisasjon"
                        endpoint: "sparkelAareg"
                        path: "/organisasjoner/{args.organisasjonsnummer}"
                        method: "GET"
                    ) {
                    organisasjonsnummer
                    navn
                }
            }
        `,
        {
            variables: {
                organisasjonsnummer: organisasjonsnummer,
            },
            skip: organisasjonsnummer.length !== 9 || isNaN(Number(organisasjonsnummer)),
        },
    );
