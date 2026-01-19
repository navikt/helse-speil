import { NextRequest } from 'next/server';

import { ApiKrrRegistrertStatus } from '@io/rest/generated/spesialist.schemas';

export async function stub(_request: NextRequest, params: Promise<{ pseudoId: string }>) {
    const { pseudoId } = await params;
    return Response.json(
        pseudoId.endsWith('4')
            ? ApiKrrRegistrertStatus.RESERVERT_MOT_DIGITAL_KOMMUNIKASJON_ELLER_VARSLING
            : pseudoId.endsWith('8')
              ? ApiKrrRegistrertStatus.IKKE_RESERVERT_MOT_DIGITAL_KOMMUNIKASJON_ELLER_VARSLING
              : ApiKrrRegistrertStatus.IKKE_REGISTRERT_I_KRR,
    );
}
