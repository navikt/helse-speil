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
import { limit, useCurrentPageState, useCurrentPageValue } from '@oversikt/table/state/pagination';
import { atomWithSessionStorage } from '@state/jotai';

type OppgavelisteSok = {
    oppgavelisteId: string | null;
    oppgaveKlarFom?: string;
    oppgaveKlarTom?: string;
    behandlingOpprettetFom?: string;
    behandlingOpprettetTom?: string;
};

const tomtSok: OppgavelisteSok = { oppgavelisteId: null };

const draftAtom = atomWithSessionStorage<OppgavelisteSok>('oppgavelisteSokDraft', tomtSok);
const appliedAtom = atomWithSessionStorage<OppgavelisteSok>('oppgavelisteSokApplied', tomtSok);

const finnOppgaveliste = (id: string | null): Oppgaveliste | null =>
    PREDEFINERTE_OPPGAVELISTER.find((liste) => liste.id === id) ?? null;

export const useOppgavelisteSokSkjema = () => {
    const [draft, setDraft] = useAtom(draftAtom);
    return {
        draft,
        valgtOppgaveliste: finnOppgaveliste(draft.oppgavelisteId),
        setOppgavelisteId: (oppgavelisteId: string) => setDraft((prev) => ({ ...prev, oppgavelisteId })),
        setOppgaveKlarFom: (oppgaveKlarFom?: string) => setDraft((prev) => ({ ...prev, oppgaveKlarFom })),
        setOppgaveKlarTom: (oppgaveKlarTom?: string) => setDraft((prev) => ({ ...prev, oppgaveKlarTom })),
        setBehandlingOpprettetFom: (behandlingOpprettetFom?: string) =>
            setDraft((prev) => ({ ...prev, behandlingOpprettetFom })),
        setBehandlingOpprettetTom: (behandlingOpprettetTom?: string) =>
            setDraft((prev) => ({ ...prev, behandlingOpprettetTom })),
    };
};

export const useSubmitOppgavelisteSok = () => {
    const draft = useAtomValue(draftAtom);
    const setApplied = useSetAtom(appliedAtom);
    const [, setCurrentPage] = useCurrentPageState();

    return () => {
        setApplied(draft);
        setCurrentPage(1);
    };
};

interface OppgaveFeedResponse {
    oppgaver?: ApiOppgaveProjeksjon[];
    error: ErrorType<ApiHttpProblemDetailsApiGetOppgaverErrorCode> | null;
    loading: boolean;
    antallOppgaver: number;
    aktivOppgaveliste: Oppgaveliste | null;
}

export const useOppgavelisteFeed = (): OppgaveFeedResponse => {
    const currentPage = useCurrentPageValue();
    const applied = useAtomValue(appliedAtom);
    const aktivOppgaveliste = finnOppgaveliste(applied.oppgavelisteId);

    const {
        data,
        error,
        isFetching: loading,
    } = useGetOppgaver(
        {
            ...aktivOppgaveliste?.params,
            oppgaveKlarFom: applied.oppgaveKlarFom,
            oppgaveKlarTom: applied.oppgaveKlarTom,
            behandlingOpprettetFom: applied.behandlingOpprettetFom,
            behandlingOpprettetTom: applied.behandlingOpprettetTom,
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
        aktivOppgaveliste,
    };
};
