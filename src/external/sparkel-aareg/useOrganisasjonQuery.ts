import { useQuery } from '@apollo/client';
import { HentOrganisasjonDocument } from '@io/graphql';

export const useOrganisasjonQuery = (organisasjonsnummer?: string) =>
    useQuery(HentOrganisasjonDocument, {
        variables: {
            organisasjonsnummer: organisasjonsnummer!,
        },
        skip:
            organisasjonsnummer === undefined ||
            organisasjonsnummer.length !== 9 ||
            isNaN(Number(organisasjonsnummer)) ||
            !organisasjonsnummerHarRiktigKontrollsiffer(organisasjonsnummer),
    });

export const organisasjonsnummerHarRiktigKontrollsiffer = (organisasjonsnummer: string) => {
    const vekttall = [3, 2, 7, 6, 5, 4, 3, 2];
    const felt = organisasjonsnummer.split('').map(Number).slice(0, -1);
    const produkter = felt.map((tall, index) => tall * (vekttall[index] ?? 0));
    const sum = produkter.reduce((a, b) => a + b, 0);
    const kontrollsiffer = 11 - (sum % 11);
    return kontrollsiffer === Number(organisasjonsnummer) % 10;
};
