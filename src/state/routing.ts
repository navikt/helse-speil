import { useParams, usePathname, useRouter } from 'next/navigation';

import { useSetActivePeriodIdUtenPerson } from '@state/periode';
import { useSetSaksbildeTab } from '@state/tab';
import { erPåEgenUnderside } from '@utils/undersider';

export const useNavigerTilTilkommenInntekt = () => {
    const { personPseudoId } = useParams<{ personPseudoId?: string }>();
    const router = useRouter();

    return (tilkommenInntektId: string) => {
        router.push(`/person/${personPseudoId}/tilkommeninntekt/${tilkommenInntektId}`);
    };
};

export const useNavigerTilPeriode = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { personPseudoId } = useParams<{ personPseudoId?: string }>();
    const setTab = useSetSaksbildeTab();
    const setActivePeriodId = useSetActivePeriodIdUtenPerson();

    return (periodeId: string) => {
        setActivePeriodId(periodeId);
        if (erPåEgenUnderside(pathname)) {
            setTab('dagoversikt');
            router.push(`/person/${personPseudoId}`);
        }
    };
};

export const useTilkommenInntektIdFraUrl = (): string | null => {
    const { tilkommenInntektId } = useParams<{ tilkommenInntektId?: string }>();

    return tilkommenInntektId !== undefined ? tilkommenInntektId : null;
};
