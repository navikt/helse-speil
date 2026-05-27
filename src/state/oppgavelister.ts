import { atom, useAtom, useAtomValue } from 'jotai';

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
    const [, setDatoOverrides] = useAtom(oppgavelisteDatoOverridesAtom);
    return (id: string) => {
        setAktivId(id);
        const liste = PREDEFINERTE_OPPGAVELISTER.find((l) => l.id === id) ?? PREDEFINERTE_OPPGAVELISTER[0]!;
        setDatoOverrides({
            oppgaveKlarFom: liste.params.oppgaveKlarFom,
            oppgaveKlarTom: liste.params.oppgaveKlarTom,
        });
    };
};

type OppgavelisteDato = { oppgaveKlarFom?: string; oppgaveKlarTom?: string };

const oppgavelisteDatoOverridesAtom = atom<OppgavelisteDato>({
    oppgaveKlarFom: PREDEFINERTE_OPPGAVELISTER[0].params.oppgaveKlarFom,
    oppgaveKlarTom: PREDEFINERTE_OPPGAVELISTER[0].params.oppgaveKlarTom,
});

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
            ...aktivOppgaveliste.params,
            oppgaveKlarFom: dato.oppgaveKlarFom,
            oppgaveKlarTom: dato.oppgaveKlarTom,
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
