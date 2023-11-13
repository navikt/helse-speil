import { useMutation } from '@apollo/client';
import { OpprettAbonnementDocument } from '@io/graphql';

export const useAbonnerPåAktør = (personidentifikator: string) => {
    return useMutation(OpprettAbonnementDocument, { variables: { personidentifikator } });
};
