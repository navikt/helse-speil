import { browserEnv, erUtvikling } from '@/env';
import { useHarGraderteAndreYtelserTilgang } from '@hooks/brukerrolleHooks';

export const useSkalSeGraderteAndreYtelser = () =>
    useHarGraderteAndreYtelserTilgang() && browserEnv.NEXT_PUBLIC_GRADERTE_ANDRE_YTELSER_ER_AKTIVERT;

export const kanLeggeTilTilkommenInntekt = (harSelvstendingNæringsinntekt: boolean) =>
    erUtvikling || !harSelvstendingNæringsinntekt;
