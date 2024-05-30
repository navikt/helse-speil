import { GraphQLError } from 'graphql/error';
import { useParams } from 'react-router-dom';
import { atom, useRecoilValue, useSetRecoilState } from 'recoil';

import { GraphQLErrors } from '@apollo/client/errors';
import { FetchError, FlereFodselsnumreError, NotFoundError, ProtectedError } from '@io/graphql/errors';
import { useFetchPersonQuery } from '@state/person';
import { SpeilError } from '@utils/error';

const varslerState = atom<Array<SpeilError>>({
    key: 'varslerState',
    default: [],
});

export const useVarsler = (): Array<SpeilError> => {
    const { aktorId } = useParams<{ aktorId: string | undefined }>();
    const { error } = useFetchPersonQuery();

    const errors: SpeilError[] =
        error?.graphQLErrors.map((error: GraphQLError) => {
            switch (error.extensions?.code) {
                case 403: {
                    return new ProtectedError();
                }
                case 404: {
                    return new NotFoundError();
                }
                case 500: {
                    if (error.extensions.feilkode === 'HarFlereFodselsnumre') {
                        const fodselsnumre = error.extensions.fodselsnumre;
                        return new FlereFodselsnumreError(fodselsnumre as string[]);
                    } else return new FetchError();
                }
                default: {
                    return new FetchError();
                }
            }
        }) ?? [];

    return useRecoilValue(varslerState).concat(aktorId !== undefined ? errors : []);
};

export const useRapporterGraphQLErrors = (): ((graphQLErrors: GraphQLErrors) => void) => {
    const addVarsel = useAddVarsel();

    return (errors) =>
        errors.map((error: GraphQLError) => {
            switch (error.extensions?.code) {
                case 403: {
                    addVarsel(new ProtectedError());
                    break;
                }
                case 404: {
                    addVarsel(new NotFoundError());
                    break;
                }
                case 500: {
                    if (error.extensions.feilkode === 'HarFlereFodselsnumre') {
                        const fodselsnumre = error.extensions.fodselsnumre;
                        addVarsel(new FlereFodselsnumreError(fodselsnumre as string[]));
                    } else addVarsel(new FetchError());
                    break;
                }
                default: {
                    addVarsel(new FetchError());
                }
            }
        });
};

export const useAddVarsel = (): ((varsel: SpeilError) => void) => {
    const setVarsler = useSetRecoilState(varslerState);

    return (varsel: SpeilError) => {
        setVarsler((varsler) => [...varsler.filter((it) => it.name !== varsel.name), varsel]);
    };
};

export const useOperationErrorHandler = (operasjon: string) => {
    const varsel: SpeilError = new SpeilError(`Det oppstod en feil. Handlingen som ikke ble utført: ${operasjon}`);

    const setVarsler = useSetRecoilState(varslerState);

    return (ex: Error) => {
        console.log(`Feil ved ${operasjon}. ${ex.message}`);
        setVarsler((varsler) => [...varsler.filter((it) => it.name !== varsel.name), varsel]);
    };
};

export const useRemoveVarsel = () => {
    const setVarsler = useSetRecoilState(varslerState);

    return (name: string) => {
        setVarsler((varsler) => varsler.filter((it) => it.name !== name));
    };
};

export const useSetVarsler = () => {
    return useSetRecoilState(varslerState);
};
