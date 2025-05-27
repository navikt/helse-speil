import { useParams, usePathname, useRouter } from 'next/navigation';

import { Maybe } from '@io/graphql';
import { useSetActivePeriodIdUtenPerson } from '@state/periode';

export const useNavigerTilTilkommenInntekt = () => {
    const aktorId = useAktørIdFraUrl();
    const router = useRouter();

    return (tilkommenInntektId: string) => {
        router.push(`/person/${aktorId}/tilkommeninntekt/${tilkommenInntektId}`);
    };
};

export const useNavigerTilPeriode = () => {
    const aktorId = useAktørIdFraUrl();
    const pathname = usePathname();
    const router = useRouter();
    const setActivePeriodId = useSetActivePeriodIdUtenPerson();

    return (periodeId: string) => {
        setActivePeriodId(periodeId);
        const erPåTilkommenInntektSide = pathname.includes('/tilkommeninntekt/');
        if (erPåTilkommenInntektSide) {
            router.push(`/person/${aktorId}/dagoversikt`);
        }
    };
};

export const useTilkommenInntektIdFraUrl = (): Maybe<string> => {
    const { tilkommenInntektId } = useParams<{ tilkommenInntektId?: string }>();

    return tilkommenInntektId !== undefined ? tilkommenInntektId : null;
};

export const useAktørIdFraUrl = (): Maybe<string> => {
    const { aktorId } = useParams<{ aktorId?: string }>();

    return aktorId !== undefined ? aktorId : null;
};
