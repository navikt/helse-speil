import { useParams, usePathname, useRouter } from 'next/navigation';

import { findPeriod, periodeUrlIdFor, useSetActivePeriodIdUtenPerson } from '@state/periode';
import { useFetchPersonQuery } from '@state/person';
import { SaksbildeTab, tabTilAnker, useSaksbildeTab, useSetSaksbildeTab } from '@state/tab';
import { erPåEgenUnderside, lagPeriodeUrl } from '@utils/undersider';

export const useNavigerTilTilkommenInntekt = () => {
    const { personPseudoId } = useParams<{ personPseudoId?: string }>();
    const router = useRouter();

    return (tilkommenInntektId: string) => {
        router.push(`/person/${personPseudoId}/tilkommeninntekt/${tilkommenInntektId}`);
    };
};

export const useNavigerTilPeriode = () => {
    const pathname = usePathname();
    const navigerTilValgtPeriode = useNavigerTilValgtPeriode();

    return (periodeId: string) => {
        navigerTilValgtPeriode(periodeId, erPåEgenUnderside(pathname) ? 'dagoversikt' : undefined);
    };
};

export const useNavigerTilValgtPeriode = () => {
    const router = useRouter();
    const { personPseudoId } = useParams<{ personPseudoId?: string }>();
    const { data } = useFetchPersonQuery();
    const [gjeldendeTab] = useSaksbildeTab();
    const setTab = useSetSaksbildeTab();
    const setActivePeriodId = useSetActivePeriodIdUtenPerson();

    return (periodeId: string, tab: SaksbildeTab = gjeldendeTab) => {
        const periode = findPeriod(periodeId, data ?? null);
        if (!personPseudoId || !periode) return;
        setActivePeriodId(periode.id);
        setTab(tab, { erstatt: true });
        router.push(lagPeriodeUrl(personPseudoId, periodeUrlIdFor(periode), tabTilAnker(tab)), { scroll: false });
    };
};

export const useTilkommenInntektIdFraUrl = (): string | null => {
    const { tilkommenInntektId } = useParams<{ tilkommenInntektId?: string }>();

    return tilkommenInntektId !== undefined ? tilkommenInntektId : null;
};
