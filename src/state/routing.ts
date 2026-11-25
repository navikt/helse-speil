import { useParams, usePathname, useRouter } from 'next/navigation';

import { findPeriod, periodeUrlIdFor, useSetActivePeriodIdUtenPerson, vilkårsgrunnlagIdFor } from '@state/periode';
import { useFetchPersonQuery } from '@state/person';
import { SaksbildeTab, delForTab, tabTilAnker, useSaksbildeTab, useSetSaksbildeTab } from '@state/tab';
import { ActivePeriod } from '@typer/shared';
import { erPåEgenUnderside, lagPeriodeUrl, lagSykefraværstilfelleUrl } from '@utils/undersider';

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

export function useNavigerTilSaksbildedel() {
    const router = useRouter();
    const { personPseudoId } = useParams<{ personPseudoId?: string }>();
    const setActivePeriodId = useSetActivePeriodIdUtenPerson();

    return (periode: ActivePeriod, tab: SaksbildeTab) => {
        if (!personPseudoId) return;
        const vilkårsgrunnlagId = vilkårsgrunnlagIdFor(periode);
        const tilSykefraværstilfellet = delForTab(tab) === 'sykefraværstilfelle';
        if (tilSykefraværstilfellet && !vilkårsgrunnlagId) return;
        setActivePeriodId(periode.id);
        const url =
            tilSykefraværstilfellet && vilkårsgrunnlagId
                ? lagSykefraværstilfelleUrl(personPseudoId, vilkårsgrunnlagId, tabTilAnker(tab))
                : lagPeriodeUrl(personPseudoId, periodeUrlIdFor(periode), tabTilAnker(tab));
        router.push(url, { scroll: false });
    };
}

export const useTilkommenInntektIdFraUrl = (): string | null => {
    const { tilkommenInntektId } = useParams<{ tilkommenInntektId?: string }>();

    return tilkommenInntektId !== undefined ? tilkommenInntektId : null;
};
