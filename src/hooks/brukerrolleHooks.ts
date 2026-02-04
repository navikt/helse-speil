import { useGetBrukerroller } from '@io/rest/generated/saksbehandlere/saksbehandlere';
import { ApiBrukerrolle } from '@io/rest/generated/spesialist.schemas';

const useErBrukerrolle = (brukerrolle: ApiBrukerrolle) => {
    const { data: brukerroller } = useGetBrukerroller();
    return brukerroller?.data.includes(brukerrolle) ?? false;
};

export const useHarFeilsøkingsrolle = () => {
    return useErBrukerrolle(ApiBrukerrolle.UTVIKLER);
};
export const useHarBeslutterrolle = () => {
    return useErBrukerrolle(ApiBrukerrolle.BESLUTTER);
};

export const useHarSkrivetilgang = () => {
    return useErBrukerrolle(ApiBrukerrolle.SAKSBEHANDLER);
};
