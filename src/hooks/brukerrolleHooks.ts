import { useGetBruker } from '@io/rest/generated/saksbehandlere/saksbehandlere';
import { ApiBrukerrolle, ApiTilgang } from '@io/rest/generated/spesialist.schemas';

const useErBrukerrolle = (brukerrolle: ApiBrukerrolle) => {
    const { data: bruker } = useGetBruker();
    return bruker?.data?.brukerroller?.includes(brukerrolle) ?? false;
};

export const useHarFeilsøkingsrolle = () => {
    return useErBrukerrolle(ApiBrukerrolle.UTVIKLER);
};
export const useHarBeslutterrolle = () => {
    return useErBrukerrolle(ApiBrukerrolle.BESLUTTER);
};

export const useHarSkrivetilgang = () => {
    const { data: bruker } = useGetBruker();
    return bruker?.data?.tilganger?.includes(ApiTilgang.SKRIV) ?? false;
};
