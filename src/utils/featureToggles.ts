import { browserEnv, erUtvikling } from '@/env';
import { useErCoachFagkoordinatorEllerSupersaksbehandler } from '@hooks/brukerrolleHooks';

export const useSkalSeGraderteAndreYtelser = () =>
    useErCoachFagkoordinatorEllerSupersaksbehandler() && browserEnv.NEXT_PUBLIC_GRADERTE_ANDRE_YTELSER_ER_AKTIVERT;

export const kanLeggeTilTilkommenInntekt = (harSelvstendingNæringsinntekt: boolean) =>
    erUtvikling || !harSelvstendingNæringsinntekt;

export const kanVurdereLikestilteYtelser = () => erUtvikling;
