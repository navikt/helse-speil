import { ApiBruker, ApiBrukerrolle, ApiTilgang } from '@io/rest/generated/spesialist.schemas';

export const stub = async () => {
    const bruker: ApiBruker = {
        brukerroller: [
            ApiBrukerrolle.SAKSBEHANDLER,
            ApiBrukerrolle.UTVIKLER,
            ApiBrukerrolle.BESLUTTER,
            ApiBrukerrolle.SELVSTENDIG_NÆRINGSDRIVENDE_BETA,
            ApiBrukerrolle.EGEN_ANSATT,
            ApiBrukerrolle.STIKKPRØVE,
        ],
        tilganger: [ApiTilgang.SKRIV, ApiTilgang.LES],
    };
    return Response.json(bruker, { status: 200 });
};
