import { erUtvikling } from '@/env';

export const kanLeggeTilTilkommenInntekt = (harSelvstendingNæringsinntekt: boolean) => erUtvikling || !harSelvstendingNæringsinntekt;
