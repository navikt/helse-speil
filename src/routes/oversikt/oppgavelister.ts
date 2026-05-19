import {
    ApiEgenskap,
    ApiOppgaveSorteringsfelt,
    ApiSorteringsrekkefølge,
    GetOppgaverParams,
} from '@io/rest/generated/spesialist.schemas';

export type Oppgaveliste = {
    id: string;
    navn: string;
    params: Omit<GetOppgaverParams, 'sidetall' | 'sidestoerrelse'>;
};

export const PREDEFINERTE_OPPGAVELISTER: [Oppgaveliste, ...Oppgaveliste[]] = [
    {
        id: 'utbetaling-uten-spesialtilfeller',
        navn: 'Utbetaling uten spesialtilfeller',
        params: {
            erTildelt: false,
            minstEnAvEgenskapene: [
                [ApiEgenskap.UTBETALING_TIL_SYKMELDT, ApiEgenskap.DELVIS_REFUSJON, ApiEgenskap.INGEN_UTBETALING].join(
                    ',',
                ),
                [ApiEgenskap.FORSTEGANGSBEHANDLING, ApiEgenskap.FORLENGELSE].join(','),
            ],
            ingenAvEgenskapene: [ApiEgenskap.UTLAND, ApiEgenskap.TILBAKEDATERT, ApiEgenskap.MEDLEMSKAP].join(','),
            sorteringsfelt: ApiOppgaveSorteringsfelt.behandlingOpprettetTidspunkt,
            sorteringsrekkefoelge: ApiSorteringsrekkefølge.STIGENDE,
        },
    },
    {
        id: 'arbeidsgiver',
        navn: 'Utbetaling til arbeidsgiver',
        params: {
            erTildelt: false,
            minstEnAvEgenskapene: [ApiEgenskap.UTBETALING_TIL_ARBEIDSGIVER],
            sorteringsfelt: ApiOppgaveSorteringsfelt.behandlingOpprettetTidspunkt,
            sorteringsrekkefoelge: ApiSorteringsrekkefølge.STIGENDE,
        },
    },
];
