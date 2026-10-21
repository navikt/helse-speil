import dayjs from 'dayjs';
import { NextRequest } from 'next/server';

import { ApiBehandletOppgaveProjeksjon } from '@io/rest/generated/spesialist.schemas';
import { limit } from '@oversikt/table/state/pagination';
import { tilfeldigeBehandledeOppgaver } from '@spesialist-mock/data/mockDataGenerator';
import { oppgaver } from '@spesialist-mock/data/oppgaver';
import { BehandlingMock } from '@spesialist-mock/storage/behandling';
import { ISO_DATOFORMAT } from '@utils/date';

export async function stub(_request: NextRequest) {
    const sidetall = Number.parseInt(_request.nextUrl.searchParams.get('sidetall') ?? '1');
    const fom = _request.nextUrl.searchParams.get('fom')!;
    const tom = _request.nextUrl.searchParams.get('tom')!;
    const behandledeOppgaver = [...behandledeOppgaverFraMock(), ...tilfeldigeBehandledeOppgaver].filter((oppgave) => {
        const ferdigstiltDato = dayjs(oppgave.ferdigstiltTidspunkt).format(ISO_DATOFORMAT);
        return ferdigstiltDato >= fom && ferdigstiltDato <= tom;
    });

    const oppgaverEtterOffset =
        sidetall === 1
            ? behandledeOppgaver.slice(0, limit)
            : behandledeOppgaver.slice((sidetall - 1) * limit).slice(0, limit);
    return Response.json({
        totaltAntall: behandledeOppgaver.length,
        sidetall: sidetall,
        sidestoerrelse: limit,
        elementer: oppgaverEtterOffset,
    });
}

function behandledeOppgaverFraMock(): ApiBehandletOppgaveProjeksjon[] {
    return BehandlingMock.getBehandledeOppgaver()
        .reverse()
        .map((oppgave) => ({
            id: Number(oppgave.oppgaveId),
            personPseudoId: oppgave.personPseudoId,
            ferdigstiltTidspunkt: oppgave.ferdigstiltTidspunkt,
            saksbehandler: oppgave.saksbehandler,
            beslutter: oppgave.beslutter,
            personnavn: oppgaver.find((it) => it.id === oppgave.oppgaveId)?.navn ?? {
                fornavn: 'Ukjent',
                etternavn: 'Person',
            },
        }));
}
