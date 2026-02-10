import { customAxios } from '@app/axios/axiosClient';
import { useQuery } from '@tanstack/react-query';

type SparkelApiOrganisasjon = { organisasjonsnummer: string; navn: string | null } | null;

export const useOrganisasjonQuery = (organisasjonsnummer?: string) =>
    useQuery({
        queryKey: ['/api/sparkel-aareg/organisasjoner/{organisasjonsnummer}', organisasjonsnummer],
        queryFn: async (): Promise<SparkelApiOrganisasjon> =>
            (await customAxios.get(`/api/sparkel-aareg/organisasjoner/${organisasjonsnummer}`)).data,
        gcTime: Infinity,
        staleTime: Infinity,
        enabled: erGyldigOrganisasjonsnummer(organisasjonsnummer),
    });

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
