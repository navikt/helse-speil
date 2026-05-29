import { useAtom, useAtomValue, useSetAtom } from 'jotai';

import { ErrorType } from '@app/axios/orval-mutator';
import { useGetOppgaver } from '@io/rest/generated/oppgaver/oppgaver';
import {
    ApiHttpProblemDetailsApiGetOppgaverErrorCode,
    ApiOppgaveProjeksjon,
} from '@io/rest/generated/spesialist.schemas';
import {
    Oppgaveliste,
    PREDEFINERTE_OPPGAVELISTER,
} from '@oversikt/table/oppgaverTable/oppgavelister/predefinerteOppgavelister';
import { limit, useCurrentPageValue } from '@oversikt/table/state/pagination';
import { atomWithSessionStorage } from '@state/jotai';

interface OppgaveFeedResponse {
    oppgaver?: ApiOppgaveProjeksjon[];
    error: ErrorType<ApiHttpProblemDetailsApiGetOppgaverErrorCode> | null;
    loading: boolean;
    antallOppgaver: number;
}

export const aktivOppgavelisteIdAtom = atomWithSessionStorage<string | null>('aktivOppgavelisteId', null);

export const useAktivOppgaveliste = (): Oppgaveliste | null => {
    const aktivId = useAtomValue(aktivOppgavelisteIdAtom);
    if (!aktivId) return null;
    return PREDEFINERTE_OPPGAVELISTER.find((liste) => liste.id === aktivId) ?? null;
};

export const useSetAktivOppgaveliste = () => {
    const setAktivId = useSetAtom(aktivOppgavelisteIdAtom);
    return (id: string) => setAktivId(id);
};

type OppgavelisteDato = { oppgaveKlarFom?: string; oppgaveKlarTom?: string };

const oppgavelisteDatoOverridesAtom = atomWithSessionStorage<OppgavelisteDato>('oppgavelisteDato', {});

export const useOppgavelisteDato = () => {
    const [dato, setDato] = useAtom(oppgavelisteDatoOverridesAtom);
    return {
        dato,
        setOppgaveKlarFom: (fom?: string) => setDato((prev) => ({ ...prev, oppgaveKlarFom: fom })),
        setOppgaveKlarTom: (tom?: string) => setDato((prev) => ({ ...prev, oppgaveKlarTom: tom })),
    };
};

export const useOppgavelisteFeed = (): OppgaveFeedResponse => {
    const currentPage = useCurrentPageValue();
    const aktivOppgaveliste = useAktivOppgaveliste();
    const { dato } = useOppgavelisteDato();

    const {
        data,
        error,
        isFetching: loading,
    } = useGetOppgaver(
        {
            ...aktivOppgaveliste?.params,
            oppgaveKlarFom: dato.oppgaveKlarFom,
            oppgaveKlarTom: dato.oppgaveKlarTom,
            sidestoerrelse: limit,
            sidetall: currentPage,
        },
        {
            query: {
                staleTime: 0,
                enabled: aktivOppgaveliste !== null,
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
