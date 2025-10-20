import { ApiDokumentInntektsmelding, ApiSoknad } from '@io/rest/generated/spesialist.schemas';
import { useQuery } from '@tanstack/react-query';

export const useHentSøknadDokumentQuery = (aktørId: string, dokumentId: string) =>
    useQuery({
        queryKey: ['/personer/{aktorId}/dokumenter/{dokuemntId}/soknad', { aktørId, dokumentId }],
        queryFn: async (): Promise<ApiSoknad> => {
            const response = await fetch(`/api/spesialist/personer/${aktørId}/dokumenter/${dokumentId}/soknad`);
            if (!response.ok) {
                throw new Error('Feil i nettverk-response');
            }
            return response.json();
        },
    });

export const useHentInntektsmeldingDokumentQuery = (aktørId: string, dokumentId: string) =>
    useQuery({
        queryKey: ['/personer/{aktorId}/dokumenter/{dokuemntId}/inntektsmelding', { aktørId, dokumentId }],
        queryFn: async (): Promise<ApiDokumentInntektsmelding> => {
            const response = await fetch(
                `/api/spesialist/personer/${aktørId}/dokumenter/${dokumentId}/inntektsmelding`,
            );
            if (!response.ok) {
                throw new Error('Feil i nettverk-response');
            }
            return response.json();
        },
    });
