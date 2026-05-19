import { NextRequest } from 'next/server';

import { stubEllerVideresendTilSporhund } from '@app/api/sporhund/common';
import { ApiDialogmeldingOppgave, ApiDialogmeldingStatus, ApiFagomrade } from '@io/rest/generated/sporhund.schemas';
import { DialogmeldingMock } from '@spesialist-mock/storage/dialogmelding';
import { PersonMock } from '@spesialist-mock/storage/person';

const fagomrader = Object.values(ApiFagomrade);
const meldingstyper = ['FORESPORSEL', 'SVAR', 'NOTAT'] as const;
const statuser = Object.values(ApiDialogmeldingStatus);

const sokerNavn = ['Slapp Appelsin', 'Optimistisk Banan', 'Skeptisk Service', 'Punktlig Jakke', 'Minimalistisk Aroma'];

// aktorId for SLAPP APPELSIN from mock oppgaver
const MOCK_AKTOR_ID = '2564094783926';

async function stub(_request: NextRequest): Promise<Response> {
    const dialoger = DialogmeldingMock.getAll();
    const personPseudoId = PersonMock.findPersonPseudoId(MOCK_AKTOR_ID) ?? 'unknown';

    const oppgaver: ApiDialogmeldingOppgave[] = dialoger.map((dialog, index) => ({
        id: dialog.id,
        personPseudoId,
        dato: dialog.tid,
        frist: getFrist(dialog.tid),
        fagomrade: fagomrader[index % fagomrader.length]!,
        soker: sokerNavn[index % sokerNavn.length]!,
        meldingstype: meldingstyper[index % meldingstyper.length]!,
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
