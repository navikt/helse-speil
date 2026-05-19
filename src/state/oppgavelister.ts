import { useAtom, useAtomValue } from 'jotai';

import { ErrorType } from '@app/axios/orval-mutator';
import { useGetOppgaver } from '@io/rest/generated/oppgaver/oppgaver';
import {
    ApiHttpProblemDetailsApiGetOppgaverErrorCode,
    ApiOppgaveProjeksjon,
} from '@io/rest/generated/spesialist.schemas';
import { Oppgaveliste, PREDEFINERTE_OPPGAVELISTER } from '@oversikt/oppgavelister';
import { limit, useCurrentPageValue } from '@oversikt/table/state/pagination';
import { atomWithSessionStorage } from '@state/jotai';

interface OppgaveFeedResponse {
    oppgaver?: ApiOppgaveProjeksjon[];
    error: ErrorType<ApiHttpProblemDetailsApiGetOppgaverErrorCode> | null;
    loading: boolean;
    antallOppgaver: number;
}

export const aktivOppgavelisteIdAtom = atomWithSessionStorage<string>(
    'aktivOppgavelisteId',
    PREDEFINERTE_OPPGAVELISTER[0].id,
);

export const useAktivOppgaveliste = (): Oppgaveliste => {
    const aktivId = useAtomValue(aktivOppgavelisteIdAtom);
    return PREDEFINERTE_OPPGAVELISTER.find((liste) => liste.id === aktivId) ?? PREDEFINERTE_OPPGAVELISTER[0]!;
};

export const useSetAktivOppgaveliste = () => {
    const [, setAktivId] = useAtom(aktivOppgavelisteIdAtom);
    return (id: string) => setAktivId(id);
};

export const useOppgavelisteFeed = (): OppgaveFeedResponse => {
    const currentPage = useCurrentPageValue();
    const aktivOppgaveliste = useAktivOppgaveliste();

    const {
        data,
        error,
        isFetching: loading,
    } = useGetOppgaver(
        {
            ...aktivOppgaveliste.params,
            sidestoerrelse: limit,
            sidetall: currentPage,
        },
        {
            query: {
                staleTime: 0,
            },
        },
    );

    return {
        oppgaver: data?.elementer,
        antallOppgaver: data?.totaltAntall ?? 0,
        error,
        loading,
    };
};
