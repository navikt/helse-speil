import { useGetBrukerroller } from '@io/rest/generated/saksbehandlere/saksbehandlere';
import { ApiBrukerrolle } from '@io/rest/generated/spesialist.schemas';

const useErBrukerrolle = (brukerrolle: ApiBrukerrolle) => {
    const { data: brukerroller } = useGetBrukerroller();
    return brukerroller?.data.includes(brukerrolle) ?? false;
};

export const useErUtvikler = () => {
    return useErBrukerrolle(ApiBrukerrolle.UTVIKLER);
};
export const useErBeslutter = () => {
    return useErBrukerrolle(ApiBrukerrolle.BESLUTTER);
};

export const useErSaksbehandler = () => {
    return useErBrukerrolle(ApiBrukerrolle.SAKSBEHANDLER);
};
