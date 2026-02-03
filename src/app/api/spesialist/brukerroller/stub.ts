import { ApiBrukerrolle } from '@io/rest/generated/spesialist.schemas';

export const stub = async () =>
    Response.json([
        ApiBrukerrolle.UTVIKLER,
        ApiBrukerrolle.BESLUTTER,
        ApiBrukerrolle.SELVSTENDIG_NÆRINGSDRIVENDE_BETA,
        ApiBrukerrolle.EGEN_ANSATT,
        ApiBrukerrolle.STIKKPRØVE,
    ]);
