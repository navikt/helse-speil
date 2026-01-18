import { NextRequest } from 'next/server';

import { ApiOpphevStansRequest } from '@io/rest/generated/spesialist.schemas';
import { fetchPersondata } from '@spesialist-mock/graphql';
import { BeregnetPeriode, NotatType } from '@spesialist-mock/schemaTypes';
import { NotatMock } from '@spesialist-mock/storage/notat';
import { OpphevStansMock } from '@spesialist-mock/storage/opphevstans';
import { isNotNullOrUndefined } from '@utils/typeguards';

export const stub = async (request: NextRequest) => {
    const requestBody: ApiOpphevStansRequest = await request.json();
    const oppgaveId = finnOppgaveId(requestBody.fodselsnummer);
    if (oppgaveId) NotatMock.addNotat(oppgaveId, { tekst: requestBody.begrunnelse, type: NotatType.OpphevStans });
    OpphevStansMock.addUnntattFraAutomatiskGodkjenning(requestBody.fodselsnummer, { erUnntatt: false });
    return new Response(null, { status: 204 });
};

const finnOppgaveId = (fødselsnummer: string): string | null => {
    const valgtPerson = fetchPersondata()[fødselsnummer];
    if (!valgtPerson) return null;
    const periode = valgtPerson.arbeidsgivere
        .flatMap((a) => a.behandlinger.flatMap((g) => g.perioder))
        .find((periode) => isNotNullOrUndefined((periode as BeregnetPeriode).oppgave));

    return (periode as BeregnetPeriode)?.oppgave?.id ?? null;
};
