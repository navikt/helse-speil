import { useGetBruker } from '@io/rest/generated/saksbehandlere/saksbehandlere';
import { ApiBrukerrolle, ApiTilgang } from '@io/rest/generated/spesialist.schemas';

const useErBrukerrolle = (brukerrolle: ApiBrukerrolle) => {
    const { data: bruker } = useGetBruker();
    return bruker?.brukerroller?.includes(brukerrolle) ?? false;
};

export const useHarUtviklerRolle = () => {
    return useErBrukerrolle(ApiBrukerrolle.UTVIKLER);
};
export const useHarBeslutterrolle = () => {
    return useErBrukerrolle(ApiBrukerrolle.BESLUTTER);
};

export const useHarSkrivetilgang = () => {
    const { data: bruker } = useGetBruker();
    return bruker?.tilganger?.includes(ApiTilgang.SKRIV) ?? false;
};
