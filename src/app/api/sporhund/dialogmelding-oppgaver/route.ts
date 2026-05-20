import { NextRequest } from 'next/server';

import { stubEllerVideresendTilSporhund } from '@app/api/sporhund/common';
import { ApiDialogmeldingOppgave, ApiDialogmeldingStatus } from '@io/rest/generated/sporhund.schemas';
import { DialogmeldingMock } from '@spesialist-mock/storage/dialogmelding';
import { PersonMock } from '@spesialist-mock/storage/person';

const statuser = Object.values(ApiDialogmeldingStatus);

const sokerNavn = ['Slapp Appelsin', 'Optimistisk Banan', 'Skeptisk Service', 'Punktlig Jakke', 'Minimalistisk Aroma'];

// aktorId for SLAPP APPELSIN from mock oppgaver
const MOCK_AKTOR_ID = '2564094783926';

async function stub(_request: NextRequest): Promise<Response> {
    const dialoger = DialogmeldingMock.getAll();
    const personPseudoId = PersonMock.findPersonPseudoId(MOCK_AKTOR_ID) ?? 'unknown';

    const oppgaver: ApiDialogmeldingOppgave[] = dialoger.map((dialog, index) => ({
        conversationRef: dialog.conversationRef,
        personPseudoId,
        sisteAktivitetTidspunkt: dialog.tid,
        fristTidspunkt: getFrist(dialog.tid),
        fagomrade: dialog.fagomrade,
        soker: sokerNavn[index % sokerNavn.length]!,
        meldingstype: dialog.meldingstype,
        status: statuser[index % statuser.length]!,
    }));

    return Response.json(oppgaver);
}

function getFrist(dato: string): string {
    const d = new Date(dato);
    d.setDate(d.getDate() + 21);
    return d.toISOString();
}

export const dynamic = 'force-dynamic';

export const GET = stubEllerVideresendTilSporhund(stub);
