import { customAxios } from '@app/axios/axiosClient';
import { useQueries, useQuery } from '@tanstack/react-query';

type SparkelApiOrganisasjon = { organisasjonsnummer: string; navn: string | null } | null;

const organisasjonQueryOptions = (orgnr: string) => ({
    queryKey: ['/api/sparkel-aareg/organisasjoner/{organisasjonsnummer}', orgnr],
    queryFn: async (): Promise<SparkelApiOrganisasjon> =>
        (await customAxios.get(`/api/sparkel-aareg/organisasjoner/${orgnr}`)).data,
    gcTime: Infinity,
    staleTime: Infinity,
    enabled: erGyldigOrganisasjonsnummer(orgnr),
});

export const useOrganisasjonQuery = (organisasjonsnummer?: string) =>
    useQuery(organisasjonQueryOptions(organisasjonsnummer ?? ''));

export const useOrganisasjonerQuery = (organisasjonsnumre: string[]) => {
    const queries = useQueries({
        queries: organisasjonsnumre.map(organisasjonQueryOptions),
    });

    const isLoading = queries.some((q) => q.isPending || q.isFetching);

    const navnMap = new Map<string, string>();
    queries.forEach((query, index) => {
        const orgnr = organisasjonsnumre[index];
        if (orgnr && query.data?.navn) {
            navnMap.set(orgnr, query.data.navn);
        }
    });

    return { navnMap, isLoading };
};

export const erGyldigOrganisasjonsnummer = (organisasjonsnummer: string | undefined) =>
    organisasjonsnummer !== undefined &&
    !isNaN(Number(organisasjonsnummer)) &&
    organisasjonsnummer.length === 9 &&
    organisasjonsnummerHarRiktigKontrollsiffer(organisasjonsnummer);

export const organisasjonsnummerHarRiktigKontrollsiffer = (organisasjonsnummer: string) => {
    const vekttall = [3, 2, 7, 6, 5, 4, 3, 2];
    const felt = organisasjonsnummer.split('').map(Number).slice(0, -1);
    const produkter = felt.map((tall, index) => tall * (vekttall[index] ?? 0));
    const sum = produkter.reduce((a, b) => a + b, 0);
    let kontrollsiffer = 11 - (sum % 11);
    if (kontrollsiffer === 11) {
        kontrollsiffer = 0;
    }
    return kontrollsiffer === Number(organisasjonsnummer) % 10;
};
