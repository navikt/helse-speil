import dayjs from 'dayjs';

import { ApiBegrunnelse } from '@io/rest/generated/spesialist.schemas';
import { Utbetalingstabelldag } from '@typer/utbetalingstabell';
import { NORSK_DATOFORMAT } from '@utils/date';

/**
 * En dag har bare én avslagsårsak. Dager som saksbehandler har avslått av en annen grunn, kan ikke avslås etter
 * oppholdskravet før det avslaget er fjernet. Spleis avviser løsningen i så fall (navikt/sas-issues#95).
 * Maskinelle avvisninger (maksdato o.l.) kan stå sammen med oppholdskravet.
 */
export function dagerAvslåttForSenMeldingTilNav(dager: Utbetalingstabelldag[]): Utbetalingstabelldag[] {
    return dager.filter((dag) => harBegrunnelse(dag, ApiBegrunnelse.AVSLATT_MELDING_TIL_NAV_DAG));
}

/** Dager avslått etter oppholdskravet kan bare endres ved å gjøre om vurderingen. Spleis avviser overstyringen. */
export function dagerMedOppholdskrav(dager: Utbetalingstabelldag[]): Utbetalingstabelldag[] {
    return dager.filter((dag) => harBegrunnelse(dag, ApiBegrunnelse.OPPHOLDSKRAV));
}

export function somDagliste(datoer: string[]): string {
    return [...datoer]
        .sort()
        .map((dato) => dayjs(dato).format(NORSK_DATOFORMAT))
        .join(', ');
}

export function dagenEllerDagene(antall: number): string {
    return antall === 1 ? 'dagen' : 'dagene';
}

function harBegrunnelse(dag: Utbetalingstabelldag, begrunnelse: ApiBegrunnelse): boolean {
    return dag.begrunnelser?.includes(begrunnelse) ?? false;
}
