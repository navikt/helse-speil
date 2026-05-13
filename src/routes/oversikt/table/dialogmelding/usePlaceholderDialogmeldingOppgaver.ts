import { callCustomAxios } from '@app/axios/orval-mutator';
import { useQuery } from '@tanstack/react-query';

import type { DialogmeldingOppgave } from './types';

export const usePlaceholderDialogmeldingOppgaver = () => {
    return useQuery<DialogmeldingOppgave[]>({
        queryKey: ['dialogmelding-oppgaver'],
        queryFn: () =>
            callCustomAxios<DialogmeldingOppgave[]>({
                url: '/api/sporhund/dialogmelding-oppgaver',
                method: 'GET',
            }),
    });
};
