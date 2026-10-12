import { ApiBruker, ApiBrukerrolle, ApiTilgang } from '@io/rest/generated/spesialist.schemas';

export const stub = async () => {
    const bruker: ApiBruker = {
        brukerroller: [
            ApiBrukerrolle.UTVIKLER,
            ApiBrukerrolle.BESLUTTER,
            ApiBrukerrolle.EGEN_ANSATT,
            ApiBrukerrolle.STIKKPRØVE,
            ApiBrukerrolle.DIALOGMELDING,
            ApiBrukerrolle.PORTEFØLJESTYRING,
            ApiBrukerrolle.COACH,
            ApiBrukerrolle.FAGKOORDINATOR,
            ApiBrukerrolle.SUPERSAKSBEHANDLER,
        ],
        tilganger: [ApiTilgang.SKRIV, ApiTilgang.LES],
    };
    return Response.json(bruker, { status: 200 });
};
