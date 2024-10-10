import { GraphQLFormattedError } from 'graphql/error';
import { useSearchParams } from 'next/navigation';
import { atom, useRecoilValue, useSetRecoilState } from 'recoil';

import {
    BadRequestError,
    FetchError,
    FlereFodselsnumreError,
    NotFoundError,
    NotReadyError,
    ProtectedError,
} from '@io/graphql/errors';
import { useFetchPersonQuery } from '@state/person';
import { SpeilError } from '@utils/error';

const varslerState = atom<Array<SpeilError>>({
    key: 'varslerState',
    default: [],
});

export const useVarsler = (): Array<SpeilError> => {
    const params = useSearchParams();
    const { error, variables } = useFetchPersonQuery();

    const errors: SpeilError[] =
        error?.graphQLErrors.map((error: GraphQLFormattedError) => {
            switch (error.extensions?.code) {
                case 403: {
                    return new ProtectedError();
                }
                case 404: {
                    return new NotFoundError();
                }
                case 409: {
                    return new NotReadyError(variables?.fnr ?? variables?.aktorId ?? 'personen');
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

    return useRecoilValue(varslerState).concat(params.get('aktorId') !== undefined ? errors : []);
};

export const useRapporterGraphQLErrors = (): ((
    graphQLErrors: ReadonlyArray<GraphQLFormattedError>,
    søkeparameter: string,
) => void) => {
    const addVarsel = useAddVarsel();

    return (errors, søkeparameter) =>
        errors.map((error: GraphQLFormattedError) => {
            switch (error.extensions?.code) {
                case 400: {
                    addVarsel(new BadRequestError(søkeparameter));
                    break;
                }
                case 403: {
                    addVarsel(new ProtectedError());
                    break;
                }
                case 404: {
                    addVarsel(new NotFoundError());
                    break;
                }
                case 409: {
                    addVarsel(new NotReadyError(søkeparameter));
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
