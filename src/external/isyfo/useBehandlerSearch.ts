import { customAxios } from '@app/axios/axiosClient';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

export type IsyfoBehandler = {
    behandlerRef: string;
    kategori: string;
    fnr: string | null;
    hprId: number | null;
    fornavn: string;
    mellomnavn: string | null;
    etternavn: string;
    orgnummer: string | null;
    kontor: string | null;
    adresse: string | null;
    postnummer: string | null;
    poststed: string | null;
    telefon: string | null;
    type: string | null;
};

export const useBehandlerSearch = (searchTerm: string) =>
    useQuery({
        queryKey: ['/api/isyfo/behandler/search', searchTerm],
        queryFn: async (): Promise<IsyfoBehandler[]> =>
            (await customAxios.post('/api/isyfo/behandler/search', { searchstring: searchTerm })).data,
        enabled: searchTerm.length >= 3,
        placeholderData: keepPreviousData,
    });
