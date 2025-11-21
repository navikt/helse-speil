import { useParams, usePathname, useRouter } from 'next/navigation';

import { Fane, useNavigation } from '@hooks/useNavigation';
import { useSetActivePeriodIdUtenPerson } from '@state/periode';

export const useNavigerTilTilkommenInntekt = () => {
    const { personPseudoId } = useParams<{ personPseudoId?: string }>();
    const router = useRouter();

    return (tilkommenInntektId: string) => {
        router.push(`/person/${personPseudoId}/tilkommeninntekt/${tilkommenInntektId}`);
    };
};

export const useNavigerTilPeriode = () => {
    const pathname = usePathname();
    const { navigateTo } = useNavigation();
    const setActivePeriodId = useSetActivePeriodIdUtenPerson();

    return (periodeId: string) => {
        setActivePeriodId(periodeId);
        const erPåTilkommenInntektSide = pathname.includes('/tilkommeninntekt/');
        if (erPåTilkommenInntektSide) {
            navigateTo(Fane.Utbetaling);
        }
    };
};

export const useTilkommenInntektIdFraUrl = (): string | null => {
    const { tilkommenInntektId } = useParams<{ tilkommenInntektId?: string }>();

    return tilkommenInntektId !== undefined ? tilkommenInntektId : null;
};
